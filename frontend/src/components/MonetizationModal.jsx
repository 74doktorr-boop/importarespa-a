import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, FileText, ShieldCheck, BookOpen, PenTool } from 'lucide-react';

const MonetizationModal = ({ isOpen, onClose, onSelectFree }) => {
    if (!isOpen) return null;

    const handleBuyPro = () => {
        // Lemon Squeezy Checkout
        window.open('https://importarespana.lemonsqueezy.com/buy/4bb4bfaf-7af5-4a59-86e7-2dde42d7ea9a', '_blank');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#0f172a] border border-white/10 rounded-3xl max-w-5xl w-full shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                    >
                        <X size={24} />
                    </button>

                    {/* Free Tier - Now the only tier */}
                    <div className="flex-1 p-10 flex flex-col items-center text-center relative bg-[#0f172a]">
                        <div className="mb-8">
                            <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                                <FileText className="text-blue-400" size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3">Tu Informe Profesional</h3>
                            <p className="text-gray-400 text-lg max-w-md mx-auto">
                                Hemos preparado el desglose completo de impuestos y transporte para tu vehículo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 w-full max-w-2xl">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                                <Check className="text-blue-400" size={20} />
                                <span className="text-gray-200 font-medium">Cálculo IEDMT (BOE)</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                                <Check className="text-blue-400" size={20} />
                                <span className="text-gray-200 font-medium">Ruta de Transporte</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                                <Check className="text-blue-400" size={20} />
                                <span className="text-gray-200 font-medium">Estimación de Gastos</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                                <Check className="text-blue-400" size={20} />
                                <span className="text-gray-200 font-medium">Válido para Trámites</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                onSelectFree();
                                onClose();
                            }}
                            className="w-full max-w-md py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-2xl shadow-blue-600/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                        >
                            <FileText size={24} />
                            DESCARGAR PDF GRATIS
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence >
    );
};

const FeatureItem = ({ text, highlight = false, icon: Icon = Check }) => {
    const isValidIcon = Icon && (typeof Icon === 'function' || typeof Icon === 'object');
    return (
        <li className={`flex items-start gap-3 ${highlight ? 'text-white' : 'text-gray-400'}`}>
            <div className={`mt-1 flex-shrink-0 ${highlight ? 'text-blue-400' : 'text-gray-600'}`}>
                {isValidIcon ? <Icon size={18} /> : <Check size={18} />}
            </div>
            <span className={`text-sm font-medium ${highlight ? 'text-blue-50' : ''}`}>{text}</span>
        </li>
    );
};

export default MonetizationModal;
