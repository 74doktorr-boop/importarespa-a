import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Settings, DollarSign, FileText, Truck, ShieldCheck } from 'lucide-react';

const CostSettings = ({ isOpen, onClose, onSave }) => {
    const [settings, setSettings] = useState({
        commissionType: 'fixed', // 'fixed' or 'percent'
        commissionValue: 990,
        itvCost: 150,
        dgtFees: 99,
        provisionalPlates: 100,
        managementFee: 0,
        transportBase: 350,
        transportPerKm: 0.85
    });

    useEffect(() => {
        const saved = localStorage.getItem('importCostSettings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleTypeChange = (type) => {
        setSettings(prev => ({
            ...prev,
            commissionType: type
        }));
    };

    const handleSave = () => {
        localStorage.setItem('importCostSettings', JSON.stringify(settings));
        onSave(settings);
        onClose();
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
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto max-w-lg h-fit bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Settings size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Configuración de Costes</h2>
                                    <p className="text-xs text-slate-500">Define tus márgenes y gastos fijos</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                            {/* Commission Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <DollarSign size={16} className="text-green-600" /> Tu Comisión
                                </h3>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => handleTypeChange('fixed')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${settings.commissionType === 'fixed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Fija (€)
                                    </button>
                                    <button
                                        onClick={() => handleTypeChange('percent')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${settings.commissionType === 'percent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Porcentaje (%)
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {settings.commissionType === 'fixed' ? 'Honorarios Fijos (€)' : 'Porcentaje sobre precio (%)'}
                                    </label>
                                    <input
                                        type="number"
                                        name="commissionValue"
                                        value={settings.commissionValue}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-slate-100"></div>

                            {/* Fixed Costs Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={16} className="text-blue-600" /> Gastos Fijos (Estimados)
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">ITV (€)</label>
                                        <input
                                            type="number"
                                            name="itvCost"
                                            value={settings.itvCost}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Tasas DGT (€)</label>
                                        <input
                                            type="number"
                                            name="dgtFees"
                                            value={settings.dgtFees}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Placas Prov. (€)</label>
                                        <input
                                            type="number"
                                            name="provisionalPlates"
                                            value={settings.provisionalPlates}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Gestoría (€)</label>
                                        <input
                                            type="number"
                                            name="managementFee"
                                            value={settings.managementFee}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50">
                            <button
                                onClick={handleSave}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={18} /> Guardar Configuración
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CostSettings;
