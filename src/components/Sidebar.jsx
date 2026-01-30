import React from 'react';
import { LayoutDashboard, History, Info, Settings, HelpCircle } from 'lucide-react';

export default function Sidebar() {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: History, label: 'History' },
        { icon: Info, label: 'Analytics' },
        { icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="w-24 bg-app-surface border-r border-black/5 flex flex-col items-center py-10 shrink-0">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-16 shadow-xl shadow-black/20">
                <span className="text-white font-black text-xl">C</span>
            </div>

            <nav className="flex-1 flex flex-col gap-8">
                {navItems.map((item, idx) => (
                    <button
                        key={idx}
                        className={`group relative p-3 rounded-2xl transition-all duration-300 ${item.active ? 'bg-black text-white shadow-lg' : 'text-black/30 hover:bg-black/5 hover:text-black'}`}
                    >
                        <item.icon size={24} strokeWidth={2.5} />
                        <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

            <button className="text-black/20 hover:text-black transition-colors duration-300">
                <HelpCircle size={24} strokeWidth={2.5} />
            </button>
        </aside>
    );
}
