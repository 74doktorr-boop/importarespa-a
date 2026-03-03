import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Award, TrendingUp, Gauge, Calendar, Euro, Shield } from 'lucide-react';

const ComparisonTable = ({ isOpen, onClose, selectedVehicles }) => {
    if (!selectedVehicles || selectedVehicles.length === 0) return null;

    const findBest = (field, isLowerBetter = true) => {
        if (selectedVehicles.length < 2) return null;
        return selectedVehicles.reduce((prev, curr) => {
            if (isLowerBetter) {
                return (curr[field] < prev[field]) ? curr : prev;
            } else {
                return (curr[field] > prev[field]) ? curr : prev;
            }
        });
    };

    const bestPrice = findBest('price', true);
    const bestMileage = findBest('mileage', true);
    const bestSavings = findBest('savings', false);
    const bestYear = findBest('year', false);

    const rows = [
        { label: 'Precio Origen', field: 'price', icon: Euro, formatter: (val) => `${val.toLocaleString()}€`, best: bestPrice },
        { label: 'Kilometraje', field: 'mileage', icon: Gauge, formatter: (val) => `${val.toLocaleString()} km`, best: bestMileage },
        { label: 'Año', field: 'year', icon: Calendar, formatter: (val) => val, best: bestYear },
        { label: 'Ahorro Est. España', field: 'savings', icon: TrendingUp, formatter: (val) => `${val.toLocaleString()}€`, best: bestSavings },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Comparador Elite</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Analizando {selectedVehicles.length} opciones seleccionadas</p>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                                <X size={24} className="text-slate-600 dark:text-slate-400" />
                            </button>
                        </div>

                        <div className="overflow-x-auto p-8">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 text-left w-48"></th>
                                        {selectedVehicles.map(vehicle => (
                                            <th key={vehicle.id} className="p-4 min-w-[200px]">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                                                        <img src={vehicle.imageUrl} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 text-[10px] font-black uppercase text-slate-900 dark:text-white">
                                                            {vehicle.make}
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-center line-clamp-2">{vehicle.model}</h4>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, rowIndex) => (
                                        <tr key={row.field} className={rowIndex % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''}>
                                            <td className="p-6 font-bold text-slate-500 dark:text-slate-400 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <row.icon size={16} />
                                                    {row.label}
                                                </div>
                                            </td>
                                            {selectedVehicles.map(vehicle => {
                                                const isBest = row.best?.id === vehicle.id;
                                                return (
                                                    <td key={vehicle.id} className="p-6 text-center">
                                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isBest
                                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold ring-2 ring-green-500/20'
                                                                : 'text-slate-900 dark:text-white font-medium'
                                                            }`}>
                                                            {row.formatter(vehicle[row.field])}
                                                            {isBest && <Award size={14} className="animate-bounce" />}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    {/* Final Verdict Row */}
                                    <tr>
                                        <td className="p-6 font-bold text-blue-600 dark:text-blue-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Shield size={16} />
                                                Veredicto IA
                                            </div>
                                        </td>
                                        {selectedVehicles.map(vehicle => (
                                            <td key={vehicle.id} className="p-6">
                                                <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                                                    {vehicle.aiVerdict?.summary?.slice(0, 100)}...
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / CTA */}
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-center gap-4 border-t border-slate-100 dark:border-slate-800">
                            <button className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all flex items-center gap-2">
                                Solicitar Revisión Técnica de los Seleccionados
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ComparisonTable;
