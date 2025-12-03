import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] z-[60]"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl p-6 shadow-2xl border border-white/10 ring-1 ring-black/5">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-500/20 p-3 rounded-xl flex-shrink-0">
                                <Cookie className="text-blue-400" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-base mb-2 text-white">Privacidad y Transparencia</h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    Usamos cookies para mejorar tu experiencia y analizar el tráfico.
                                    <Link to="/cookies" className="text-blue-400 hover:text-blue-300 ml-1 hover:underline transition-colors">
                                        Más información
                                    </Link>.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-medium rounded-xl transition-all active:scale-95"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
