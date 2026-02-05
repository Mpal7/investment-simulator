export type InvestmentParams = {
  initialCapital: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number; // Percentage (e.g., 5 for 5%)
  annualFees: number; // Percentage (e.g., 0.2 for 0.2%)
  taxRate: number; // Percentage (e.g., 26 for 26%)
  inflationRate: number; // Percentage (e.g., 2 for 2%)
};



export type InvestmentResult = {
  finalNominalBalance: number;
  finalRealBalance: number;
  totalContributed: number;
  totalTax: number;
  totalFees: number; // TER Cost
  netProfit: number;
  breakdown: YearlyBreakdown;
};

export type YearlyBreakdown = {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
  balanceGross: number; // Balance without fees
  balanceReal: number; // Inflation adjusted
  annualContribution: number;
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
  } = params;

  let balance = initialCapital;
  let balanceGross = initialCapital;
  let totalContributed = initialCapital;
  let lastYearContributed = initialCapital; // Track previous year's total for delta

  // Net annual rate after fees
  const netAnnualRate = Math.max(0, annualReturn - annualFees) / 100;
  const grossAnnualRate = annualReturn / 100;

  // Geometric monthly rate: (1 + r)^(1/12) - 1
  const monthlyRate = Math.pow(1 + netAnnualRate, 1 / 12) - 1;
  const monthlyGrossRate = Math.pow(1 + grossAnnualRate, 1 / 12) - 1;

  const totalMonths = years * 12;

  const breakdown: YearlyBreakdown = [];

  const inflationDecimal = inflationRate / 100;

  for (let month = 1; month <= totalMonths; month++) {
    // Add contribution
    balance += monthlyContribution;
    balanceGross += monthlyContribution;
    totalContributed += monthlyContribution;

    // Apply interest
    balance *= (1 + monthlyRate);
    balanceGross *= (1 + monthlyGrossRate);

    // Record yearly breakdown
    if (month % 12 === 0) {
      const currentYear = month / 12;

      // Calculate annual contribution
      let annualContribution = totalContributed - lastYearContributed;
      if (currentYear === 1) {
        annualContribution += initialCapital;
      }

      // Calculate hypothetical tax to estimate current real net value
      const currentProfit = balance - totalContributed;
      const currentTax = Math.max(0, currentProfit) * (taxRate / 100);
      const currentNetBalance = balance - currentTax;
      const currentRealBalance = currentNetBalance / Math.pow(1 + inflationDecimal, currentYear);

      breakdown.push({
        year: currentYear,
        contributions: totalContributed,
        interest: balance - totalContributed,
        balance: balance,
        balanceGross: balanceGross,
        balanceReal: currentRealBalance,
        annualContribution: annualContribution,
      });

      lastYearContributed = totalContributed;
    }
  }

  const grossProfit = balance - totalContributed;
  // Tax is only on profit, and cannot be negative
  const taxableAmount = Math.max(0, grossProfit);
  const totalTax = taxableAmount * (taxRate / 100);

  const postTaxBalance = balance - totalTax;

  // Real value calculation (discounting by inflation)
  // Formula: Amount / (1 + inflation)^years
  // We use post-tax balance for the real value
  const finalRealBalance = postTaxBalance / Math.pow(1 + inflationDecimal, years);

  return {
    finalNominalBalance: postTaxBalance,
    finalRealBalance,
    totalContributed,
    totalTax,
    totalFees: balanceGross - balance, // Difference between Gross and Net is the cost of fees
    netProfit: postTaxBalance - totalContributed,
    breakdown,
  };
};
