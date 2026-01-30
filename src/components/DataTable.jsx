import React from 'react';

export default function DataTable({ rows }) {
    if (!rows || rows.length === 0) return null;

    return (
        <div className="glass-card rounded-[2rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between">
                <h3 className="text-lg font-bold">Raw Parameters</h3>
                <span className="text-[10px] font-black bg-black text-white px-3 py-1 rounded-full uppercase tracking-widest">
                    {rows.length} Nodes
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/5">
                            {Object.keys(rows[0]).map((col) => (
                                <th key={col} className="px-8 py-4 text-[10px] font-black text-black/40 uppercase tracking-widest">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-black/[0.02] transition-colors group">
                                {Object.keys(rows[0]).map((col) => {
                                    const val = row[col];
                                    const isNumeric = !isNaN(parseFloat(val)) && isFinite(val);
                                    let textColor = "text-black";

                                    // Apply colors for specific columns if they exist
                                    const colLower = col.toLowerCase();
                                    if (colLower.includes('flow')) textColor = "text-flowrate";
                                    else if (colLower.includes('press')) textColor = "text-pressure";
                                    else if (colLower.includes('temp')) textColor = "text-temperature";

                                    return (
                                        <td key={col} className="px-8 py-4">
                                            <p className={`text-sm font-bold ${isNumeric ? 'font-mono' : ''} ${textColor}`}>
                                                {isNumeric ? parseFloat(val).toFixed(2) : val}
                                            </p>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
