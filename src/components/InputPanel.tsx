'use client';

import React from 'react';
import { InvestmentParams } from '../utils/finance';
import { useLanguage } from '../context/LanguageContext';
import { Sliders, TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

type InputPanelProps = {
    params: InvestmentParams;
    onChange: (key: keyof InvestmentParams, value: number) => void;
};

export const InputPanel: React.FC<InputPanelProps> = ({ params, onChange }) => {
    const { t, language } = useLanguage();

    const handleChange = (key: keyof InvestmentParams, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            onChange(key, numValue);
        }
    };

    const setPreset = (rate: number) => {
        onChange('annualReturn', rate);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">{t.title}</h2>
                {/* Note: Title might be too long here, maybe use a subsection title or just "Parameters" */}
            </div>

            {/* Initial Capital */}
            <InputGroup
                label={t.initialCapital}
                value={params.initialCapital}
                onChange={(v) => onChange('initialCapital', v)}
                min={0}
                max={1000000}
                step={100}
                unit="€"
                icon={<DollarSign className="w-4 h-4" />}
            />

            {/* Monthly Contribution */}
            <InputGroup
                label={t.monthlyContribution}
                value={params.monthlyContribution}
                onChange={(v) => onChange('monthlyContribution', v)}
                min={0}
                max={10000}
                step={50}
                unit="€"
                icon={<DollarSign className="w-4 h-4" />}
            />

            {/* Investment Horizon */}
            <InputGroup
                label={t.investmentHorizon}
                value={params.years}
                onChange={(v) => onChange('years', v)}
                min={1}
                max={50}
                step={1}
                unit={t.years} // "years" or "anni"
                icon={<Calendar className="w-4 h-4" />}
            />

            {/* Expected Annual Return */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 flex justify-between">
                    <span>{t.expectedAnnualReturn}</span>
                    <span className="text-indigo-600 font-bold">{params.annualReturn}%</span>
                </label>
                <div className="flex gap-2 mb-2">
                    <PresetButton label={t.presets.prudent} onClick={() => setPreset(3)} active={params.annualReturn === 3} />
                    <PresetButton label={t.presets.balanced} onClick={() => setPreset(5)} active={params.annualReturn === 5} />
                    <PresetButton label={t.presets.aggressive} onClick={() => setPreset(8)} active={params.annualReturn === 8} />
                </div>
                <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.1"
                    value={params.annualReturn}
                    onChange={(e) => handleChange('annualReturn', e.target.value)}
                    className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Annual Fees (TER) */}
            <InputGroup
                label={t.annualFees}
                value={params.annualFees}
                onChange={(v) => onChange('annualFees', v)}
                min={0}
                max={5}
                step={0.01}
                unit="%"
                icon={<Percent className="w-4 h-4" />}
            />

            {/* Inflation Rate */}
            <InputGroup
                label={t.inflationRate}
                value={params.inflationRate}
                onChange={(v) => onChange('inflationRate', v)}
                min={0}
                max={10}
                step={0.1}
                unit="%"
                icon={<TrendingUp className="w-4 h-4" />}
            />

            {/* Capital Gain Tax */}
            <InputGroup
                label={t.capitalGainTax}
                value={params.taxRate}
                onChange={(v) => onChange('taxRate', v)}
                min={0}
                max={50}
                step={1}
                unit="%"
                icon={<Percent className="w-4 h-4" />}
            />
        </div>
    );
};

// Helper Components
const InputGroup = ({
    label,
    value,
    onChange,
    min,
    max,
    step,
    unit,
    icon
}: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    step: number;
    unit: string;
    icon?: React.ReactNode;
}) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    {icon} {label}
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                    <input
                        type="number"
                        value={isNaN(value) ? '' : value}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onChange(isNaN(val) ? 0 : val);
                        }}
                        className="w-20 bg-transparent text-right font-mono text-sm focus:outline-none"
                    />
                    <span className="text-xs text-slate-500 ml-1">{unit}</span>
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={isNaN(value) ? 0 : value}
                onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onChange(isNaN(val) ? 0 : val);
                }}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );
};

const PresetButton = ({ label, onClick, active }: { label: string, onClick: () => void, active: boolean }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 text-xs rounded-full border transition-colors ${active
            ? 'bg-indigo-100 border-indigo-500 text-indigo-700 font-semibold'
            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
    >
        {label}
    </button>
);
