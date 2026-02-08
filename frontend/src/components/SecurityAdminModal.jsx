import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ArrowRight, ShieldAlert } from 'lucide-react';

const SecurityAdminModal = ({ isOpen, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hardcoded password for now - in a real app this should be env var or backend validated
        if (password === 'admin2025') {
            setError(false);
            setPassword('');
            onSuccess();
        } else {
            setError(true);
            // Shake effect or error message
            setTimeout(() => setError(false), 2000);
        }
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
                        className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[80]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 m-auto max-w-md h-fit bg-white rounded-2xl shadow-2xl z-[90] overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <div className={`p-4 rounded-full ${error ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-900'} transition-colors duration-300`}>
                                    {error ? <ShieldAlert size={32} /> : <Lock size={32} />}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Acceso Restringido</h2>
                            <p className="text-center text-slate-500 mb-8">Introduce la clave de administrador para continuar.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Contraseña..."
                                        className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-xl text-center text-lg font-bold tracking-widest outline-none transition-all ${error
                                            ? 'border-red-300 focus:border-red-500 text-red-900 placeholder-red-300'
                                            : 'border-slate-200 focus:border-slate-900 text-slate-900'
                                            }`}
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Acceder</span>
                                    <ArrowRight size={20} />
                                </button>
                            </form>
                        </div>

                        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                            <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600 font-medium">
                                Cancelar
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SecurityAdminModal;
