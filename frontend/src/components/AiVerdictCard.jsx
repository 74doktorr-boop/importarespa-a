import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, AlertTriangle, Info, TrendingUp, TrendingDown } from 'lucide-react';

const AiVerdictCard = ({ verdict }) => {
    if (!verdict) return null;

    const { price_evaluation, score, summary, pros, cons, verdict_text } = verdict;

    const getScoreColor = (s) => {
        if (s >= 8) return 'text-emerald-500 bg-emerald-500/10';
        if (s >= 6) return 'text-amber-500 bg-amber-500/10';
        return 'text-rose-500 bg-rose-500/10';
    };

    const getPriceBadge = (evalText) => {
        const lower = evalText.toLowerCase();
        if (lower.includes('ganga') || lower.includes('buen')) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                    <TrendingDown size={14} /> {evalText}
                </span>
            );
        }
        if (lower.includes('justo')) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle size={14} /> {evalText}
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider">
                <TrendingUp size={14} /> {evalText}
            </span>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10 pointer-events-none">
                <Sparkles size={120} className="text-blue-600" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Veredicto de Nuestra IA</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Análisis inteligente del mercado europeo</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {getPriceBadge(price_evaluation)}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${getScoreColor(score)}`}>
                            {score}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                        "{verdict_text}"
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pros */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                            <CheckCircle size={16} className="text-emerald-500" />
                            Puntos Fuertes
                        </h4>
                        <ul className="space-y-3">
                            {pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl text-slate-600 dark:text-slate-400 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cons/Check */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                            <AlertTriangle size={16} className="text-amber-500" />
                            A Revisar
                        </h4>
                        <ul className="space-y-3">
                            {cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl text-slate-600 dark:text-slate-400 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                    {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <Info size={12} /> Basado en tendencias actuales de importación 2025
                </div>
            </div>
        </motion.div>
    );
};

export default AiVerdictCard;
