import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ShieldAlert, ArrowRight, Loader } from 'lucide-react';

const RedirectModal = ({ isOpen, onClose, targetUrl, vehicleData }) => {
    const [countdown, setCountdown] = useState(3);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setCountdown(3);
            setProgress(0);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        window.open(targetUrl, '_blank');
                        onClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            const progressTimer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressTimer);
                        return 100;
                    }
                    return prev + (100 / 30); // 100% over 3 seconds (30 steps of 100ms)
                });
            }, 100);

            return () => {
                clearInterval(timer);
                clearInterval(progressTimer);
            };
        }
    }, [isOpen, targetUrl, onClose]);

    if (!isOpen) return null;

    const carVerticalUrl = `https://www.carvertical.com/es/land/vin-check?utm_source=affiliate&utm_medium=importarespana&vin=${vehicleData?.vin || ''}`;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
                >
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <Loader className="text-blue-600 animate-spin" size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Redirigiendo al Anuncio...</h2>
                        <p className="text-slate-500 mb-8">
                            En {countdown} segundos te llevaremos a la página de origen.
                        </p>

                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 text-left relative overflow-hidden group">
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-amber-900 mb-1">¡Un momento! Evita estafas</h3>
                                    <p className="text-sm text-amber-800 leading-relaxed mb-4">
                                        Antes de contactar con el vendedor, te recomendamos verificar el historial del coche con <strong>CarVertical</strong>.
                                    </p>
                                    <a
                                        href={carVerticalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md"
                                    >
                                        Sacar Informe <ArrowRight size={16} />
                                    </a>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        </div>

                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                                className="bg-blue-600 h-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                            />
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                        >
                            Cancelar Redirección
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RedirectModal;
