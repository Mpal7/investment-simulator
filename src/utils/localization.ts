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
        years: 'anni',
        result: {
            totalContributed: 'Totale Versato',
            totalFees: 'Costi Gestione (TER)',
            totalTax: 'Totale Tasse',
            finalBalance: 'Capitale Finale',
            nominalBalance: 'Capitale Finale Netto',
            realBalance: 'Valore Reale (Aggiustato)',
            netGrowth: 'Crescita Netta',
            retainedByFund: 'Trattenuti dal Fondo',
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
            efficiency: 'Efficienza',
            totalContributedTable: 'Totale Versato',
        },
        summary: {
            title: 'Riepilogo Investimento',
            intro: 'In {years} anni, avrai versato un totale di {contributed}.',
            grossGrowth: 'Crescita Lorda:',
            grossGrowthText: 'Il tuo capitale cresce fino a un valore finale netto di {netBalance}.',
            netProfit: 'Profitto Netto:',
            netProfitText: 'Dopo i costi di gestione ({fees}) e le tasse ({tax}), il tuo guadagno effettivo è {netProfit}.',
            inflationTitle: 'Attenzione Inflazione',
            inflationText: 'Con un tasso di inflazione medio del {inflation}, il tuo capitale futuro avrà il potere d\'acquisto di {realBalance} di oggi. Il tuo aumento di ricchezza reale è effettivamente {realGain}.',
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
        years: 'years',
        result: {
            totalContributed: 'Total Contributed',
            totalFees: 'Total Management Cost (TER)',
            totalTax: 'Total Taxes Paid',
            finalBalance: 'Final Balance',
            nominalBalance: 'Final Net Balance',
            realBalance: 'Real Value',
            netGrowth: 'Net Growth',
            retainedByFund: 'Retained by Fund',
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
            grossGrowth: 'Gross Growth:',
            grossGrowthText: 'Your capital grows to a net final value of {netBalance}.',
            netProfit: 'Net Profit:',
            netProfitText: 'After management costs ({fees}) and taxes ({tax}), your actual gain is {netProfit}.',
            inflationTitle: 'Inflation Watch',
            inflationText: 'At an average inflation rate of {inflation}, your future capital will have the purchasing power of {realBalance} today. Your real wealth increase is effectively {realGain}.',
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
