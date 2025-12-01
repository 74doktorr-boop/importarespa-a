import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const TransportCard = ({ originCity, onCostCalculated }) => {
    const [zipCode, setZipCode] = useState('28001'); // Default to Madrid
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [hasAutoCalculated, setHasAutoCalculated] = useState(false);

    // Auto-calculate on load if originCity is available
    React.useEffect(() => {
        if (originCity && !hasAutoCalculated && !result && !loading) {
            handleCalculate();
            setHasAutoCalculated(true);
        }
    }, [originCity]);

    const handleCalculate = async (e) => {
        if (e) e.preventDefault();

        if (!zipCode || zipCode.length < 5) {
            setError('Introduce un CP válido');
            return;
        }

        setLoading(true);
        setError(null);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        try {
            const response = await axios.post(`${API_URL}/api/transport`, {
                origin: originCity,
                destination: zipCode
            });

            setResult(response.data);
            if (onCostCalculated) {
                onCostCalculated(response.data.cost);
            }
        } catch (err) {
            console.error(err);
            // Don't show error on auto-calc to avoid UI noise, just log it
            if (e) setError('Error al calcular. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-900/40 to-black/40 backdrop-blur-2xl border border-blue-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            {/* Decorative Background */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
            ></motion.div>
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    x: [0, 50, 0],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"
            ></motion.div>

            <div className="flex items-center mb-6 relative z-10">
                <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="p-3 bg-blue-500/20 rounded-xl mr-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                    <Truck className="text-blue-400" size={28} />
                </motion.div>
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Transporte a España</h3>
                    <p className="text-xs text-blue-300/70 font-medium uppercase tracking-wider">Logística Integral</p>
                </div>
            </div>

            {!result ? (
                <form onSubmit={handleCalculate} className="relative z-10">
                    <div className="space-y-5">
                        {/* Route Visual */}
                        <div className="flex items-center justify-between px-2 relative">
                            <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-gray-700/50 -z-10"></div>
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute left-4 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent -z-10"
                            ></motion.div>

                            <div className="flex flex-col items-center bg-black/40 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                <MapPin size={16} className="text-gray-400 mb-1" />
                                <span className="text-[10px] font-bold text-gray-300 uppercase">{originCity ? originCity.substring(0, 3) : 'DE'}</span>
                            </div>

                            <div className="bg-black/40 p-1.5 rounded-full border border-white/10">
                                <ArrowRight size={14} className="text-gray-500" />
                            </div>

                            <div className="flex flex-col items-center bg-black/40 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                <MapPin size={16} className="text-blue-400 mb-1" />
                                <span className="text-[10px] font-bold text-blue-300 uppercase">ES</span>
                            </div>
                        </div>

                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">CP Destino</span>
                            </div>
                            <input
                                type="text"
                                placeholder="28001"
                                maxLength={5}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-24 pr-12 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all outline-none font-mono text-lg tracking-widest"
                                value={zipCode}
                                onChange={(e) => {
                                    setZipCode(e.target.value.replace(/\D/g, ''));
                                    setError(null);
                                }}
                            />
                            <button
                                type="submit"
                                disabled={loading || !originCity}
                                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 flex items-center justify-center transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                            </button>
                        </div>

                        {error && <p className="text-red-400 text-xs mt-2 ml-1 flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{error}</p>}
                    </div >
                </form >
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10"
                >
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-1 shadow-lg mb-5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5 text-center relative">
                            <span className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1 block">Coste Estimado</span>
                            <span className="text-4xl font-black text-white tracking-tight drop-shadow-md">
                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(result.cost)}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2 mb-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Distancia</span>
                            <span className="text-white font-mono font-bold">{result.distanceKm} km</span>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Tiempo</span>
                            <span className="text-white font-mono font-bold">~{result.durationDays} días</span>
                        </div>
                    </div>

                    <button
                        onClick={() => { setResult(null); if (onCostCalculated) onCostCalculated(0); }}
                        className="w-full py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider"
                    >
                        Recalcular Ruta
                    </button>
                </motion.div>
            )}
        </div >
    );
};

export default TransportCard;
