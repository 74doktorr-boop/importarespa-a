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
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[380px] z-[60]"
                >
                    <div className="bg-white text-slate-900 rounded-lg p-6 shadow-2xl border border-slate-100 ring-1 ring-black/5">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-2.5 rounded-md flex-shrink-0">
                                <Cookie className="text-blue-600" size={22} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-sm mb-2 text-slate-900 uppercase tracking-wide">Cookies & Privacidad</h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                                    Mejoramos tu experiencia usando cookies. Al continuar, aceptas su uso.
                                    <Link to="/cookies" className="text-blue-600 hover:text-blue-700 ml-1 font-medium hover:underline transition-colors">
                                        Leer más
                                    </Link>.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-md transition-all shadow-md active:scale-95"
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-sm font-bold rounded-md transition-all active:scale-95"
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
