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
                onCostCalculated({
                    cost: response.data.cost,
                    distance: response.data.distanceKm
                });
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md dark:shadow-none transition-shadow">
            <div className="flex items-center mb-6 relative z-10">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl mr-4 text-blue-600 dark:text-blue-400">
                    <Truck size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Transporte a España</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Logística Integral</p>
                </div>
            </div>

            {!result ? (
                <form onSubmit={handleCalculate} className="relative z-10">
                    <div className="space-y-5">
                        {/* Route Visual */}
                        <div className="flex items-center justify-between px-2 relative">
                            <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>

                            <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                <MapPin size={16} className="text-slate-400 mb-1" />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{originCity ? originCity.substring(0, 3) : 'DE'}</span>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-700 p-1.5 rounded-full border border-slate-100 dark:border-slate-600">
                                <ArrowRight size={14} className="text-slate-400" />
                            </div>

                            <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                <MapPin size={16} className="text-blue-500 mb-1" />
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">ES</span>
                            </div>
                        </div>

                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">CP Destino</span>
                            </div>
                            <input
                                type="text"
                                placeholder="28001"
                                maxLength={5}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pl-24 pr-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none font-mono text-lg tracking-widest"
                                value={zipCode}
                                onChange={(e) => {
                                    setZipCode(e.target.value.replace(/\D/g, ''));
                                    setError(null);
                                }}
                            />
                            <button
                                type="submit"
                                disabled={loading || !originCity}
                                className="absolute right-2 top-2 bottom-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-lg px-4 flex items-center justify-center transition-all shadow-lg hover:shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                            </button>
                        </div>

                        {error && <p className="text-red-500 text-xs mt-2 ml-1 flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{error}</p>}
                    </div >
                </form >
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10"
                >
                    <div className="bg-slate-900 dark:bg-blue-600 rounded-2xl p-6 shadow-lg mb-6 relative overflow-hidden text-center group/price">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/price:opacity-100 transition-opacity duration-500"></div>
                        <span className="text-slate-400 dark:text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block relative z-10">Coste Total Logística</span>
                        <span className="text-4xl font-black text-white tracking-tight relative z-10">
                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(result.cost)}
                        </span>
                    </div>

                    {/* Enhanced Route Info */}
                    <div className="space-y-6 mb-8">
                        <div className="flex items-center justify-between px-2">
                            <div className="text-center flex-1">
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-1">Origen</div>
                                <div className="text-slate-900 dark:text-white font-bold truncate max-w-[100px] mx-auto">{originCity || 'Europa'}</div>
                            </div>
                            <div className="flex-[2] px-4 flex flex-col items-center">
                                <div className="w-full h-px bg-slate-200 dark:bg-slate-800 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-2 flex items-center gap-1">
                                        <Truck size={12} className="text-blue-500 animate-pulse" />
                                        <span className="text-[9px] font-mono text-slate-400">{result.distanceKm}km</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center flex-1">
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-1">Destino</div>
                                <div className="text-blue-600 dark:text-blue-400 font-bold">España ({zipCode})</div>
                            </div>
                        </div>

                        {/* Logistics Timeline */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircle size={10} /> Etapas de Entrega
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'Recogida y Carga', desc: 'Verificación de documentos', time: 'Día 1-2' },
                                    { label: 'Tránsito Internacional', desc: 'Transporte asegurado', time: 'Día 3-5' },
                                    { label: 'Entrega en Destino', desc: 'Descarga y entrega de llaves', time: `~Día ${result.durationDays}` }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            </div>
                                            {i < 2 && <div className="w-px h-full bg-slate-200 dark:bg-slate-700 mt-1"></div>}
                                        </div>
                                        <div className="flex-1 pb-1">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{step.label}</span>
                                                <span className="text-[9px] font-mono text-slate-400">{step.time}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => { setResult(null); if (onCostCalculated) onCostCalculated({ cost: 0, distance: 0 }); }}
                        className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-[0.2em]"
                    >
                        Nueva Simulación
                    </button>
                </motion.div>
            )}
        </div >
    );
};

export default TransportCard;
