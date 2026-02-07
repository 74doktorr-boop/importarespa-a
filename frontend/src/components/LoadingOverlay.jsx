import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Search, Database, Calculator, CheckCircle } from 'lucide-react';

const LoadingOverlay = ({ isLoading }) => {
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);

    const steps = [
        { text: "Iniciando conexión segura...", icon: Search },
        { text: "Analizando anuncio en mobile.de...", icon: Car },
        { text: "Extrayendo especificaciones técnicas...", icon: Database },
        { text: "Calculando impuestos y transporte...", icon: Calculator },
        { text: "Finalizando...", icon: CheckCircle }
    ];

    useEffect(() => {
        if (isLoading) {
            setProgress(0);
            setStep(0);

            // Simulate progress
            const interval = setInterval(() => {
                setProgress(prev => {
                    // Slow down as we get closer to 90%
                    if (prev >= 90) return prev;

                    const increment = Math.max(1, (90 - prev) / 20);
                    const newProgress = prev + increment;

                    // Update step based on progress
                    if (newProgress > 70) setStep(3);
                    else if (newProgress > 50) setStep(2);
                    else if (newProgress > 20) setStep(1);

                    return newProgress;
                });
            }, 100);

            return () => clearInterval(interval);
        } else {
            setProgress(100);
            setStep(4);
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/95 backdrop-blur-md"
                >
                    <div className="w-full max-w-md px-6 text-center">
                        {/* Icon Animation */}
                        <div className="relative h-24 w-24 mx-auto mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-blue-600"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                                {React.createElement(steps[step].icon, { size: 32 })}
                            </div>
                        </div>

                        {/* Text Steps */}
                        <div className="h-16 mb-6">
                            <AnimatePresence mode="wait">
                                <motion.h3
                                    key={step}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-xl font-bold text-slate-900"
                                >
                                    {steps[step].text}
                                </motion.h3>
                            </AnimatePresence>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                            <motion.div
                                className="h-full bg-blue-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>Procesando</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingOverlay;
