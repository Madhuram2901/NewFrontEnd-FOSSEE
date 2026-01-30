import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut, History, RotateCcw } from "lucide-react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ChartSection from "../components/ChartSection";
import UploadForm from "../components/UploadForm";
import DataTable from "../components/DataTable";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fossee-chemicalapp-production.up.railway.app/api";

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDatasetId, setSelectedDatasetId] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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

    return (
        <div className="flex h-screen overflow-hidden bg-app-bg">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-app-surface/50 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-10 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-black leading-tight">Dashboard</h1>
                        <p className="text-xs text-black/60 font-medium">Chemical Equipment Analytics</p>
                    </div>

                    <div className="flex items-center gap-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 shrink-0">
                        <StatCard title="Total Equipment" value={summary?.total_equipment || "—"} unit="Units" />
                        <StatCard title="Avg Flowrate" value={summary?.averages?.flowrate || "—"} unit="m³/h" color="text-flowrate" />
                        <StatCard title="Avg Pressure" value={summary?.averages?.pressure || "—"} unit="bar" color="text-pressure" />
                        <StatCard title="Avg Temperature" value={summary?.averages?.temperature || "—"} unit="°C" color="text-temperature" />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-8">
                            {/* Content area for Charts/Tables */}
                            {summary && <ChartSection data={summary} />}
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
                            {/* Sidebar tools */}
                            <UploadForm onUpload={handleUpload} loading={loading} />

                            <div className="glass-card rounded-3xl p-8">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <History size={18} /> Recent Runs
                                </h3>
                                <div className="space-y-3">
                                    {history.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelectDataset(item.id)}
                                            className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${selectedDatasetId === item.id ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'}`}
                                        >
                                            <p className="text-sm font-bold truncate">{item.original_filename}</p>
                                            <p className={`text-[10px] ${selectedDatasetId === item.id ? 'text-white/60' : 'text-black/40'} font-medium mt-0.5`}>
                                                {new Date(item.uploaded_at).toLocaleString()}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
