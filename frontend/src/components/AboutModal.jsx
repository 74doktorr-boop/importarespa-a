import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Zap, Heart, Globe, Users, ArrowRight } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
                >
                    {/* Header Image/Gradient */}
                    <div className="relative h-48 bg-slate-900 overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Sobre Nosotros</h2>
                                <p className="text-blue-200 font-medium tracking-wide">IMPORTAR ESPAÑA</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Mission Statement */}
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Simplificando la importación de vehículos</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Nacimos con una misión clara: eliminar la incertidumbre y la complejidad de comprar un coche en el extranjero.
                                Combinamos tecnología avanzada con experiencia legal para ofrecerte total transparencia en costes y trámites.
                            </p>
                        </div>

                        {/* Values Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {[
                                {
                                    icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
                                    title: "Transparencia Total",
                                    desc: "Sin costes ocultos. Calculamos cada impuesto y tasa al céntimo para que sepas exactamente lo que vas a pagar."
                                },
                                {
                                    icon: <Zap className="w-8 h-8 text-amber-500" />,
                                    title: "Tecnología e IA",
                                    desc: "Analizamos miles de datos en tiempo real para darte valoraciones precisas y detectar las mejores oportunidades."
                                },
                                {
                                    icon: <Heart className="w-8 h-8 text-red-500" />,
                                    title: "Pasión por el Motor",
                                    desc: "No somos solo gestores, somos entusiastas de los coches. Tratamos tu futura compra como si fuera la nuestra."
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                        {item.icon}
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Services Highlight */}
                        <div className="bg-slate-900 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe size={18} className="text-blue-400" />
                                        <span className="text-blue-400 font-bold text-sm tracking-wider uppercase">Servicio Integral</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">¿No quieres complicaciones?</h3>
                                    <p className="text-slate-300 max-w-md">
                                        Ofrecemos un servicio "Llave en Mano". Nosotros negociamos, transportamos, homologamos y matriculamos tu coche.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center whitespace-nowrap"
                                >
                                    Ver Servicios <ArrowRight size={18} className="ml-2" />
                                </button>
                            </div>

                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        </div>

                        {/* Team/Footer */}
                        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
                            <div className="flex items-center justify-center gap-2 text-slate-400 mb-4">
                                <Users size={20} />
                                <span className="font-medium">El Equipo de Importar España</span>
                            </div>
                            <p className="text-sm text-slate-400">
                                © {new Date().getFullYear()} Importar España. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AboutModal;
