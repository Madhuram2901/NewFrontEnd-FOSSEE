import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut, History, RotateCcw, Download, Info, Settings, FileText, AlertTriangle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ChartSection from "../components/ChartSection";
import UploadForm from "../components/UploadForm";
import DataTable from "../components/DataTable";
import RiskAnalysis from "../components/RiskAnalysis";
import AnalyticsView from "../components/AnalyticsView";
import TrendsView from "../components/TrendsView";
import { Sparkles, BarChart3, TrendingUp as TrendIcon, Zap } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fossee-chemicalapp-production.up.railway.app/api";

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDatasetId, setSelectedDatasetId] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');

    // Auth
    const token = localStorage.getItem('auth_token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchHistory();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/history/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
            if (res.data.length > 0 && !selectedDatasetId) {
                handleSelectDataset(res.data[0].id);
            }
        } catch (err) {
            if (err.response?.status === 401) handleLogout();
            else setError("Failed to fetch history");
        } finally {
            // Loading handle
        }
    };

    const handleSelectDataset = async (id) => {
        setLoading(true);
        setError(null);
        setSelectedDatasetId(id);
        try {
            const res = await axios.get(`${API_BASE_URL}/summary/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSummary(res.data);
        } catch (err) {
            setError("Failed to load dataset details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        if (!file) return;
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(`${API_BASE_URL}/upload/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage("Dataset processed successfully!");
            await fetchHistory();
            await handleSelectDataset(res.data.dataset_id);
        } catch (err) {
            setError(err.response?.data?.error || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        if (!selectedDatasetId || !token) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/report/${selectedDatasetId}/`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${selectedDatasetId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setSuccessMessage("Report downloaded successfully!");
        } catch (err) {
            setError("Failed to download report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-app-bg">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-app-surface/50 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-10 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-black uppercase tracking-tighter capitalize">{activeView}</h1>
                        <p className="text-xs text-black/60 font-medium tracking-wide">Chemical Equipment Suite</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {summary && activeView === 'dashboard' && (
                            <button
                                onClick={handleDownloadReport}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-black text-white rounded-xl hover:opacity-80 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Download size={14} />
                                Export PDF
                            </button>
                        )}
                        <div className="text-right">
                            <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">System Status: Active</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10">
                    {activeView === 'dashboard' && (
                        <>
                            {/* Error/Success Feed */}
                            {error && (
                                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                                    <span className="text-sm font-medium">{error}</span>
                                    <button onClick={() => setError(null)} className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Dismiss</button>
                                </div>
                            )}

                            {successMessage && (
                                <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                                    <span className="text-sm font-medium">{successMessage}</span>
                                    <button onClick={() => setSuccessMessage(null)} className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Dismiss</button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 shrink-0">
                                <StatCard title="Total Equipment" value={summary?.total_equipment || "—"} unit="Units" />
                                <StatCard title="Avg Flowrate" value={summary?.averages?.flowrate || "—"} unit="m³/h" color="text-flowrate" />
                                <StatCard title="Avg Pressure" value={summary?.averages?.pressure || "—"} unit="bar" color="text-pressure" />
                                <StatCard title="Avg Temperature" value={summary?.averages?.temperature || "—"} unit="°C" color="text-temperature" />
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 space-y-10">
                                    {summary && (
                                        <div className="space-y-10">
                                            <ChartSection data={summary} />

                                        </div>
                                    )}
                                    {!summary && !loading && (
                                        <div className="h-64 glass-card rounded-[2.5rem] flex flex-col items-center justify-center p-10 border-2 border-dashed border-black/5">
                                            <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                                                <RotateCcw className="text-black/20" size={32} />
                                            </div>
                                            <p className="text-sm font-bold text-black/40">Awaiting System Data</p>
                                        </div>
                                    )}
                                    {loading && !summary && (
                                        <div className="h-64 glass-card rounded-[2.5rem] flex flex-col items-center justify-center p-10">
                                            <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin" />
                                            <p className="text-sm font-bold text-black/40 mt-4">Analyzing Dataset...</p>
                                        </div>
                                    )}
                                    {summary && <DataTable rows={summary.table} />}
                                </div>

                                <div className="space-y-8">
                                    <UploadForm onUpload={handleUpload} loading={loading} />
                                    <div className="glass-card rounded-[2rem] p-8">
                                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                            <History size={18} className="text-black/40" /> Recent Runs
                                        </h3>
                                        <div className="space-y-3">
                                            {history.length > 0 ? history.map(item => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleSelectDataset(item.id)}
                                                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border-2 ${selectedDatasetId === item.id ? 'bg-black border-black text-white shadow-xl translate-x-1' : 'bg-black/5 border-transparent hover:bg-black/10'}`}
                                                >
                                                    <p className="text-xs font-black uppercase tracking-tight truncate">
                                                        {item.original_filename || item.filename || item.name || `Dataset #${item.id}`}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className={`text-[9px] font-bold ${selectedDatasetId === item.id ? 'text-white/40' : 'text-black/30'} uppercase`}>
                                                            Ready for Analysis
                                                        </span>
                                                        <div className={`w-1 h-1 rounded-full ${selectedDatasetId === item.id ? 'bg-white' : 'bg-black/20'}`} />
                                                    </div>
                                                </button>
                                            )) : (
                                                <p className="text-[10px] font-bold text-black/30 text-center py-4 uppercase">No history found</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 5: AI Insights Generator */}
                            {summary && (
                                <div className="mt-10 p-8 glass-card rounded-[2.5rem] bg-gradient-to-br from-black/[0.02] to-transparent border-black/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                        <Sparkles size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                                                <Zap size={16} fill="currentColor" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                                Automated System Insights
                                                <span className="text-blue-500 lowercase opacity-60 font-medium tracking-normal text-[10px]">(powered by Gemini)</span>
                                            </h3>
                                        </div>
                                        <div className="space-y-3 max-w-4xl">
                                            {(summary.ai_insights || `• System operating with ${summary.total_equipment} units. • Average thermal load stable at ${summary.averages.temperature}°C.`).split(/[•*-]/).filter(p => p.trim()).map((point, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                                    <p className="text-sm font-bold text-black/70 leading-relaxed italic">
                                                        {point.trim().split(/(\d+(?:\.\d+)?%?)/).map((part, j) =>
                                                            /(\d+(?:\.\d+)?%?)/.test(part) ?
                                                                <span key={j} className="text-emerald-500 font-black">{part}</span> :
                                                                part
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeView === 'history' && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-black">Extended History</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {history.map(item => (
                                    <div key={item.id} className="glass-card p-6 rounded-3xl flex flex-col justify-between border border-black/5 hover:border-black/20 transition-all">
                                        <div>
                                            <p className="text-sm font-black truncate mb-1">
                                                {item.original_filename || item.filename || item.name || `Dataset #${item.id}`}
                                            </p>
                                            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">
                                                ID: {item.id} • {new Date(item.uploaded_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => { setActiveView('dashboard'); handleSelectDataset(item.id); }}
                                            className="mt-6 text-[10px] font-black uppercase tracking-widest bg-black text-white py-3 rounded-xl text-center hover:opacity-80 transition-opacity active:scale-95"
                                        >
                                            Analyze Dataset
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeView === 'risk' && (
                        summary ? <RiskAnalysis data={summary} /> : (
                            <div className="flex flex-col items-center justify-center p-20 text-center opacity-50">
                                <AlertTriangle size={48} className="mb-4" />
                                <h3 className="text-xl font-bold">No Dataset Selected</h3>
                                <p className="text-sm">Please select a run from the Dashboard or History to perform risk analysis.</p>
                                <button onClick={() => setActiveView('dashboard')} className="mt-6 px-6 py-2 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest">Go to Dashboard</button>
                            </div>
                        )
                    )}

                    {activeView === 'trends' && <TrendsView history={history} token={token} />}

                    {activeView === 'analytics' && (
                        summary ? <AnalyticsView data={summary} /> : (
                            <div className="flex flex-col items-center justify-center p-20 text-center opacity-50">
                                <BarChart3 size={48} className="mb-4" />
                                <h3 className="text-xl font-bold">No Data for Correlation</h3>
                                <p className="text-sm">Select a dataset to visualize parameter relationships.</p>
                                <button onClick={() => setActiveView('dashboard')} className="mt-6 px-6 py-2 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest">Go to Dashboard</button>
                            </div>
                        )
                    )}

                    {activeView === 'settings' && (
                        <div className="max-w-2xl mx-auto space-y-12 py-10">
                            <h2 className="text-3xl font-black">System Settings</h2>
                            <div className="space-y-6">
                                <div className="glass-card p-8 rounded-[2rem]">
                                    <h4 className="font-bold mb-4">API Configuration</h4>
                                    <div className="p-4 bg-black/5 rounded-xl font-mono text-xs text-black/50 break-all">
                                        {API_BASE_URL}
                                    </div>
                                </div>
                                <div className="glass-card p-8 rounded-[2rem]">
                                    <h4 className="font-bold mb-4">User Preferences</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Automatic unit conversion</span>
                                        <div className="w-12 h-6 bg-black rounded-full relative">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main >
        </div >
    );
}
