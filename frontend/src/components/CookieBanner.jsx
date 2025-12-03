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
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-6 shadow-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-blue-500/20 p-3 rounded-xl">
                            <Cookie className="text-blue-400" size={32} />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-lg mb-1">Valoramos tu privacidad</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Utilizamos cookies propias y de terceros para mejorar nuestros servicios y analizar el tráfico.
                                Puedes consultar nuestra <Link to="/cookies" className="text-blue-400 hover:underline">Política de Cookies</Link>.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap"
                            >
                                Aceptar Todo
                            </button>
                            <button
                                onClick={handleAccept} // For simplicity in this MVP, both close. Real implementation might have settings.
                                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
