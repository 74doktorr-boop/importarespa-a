import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Check, ArrowRight, Banknote } from 'lucide-react';

const FinancingModal = ({ isOpen, onClose, vehiclePrice }) => {
    const [months, setMonths] = useState(60);
    const [downPayment, setDownPayment] = useState(0);
    const [interestRate, setInterestRate] = useState(6.99); // Example rate

    // Calculate monthly payment
    const calculatePayment = () => {
        const principal = vehiclePrice - downPayment;
        if (principal <= 0) return 0;

        const monthlyRate = interestRate / 100 / 12;
        const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
        return payment;
    };

    const monthlyPayment = calculatePayment();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl">
                                <Banknote size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Financiación Flexible</h3>
                                <p className="text-blue-200 text-xs">Simulación aproximada</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Tu cuota mensual</span>
                            <div className="text-5xl font-black text-slate-900 mt-2 tracking-tight">
                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(monthlyPayment)}
                                <span className="text-lg text-slate-400 font-medium">/mes</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Plazo */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-700">Plazo (Meses)</label>
                                    <span className="text-sm font-bold text-blue-600">{months} meses</span>
                                </div>
                                <input
                                    type="range"
                                    min="12"
                                    max="96"
                                    step="12"
                                    value={months}
                                    onChange={(e) => setMonths(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>1 año</span>
                                    <span>8 años</span>
                                </div>
                            </div>

                            {/* Entrada */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-700">Entrada Inicial</label>
                                    <span className="text-sm font-bold text-blue-600">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(downPayment)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={vehiclePrice * 0.8}
                                    step="500"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 mb-6">
                            <div className="flex items-start gap-2">
                                <Check size={16} className="mt-0.5 shrink-0" />
                                <p>Respuesta en 24h. Sin cambiar de banco. 100% Online.</p>
                            </div>
                        </div>

                        <a
                            href="https://www.younited-credit.com/" // Placeholder link
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                        >
                            Solicitar Estudio Gratuito <ArrowRight size={20} />
                        </a>

                        <p className="text-center text-[10px] text-slate-400 mt-4">
                            *TAE variable según perfil. Financiación sujeta a aprobación por parte de la entidad financiera.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FinancingModal;
