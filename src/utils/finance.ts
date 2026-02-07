export type InvestmentParams = {
  initialCapital: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number; // Percentage (e.g., 5 for 5%)
  annualFees: number; // TER - reduces return rate, NOT a cash outflow
  taxRate: number; // Percentage (e.g., 26 for 26%) - Italian capital gains
  inflationRate: number; // Percentage (e.g., 2 for 2%)
  stampDutyEnabled: boolean; // Italian Imposta di Bollo (0.20%)
};

/**
 * Investment Result - Financially Correct Naming
 * 
 * KEY CONCEPTS:
 * 1. TER is NOT a "fee paid" - it reduces returns. We show "opportunity cost"
 *    which is what you would have earned without the TER drag.
 * 2. Capital gains tax (26% in Italy) is applied ONCE at exit, not yearly.
 * 3. Real values are inflation-adjusted for purchasing power comparison.
 */
export type InvestmentResult = {
  finalNominalPreTax: number;      // Balance before capital gains tax
  finalNominalPostTax: number;     // Balance after 26% tax on profits
  finalRealPostTax: number;        // Post-tax balance in today's purchasing power
  totalContributedNominal: number; // Sum of all contributions (nominal)
  totalContributedReal: number;    // Contributions in today's purchasing power
  totalStampDuty: number;          // Imposta di Bollo - actual cash outflow
  opportunityCostVsNoFee: number;  // TER "cost" = what no-fee scenario would yield
  capitalGainsTax: number;         // 26% tax on (finalPreTax - contributions)
  breakdown: YearlyBreakdown;
};

/**
 * Yearly Breakdown - Pre-Tax Only
 * 
 * Taxes are applied ONCE at exit, so yearly values are all pre-tax.
 * This avoids the misleading practice of showing hypothetical intermediate taxes.
 */
export type YearlyBreakdown = {
  year: number;
  contributionsNominal: number;    // Cumulative contributions to date
  balanceNominal: number;          // Pre-tax balance (after TER reduction & stamp duty)
  balanceNoFee: number;            // What balance would be without TER (for comparison)
  balanceReal: number;             // Pre-tax balance adjusted for inflation
  annualContribution: number;      // This year's contribution only
}[];

export const calculateInvestmentGrowth = (params: InvestmentParams): InvestmentResult => {
  const {
    initialCapital,
    monthlyContribution,
    years,
    annualReturn,
    annualFees,
    taxRate,
    inflationRate,
    stampDutyEnabled,
  } = params;

  // === BALANCE TRACKING ===
  // balance: actual portfolio value (reduced by TER via lower rate)
  // balanceNoFee: hypothetical portfolio if TER was 0% (for opportunity cost)
  let balance = initialCapital;
  let balanceNoFee = initialCapital;
  let totalContributed = initialCapital;
  let lastYearContributed = initialCapital;
  let totalStampDuty = 0;

  // === RATE CALCULATIONS ===
  // TER reduces the effective return rate - it is NOT a cash outflow
  // This is financially correct: a 5% return with 0.2% TER = 4.8% effective return
  const netAnnualRate = Math.max(0, annualReturn - annualFees) / 100;
  const grossAnnualRate = annualReturn / 100; // No-fee scenario

  // Geometric monthly rate: (1 + r)^(1/12) - 1
  const monthlyRate = Math.pow(1 + netAnnualRate, 1 / 12) - 1;
  const monthlyRateNoFee = Math.pow(1 + grossAnnualRate, 1 / 12) - 1;

  const totalMonths = years * 12;
  const breakdown: YearlyBreakdown = [];

  const inflationDecimal = inflationRate / 100;
  const stampDutyRate = 0.0020; // 0.20% annual

  // === MONTHLY SIMULATION ===
  for (let month = 1; month <= totalMonths; month++) {
    // Add contribution
    balance += monthlyContribution;
    balanceNoFee += monthlyContribution;
    totalContributed += monthlyContribution;

    // Apply monthly growth (TER already factored into rate)
    balance *= (1 + monthlyRate);
    balanceNoFee *= (1 + monthlyRateNoFee);

    // Record yearly breakdown
    if (month % 12 === 0) {
      const currentYear = month / 12;

      // Stamp duty is an ACTUAL cash outflow (0.20% of portfolio annually)
      if (stampDutyEnabled) {
        const stampDutyCharge = balance * stampDutyRate;
        balance -= stampDutyCharge;
        totalStampDuty += stampDutyCharge;

        const stampDutyChargeNoFee = balanceNoFee * stampDutyRate;
        balanceNoFee -= stampDutyChargeNoFee;
      }

      // Calculate annual contribution
      let annualContribution =
        currentYear === 1
          ? initialCapital + monthlyContribution * 12
          : monthlyContribution * 12;

      // Real balance = pre-tax balance adjusted for inflation
      // NO tax applied here - tax is only at exit
      const realBalance = balance / Math.pow(1 + inflationDecimal, currentYear);

      breakdown.push({
        year: currentYear,
        contributionsNominal: totalContributed,
        balanceNominal: balance,
        balanceNoFee: balanceNoFee,
        balanceReal: realBalance,
        annualContribution: annualContribution,
      });

      lastYearContributed = totalContributed;
    }
  }

  // === FINAL CALCULATIONS ===

  // Pre-tax final balance
  const finalNominalPreTax = balance;

  // Capital gains tax: applied ONCE at exit, only on profit
  // This is how Italian tax (26% imposta sostitutiva) actually works
  const profit = Math.max(0, balance - totalContributed);
  const capitalGainsTax = profit * (taxRate / 100);

  // Post-tax balance
  const finalNominalPostTax = balance - capitalGainsTax;

  // Real values (inflation-adjusted)
  const inflationFactor = Math.pow(1 + inflationDecimal, years);
  const finalRealPostTax = finalNominalPostTax / inflationFactor;
  const totalContributedReal = totalContributed / inflationFactor;

  // Opportunity cost: what TER "cost" you in potential gains
  // This is NOT money paid out - it's unrealized gains you missed
  const opportunityCostVsNoFee = balanceNoFee - balance;

  return {
    finalNominalPreTax,
    finalNominalPostTax,
    finalRealPostTax,
    totalContributedNominal: totalContributed,
    totalContributedReal,
    totalStampDuty,
    opportunityCostVsNoFee,
    capitalGainsTax,
    breakdown,
  };
};

