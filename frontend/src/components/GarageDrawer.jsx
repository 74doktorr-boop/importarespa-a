import React from 'react';
import { X, Trash2, ExternalLink, TrendingUp, TrendingDown, Car, Calendar, Gauge, Euro, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GarageDrawer = ({ isOpen, onClose, vehicles = [], onRemove, onClear }) => {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[800px] bg-[#0a0f1c] border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tighter">
                                        Mi Garaje
                                    </h2>
                                    <p className="text-gray-400 text-sm">
                                        Comparando {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {vehicles.length > 0 && (
                                        <button
                                            onClick={onClear}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                                        >
                                            <Trash2 size={14} /> Limpiar
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X size={24} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            {vehicles.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-50">
                                    <Car size={64} className="text-gray-600 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Tu garaje está vacío</h3>
                                    <p className="text-gray-500 max-w-xs">
                                        Analiza vehículos y pulsa "Guardar en Garaje" para compararlos aquí.
                                    </p>
                                </div>
                            ) : (
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {vehicles.map((vehicle, index) => (
                                        <motion.div
                                            key={vehicle.id || index}
                                            layout
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                show: { opacity: 1, y: 0 }
                                            }}
                                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative group hover:border-white/20 hover:shadow-xl transition-all duration-300"
                                        >
                                            <button
                                                onClick={() => onRemove(vehicle.id)}
                                                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-all z-10 opacity-0 group-hover:opacity-100 hover:scale-110"
                                            >
                                                <X size={14} />
                                            </button>

                                            {/* Image & Header */}
                                            <div className="h-40 relative overflow-hidden">
                                                <motion.img
                                                    src={vehicle.imageUrl}
                                                    alt={vehicle.model}
                                                    className="w-full h-full object-cover"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                                                <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                                        {vehicle.make}
                                                    </div>
                                                    <div className="text-lg font-bold text-white truncate">
                                                        {vehicle.model}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Specs Grid */}
                                            <div className="p-4 space-y-4">
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div className="bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition-colors">
                                                        <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
                                                            <Calendar size={10} /> Fecha
                                                        </div>
                                                        <div className="text-white font-mono truncate">{vehicle.firstRegistration || vehicle.year}</div>
                                                    </div>
                                                    <div className="bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition-colors">
                                                        <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
                                                            <Gauge size={10} /> Km
                                                        </div>
                                                        <div className="text-white font-mono">{vehicle.mileage.toLocaleString()}</div>
                                                    </div>
                                                </div>

                                                {/* Financials */}
                                                <div className="space-y-2 pt-2 border-t border-white/5">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400 text-xs">Precio Origen</span>
                                                        <span className="text-white font-mono text-sm">{formatCurrency(vehicle.price)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400 text-xs">Coste Total Est.</span>
                                                        <span className="text-blue-300 font-mono font-bold text-sm">{formatCurrency(vehicle.totalCost)}</span>
                                                    </div>
                                                </div>

                                                {/* Profitability Highlight */}
                                                {vehicle.savings && (
                                                    <div className={`p-3 rounded-xl flex items-center justify-between ${vehicle.savings >= 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                                        <div className="flex items-center gap-2">
                                                            {vehicle.savings >= 0 ? <TrendingUp size={16} className="text-green-400" /> : <TrendingDown size={16} className="text-red-400" />}
                                                            <span className={`text-xs font-bold uppercase tracking-wider ${vehicle.savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                                {vehicle.savings >= 0 ? 'Ahorro' : 'Pérdida'}
                                                            </span>
                                                        </div>
                                                        <span className={`font-black font-mono ${vehicle.savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {formatCurrency(Math.abs(vehicle.savings))}
                                                        </span>
                                                    </div>
                                                )}

                                                <a
                                                    href={vehicle.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full py-2 text-center bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                                                >
                                                    Ver Anuncio
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence >
    );
};

export default GarageDrawer;
