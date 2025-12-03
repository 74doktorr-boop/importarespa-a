import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, FileCheck, Key, ArrowRight } from 'lucide-react';

const ImportServicePromo = ({ onOpenContact }) => {
    const benefits = [
        {
            icon: <Truck className="w-6 h-6 text-blue-400" />,
            title: "Transporte Asegurado",
            description: "Traemos tu coche desde cualquier punto de Europa hasta la puerta de tu casa."
        },
        {
            icon: <FileCheck className="w-6 h-6 text-blue-400" />,
            title: "Trámites y Homologación",
            description: "Nos encargamos de la ITV, matriculación y toda la burocracia."
        },
        {
            icon: <Key className="w-6 h-6 text-blue-400" />,
            title: "Llave en Mano",
            description: "Te entregamos el coche listo para conducir, sin sorpresas ni dolores de cabeza."
        },
        {
            icon: <CheckCircle className="w-6 h-6 text-blue-400" />,
            title: "Revisión y Negociación",
            description: "Verificamos el estado del vehículo y negociamos el mejor precio por ti."
        }
    ];

    return (
        <section className="py-20 bg-slate-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wider mb-6">
                                SERVICIO INTEGRAL
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                ¿Quieres que te lo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">traigamos?</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Olvídate del papeleo, el idioma y la logística. Nosotros nos encargamos de todo el proceso de importación para que tú solo disfrutes de tu nuevo coche.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button
                                    onClick={onOpenContact}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/20 flex items-center group"
                                >
                                    Solicitar Presupuesto
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-slate-500 text-sm">
                                    Sin compromiso. Respuesta en 24h.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 border border-slate-700">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImportServicePromo;
