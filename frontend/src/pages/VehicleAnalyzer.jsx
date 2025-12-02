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
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isMonetizationOpen, setIsMonetizationOpen] = useState(false);

    const [garageVehicles, setGarageVehicles] = useState(() => {
        try {
            const saved = localStorage.getItem('garageVehicles');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load garage from localStorage", e);
            return [];
        }
    });

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
        setIsGarageOpen(true);
    };

    const removeFromGarage = (id) => {
        setGarageVehicles(prev => prev.filter(v => v.id !== id));
    };

    const clearGarage = () => {
        setGarageVehicles([]);
    };

    // Recent Searches
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
                transmission: vehicleData.transmission,
                price: vehicleData.price,
                timestamp: Date.now()
            };
            const filtered = prev.filter(s => s.url !== vehicleUrl);
            return [newSearch, ...filtered].slice(0, 5);
        });
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
                setError('No se pudieron cargar los datos. Por favor, verifica el enlace.');
            } else {
                setData(response.data);
                addToRecentSearches(response.data, url);
            }
        } catch (err) {
            console.error(err);
            setError('Error al analizar el vehículo. Verifica la URL o inténtalo de nuevo.');
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
                    setError('No se pudieron cargar los datos.');
                } else {
                    setData(response.data);
                    addToRecentSearches(response.data, searchUrl);
                }
            })
            .catch(err => {
                setError('Error al recargar el vehículo.');
            })
            .finally(() => setLoading(false));
    };

    const calculateTax = (co2, price) => {
        if (!co2 || !price) return { rate: 0, amount: 0, total: 0 };
        let rate = 0;
        if (co2 <= 120) rate = 0;
        else if (co2 <= 159) rate = 4.75;
        else if (co2 <= 199) rate = 9.75;
        else rate = 14.75;

        const amount = (price * rate) / 100;
        return { rate, amount, total: price + amount };
    };

    const taxData = data ? calculateTax(data.co2, data.price) : null;
    const dgtLabel = data ? getDgtLabel(data.fuelType, data.year) : null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
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

            <MonetizationModal
                isOpen={isMonetizationOpen}
                onClose={() => setIsMonetizationOpen(false)}
                onSelectFree={() => generateVehicleReport(data, taxData, transportCost)}
                onSelectPro={() => alert("¡Próximamente! Estamos integrando la pasarela de pago segura.")}
            />

            {/* About Modal */}
            <AnimatePresence>
                {isAboutOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setIsAboutOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsAboutOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <XCircle size={24} />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                                    <Car size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">IMPORTAR ESPAÑA</h2>
                                    <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">Premium Import Tool</p>
                                </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-6">
                                La herramienta definitiva para calcular los costes reales de importación de vehículos desde Alemania a España.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-slate-600">Cálculo preciso del Impuesto de Matriculación (IEDMT).</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-slate-600">Estimación de costes de transporte y logística.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-slate-600">Generación de informes profesionales en PDF.</p>
                                </div>
                            </div>

                            <div className="text-center text-xs text-slate-400">
                                © 2025 Importar España. Todos los derechos reservados.
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50"></div>
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-multiply"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`text-center transition-all duration-500 ${data ? 'mb-12' : 'mb-16'}`}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-100">
                            Professional Import Calculator
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
                            Importar España
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                            Calcula impuestos, transporte y costes de matriculación con precisión profesional.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="max-w-2xl mx-auto"
                    >
                        <form onSubmit={handleAnalyze} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-xl border border-slate-100">
                                <Search className="ml-4 text-slate-400 w-6 h-6" />
                                <input
                                    type="text"
                                    placeholder="Pega el enlace de mobile.de o AutoScout24..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 px-4 py-4 text-lg placeholder-slate-400 font-medium"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-slate-900 text-white hover:bg-slate-800 font-medium py-3 px-8 rounded-xl transition-all duration-300 min-w-[140px] flex justify-center items-center shadow-lg shadow-slate-900/20"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="flex items-center">Analizar <ArrowRight size={18} className="ml-2" /></span>
                                    )}
                                </button>
                            </div>
                        </form>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center justify-center text-sm font-medium"
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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="max-w-2xl mx-auto mt-8 flex flex-wrap justify-center gap-2"
                            >
                                {recentSearches.map((search, idx) => (
                                    <button
                                        key={search.timestamp}
                                        onClick={() => loadRecentSearch(search.url)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
                                    >
                                        <Car size={12} />
                                        {search.make} {search.model}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Features Grid (Only when no data) */}
            <AnimatePresence>
                {!data && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="container mx-auto px-4 pb-20"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { icon: Zap, title: "Análisis Instantáneo", desc: "Extracción de datos en tiempo real mediante IA avanzada." },
                                { icon: Calculator, title: "Impuestos Precisos", desc: "Cálculo del IEDMT basado en emisiones CO2 y tablas de Hacienda." },
                                { icon: FileText, title: "Informes PDF", desc: "Genera dossiers profesionales listos para presentar." }
                            ].map((item, index) => (
                                <div key={index} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 text-slate-900">
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Section */}
            <AnimatePresence>
                {data && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="container mx-auto px-4 pb-24 max-w-7xl"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Main Vehicle Info (8 cols) */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                                    {data.make}
                                                </span>
                                                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                                                    Importación
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight">
                                                {data.model}
                                            </h2>
                                            <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                                <div className="flex items-center">
                                                    <MapPin size={16} className="mr-1.5 text-slate-400" />
                                                    {data.location}, {data.country}
                                                </div>
                                                {dgtLabel && (
                                                    <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                                                        <span className="text-[10px] uppercase tracking-wider font-bold">Etiqueta</span>
                                                        <DgtBadge label={dgtLabel} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-slate-900 tracking-tight">
                                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: data.currency }).format(data.price)}
                                            </div>
                                            <div className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-bold">Precio Origen</div>
                                        </div>
                                    </div>

                                    {/* Main Image */}
                                    <div className="w-full h-[450px] rounded-2xl overflow-hidden mb-8 bg-slate-100 relative shadow-inner">
                                        <img
                                            src={data.imageUrl}
                                            alt={`${data.make} ${data.model}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {!data.imageUrl && (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                <Car size={64} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <StatCard icon={Settings} label="Cambio" value={data.transmission || 'Manual'} delay={0.1} />
                                        <StatCard icon={Activity} label="Kilometraje" value={`${data.mileage.toLocaleString()} km`} delay={0.2} />
                                        <StatCard icon={Gauge} label="Potencia" value={data.power ? `${data.power} CV` : 'N/A'} delay={0.3} />
                                        <StatCard icon={Fuel} label="Combustible" value={data.fuelType || 'N/A'} delay={0.4} />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center justify-center gap-2">
                                        <ExternalLink size={18} /> Ver Anuncio
                                    </a>
                                    <button onClick={() => setIsMonetizationOpen(true)} className="btn-secondary flex items-center justify-center gap-2">
                                        <FileText size={18} /> PDF
                                    </button>
                                    <button onClick={addToGarage} className="btn-secondary flex items-center justify-center gap-2">
                                        <Save size={18} /> Guardar
                                    </button>
                                    <button onClick={() => {
                                        const message = `🚗 *${data.make} ${data.model}* (${data.year})\n💰 *Precio:* ${data.price}€\n🔗 ${url}`;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                                    }} className="btn-primary flex items-center justify-center gap-2">
                                        <Share2 size={18} /> Compartir
                                    </button>
                                </div>

                                {/* Transport & Profitability */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TransportCard originCity={data.location} onCostCalculated={setTransportCost} />
                                    <ProfitabilityCard importPrice={taxData.total + transportCost} vehicleData={data} />
                                </div>
                            </div>

                            {/* Sidebar (4 cols) */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
                                    <div className="flex items-center mb-6">
                                        <div className="p-2.5 bg-slate-900 rounded-xl mr-3 text-white">
                                            <Calculator size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Desglose de Costes</h3>
                                    </div>

                                    {/* CO2 Gauge */}
                                    <div className="flex justify-center mb-8 py-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <AnimatedGauge value={data.co2} label="Emisiones CO2" unit="g/km" />
                                    </div>

                                    <div className="mb-8">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tramos IEDMT</h4>
                                        <TaxBrackets currentCo2={data.co2} />
                                    </div>

                                    <div className="space-y-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Precio Vehículo</span>
                                            <span className="font-mono font-medium text-slate-900">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(data.price)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Tipo Impositivo</span>
                                            <span className="font-mono font-medium text-blue-600">{taxData.rate}%</span>
                                        </div>
                                        <div className="h-px bg-slate-200 my-2"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-900">Impuesto Matriculación</span>
                                            <span className="font-bold text-lg text-slate-900 font-mono">
                                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(taxData.amount)}
                                            </span>
                                        </div>
                                        {transportCost > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-900">Transporte</span>
                                                <span className="font-bold text-lg text-blue-600 font-mono">
                                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(transportCost)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Estimado</span>
                                            <span className="text-4xl font-bold text-slate-900 tracking-tight">
                                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(taxData.total + transportCost)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VehicleAnalyzer;
