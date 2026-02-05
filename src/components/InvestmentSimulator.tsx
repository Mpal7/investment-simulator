'use client';

import React, { useState, useMemo } from 'react';
import { InvestmentParams, calculateInvestmentGrowth } from '../utils/finance';
import { InputPanel } from './InputPanel';
import { ResultsPanel } from './ResultsPanel';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const InvestmentSimulator = () => {
    const { language, setLanguage, t } = useLanguage();

    const [params, setParams] = useState<InvestmentParams>({
        initialCapital: 10000,
        monthlyContribution: 500,
        years: 20,
        annualReturn: 5,
        annualFees: 0.2, // TER
        taxRate: 26,
        inflationRate: 2,
    });

    const results = useMemo(() => calculateInvestmentGrowth(params), [params]);

    const updateParam = (key: keyof InvestmentParams, value: number) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const toggleLanguage = () => {
        setLanguage(language === 'it' ? 'en' : 'it');
    };

    return (
        <div className="min-h-[100dvh] bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                            IS
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent hidden sm:block">
                            {t.title}
                        </h1>
                    </div>

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                    >
                        <Globe className="w-4 h-4" />
                        {language === 'it' ? 'Italiano' : 'English'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {/* Left Panel - Inputs */}
                    <div className="lg:col-span-4 h-full">
                        <InputPanel params={params} onChange={updateParam} />
                    </div>

                    {/* Right Panel - Results */}
                    <div className="lg:col-span-8 h-full">
                        <ResultsPanel result={results} />
                    </div>
                </div>
            </main>
        </div>
    );
};
