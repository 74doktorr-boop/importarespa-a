import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Euro, Info, ExternalLink } from 'lucide-react';
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

        // Use detected year or manual year
        const yearToUse = (vehicleData.year && vehicleData.year > 1900) ? vehicleData.year : manualYear;

        // Format: "Make Model Year KM segunda mano"
        const query = `site:coches.net OR site:wallapop.com ${vehicleData.make} ${vehicleData.model} ${yearToUse} ${vehicleData.mileage}km segunda mano`;

        // Clean up double spaces if year was empty
        const cleanQuery = query.replace(/\s+/g, ' ').trim();

        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`;
        window.open(searchUrl, '_blank');
    };

    return (
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            {/* Decorative Header Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 opacity-80"></div>

            {/* Background Animation */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -90, 0],
                    opacity: [0.05, 0.1, 0.05]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"
            ></motion.div>

            <div className="flex items-center mb-6 mt-2 relative z-10">
                <motion.div
                    whileHover={{ rotate: -10, scale: 1.1 }}
                    className="p-2 bg-green-500/10 rounded-lg mr-3"
                >
                    <TrendingUp className="text-green-400" size={20} />
                </motion.div>
                <h3 className="text-xl font-bold tracking-tight text-white">Rentabilidad</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Precio de Mercado en España
                    </label>
                    <div className="relative group mb-3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <motion.div
                                animate={{ rotateY: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                            >
                                <Euro className="text-yellow-500 group-focus-within:text-yellow-400 transition-colors drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" size={18} />
                            </motion.div>
                        </div>
                        <input
                            type="number"
                            value={spainPrice}
                            onChange={(e) => setSpainPrice(e.target.value)}
                            placeholder="Ej: 25000"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all font-mono text-lg"
                        />
                    </div>

                    {/* Manual Year Input (Only if missing) */}
                    {(!vehicleData?.year || vehicleData.year === 0) && (
                        <div className="mb-3 animate-in fade-in slide-in-from-top-2">
                            <label className="block text-[10px] font-bold text-yellow-500/80 uppercase tracking-wider mb-1">
                                Año no detectado (Necesario para búsqueda)
                            </label>
                            <input
                                type="number"
                                value={manualYear}
                                onChange={(e) => setManualYear(e.target.value)}
                                placeholder="Ej: 2018"
                                className="w-full bg-yellow-500/5 border border-yellow-500/20 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 text-sm"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleSmartSearch}
                        className="w-full py-2 px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>🔍 Buscar Comparables</span>
                        <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Calculation Details */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-400">Coste Importación</span>
                        <span className="text-white font-mono">{formatCurrency(importPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-400 flex items-center gap-1">
                            Gastos Varios <Info size={12} />
                        </span>
                        <span className="text-white font-mono">{formatCurrency(FIXED_COSTS)}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-300">Total "Llave en Mano"</span>
                        <span className="font-bold text-white font-mono">{formatCurrency(totalImportCost)}</span>
                    </div>
                </div>

                {/* Result */}
                {
                    savings !== null && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`rounded-2xl p-1 shadow-2xl relative overflow-hidden ${savings >= 0 ? 'bg-gradient-to-br from-green-500 to-emerald-700' : 'bg-gradient-to-br from-red-500 to-red-700'}`}
                        >
                            {/* Noise Texture */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>

                            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center relative z-10">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${savings >= 0 ? 'text-green-100' : 'text-red-100'}`}>
                                        {savings >= 0 ? 'Ahorro Total' : 'Sobreprecio'}
                                    </span>
                                    {savings >= 0 ? <TrendingUp size={16} className="text-green-200" /> : <TrendingDown size={16} className="text-red-200" />}
                                </div>

                                <div className="text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-lg">
                                    {formatCurrency(Math.abs(savings))}
                                </div>

                                {savings >= 0 && (
                                    <div className="inline-block px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-md">
                                        <span className="text-xs font-bold text-white">
                                            ¡{roi}% más barato!
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Visual Comparison Bars (Simplified for this view) */}
                            <div className="bg-black/40 p-4 relative z-10">
                                <div className="space-y-3">
                                    {(() => {
                                        const spainVal = parseFloat(spainPrice);
                                        const maxVal = Math.max(totalImportCost, spainVal);
                                        const importWidth = (totalImportCost / maxVal) * 100;
                                        const spainWidth = (spainVal / maxVal) * 100;

                                        return (
                                            <>
                                                <div>
                                                    <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                                                        <span>Importación</span>
                                                        <span>{formatCurrency(totalImportCost)}</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${importWidth}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full bg-blue-400 rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                                                        <span>Mercado España</span>
                                                        <span>{formatCurrency(spainVal)}</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${spainWidth}%` }}
                                                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                                            className={`h-full rounded-full ${savings >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </div >
        </div >
    );
};

export default ProfitabilityCard;
