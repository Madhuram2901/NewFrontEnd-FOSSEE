import React from 'react';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function RiskAnalysis({ data }) {
    if (!data || !data.table) return (
        <div className="flex flex-col items-center justify-center p-20 text-center">
            <ShieldCheck size={64} className="text-black/10 mb-6" />
            <h2 className="text-2xl font-black">No Data Analyzed</h2>
            <p className="text-black/40">Upload a dataset on the dashboard to perform risk assessment.</p>
        </div>
    );

    const parseVal = (v) => parseFloat(v) || 0;

    // Outlier Detection Logic
    const analyzeRisk = () => {
        const rows = data.table;
        const types = [...new Set(rows.map(r => r.Type))];
        const typeStats = {};

        // Global stats for fallback/baseline (matches PDF logic)
        const globalStats = {
            pressure: data.averages.pressure || 1,
            temperature: data.averages.temperature || 1
        };

        // Calculate averages per type
        types.forEach(type => {
            const typeRows = rows.filter(r => r.Type === type);
            typeStats[type] = {
                flowrate: typeRows.reduce((acc, r) => acc + parseVal(r.Flowrate), 0) / typeRows.length,
                pressure: typeRows.reduce((acc, r) => acc + parseVal(r.Pressure), 0) / typeRows.length,
                temperature: typeRows.reduce((acc, r) => acc + parseVal(r.Temperature), 0) / typeRows.length,
            };
        });

        // Flag outliers
        const risks = rows.map(row => {
            const stats = typeStats[row.Type];
            const p = parseVal(row.Pressure);
            const t = parseVal(row.Temperature);

            // Check against type-specific and global benchmarks
            const pScaleType = p / (stats.pressure || 1);
            const tScaleType = t / (stats.temperature || 1);
            const pScaleGlobal = p / globalStats.pressure;
            const tScaleGlobal = t / globalStats.temperature;

            let status = 'Stable';
            let score = 0;
            let reason = '';

            // CRITICAL: Over 50% above type average OR over 50% above global average (PDF sync)
            if (pScaleType > 1.5 || tScaleType > 1.5 || pScaleGlobal > 1.5 || tScaleGlobal > 1.5) {
                status = 'Critical';
                score = 3;
                reason = (pScaleType > 1.5 || pScaleGlobal > 1.5) ? 'Extreme Pressure' : 'Thermal Overload';
            }
            // WARNING: Over 20% above benchmarks
            else if (pScaleType > 1.2 || tScaleType > 1.2 || pScaleGlobal > 1.2 || tScaleGlobal > 1.2) {
                status = 'Warning';
                score = 2;
                reason = 'Operating above nominal range';
            }
            // Warning for low pressure
            else if (pScaleType < 0.5) {
                status = 'Warning';
                score = 1;
                reason = 'Process optimization required (Low pressure)';
            }

            return { ...row, status, score, reason };
        }).filter(r => r.status !== 'Stable').sort((a, b) => b.score - a.score);

        return risks;
    };

    const riskList = analyzeRisk();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 rounded-[2.5rem] bg-red-500/5 border-red-500/10">
                    <p className="text-xs font-black uppercase text-red-500 tracking-widest mb-2">Critical Assets</p>
                    <h3 className="text-4xl font-black">{riskList.filter(r => r.status === 'Critical').length}</h3>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] bg-amber-500/5 border-amber-500/10">
                    <p className="text-xs font-black uppercase text-amber-500 tracking-widest mb-2">Potential Warnings</p>
                    <h3 className="text-4xl font-black">{riskList.filter(r => r.status === 'Warning').length}</h3>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] bg-emerald-500/5 border-emerald-500/10">
                    <p className="text-xs font-black uppercase text-emerald-500 tracking-widest mb-2">Health Index</p>
                    <h3 className="text-4xl font-black">{Math.max(0, 100 - (riskList.length * 5))}%</h3>
                </div>
            </div>

            <div className="glass-card rounded-[3rem] overflow-hidden border-black/5">
                <div className="p-8 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
                    <h3 className="font-black text-xl flex items-center gap-3">
                        <AlertTriangle className="text-red-500" size={24} />
                        Active Operational Risks
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full">
                        {riskList.length} Issues Detected
                    </span>
                </div>

                <div className="divide-y divide-black/5">
                    {riskList.length > 0 ? riskList.map((risk, i) => (
                        <div key={i} className="p-8 flex items-center justify-between hover:bg-black/[0.01] transition-colors">
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${risk.status === 'Critical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-amber-500 text-white'}`}>
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg">{risk['Equipment Name']}</h4>
                                    <p className="text-xs font-bold text-black/40 uppercase tracking-tight">{risk.Type} • {risk.reason}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-10 text-right">
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-black text-black/20 uppercase mb-1">Pressure Delta</p>
                                    <p className={`font-mono font-bold ${risk.status === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>
                                        {risk.Pressure} bar
                                    </p>
                                </div>
                                <div>
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${risk.status === 'Critical' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                        {risk.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-20 text-center">
                            <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-4" />
                            <p className="font-bold text-black/40">System Operating Within Nominal Parameters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
