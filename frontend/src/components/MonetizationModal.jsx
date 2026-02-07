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

                    {/* Free Tier */}
                    <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col relative bg-[#0f172a]">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Informe Básico</h3>
                            <p className="text-gray-400 text-sm">Todo lo necesario para empezar tu análisis.</p>
                        </div>
                        <div className="text-4xl font-black text-white mb-8">
                            0€ <span className="text-lg font-normal text-gray-500">/ siempre</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Datos del Vehículo" />
                            <FeatureItem text="Cálculo de Impuestos (IEDMT)" />
                            <FeatureItem text="Estimación de Transporte" />
                            <FeatureItem text="Informe PDF Estándar" />
                        </ul>

                        <button
                            onClick={() => {
                                onSelectFree();
                                onClose();
                            }}
                            className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all"
                        >
                            Descargar Gratis
                        </button>
                    </div>

                    {/* Pro Tier */}
                    <div className="flex-[1.3] p-8 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden flex flex-col border-l border-white/10">
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">
                            OFERTA LANZAMIENTO
                        </div>

                        <div className="mb-6 relative z-10">
                            <img src="/logo.svg" alt="Logo" className="h-12 w-auto mb-4 opacity-90" />
                            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 flex items-center gap-2">
                                Pack Importador PRO <Star className="text-yellow-400 fill-yellow-400" size={24} />
                            </h3>
                            <p className="text-blue-200 text-sm">La Biblia del Importador + Herramientas Profesionales.</p>
                        </div>

                        <div className="flex justify-center -space-x-4 mb-6 relative z-10">
                            <div className="w-24 h-32 bg-blue-900/50 rounded border border-blue-500/30 flex items-center justify-center transform -rotate-6 shadow-lg backdrop-blur-sm">
                                <BookOpen className="text-blue-400" size={32} />
                            </div>
                            <div className="w-24 h-32 bg-purple-900/50 rounded border border-purple-500/30 flex items-center justify-center transform rotate-6 shadow-lg backdrop-blur-sm z-10">
                                <ShieldCheck className="text-purple-400" size={32} />
                            </div>
                        </div>

                        <div className="flex items-end gap-3 mb-2 relative z-10">
                            <div className="text-5xl font-black text-white">
                                16.99€
                            </div>
                            <div className="flex flex-col mb-1">
                                <span className="text-lg font-bold text-gray-400 line-through decoration-red-500/50 decoration-2">39.99€</span>
                                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">-58% OFERTA FLASH</span>
                            </div>
                        </div>
                        <p className="text-xs text-blue-300 mb-6 relative z-10">Pago único. Acceso de por vida.</p>

                        <ul className="space-y-3 mb-8 flex-1 relative z-10">
                            <FeatureItem text="Todo lo incluido en Básico" highlight />
                            <FeatureItem text="La Biblia del Importador (PDF Premium)" icon={BookOpen} highlight />
                            <FeatureItem text="Checklist de Inspección (PDF)" icon={ShieldCheck} highlight />
                            <FeatureItem text="Guía de Trámites DGT e ITV" icon={FileText} highlight />
                            <FeatureItem text="Contrato Compraventa Bilingüe" icon={PenTool} highlight />
                        </ul>

                        <button
                            onClick={handleBuyPro}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-blue-900/50 transition-all relative z-10 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <span>Comprar Pack Ahora</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">16.99€</span>
                        </button>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-blue-500/10 to-purple-500/10 blur-3xl pointer-events-none"></div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence >
    );
};

const FeatureItem = ({ text, highlight = false, icon: Icon = Check }) => (
    <li className={`flex items-start gap-3 ${highlight ? 'text-white' : 'text-gray-400'}`}>
        <div className={`mt-1 flex-shrink-0 ${highlight ? 'text-blue-400' : 'text-gray-600'}`}>
            <Icon size={18} />
        </div>
        <span className={`text-sm font-medium ${highlight ? 'text-blue-50' : ''}`}>{text}</span>
    </li>
);

export default MonetizationModal;
