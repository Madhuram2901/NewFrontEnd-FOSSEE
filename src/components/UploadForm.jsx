import React, { useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export default function UploadForm({ onUpload, loading }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) onUpload(file);
    };

    return (
        <div className="glass-card rounded-[2rem] p-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Upload size={18} className="text-black/40" />
                System Input
            </h3>
            <p className="text-xs text-black/50 font-medium mb-8 leading-relaxed">
                Upload equipment parameters in CSV format to generate a digital twin analysis.
            </p>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
            />

            <button
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
                className="w-full group relative flex flex-col items-center justify-center p-10 border-2 border-dashed border-black/10 rounded-[1.5rem] hover:border-black/20 hover:bg-black/5 transition-all duration-500 disabled:opacity-50"
            >
                <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <FileText className="text-black/20 group-hover:text-black/60 transition-colors" size={28} />
                </div>
                <p className="text-sm font-bold text-black/60 group-hover:text-black transition-colors">
                    {loading ? "Processing..." : "Drop CSV Here"}
                </p>
                <p className="text-[10px] text-black/30 font-bold uppercase tracking-wider mt-1">or click to browse</p>
            </button>

            <div className="mt-6 flex items-start gap-3 p-4 bg-black/5 rounded-2xl">
                <AlertCircle className="text-black/20 shrink-0" size={16} />
                <p className="text-[10px] text-black/40 font-bold leading-normal uppercase">
                    Ensure headers match: name, type, flowrate, pressure, temperature.
                </p>
            </div>
        </div>
    );
}
