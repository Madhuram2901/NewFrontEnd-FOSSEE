import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { Info, Target, MousePointer2 } from 'lucide-react';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AnalyticsView({ data }) {
    if (!data || !data.table) return (
        <div className="flex flex-col items-center justify-center p-20 text-center">
            <Info size={64} className="text-black/10 mb-6" />
            <h2 className="text-2xl font-black">Analytics Workspace</h2>
            <p className="text-black/40">Load a dataset to view advanced correlations.</p>
        </div>
    );

    const parseVal = (v) => parseFloat(v) || 0;

    // Scatter Data: Pressure vs Temperature
    const scatterData = {
        datasets: [
            {
                label: 'Equipment Units',
                data: data.table.map(row => ({
                    x: parseVal(row.Pressure),
                    y: parseVal(row.Temperature)
                })),
                backgroundColor: '#000',
                pointRadius: 6,
                pointHoverRadius: 10,
                pointBorderWidth: 2,
                pointBorderColor: '#fff',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const row = data.table[context.dataIndex];
                        return `${row['Equipment Name']}: P=${row.Pressure} bar, T=${row.Temperature}°C`;
                    }
                },
                backgroundColor: '#000',
                titleFont: { family: 'Outfit', size: 12, weight: 'bold' },
                bodyFont: { family: 'Outfit', size: 12 },
                padding: 12,
                cornerRadius: 12,
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'Pressure (bar)', font: { family: 'Outfit', weight: 'bold' } },
                grid: { color: 'rgba(0,0,0,0.03)' },
                ticks: { family: 'Outfit' }
            },
            y: {
                title: { display: true, text: 'Temperature (°C)', font: { family: 'Outfit', weight: 'bold' } },
                grid: { color: 'rgba(0,0,0,0.03)' },
                ticks: { family: 'Outfit' }
            }
        }
    };

    // Dynamic Analysis Calculations
    const calculateCorrelation = (x, y) => {
        const n = x.length;
        if (n < 2) return { score: "Insuff. Data", label: "N/A" };

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
        const sumX2 = x.reduce((a, b) => a + b * b, 0);
        const sumY2 = y.reduce((a, b) => a + b * b, 0);

        const num = (n * sumXY) - (sumX * sumY);
        const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        if (den === 0) return { score: "0.00", label: "Neutral" };
        const r = num / den;

        if (r > 0.7) return { score: r.toFixed(2), label: "Strong Positive" };
        if (r > 0.3) return { score: r.toFixed(2), label: "Moderate" };
        if (r > -0.3) return { score: r.toFixed(2), label: "Weak/Neutral" };
        return { score: r.toFixed(2), label: "Inverse" };
    };

    const calculateStability = (rows) => {
        if (!rows.length) return 100;
        const avgT = rows.reduce((a, b) => a + parseVal(b.Temperature), 0) / rows.length;
        const withinBounds = rows.filter(r => {
            const val = parseVal(r.Temperature);
            if (avgT === 0) return true;
            const dev = Math.abs(val - avgT) / avgT;
            return dev < 0.25; // Within 25% of mean
        }).length;
        return ((withinBounds / rows.length) * 100).toFixed(0);
    };

    const pressures = data.table.map(row => parseVal(row.Pressure));
    const temps = data.table.map(row => parseVal(row.Temperature));

    const correlation = calculateCorrelation(pressures, temps);
    const stability = calculateStability(data.table);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 glass-card rounded-[2.5rem] p-10 h-[600px] flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <Target size={24} className="text-black/20" />
                                Pressure-Temperature Correlation
                            </h3>
                            <p className="text-xs font-bold text-black/30 uppercase tracking-widest mt-1">Cross-parameter mapping for all active units</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <MousePointer2 size={14} className="text-black/20" />
                            <span className="text-[10px] font-black uppercase text-black/20">Hover points for unit details</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Scatter options={options} data={scatterData} />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-8 rounded-[2rem] bg-black text-white shadow-2xl shadow-black/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Correlation Score</p>
                        <h4 className="text-4xl font-black mb-4">{correlation.label}</h4>
                        <p className="text-sm font-medium text-white/60 leading-relaxed">
                            {data.analytics_insight || (correlation.score !== "Insuff. Data"
                                ? `Statistical relationship coefficient R=${correlation.score} indicates a ${correlation.label.toLowerCase()} link in this dataset.`
                                : "Add more equipment data to calculate precise parameter relationships.")}
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-[2rem] border-emerald-500/20 bg-emerald-500/[0.02]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-2">Efficiency Insight</p>
                        <h4 className="text-lg font-black text-emerald-600 mb-2">{stability}% Stability</h4>
                        <p className="text-xs font-bold text-black/50 leading-relaxed">
                            {stability}% of your units are operating within the target thermal stability envelope (±25% variance).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
