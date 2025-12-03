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
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6 relative z-10">
                <div className="p-3 bg-blue-50 rounded-xl mr-4 text-blue-600">
                    <Truck size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Transporte a España</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Logística Integral</p>
                </div>
            </div>

            {!result ? (
                <form onSubmit={handleCalculate} className="relative z-10">
                    <div className="space-y-5">
                        {/* Route Visual */}
                        <div className="flex items-center justify-between px-2 relative">
                            <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-100 -z-10"></div>

                            <div className="flex flex-col items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                <MapPin size={16} className="text-slate-400 mb-1" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase">{originCity ? originCity.substring(0, 3) : 'DE'}</span>
                            </div>

                            <div className="bg-slate-50 p-1.5 rounded-full border border-slate-100">
                                <ArrowRight size={14} className="text-slate-400" />
                            </div>

                            <div className="flex flex-col items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                <MapPin size={16} className="text-blue-500 mb-1" />
                                <span className="text-[10px] font-bold text-blue-600 uppercase">ES</span>
                            </div>
                        </div>

                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">CP Destino</span>
                            </div>
                            <input
                                type="text"
                                placeholder="28001"
                                maxLength={5}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-24 pr-12 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-mono text-lg tracking-widest"
                                value={zipCode}
                                onChange={(e) => {
                                    setZipCode(e.target.value.replace(/\D/g, ''));
                                    setError(null);
                                }}
                            />
                            <button
                                type="submit"
                                disabled={loading || !originCity}
                                className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 flex items-center justify-center transition-all shadow-lg hover:shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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
                    <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-5 relative overflow-hidden text-center">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 block">Coste Estimado</span>
                        <span className="text-4xl font-bold text-white tracking-tight">
                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(result.cost)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center px-2 mb-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Distancia</span>
                            <span className="text-slate-900 font-mono font-bold">{result.distanceKm} km</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Tiempo</span>
                            <span className="text-slate-900 font-mono font-bold">~{result.durationDays} días</span>
                        </div>
                    </div>

                    <button
                        onClick={() => { setResult(null); if (onCostCalculated) onCostCalculated({ cost: 0, distance: 0 }); }}
                        className="w-full py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-wider"
                    >
                        Recalcular Ruta
                    </button>
                </motion.div>
            )}
        </div >
    );
};

export default TransportCard;
