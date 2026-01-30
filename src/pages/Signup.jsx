import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fossee-chemicalapp-production.up.railway.app/api";

export default function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_BASE_URL}/register/`, formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Username may already exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-app-bg flex items-center justify-center p-6 text-black">
            <div className="w-full max-w-md">
                <div className="glass-card rounded-[2.5rem] p-12 overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>

                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-black/20">
                            <UserPlus className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">Create Account</h1>
                        <p className="text-sm text-black/40 font-bold uppercase tracking-widest">Join Analysis Suite</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest ml-4">Username</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-black/20"
                                    placeholder="your_name"
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest ml-4">Email</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-black/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-black/20"
                                    placeholder="email@example.com"
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest ml-4">Password</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-black/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-black/20"
                                    placeholder="••••••••"
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs font-bold text-red-500 text-center px-4">{error}</p>}

                        <button
                            disabled={loading}
                            className="w-full bg-black text-white rounded-2xl py-5 font-bold text-sm flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 mt-4"
                        >
                            {loading ? "Creating..." : "Register Account"}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-black/5 text-center">
                        <p className="text-xs text-black/40 font-bold mb-4">Already registered?</p>
                        <Link to="/login" className="text-sm font-black underline decoration-2 underline-offset-4 hover:text-black/60 transition-colors">
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
