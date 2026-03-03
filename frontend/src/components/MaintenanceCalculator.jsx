import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Fuel, Shield, Tool, Info, ChevronRight } from 'lucide-react';

const MaintenanceCalculator = ({ vehicleData }) => {
    const [annualKm, setAnnualKm] = useState(15000);
    const [costs, setCosts] = useState({
        fuel: 0,
        insurance: 0,
        maintenance: 0,
        total: 0
    });

    useEffect(() => {
        if (!vehicleData) return;

        // 1. Fuel Calculation
        const consumption = vehicleData.params?.consumption || 7.5; // Default 7.5L/100km
        const fuelPrice = 1.62; // Average Spain price
        const annualFuel = (annualKm / 100) * consumption * fuelPrice;

        // 2. Insurance Estimation
        const power = vehicleData.params?.power || 150;
        let baseInsurance = 450;
        if (power > 250) baseInsurance = 1200;
        else if (power > 150) baseInsurance = 750;

        // Premium brand markup
        const premiumBrands = ['BMW', 'MERCEDES-BENZ', 'AUDI', 'PORSCHE', 'TESLA', 'LAND ROVER'];
        const isPremium = premiumBrands.includes(vehicleData.make?.toUpperCase());
        if (isPremium) baseInsurance *= 1.3;

        // 3. Maintenance (Service + Tires)
        let baseMaintenance = isPremium ? 800 : 400;
        // Adjust by mileage - older cars need more
        if (vehicleData.mileage > 100000) baseMaintenance *= 1.4;

        setCosts({
            fuel: Math.round(annualFuel),
            insurance: Math.round(baseInsurance),
            maintenance: Math.round(baseMaintenance),
            total: Math.round(annualFuel + baseInsurance + baseMaintenance)
        });
    }, [annualKm, vehicleData]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl mr-4 text-indigo-600 dark:text-indigo-400">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Coste de Propiedad</h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Mantenimiento Anual Estimado</p>
                    </div>
                </div>
            </div>

            {/* Total Highlight */}
            <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 mb-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Wallet size={80} className="text-white" />
                </div>
                <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1 block">Total al año</span>
                <span className="text-4xl font-black text-white tracking-tight">
                    {formatCurrency(costs.total)}
                </span>
                <div className="mt-1 text-[10px] text-slate-400 font-medium italic">
                    ~{formatCurrency(costs.total / 12)} / mes
                </div>
            </div>

            {/* KM Slider */}
            <div className="mb-8 px-2">
                <div className="flex justify-between items-end mb-3">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Kilómetros anuales
                    </label>
                    <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {annualKm.toLocaleString()} <span className="text-xs">km</span>
                    </span>
                </div>
                <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={annualKm}
                    onChange={(e) => setAnnualKm(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
            </div>

            {/* Breakdown */}
            <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                            <Fuel size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Combustible</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(costs.fuel)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Shield size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Seguro (Terceros+)</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(costs.insurance)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                            <Tool size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Revisiones y Neumáticos</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(costs.maintenance)}</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2">
                <Info size={14} className="text-slate-400 mt-0.5" />
                <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-relaxed">
                    Estimaciones basadas en el mercado español actual. Los costes reales pueden variar según el perfil del conductor y el estado del vehículo.
                </p>
            </div>
        </div>
    );
};

export default MaintenanceCalculator;
