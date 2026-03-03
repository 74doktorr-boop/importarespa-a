import React from 'react';
import { motion } from 'framer-motion';
import ProcedureAssistant from '../components/ProcedureAssistant';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const Tramites = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <ShieldCheck size={16} /> Guía de Legalización 2024
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Trámites de <span className="text-blue-600">Importación</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Sigue esta guía interactiva para legalizar tu vehículo en España. Hemos desglosado cada paso, desde la ITV hasta la placa definitiva.
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-b from-blue-600/5 to-transparent rounded-[40px] blur-3xl -z-10 opacity-50"></div>
                    <ProcedureAssistant />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-8 rounded-3xl bg-slate-900 dark:bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10"
                >
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2">¿Prefieres que lo hagamos por ti?</h3>
                        <p className="text-blue-100/70 text-sm max-w-md">Ofrecemos gestión integral de trámites para que no tengas que preocuparte por Hacienda ni la DGT.</p>
                    </div>
                    <button className="whitespace-nowrap px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-xl shadow-black/20">
                        Consultar Gestoría <ArrowRight size={18} />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Tramites;
