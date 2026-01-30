import React from 'react';

export default function StatCard({ title, value, unit, color = 'text-black' }) {
    return (
        <div className="glass-card p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:rotate-1">
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold tracking-tight ${color}`}>
                    {value}
                </span>
                <span className="text-xs font-bold text-black/40">{unit}</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-current ${color} opacity-20`}
                    style={{ width: value !== "—" ? '60%' : '0%' }}
                />
            </div>
        </div>
    );
}
