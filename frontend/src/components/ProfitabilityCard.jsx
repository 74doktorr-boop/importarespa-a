import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Euro, Info, ExternalLink, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfitabilityCard = ({ importPrice, vehicleData }) => {
    const [spainPrice, setSpainPrice] = useState('');
    const [manualYear, setManualYear] = useState('');
    const [savings, setSavings] = useState(null);
    const [roi, setRoi] = useState(0);

    const totalImportCost = importPrice;

    useEffect(() => {
        if (spainPrice && !isNaN(spainPrice)) {
            const price = parseFloat(spainPrice);
            const diff = price - totalImportCost;
            setSavings(diff);
            setRoi(((diff / totalImportCost) * 100).toFixed(1));
        } else {
            setSavings(null);
            setRoi(0);
        }
    }, [spainPrice, totalImportCost]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
    };

    const handleSmartSearch = () => {
        if (!vehicleData) return;
        const yearToUse = (vehicleData.year && vehicleData.year > 1900) ? vehicleData.year : manualYear;
        const query = `${vehicleData.make} ${vehicleData.model} ${yearToUse} ${vehicleData.mileage}km segunda mano`;
        const cleanQuery = query.replace(/\s+/g, ' ').trim();
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`;
        window.open(searchUrl, '_blank');
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md dark:shadow-none transition-shadow">
            <div className="flex items-center mb-6 mt-2 relative z-10">
                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg mr-3">
                    <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Rentabilidad</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Precio de Mercado en España
                    </label>
                    <div className="relative group mb-3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Euro className="text-slate-400" size={18} />
                        </div>
                        <input
                            type="number"
                            value={spainPrice}
                            onChange={(e) => setSpainPrice(e.target.value)}
                            placeholder="Ej: 25000"
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 transition-all font-mono text-lg"
                        />
                    </div>

                    {(!vehicleData?.year || vehicleData.year === 0) && (
                        <div className="mb-3 animate-in fade-in slide-in-from-top-2">
                            <label className="block text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-1">
                                Año no detectado (Necesario para búsqueda)
                            </label>
                            <input
                                type="number"
                                value={manualYear}
                                onChange={(e) => setManualYear(e.target.value)}
                                placeholder="Ej: 2018"
                                className="w-full bg-yellow-50 border border-yellow-200 rounded-lg py-2 px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleSmartSearch}
                        className="w-full py-2 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-sm dark:shadow-none"
                    >
                        <span>🔍 Buscar Comparables</span>
                        <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Calculation Details */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Coste Total Importación</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(totalImportCost)}</span>
                    </div>
                </div>

                {/* Result */}
                {
                    savings !== null && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`rounded-2xl p-6 shadow-lg text-center relative overflow-hidden ${savings >= 0 ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}`}
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                                        {savings >= 0 ? 'Ahorro Total' : 'Sobreprecio'}
                                    </span>
                                    {savings >= 0 ? <TrendingUp size={16} className="text-white" /> : <TrendingDown size={16} className="text-white" />}
                                </div>

                                <div className="text-4xl font-black text-white tracking-tighter mb-2">
                                    {formatCurrency(Math.abs(savings))}
                                </div>

                                {savings >= 0 && (
                                    <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                                        <span className="text-xs font-bold text-white">
                                            ¡{roi}% más barato!
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                }
            </div >

        </div >
    );
};

export default ProfitabilityCard;
