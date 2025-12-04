import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Download, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

const LeadMagnetModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        // Show modal after 15 seconds
        const timer = setTimeout(() => {
            const hasSeenModal = localStorage.getItem('hasSeenLeadMagnet');
            if (!hasSeenModal) {
                setIsOpen(true);
            }
        }, 15000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenLeadMagnet', 'true');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email) {
            setLoading(true);
            setError(null);
            try {
                await axios.post(`${API_URL}/api/subscribe`, { email });
                setSubmitted(true);
                setTimeout(() => {
                    handleClose();
                }, 5000);
            } catch (err) {
                console.error(err);
                setError('Hubo un error al suscribirte. Inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden z-10"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            {!submitted ? (
                                <>
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto text-blue-600">
                                        <Download size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">
                                        ¿No quieres perder dinero?
                                    </h3>
                                    <p className="text-slate-600 text-center mb-8">
                                        Descarga GRATIS nuestra guía: <strong>"Los 5 Errores de Importación que te costarán 3.000€"</strong>.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="email"
                                                required
                                                placeholder="Tu mejor email"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                "¡Quiero la Guía!"
                                            )}
                                        </button>
                                        {error && (
                                            <p className="text-xs text-red-500 text-center flex items-center justify-center gap-1">
                                                <AlertCircle size={12} /> {error}
                                            </p>
                                        )}
                                    </form>
                                    <p className="text-xs text-center text-slate-400 mt-4">
                                        Te enviaremos la guía al instante. Sin spam.
                                    </p>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto text-green-600">
                                        <Check size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">¡Enviado!</h3>
                                    <p className="text-slate-600">
                                        Revisa tu bandeja de entrada (o spam).
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div >
            )}
        </AnimatePresence >
    );
};

export default LeadMagnetModal;
