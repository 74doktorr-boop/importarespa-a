import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Euro, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfitabilityCard = ({ importPrice, vehicleData }) => {
    const [spainPrice, setSpainPrice] = useState('');
    const [manualYear, setManualYear] = useState('');
    const [savings, setSavings] = useState(null);
    const [roi, setRoi] = useState(0);

    // Fixed estimated costs for realistic calculation
    const FIXED_COSTS = 800; // ITV, DGT, Plates, Gestoría

    const totalImportCost = importPrice + FIXED_COSTS;

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
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center mb-6 mt-2 relative z-10">
                <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                    <TrendingUp className="text-green-400" size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">Rentabilidad</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Precio de Mercado en España
                    </label>
                    <div className="relative group mb-3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Euro className="text-slate-500" size={18} />
                        </div>
                        <input
                            type="number"
                            value={spainPrice}
                            onChange={(e) => setSpainPrice(e.target.value)}
                            placeholder="Ej: 25000"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-mono text-lg"
                        />
                    </div>

                    {(!vehicleData?.year || vehicleData.year === 0) && (
                        <div className="mb-3 animate-in fade-in slide-in-from-top-2">
                            <label className="block text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-1">
                                Año no detectado (Necesario para búsqueda)
                            </label>
                            <input
                                type="number"
                                value={manualYear}
                                onChange={(e) => setManualYear(e.target.value)}
                                placeholder="Ej: 2018"
                                className="w-full bg-yellow-500/10 border border-yellow-500/20 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleSmartSearch}
                        className="w-full py-2 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-sm hover:text-white"
                    >
                        <span>🔍 Buscar Comparables</span>
                        <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Calculation Details */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-slate-400">Coste Importación</span>
                        <span className="text-white font-mono">{formatCurrency(importPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-slate-400 flex items-center gap-1">
                            Gastos Varios <Info size={12} />
                        </span>
                        <span className="text-white font-mono">{formatCurrency(FIXED_COSTS)}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-300">Total "Llave en Mano"</span>
                        <span className="font-bold text-white font-mono">{formatCurrency(totalImportCost)}</span>
                    </div>
                </div>

                {/* Result */}
                {
                    savings !== null && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`rounded-2xl p-6 shadow-lg text-center relative overflow-hidden ${savings >= 0 ? 'bg-green-600/90 text-white backdrop-blur-sm' : 'bg-red-500/90 text-white backdrop-blur-sm'}`}
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
                                    <div className="inline-block px-3 py-1 rounded-full bg-black/20 backdrop-blur-md">
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
