'use client';

import React from 'react';
import { InvestmentResult, InvestmentParams } from '../utils/finance';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency, formatPercent } from '../utils/localization';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, PieChart, Info, DollarSign } from 'lucide-react';

type ResultsPanelProps = {
    result: InvestmentResult;
    params: InvestmentParams;
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, params }) => {
    const { t, language } = useLanguage();

    // Calculate net profit for display
    const netProfit = result.finalNominalPostTax - result.totalContributedNominal;
    const isLosingWealth = result.finalRealPostTax < result.totalContributedNominal;
    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Summary Cards */}
            <div className="flex flex-wrap gap-4">
                <SummaryCard
                    title={t.result.totalContributed}
                    value={formatCurrency(result.totalContributedNominal, language)}
                    subtext=""
                    subValue=""
                    color="slate"
                    icon={<DollarSign className="w-5 h-5 text-slate-600" />}
                />
                <SummaryCard
                    title={t.result.opportunityCost}
                    value={formatCurrency(result.opportunityCostVsNoFee, language)}
                    subtext={t.result.opportunityCostSubtext}
                    subValue={formatPercent(result.feesAsPercentOfPotentialProfit, language)}
                    color="amber"
                    icon={<PieChart className="w-5 h-5 text-amber-600" />}
                />
                {params.stampDutyEnabled && (
                    <SummaryCard
                        title={t.result.totalStampDuty}
                        value={formatCurrency(result.totalStampDuty, language)}
                        subtext={t.result.stampDutySubtext}
                        subValue={formatPercent(result.totalStampDuty / result.totalContributedNominal * 100, language)}
                        color="amber"
                        icon={<PieChart className="w-5 h-5 text-amber-600" />}
                    />
                )}
                <SummaryCard
                    title={t.result.capitalGainsTax}
                    value={formatCurrency(result.capitalGainsTax, language)}
                    subtext={t.result.capitalGainsTaxSubtext.replace('{taxRate}', formatPercent(params.taxRate, language))} subValue=""
                    color="amber"
                    icon={<PieChart className="w-5 h-5 text-amber-600" />}
                />
                <SummaryCard
                    title={t.result.finalPostTax}
                    value={formatCurrency(result.finalNominalPostTax, language)}
                    subtext={t.result.netGrowth}
                    subValue={formatCurrency(netProfit, language)}
                    color="indigo"
                    icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
                />
                <SummaryCard
                    title={t.result.realBalance}
                    value={formatCurrency(result.finalRealPostTax, language)}
                    subtext={t.result.inflationAdjusted}
                    subValue=""
                    color="emerald"
                    icon={<Info className="w-5 h-5 text-emerald-600" />}
                />
            </div>

            {/* Investment Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📈</span>
                    <h3 className="text-lg font-bold text-slate-800">{t.summary.title}</h3>
                </div>

                <p className="text-slate-700 mb-4">
                    {t.summary.intro
                        .replace('{years}', params.years.toString())
                        .replace('{contributed}', formatCurrency(result.totalContributedNominal, language))
                    }
                </p>

                <ul className="space-y-3 mb-4">
                    <li>
                        <span className="font-semibold text-slate-800">{t.summary.grossGrowth}</span>{' '}
                        <span className="text-slate-700">
                            {t.summary.grossGrowthText
                                .replace('{preTaxBalance}', formatCurrency(result.finalNominalPreTax, language))
                                .replace('{opportunityCost}', formatCurrency(result.opportunityCostVsNoFee, language))
                                .replace('{taxRate}', formatPercent(params.taxRate, language))
                            }
                        </span>
                    </li>
                    {params.stampDutyEnabled && (
                        <li>
                            <span className="font-semibold text-slate-800">{t.summary.stampDuty}</span>{' '}
                            <span className="text-slate-700">
                                {t.summary.stampDutyText
                                    .replace('{stampDuty}', formatCurrency(result.totalStampDuty, language))
                                }
                            </span>
                        </li>
                    )}
                    <li>
                        <span className="font-semibold text-slate-800">{t.summary.netProfit}</span>{' '}
                        <span className="text-slate-700">
                            {t.summary.netProfitText
                                .replace('{tax}', formatCurrency(result.capitalGainsTax, language))
                                .replace('{postTaxBalance}', formatCurrency(result.finalNominalPostTax, language))
                                .replace('{netGrowth}', formatCurrency(netProfit, language))
                            }
                        </span>
                    </li>
                </ul>

                <div className={`${isLosingWealth ? 'bg-red-50 border-red-400' : 'bg-emerald-50 border-emerald-400'} border-l-4 p-4 rounded-r`}>
                    <div className="flex gap-2">
                        <span className={`${isLosingWealth ? 'text-red-600' : 'text-emerald-600'} font-semibold flex-shrink-0`}>
                            ⚠️ {t.summary.inflationTitle}
                        </span>
                        <span className="text-slate-700">
                            {isLosingWealth
                                ? t.summary.inflationLoss
                                    .replace('{realBalance}', formatCurrency(result.finalRealPostTax, language))
                                    .replace('{contributed}', formatCurrency(result.totalContributedNominal, language))
                                : t.summary.inflationGain
                                    .replace('{postTaxBalance}', formatCurrency(result.finalNominalPostTax, language))
                                    .replace('{realBalance}', formatCurrency(result.finalRealPostTax, language))
                                    .replace('{contributed}', formatCurrency(result.totalContributedNominal, language))
                            }
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 min-h-[400px]">
                <h3 className="text-lg font-bold text-slate-800 mb-4">{t.title} - Growth Chart</h3>
                <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={result.breakdown} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorNoFee" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const noFee = payload.find(p => p.dataKey === 'balanceNoFee');
                                        const net = payload.find(p => p.dataKey === 'balanceNominal');
                                        const contributed = payload.find(p => p.dataKey === 'contributionsNominal');

                                        return (
                                            <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 ring-1 ring-slate-900/5">
                                                <p className="font-medium text-slate-500 mb-2">{`${t.table.year} ${label}`}</p>
                                                <div className="flex flex-col gap-1.5 min-w-[200px]">
                                                    {noFee && (
                                                        <div className="flex justify-between items-center text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                                <span className="text-slate-600">{t.table.grossBalance}</span>
                                                            </div>
                                                            <span className="font-mono font-semibold text-orange-600">
                                                                {formatCurrency(Number(noFee.value), language)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {net && (
                                                        <div className="flex justify-between items-center text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                                <span className="text-slate-600">{t.table.balance}</span>
                                                            </div>
                                                            <span className="font-mono font-bold text-emerald-600">
                                                                {formatCurrency(Number(net.value), language)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {contributed && (
                                                        <div className="flex justify-between items-center text-sm pt-1.5 border-t border-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-slate-500" />
                                                                <span className="text-slate-600">{t.table.contributed}</span>
                                                            </div>
                                                            <span className="font-mono font-medium text-slate-600">
                                                                {formatCurrency(Number(contributed.value), language)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            {/* Layer 1: No-Fee Balance (Background - shows opportunity cost) */}
                            <Area
                                type="monotone"
                                dataKey="balanceNoFee"
                                stroke="#f97316"
                                strokeWidth={1}
                                strokeDasharray="0"
                                fill="url(#colorNoFee)"
                                fillOpacity={1}
                                activeDot={{ r: 4, strokeWidth: 0, fill: '#f97316' }}
                                name={t.table.grossBalance}
                            />
                            {/* Layer 2: Nominal Balance (Middle - actual pre-tax value) */}
                            <Area
                                type="monotone"
                                dataKey="balanceNominal"
                                stroke="#10b981"
                                strokeWidth={3}
                                fill="url(#colorNet)"
                                fillOpacity={1}
                                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#10b981' }}
                                name={t.table.balance}
                            />
                            {/* Layer 3: Contributions (Foreground/Bottom) */}
                            <Area
                                type="monotone"
                                dataKey="contributionsNominal"
                                stroke="#64748b"
                                strokeWidth={2}
                                fill="#f1f5f9"
                                fillOpacity={0.5}
                                activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: '#64748b' }}
                                name={t.table.contributed}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[500px]">
                <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
                    <h3 className="font-semibold text-slate-700">{t.table.balance} - Breakdown</h3>
                </div>

                <div className="overflow-y-auto flex-1 relative">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 whitespace-nowrap">{t.table.year}</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 whitespace-nowrap">{t.table.contributed}</th>
                                <th className="px-6 py-4 font-semibold text-indigo-700 whitespace-nowrap text-right">{t.table.balance}</th>
                                <th className="px-6 py-4 font-semibold text-emerald-700 whitespace-nowrap text-right">{t.table.realValue}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {result.breakdown.map((row) => {
                                return (
                                    <tr key={row.year} className="group hover:bg-indigo-50/30 transition-colors odd:bg-white even:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-500 font-mono border-r border-slate-100/50">{row.year}</td>

                                        {/* Annual Contribution */}
                                        <td className="px-6 py-4 font-mono text-slate-700">
                                            {formatCurrency(row.annualContribution, language)}
                                        </td>

                                        {/* Nominal Balance (Pre-Tax) */}
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold font-mono text-indigo-700 text-base">
                                                {formatCurrency(row.balanceNominal, language)}
                                            </span>
                                        </td>

                                        {/* Real Balance (Pre-Tax, Inflation-Adjusted) */}
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-mono text-emerald-600">
                                                {formatCurrency(row.balanceReal, language)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Summary Footer */}
                <div className="bg-slate-900 text-white p-4 shrink-0 flex flex-wrap justify-between items-center gap-4 text-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{t.table.totalContributedTable}</span>
                        <span className="font-mono text-lg font-medium">{formatCurrency(result.totalContributedNominal, language)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-emerald-400 text-xs uppercase tracking-wider font-semibold">{t.result.netGrowth}</span>
                        <span className="font-mono text-lg font-bold text-emerald-300">+{formatCurrency(netProfit, language)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-indigo-300 text-xs uppercase tracking-wider font-semibold">{t.table.efficiency}</span>
                        <span className="font-mono text-lg font-bold text-indigo-200">
                            {formatPercent((netProfit / result.totalContributedNominal) * 100, language)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, subtext, subValue, color, icon }: any) => {
    const colorClasses: Record<string, string> = {
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-900',
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-900',
        slate: 'bg-slate-50 border-slate-100 text-slate-900',
        red: 'bg-red-50 border-red-100 text-red-900',
        amber: 'bg-amber-50 border-amber-100 text-amber-900'
    };

    return (
        <div className={`p-4 rounded-xl border ${colorClasses[color]} flex flex-col gap-1 flex-1 min-w-[200px]`}>
            <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-medium opacity-80 break-words leading-tight">{title}</span>
                <div className="shrink-0 pt-0.5">{icon}</div>
            </div>
            <div className="text-xl xl:text-2xl font-bold mt-1 whitespace-nowrap tracking-tight">{value}</div>
            <div className="text-xs opacity-70 flex flex-wrap justify-between gap-x-2 mt-auto pt-2">
                <span className="truncate max-w-full">{subtext}</span>
                <span className="font-semibold whitespace-nowrap">{subValue}</span>
            </div>
        </div>
    )
}
