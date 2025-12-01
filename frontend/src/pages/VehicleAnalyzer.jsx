import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Car, MapPin, Calendar, DollarSign, Activity, AlertTriangle, CheckCircle, XCircle, FileText, ExternalLink, Zap, ShieldCheck, Clock, Info, Fuel, Gauge, Calculator, AlertCircle, ArrowRight, Settings, Warehouse, Plus, Save, Share2, Mail, Home, Menu, X } from 'lucide-react';
import StatCard from '../components/StatCard';
import AnimatedGauge from '../components/AnimatedGauge';
import TaxBrackets from '../components/TaxBrackets';
import TransportCard from '../components/TransportCard';
import ProfitabilityCard from '../components/ProfitabilityCard';
import GarageDrawer from '../components/GarageDrawer';
import axios from 'axios';
import luxuryBg from '../assets/luxury-bg.png';
import Navbar from '../components/Navbar';
import MonetizationModal from '../components/MonetizationModal';
import { generateVehicleReport } from '../utils/pdfGenerator';
import { getDgtLabel } from '../utils/dgtLogic';
import DgtBadge from '../components/DgtBadge';

const VehicleAnalyzer = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [transportCost, setTransportCost] = useState(0);

    // Garage State
    const [isGarageOpen, setIsGarageOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false); // About Modal State
    const [isMonetizationOpen, setIsMonetizationOpen] = useState(false); // Monetization Modal State
    // Load initial state from localStorage to avoid wiping data on first render
    const [garageVehicles, setGarageVehicles] = useState(() => {
        try {
            const saved = localStorage.getItem('garageVehicles');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load garage from localStorage", e);
            return [];
        }
    });

    // Save Garage to LocalStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('garageVehicles', JSON.stringify(garageVehicles));
    }, [garageVehicles]);

    const addToGarage = () => {
        if (!data) return;

        const newVehicle = {
            id: Date.now(),
            ...data,
            totalCost: taxData.total + transportCost,
            url: url,
            addedAt: new Date().toISOString()
        };

        setGarageVehicles(prev => [newVehicle, ...prev]);
        setIsGarageOpen(true); // Open drawer to show success
    };

    const removeFromGarage = (id) => {
        setGarageVehicles(prev => prev.filter(v => v.id !== id));
    };

    const clearGarage = () => {
        setGarageVehicles([]);
    };

    // Recent Searches State
    const [recentSearches, setRecentSearches] = useState(() => {
        try {
            const saved = localStorage.getItem('recentSearches');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }, [recentSearches]);

    const addToRecentSearches = (vehicleData, vehicleUrl) => {
        setRecentSearches(prev => {
            const newSearch = {
                url: vehicleUrl,
                make: vehicleData.make,
                model: vehicleData.model,
                year: vehicleData.year,
                transmission: vehicleData.transmission, // Store transmission
                price: vehicleData.price,
                timestamp: Date.now()
            };
            // Filter out duplicates (same URL) and keep last 5
            const filtered = prev.filter(s => s.url !== vehicleUrl);
            return [newSearch, ...filtered].slice(0, 5);
        });
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Warm up the server on load (Render Free Tier Cold Start)
    useEffect(() => {
        axios.get(`${API_URL}/`).catch(() => { });
    }, []);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await axios.post(`${API_URL}/api/parse`, { url });
            if (response.data.error) {
                setError('Could not load vehicle data. Please check the link.');
            } else {
                setData(response.data);
                addToRecentSearches(response.data, url);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to analyze the vehicle. Please check the URL or try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadRecentSearch = (searchUrl) => {
        setUrl(searchUrl);

        setLoading(true);
        setError(null);
        setData(null);

        axios.post(`${API_URL}/api/parse`, { url: searchUrl })
            .then(response => {
                if (response.data.error) {
                    setError('Could not load vehicle data.');
                } else {
                    setData(response.data);
                    addToRecentSearches(response.data, searchUrl);
                }
            })
            .catch(err => {
                setError('Failed to reload vehicle.');
            })
            .finally(() => setLoading(false));
    };

    // Tax Calculation Logic
    const calculateTax = (co2, price) => {
        if (!co2 || !price) return { rate: 0, amount: 0, total: 0 };

        let rate = 0;
        if (co2 <= 120) rate = 0;
        else if (co2 <= 159) rate = 4.75;
        else if (co2 <= 199) rate = 9.75;
        else rate = 14.75;

        const amount = (price * rate) / 100;
        return {
            rate,
            amount,
            total: price + amount
        };
    };

    const taxData = data ? calculateTax(data.co2, data.price) : null;
    const dgtLabel = data ? getDgtLabel(data.fuelType, data.year) : null;

    return (
        <div className="min-h-screen text-white relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Dynamic Background Image with Overlay */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-[#050b14] z-10"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 mix-blend-overlay"></div>
                <motion.img
                    key={data?.imageUrl || 'default-bg'}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={data?.imageUrl || luxuryBg}
                    alt="Background"
                    className={`w-full h-full object-cover ${data?.imageUrl ? 'blur-md opacity-60' : 'opacity-40'}`}
                />
            </div>

            {/* Navbar */}
            <Navbar
                onOpenGarage={() => setIsGarageOpen(true)}
                garageCount={garageVehicles.length}
                onOpenAbout={() => setIsAboutOpen(true)}
                onReset={() => {
                    setData(null);
                    setUrl('');
                    setError(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />

            <GarageDrawer
                isOpen={isGarageOpen}
                onClose={() => setIsGarageOpen(false)}
                savedVehicles={garageVehicles}
                onRemove={removeFromGarage}
                onClear={clearGarage}
            />

            {/* Monetization Modal */}
            <MonetizationModal
                isOpen={isMonetizationOpen}
                onClose={() => setIsMonetizationOpen(false)}
                onSelectFree={() => generateVehicleReport(data, transportCost)}
                onSelectPro={() => alert("¡Próximamente! Estamos integrando la pasarela de pago segura.")}
            />

            {/* About Modal */}
            <AnimatePresence>
                {isAboutOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsAboutOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                            <button
                                onClick={() => setIsAboutOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <XCircle size={24} />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                    <Car size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">IMPORTAR ESPAÑA</h2>
                                    <p className="text-blue-400 text-sm font-medium">Premium Import Tool</p>
                                </div>
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-6">
                                La herramienta definitiva para calcular los costes reales de importación de vehículos desde Alemania a España.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-gray-400">Cálculo preciso del Impuesto de Matriculación (IEDMT) basado en emisiones CO2.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-gray-400">Estimación de costes de transporte y logística.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-gray-400">Generación de informes profesionales en PDF.</p>
                                </div>
                            </div>

                            <div className="text-center text-xs text-gray-600">
                                © 2025 Importar España. Todos los derechos reservados.
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl relative z-20">
                {/* Header / Landing Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`text-center transition-all duration-700 ${data ? 'mb-8 scale-90 origin-top' : 'mb-20 mt-20'}`}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                        <span className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">Premium Import Tool</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter drop-shadow-2xl relative">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500 animate-gradient-x">
                            IMPORTAR ESPAÑA
                        </span>
                        <motion.div
                            className="absolute -inset-10 bg-blue-500/20 blur-3xl rounded-full -z-10"
                            animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.8, 1.1, 0.8] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        Calculadora de costes de importación con precisión milimétrica y diseño de vanguardia.
                    </p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="max-w-3xl mx-auto mb-20"
                >
                    <form onSubmit={handleAnalyze} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse"></div>
                        <div className="relative flex items-center bg-black/60 backdrop-blur-2xl rounded-2xl p-2 border border-white/10 shadow-2xl ring-1 ring-white/5 focus-within:ring-blue-500/50 transition-all">
                            <Search className="ml-4 text-gray-400 w-6 h-6" />
                            <input
                                type="text"
                                placeholder="Pega el enlace de mobile.de o AutoScout24..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white px-4 py-4 text-lg placeholder-gray-500 font-light rounded-2xl"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-xl transition-all duration-300 min-w-[140px] flex justify-center items-center shadow-lg"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <span className="flex items-center">Analizar <ArrowRight size={18} className="ml-2" /></span>
                                )}
                            </motion.button>
                        </div>
                    </form>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl text-red-200 flex items-center justify-center text-sm"
                        >
                            <AlertTriangle className="mr-2" size={18} />
                            {error}
                        </motion.div>
                    )}
                </motion.div>

                {/* Recent Searches */}
                <AnimatePresence>
                    {!data && recentSearches.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="max-w-3xl mx-auto mb-12 -mt-10"
                        >
                            <div className="flex items-center gap-2 mb-3 px-2">
                                <Clock size={14} className="text-gray-500" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Búsquedas Recientes</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {recentSearches.map((search, idx) => (
                                    <motion.button
                                        key={search.timestamp}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => loadRecentSearch(search.url)}
                                        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl px-4 py-2 transition-all group text-left"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                            <Car size={16} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                                                {search.make} {search.model}
                                            </div>
                                            <div className="text-xs text-gray-500 flex gap-2">
                                                <span>{search.transmission || 'N/A'}</span>
                                                <span>•</span>
                                                <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(search.price)}</span>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Info Boxes - Only show when no data is loaded */}
                <AnimatePresence>
                    {!data && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
                        >
                            {[
                                { icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10", title: "Análisis Instantáneo", desc: "Extracción de datos en tiempo real mediante IA." },
                                { icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10", title: "Ahorra Tiempo", desc: "Cálculos complejos de impuestos en milisegundos." },
                                { icon: ShieldCheck, color: "text-green-400", bg: "bg-green-500/10", title: "Datos Oficiales", desc: "Estimaciones basadas en normativas vigentes." }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    transition={{ delay: 0.4 + (index * 0.1) }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-colors duration-300 group cursor-default"
                                >
                                    <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                        <item.icon className={`${item.color} w-6 h-6`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white/90">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Section */}
                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Main Vehicle Info (8 cols) */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                    {/* Glass Reflection */}
                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>

                                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 relative z-10">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="px-2 py-1 rounded-md bg-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-300 border border-white/5">
                                                    {data.make}
                                                </span>
                                                <span className="px-2 py-1 rounded-md bg-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-300 border border-blue-500/20">
                                                    Importación
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 truncate leading-tight" title={`${data.make} ${data.model}`}>
                                                {data.model}
                                            </h2>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center text-gray-400 text-sm">
                                                    <MapPin size={14} className="mr-1.5 text-blue-400" />
                                                    <span className="truncate">{data.location}, {data.country}</span>
                                                </div>
                                                {dgtLabel && (
                                                    <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Etiqueta</span>
                                                        <DgtBadge label={dgtLabel} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                                            <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                                {data.price > 0
                                                    ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: data.currency }).format(data.price)
                                                    : 'Consultar'}
                                            </div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-medium">Precio Anuncio</div>
                                        </div>
                                    </div>

                                    {/* Main Image */}
                                    <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-8 relative group shadow-2xl border border-white/10 bg-black/50">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none"></div>

                                        <img
                                            src={data.imageUrl || luxuryBg}
                                            alt={`${data.make} ${data.model}`}
                                            className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-in-out ${!data.imageUrl ? 'opacity-50 grayscale' : ''}`}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

                                        {!data.imageUrl && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Car size={64} className="text-white/20" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <StatCard icon={Settings} label="Cambio" value={data.transmission || 'Manual'} delay={0.1} />
                                        <StatCard icon={Activity} label="Kilometraje" value={`${data.mileage.toLocaleString()} km`} delay={0.2} />
                                        <StatCard
                                            icon={Gauge}
                                            label="Potencia"
                                            value={data.power ? `${data.power} CV` : 'N/A'}
                                            delay={0.3}
                                        />
                                        <StatCard
                                            icon={Fuel}
                                            label="Combustible"
                                            value={data.fuelType || 'N/A'}
                                            delay={0.4}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all group font-medium shadow-lg hover:border-blue-500/30"
                                    >
                                        <ExternalLink className="mr-2 text-gray-400 group-hover:text-blue-400 transition-colors" size={20} />
                                        <span className="group-hover:text-white transition-colors">Ver Anuncio Original</span>
                                    </a>
                                    <button
                                        onClick={() => setIsMonetizationOpen(true)}
                                        className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all group font-medium shadow-lg hover:border-purple-500/30"
                                    >
                                        <FileText className="mr-2 text-gray-400 group-hover:text-purple-400 transition-colors" size={20} />
                                        <span className="group-hover:text-white transition-colors">Generar Informe PDF</span>
                                    </button>
                                    <button
                                        onClick={addToGarage}
                                        className="flex-1 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 p-5 rounded-2xl flex items-center justify-center hover:bg-blue-600/30 transition-all group font-medium shadow-lg hover:border-blue-500/50"
                                    >
                                        <Save className="mr-2 text-blue-400 group-hover:text-blue-300 transition-colors" size={20} />
                                        <span className="text-blue-100 group-hover:text-white transition-colors">Guardar en Garaje</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const message = `🚗 *${data.make} ${data.model}* (${data.year})\n\n💰 *Precio:* ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(data.price)}\n📏 *KM:* ${data.mileage.toLocaleString()}\n🏁 *Total Estimado:* ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(taxData.total + transportCost)}\n\n🔗 ${url}`;
                                            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                                        }}
                                        className="flex-1 bg-green-600/20 backdrop-blur-md border border-green-500/30 p-5 rounded-2xl flex items-center justify-center hover:bg-green-600/30 transition-all group font-medium shadow-lg hover:border-green-500/50"
                                    >
                                        <Share2 className="mr-2 text-green-400 group-hover:text-green-300 transition-colors" size={20} />
                                        <span className="text-green-100 group-hover:text-white transition-colors">Compartir</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const subject = `Anfrage: ${data.make} ${data.model} (${data.year})`;
                                            const body = `Dear Sir or Madam,\nSehr geehrte Damen und Herren,\n\nI am interested in your vehicle: ${data.make} ${data.model} (${data.year}).\nIch interessiere mich für Ihr Fahrzeug.\n\nCould you please answer the following questions?\nKönnten Sie bitte folgende Fragen beantworten?\n\n1. Is the vehicle still available?\n   Ist das Fahrzeug noch verfügbar?\n\n2. Is the vehicle accident-free?\n   Ist das Fahrzeug unfallfrei?\n\n3. Does it have a full service history?\n   Ist das Fahrzeug scheckheftgepflegt?\n\n4. What is the net price for export to Spain?\n   Was ist der Netto-Exportpreis nach Spanien?\n\nThank you.\nVielen Dank.`;

                                            navigator.clipboard.writeText(`${subject}\n\n${body}`).then(() => {
                                                alert("📧 Email copiado al portapapeles / Email copied to clipboard");
                                            });
                                        }}
                                        className="flex-1 bg-orange-600/20 backdrop-blur-md border border-orange-500/30 p-5 rounded-2xl flex items-center justify-center hover:bg-orange-600/30 transition-all group font-medium shadow-lg hover:border-orange-500/50"
                                    >
                                        <Mail className="mr-2 text-orange-400 group-hover:text-orange-300 transition-colors" size={20} />
                                        <span className="text-orange-100 group-hover:text-white transition-colors">Contactar</span>
                                    </button>
                                </div>

                                {/* New Section: Transport & Profitability (Side by Side) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Transport Calculator */}
                                    <TransportCard
                                        originCity={data.location}
                                        onCostCalculated={setTransportCost}
                                    />

                                    {/* Profitability Calculator */}
                                    <ProfitabilityCard
                                        importPrice={taxData.total + transportCost}
                                        vehicleData={data}
                                    />
                                </div>
                            </div>

                            {/* Tax Calculation Sidebar (4 cols) */}
                            <div className="lg:col-span-4 space-y-4">
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                                    className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col relative overflow-hidden"
                                >
                                    {/* Decorative Top Line */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-80"></div>

                                    <div className="flex items-center mb-4 mt-1">
                                        <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                                            <Calculator className="text-blue-400" size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight">Impuestos España</h3>
                                    </div>

                                    {/* Vehicle Image in Tax Dashboard */}
                                    <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-lg relative h-32 group">
                                        <img
                                            src={data.imageUrl || luxuryBg}
                                            alt="Vehicle Thumbnail"
                                            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${!data.imageUrl ? 'opacity-40 grayscale' : 'opacity-80'}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                                        <div className="absolute bottom-3 left-4 right-4">
                                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{data.make}</div>
                                            <div className="text-sm font-bold text-white truncate">{data.model}</div>
                                        </div>
                                    </div>

                                    {/* CO2 Gauge Section */}
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex justify-center mb-4 relative py-3 bg-white/5 rounded-2xl border border-white/5"
                                    >
                                        <AnimatedGauge value={data.co2} label="Emisiones CO2" unit="g/km" />
                                        {data.isEstimatedCO2 && (
                                            <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/30 flex items-center backdrop-blur-sm uppercase tracking-wide">
                                                Estimado
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Tax Brackets Visual */}
                                    <div className="mb-4">
                                        <h4 className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-bold ml-1">Tramos de CO2</h4>
                                        <TaxBrackets currentCo2={data.co2} />
                                    </div>

                                    {/* Calculation Breakdown */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className="bg-gradient-to-b from-white/5 to-white/0 rounded-2xl p-4 border border-white/5"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400">Precio Base</span>
                                                <span className="font-mono text-gray-300">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(data.price)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400">Tipo Impositivo</span>
                                                <span className="font-mono text-blue-400">{taxData.rate}%</span>
                                            </div>
                                            <div className="h-px bg-white/10 my-1"></div>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="font-bold text-white block">Impuesto Matriculación</span>
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">(Aproximado)</span>
                                                </div>
                                                <span className="font-bold text-xl text-red-400 font-mono">
                                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(taxData.amount)}
                                                </span>
                                            </div>
                                            {transportCost > 0 && (
                                                <div className="flex justify-between items-center animate-in fade-in slide-in-from-top-2 duration-500">
                                                    <span className="font-bold text-white block">Transporte</span>
                                                    <span className="font-bold text-xl text-blue-400 font-mono">
                                                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(transportCost)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Hacienda Info Box */}
                                    <div className="mt-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-start group hover:bg-yellow-500/10 transition-colors">
                                        <AlertCircle className="text-yellow-500 w-4 h-4 mr-2 flex-shrink-0 mt-0.5 opacity-80 group-hover:opacity-100" />
                                        <p className="text-[10px] text-yellow-200/70 leading-relaxed group-hover:text-yellow-200/90 transition-colors">
                                            <span className="font-bold text-yellow-500 block mb-0.5">Nota Importante</span>
                                            El impuesto oficial se calcula sobre el <strong>Valor Venal (Hacienda)</strong>, no el precio de compra. El coste real podría variar.
                                        </p>
                                    </div>

                                    <div className="mt-3 pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Estimado</span>
                                            <motion.span
                                                key={taxData.total + transportCost}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-3xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                                            >
                                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(taxData.total + transportCost)}
                                            </motion.span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <MonetizationModal
                    isOpen={isMonetizationOpen}
                    onClose={() => setIsMonetizationOpen(false)}
                    onSelectFree={() => generateVehicleReport(data, taxData, transportCost)}
                />
            </div>
        </div>
    );
};

export default VehicleAnalyzer;
