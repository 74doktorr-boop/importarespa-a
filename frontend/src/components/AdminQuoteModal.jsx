import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Settings, DollarSign, FileText, Truck, ShieldCheck, Calculator, Download, Eye, EyeOff, Plane, Hotel, Fuel, Coffee, Map } from 'lucide-react';
import { generateVehicleReportV2 } from '../utils/pdfGenerator';

const AdminQuoteModal = ({ isOpen, onClose, vehicleData, transportCost, transportDistance }) => {
    const [settings, setSettings] = useState({
        commissionType: 'fixed', // 'fixed' or 'percent'
        commissionValue: 1500,
        itvCost: 150,
        dgtFees: 99,
        provisionalPlates: 150,
        managementFee: 250,
        transportOverride: 0,
        // Travel Settings
        transportMode: 'truck', // 'truck' or 'personal'
        flightCost: 150,
        hotelCost: 100,
        fuelPrice: 1.65,
        fuelConsumption: 8.5, // L/100km
        tolls: 120,
        foodCost: 100
    });

    const [finalTransport, setFinalTransport] = useState(transportCost);

    useEffect(() => {
        const saved = localStorage.getItem('adminQuoteSettings');
        if (saved) {
            setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
        }
    }, []);

    // Calculate Fuel Cost
    const fuelCost = (transportDistance / 100) * settings.fuelConsumption * settings.fuelPrice;
    const totalTripCost = settings.flightCost + settings.hotelCost + fuelCost + settings.tolls + settings.foodCost;

    useEffect(() => {
        if (settings.transportMode === 'personal') {
            setFinalTransport(totalTripCost);
        } else {
            // Truck Mode
            if (transportCost > 0 && settings.transportOverride === 0) {
                setFinalTransport(transportCost);
            } else if (settings.transportOverride > 0) {
                setFinalTransport(settings.transportOverride);
            }
        }
    }, [transportCost, settings.transportOverride, settings.transportMode, totalTripCost]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSave = () => {
        localStorage.setItem('adminQuoteSettings', JSON.stringify(settings));
    };

    // Calculations
    const commissionAmount = settings.commissionType === 'fixed'
        ? settings.commissionValue
        : (vehicleData ? (vehicleData.price * settings.commissionValue) / 100 : 0);

    const fixedCostsTotal = settings.itvCost + settings.dgtFees + settings.provisionalPlates + settings.managementFee;

    // Tax Calculation (Re-implemented here for safety)
    const calculateTax = (co2, price) => {
        if (!co2 || !price) return 0;
        let rate = 0;
        if (co2 <= 120) rate = 0;
        else if (co2 <= 159) rate = 4.75;
        else if (co2 <= 199) rate = 9.75;
        else rate = 14.75;
        return (price * rate) / 100;
    };

    const taxAmount = vehicleData ? calculateTax(vehicleData.co2, vehicleData.price) : 0;
    const basePrice = vehicleData ? vehicleData.price : 0;
    const totalClientPrice = basePrice + taxAmount + finalTransport + fixedCostsTotal + commissionAmount;

    const handleGenerateQuote = () => {
        handleSave();
        // Generate Client PDF (Hiding internal breakdown)
        const quoteData = {
            ...vehicleData,
            taxAmount,
            transportCost: finalTransport,
            fixedCostsTotal,
            commissionAmount,
            totalClientPrice,
            // Pass individual costs just in case, but PDF generator will decide what to show
            itvCost: settings.itvCost,
            dgtFees: settings.dgtFees,
            provisionalPlates: settings.provisionalPlates,
            managementFee: settings.managementFee
        };

        generateVehicleReportV2(quoteData, finalTransport, true); // true = isClientQuote
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto max-w-5xl h-fit max-h-[95vh] bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Panel de Administración</h2>
                                    <p className="text-xs text-blue-200">Generador de Presupuestos & Gestión de Márgenes</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left: Configuration (7 cols) */}
                                <div className="lg:col-span-7 space-y-6">

                                    {/* Commission Section */}
                                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <DollarSign size={16} className="text-green-600" /> Tu Comisión
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <button
                                                onClick={() => setSettings(s => ({ ...s, commissionType: 'fixed' }))}
                                                className={`py-2 px-3 text-sm font-medium rounded-lg border ${settings.commissionType === 'fixed' ? 'bg-white border-blue-500 text-blue-600 shadow-sm' : 'bg-slate-100 border-transparent text-slate-500'}`}
                                            >
                                                Fija (€)
                                            </button>
                                            <button
                                                onClick={() => setSettings(s => ({ ...s, commissionType: 'percent' }))}
                                                className={`py-2 px-3 text-sm font-medium rounded-lg border ${settings.commissionType === 'percent' ? 'bg-white border-blue-500 text-blue-600 shadow-sm' : 'bg-slate-100 border-transparent text-slate-500'}`}
                                            >
                                                Porcentaje (%)
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="commissionValue"
                                                value={settings.commissionValue}
                                                onChange={handleChange}
                                                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-mono text-lg font-bold text-slate-900"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                                {settings.commissionType === 'fixed' ? '€' : '%'}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-right text-sm font-bold text-green-600">
                                            Beneficio: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(commissionAmount)}
                                        </div>
                                    </div>

                                    {/* Transport & Travel Calculator */}
                                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Truck size={16} className="text-blue-600" /> Transporte & Logística
                                        </h3>

                                        {/* Mode Selection */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <button
                                                onClick={() => setSettings(s => ({ ...s, transportMode: 'truck' }))}
                                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${settings.transportMode === 'truck' ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-slate-100 border-transparent hover:bg-slate-200'}`}
                                            >
                                                <Truck size={20} className={settings.transportMode === 'truck' ? 'text-blue-600' : 'text-slate-400'} />
                                                <span className={`text-xs font-bold uppercase ${settings.transportMode === 'truck' ? 'text-blue-700' : 'text-slate-500'}`}>Camión</span>
                                                <span className="font-mono font-bold text-slate-900">
                                                    {transportCost > 0 ? `${transportCost} €` : 'N/A'}
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => setSettings(s => ({ ...s, transportMode: 'personal' }))}
                                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${settings.transportMode === 'personal' ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-slate-100 border-transparent hover:bg-slate-200'}`}
                                            >
                                                <Plane size={20} className={settings.transportMode === 'personal' ? 'text-blue-600' : 'text-slate-400'} />
                                                <span className={`text-xs font-bold uppercase ${settings.transportMode === 'personal' ? 'text-blue-700' : 'text-slate-500'}`}>Viaje Propio</span>
                                                <span className="font-mono font-bold text-slate-900">
                                                    {Math.round(totalTripCost)} €
                                                </span>
                                            </button>
                                        </div>

                                        {/* Inputs based on selection */}
                                        {settings.transportMode === 'truck' ? (
                                            <div>
                                                <label className="block text-xs font-medium text-slate-900 mb-1">Coste Manual (Opcional)</label>
                                                <input
                                                    type="number"
                                                    name="transportOverride"
                                                    value={settings.transportOverride}
                                                    onChange={handleChange}
                                                    placeholder="0 = Usar Automático"
                                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                                <div className="col-span-2 bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                                                    <span className="text-xs font-bold text-blue-800 uppercase flex items-center gap-2">
                                                        <Map size={14} /> Distancia: {transportDistance} km
                                                    </span>
                                                    <span className="text-xs font-bold text-blue-800">
                                                        Combustible: {Math.round(fuelCost)} €
                                                    </span>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><Plane size={12} /> Vuelos</label>
                                                    <input type="number" name="flightCost" value={settings.flightCost} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><Hotel size={12} /> Hotel</label>
                                                    <input type="number" name="hotelCost" value={settings.hotelCost} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><Fuel size={12} /> Precio/L</label>
                                                    <input type="number" name="fuelPrice" value={settings.fuelPrice} onChange={handleChange} step="0.01" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><Calculator size={12} /> L/100km</label>
                                                    <input type="number" name="fuelConsumption" value={settings.fuelConsumption} onChange={handleChange} step="0.1" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><DollarSign size={12} /> Peajes</label>
                                                    <input type="number" name="tolls" value={settings.tolls} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><Coffee size={12} /> Dietas</label>
                                                    <input type="number" name="foodCost" value={settings.foodCost} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Fixed Costs */}
                                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Settings size={16} className="text-slate-600" /> Costes Fijos (Estimados)
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">ITV Importación</label>
                                                <input type="number" name="itvCost" value={settings.itvCost} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Tasas DGT</label>
                                                <input type="number" name="dgtFees" value={settings.dgtFees} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Placas Prov.</label>
                                                <input type="number" name="provisionalPlates" value={settings.provisionalPlates} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Gestoría / Otros</label>
                                                <input type="number" name="managementFee" value={settings.managementFee} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Real-time Quote Preview (5 cols) */}
                                <div className="lg:col-span-5 flex flex-col h-full">
                                    <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-lg flex-1 flex flex-col sticky top-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold text-slate-900">Vista Previa</h3>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Cliente</span>
                                        </div>

                                        <div className="space-y-3 flex-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Precio Vehículo (Origen)</span>
                                                <span className="font-mono font-medium">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(basePrice)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Impuesto Matriculación</span>
                                                <span className="font-mono font-medium">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(taxAmount)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Transporte y Logística</span>
                                                <span className="font-mono font-medium">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(finalTransport)}</span>
                                            </div>

                                            <div className="h-px bg-slate-100 my-2"></div>

                                            {/* The "Black Box" for the client */}
                                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                <div>
                                                    <span className="block text-sm font-bold text-blue-900">Gestión Integral e Importación</span>
                                                    <span className="text-[10px] text-blue-600">Incluye ITV, DGT, Placas, Gestoría y Honorarios</span>
                                                </div>
                                                <span className="font-mono font-bold text-blue-900 text-lg">
                                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(fixedCostsTotal + commissionAmount)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t-2 border-slate-100">
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Llave en Mano</span>
                                                <span className="text-4xl font-black text-slate-900 tracking-tight">
                                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalClientPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleGenerateQuote}
                                        className="mt-6 w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        <Download size={24} />
                                        Generar PDF para Cliente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AdminQuoteModal;
