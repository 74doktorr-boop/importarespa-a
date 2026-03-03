import React from 'react';
import { Sparkles, Info } from 'lucide-react';

const AdSpace = ({ type = 'horizontal', label = 'Espacio Patrocinado' }) => {
    const isHorizontal = type === 'horizontal';

    return (
        <div className={`relative group overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-center justify-center transition-all hover:bg-white dark:hover:bg-slate-850 ${isHorizontal ? 'w-full h-24 mb-6' : 'w-full h-64 h-full aspect-square'
            }`}>
            {/* Ad Placeholder Visual */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none p-1 bg-[radial-gradient(#2563eb_0.5px,transparent_0.5px)] [background-size:12px_12px]"></div>

            <div className="flex flex-col items-center gap-2 relative z-10 text-slate-300 dark:text-slate-700">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Sparkles size={isHorizontal ? 20 : 32} className="opacity-50" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">{label}</span>
            </div>

            {/* Premium Touch */}
            <div className="absolute bottom-2 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info size={10} className="text-blue-500" />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Anúnciate aquí</span>
            </div>
        </div>
    );
};

export default AdSpace;
