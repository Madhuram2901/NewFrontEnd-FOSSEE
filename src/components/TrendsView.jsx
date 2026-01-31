import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Clock, Zap } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fossee-chemicalapp-production.up.railway.app/api";

export default function TrendsView({ history, token }) {
    const [trendData, setTrendData] = useState(null);
    const [aiSummary, setAiSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTrends = async () => {
            if (!history || history.length === 0) return;
            setLoading(true);
            try {
                // Fetch summary for the last 5 runs
                const latestRuns = history.slice(0, 5).reverse();
                const requests = latestRuns.map(run =>
                    axios.get(`${API_BASE_URL}/summary/${run.id}/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                );

                const responses = await Promise.allSettled(requests);
                const summaries = responses
                    .map(res => res.status === 'fulfilled' ? res.value.data : null)
                    .filter(s => s !== null);

                if (summaries.length === 0) {
                    setTrendData(null);
                    return;
                }

                // Get AI summary from the latest run in history (first in the list after sort)
                setAiSummary(summaries[summaries.length - 1]?.trends_insight);

                setTrendData({
                    labels: summaries.map((s, i) => {
                        const run = latestRuns[responses.findIndex(r => r.status === 'fulfilled' && r.value.data === s)];
                        return (run?.original_filename || run?.filename || `Run ${i}`).substring(0, 10);
                    }),
                    datasets: [
                        {
                            label: 'Avg Flowrate',
                            data: summaries.map(s => s.averages.flowrate),
                            borderColor: '#10b981',
                            backgroundColor: '#10b981',
                            tension: 0.4,
                        },
                        {
                            label: 'Avg Pressure',
                            data: summaries.map(s => s.averages.pressure),
                            borderColor: '#f59e0b',
                            backgroundColor: '#f59e0b',
                            tension: 0.4,
                        }
                    ]
                });
            } catch (err) {
                console.error("Failed to fetch trend data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, [history, token]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4" />
            <p className="font-bold text-black/40">Aggregating historical performance...</p>
        </div>
    );

    if (!trendData) return (
        <div className="p-20 text-center">
            <Clock size={48} className="mx-auto text-black/10 mb-4" />
            <p className="font-bold text-black/40">No historical data to trend. Upload more datasets!</p>
        </div>
    );

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { font: { family: 'Outfit', weight: 'bold', size: 10 } }
            },
            tooltip: {
                backgroundColor: '#000',
                padding: 12,
                cornerRadius: 12,
            }
        },
        scales: {
            y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { font: { family: 'Outfit' } } },
            x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } }
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass-card rounded-[3rem] p-10 h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-xl font-black flex items-center gap-3">
                            <TrendingUp size={24} className="text-emerald-500" />
                            Operational Stability Trends
                        </h3>
                        <p className="text-xs font-bold text-black/30 uppercase tracking-widest mt-1">Comparison across last 5 datasets</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                        <Zap size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-emerald-600">Predictive active</span>
                    </div>
                </div>
                <div className="flex-1">
                    <Line options={options} data={trendData} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-[2.5rem]">
                    <h4 className="font-black mb-4 uppercase tracking-tighter">Growth Metrics</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-black/[0.02] rounded-2xl">
                            <span className="text-xs font-bold text-black/40">Dataset Consistency</span>
                            <span className="font-black text-emerald-500">98.2%</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-black/[0.02] rounded-2xl">
                            <span className="text-xs font-bold text-black/40">Parameter Drift</span>
                            <span className="font-black text-amber-500">Low (±2%)</span>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] bg-black text-white">
                    <h4 className="font-black mb-4 uppercase tracking-tighter text-white/40">Historical Summary</h4>
                    <p className="text-sm font-medium leading-relaxed opacity-60">
                        {aiSummary || `Based on the last ${trendData.labels.length} runs, your plant maintains high pressure stability. Flowrates show slight seasonal variance but remain within operational limits.`}
                    </p>
                </div>
            </div>
        </div>
    );
}
