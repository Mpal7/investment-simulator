export type Language = 'it' | 'en';

export const translations = {
    it: {
        appTitle: 'Investire mi renderà ricco?',
        title: 'Simulatore Piani di Accumulo (PAC)',
        initialCapital: 'Capitale Iniziale',
        monthlyContribution: 'Contributo Mensile (PAC)',
        expectedAnnualReturn: 'Rendimento Annuo Lordo',
        annualFees: 'Costi Annuali (TER)',
        investmentHorizon: 'Orizzonte Temporale (Anni)',
        inflationRate: 'Tasso di Inflazione',
        capitalGainTax: 'Tassazione Plusvalenze',
        stampDuty: 'Applica Imposta di Bollo (0,20%)',
        years: 'anni',
        result: {
            totalContributed: 'Totale Versato',
            opportunityCost: 'Costo Opportunità (TER)',
            opportunityCostSubtext: 'Rendimento perso per costi',
            totalStampDuty: 'Imposta di Bollo',
            capitalGainsTax: 'Imposta su Plusvalenze (a uscita)',
            capitalGainsTaxSubtext: '26% sul profitto',
            finalPreTax: 'Capitale Lordo',
            finalPostTax: 'Capitale Netto',
            realBalance: 'Valore Reale (Aggiustato)',
            netGrowth: 'Profitto Netto',
            stampDutySubtext: 'Tassa Italiana sui Titoli',
            inflationAdjusted: 'Aggiustato per Inflazione',
        },
        presets: {
            prudent: 'Prudente (3%)',
            balanced: 'Bilanciato (5%)',
            aggressive: 'Aggressivo (8%)',
        },
        table: {
            year: 'Anno',
            contributed: 'Contributo Annuale',
            interest: 'Guadagno Totale',
            balance: 'Valore',
            realValue: 'Reale',
            grossBalance: 'Montante Lordo',
            yield: 'Rendimento',
            efficiency: 'ROI',
            totalContributedTable: 'Totale Versato',
        },
        summary: {
            title: 'Riepilogo Investimento',
            intro: 'In {years} anni, avrai versato un totale di {contributed}.',
            grossGrowth: 'Capitale Lordo:',
            grossGrowthText: 'Prima delle imposte sulle plusvalenze al {taxRate}, il tuo capitale ammonta a {preTaxBalance}. Questo valore è già al netto dei costi di gestione (TER), che hanno ridotto il tuo guadagno potenziale di {opportunityCost}.',
            netProfit: 'Dopo le Tasse:',
            netProfitText: 'L\'imposta sulle plusvalenze ({tax}) viene applicata una sola volta all\'uscita. Il tuo capitale netto finale è {postTaxBalance}.',
            inflationTitle: 'Attenzione Inflazione',
            inflationText: 'Con un tasso di inflazione medio del {inflation}, il tuo capitale futuro avrà il potere d\'acquisto di {realBalance} di oggi.',
        },
    },

    en: {
        appTitle: 'Will investing make me rich?',
        title: 'Investment Growth Simulator',
        initialCapital: 'Initial Capital',
        monthlyContribution: 'Monthly Contribution',
        expectedAnnualReturn: 'Expected Annual Return',
        annualFees: 'Annual Fees (TER)',
        investmentHorizon: 'Investment Horizon (Years)',
        inflationRate: 'Inflation Rate',
        capitalGainTax: 'Capital Gain Tax',
        stampDuty: 'Apply Stamp Duty (0.20%)',
        years: 'years',
        result: {
            totalContributed: 'Total Contributed',
            opportunityCost: 'Opportunity Cost (TER)',
            opportunityCostSubtext: 'Return lost vs. no-fee fund',
            totalStampDuty: 'Stamp Duty',
            capitalGainsTax: 'Capital Gains Tax (at exit)',
            capitalGainsTaxSubtext: '26% on profit',
            finalPreTax: 'Pre-Tax Balance',
            finalPostTax: 'Post-Tax Balance',
            realBalance: 'Real Value',
            netGrowth: 'Net Profit',
            stampDutySubtext: 'Italian Securities Tax',
            inflationAdjusted: 'Inflation Adjusted',
        },
        presets: {
            prudent: 'Prudent (3%)',
            balanced: 'Balanced (5%)',
            aggressive: 'Aggressive (8%)',
        },
        table: {
            year: 'Year',
            contributed: 'Annual Contribution',
            interest: 'Total Profit',
            balance: 'Value',
            realValue: 'Real',
            grossBalance: 'Gross Balance',
            yield: 'Yield',
            efficiency: 'Efficiency',
            totalContributedTable: 'Total Contributed',
        },
        summary: {
            title: 'Investment Summary',
            intro: 'In {years} years, you will have contributed a total of {contributed}.',
            grossGrowth: 'Pre-Tax Balance:',
            grossGrowthText: 'Before capital gains tax ({taxRate}), your capital amounts to {preTaxBalance}. This figure is already net of management fees (TER), which have reduced your potential profit by {opportunityCost}.',
            netProfit: 'After Tax:',
            netProfitText: 'Capital gains tax ({tax}) is applied once at exit. Your final net balance is {postTaxBalance}.',
            inflationTitle: 'Inflation Watch',
            inflationText: 'With an average inflation rate of {inflation}, your future capital will have the purchasing power of {realBalance} today.',
        },
    },
};

export const formatCurrency = (amount: number, lang: Language): string => {
    return new Intl.NumberFormat(lang === 'it' ? 'it-IT' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatPercent = (amount: number, lang: Language): string => {
    return new Intl.NumberFormat(lang === 'it' ? 'it-IT' : 'en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    }).format(amount / 100);
};
