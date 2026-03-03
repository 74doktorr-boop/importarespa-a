import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, FileText, Landmark, ShieldCheck, CreditCard, ClipboardList, Info, ChevronDown, ExternalLink } from 'lucide-react';

const ProcedureAssistant = () => {
    const [steps, setSteps] = useState(() => {
        const saved = localStorage.getItem('importProcedures');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, title: 'Documentación de Origen', desc: 'Asegúrate de tener el Permiso de Circulación (Teil I y II) y el COC (Certificado de Conformidad).', icon: FileText, done: false },
            { id: 2, title: 'Ficha Técnica Reducida', desc: 'Contrata un ingeniero para que emita la ficha técnica si el COC no es suficiente.', icon: ClipboardList, done: false },
            { id: 3, title: 'ITV de Importación', desc: 'Pide cita en una estación ITV para la inspección extraordinaria de importación.', icon: ShieldCheck, done: false },
            { id: 4, title: 'Modelo 576 (Hacienda)', desc: 'Liquidación del Impuesto de Matriculación ante la AEAT basado en emisiones CO2.', icon: CreditCard, done: false, link: 'https://sede.agenciatributaria.gob.es/' },
            { id: 5, title: 'Impuesto de Tracción Mecánica', desc: 'Pago del impuesto de circulación (numerito) en tu ayuntamiento.', icon: Landmark, done: false },
            { id: 6, title: 'Matriculación Final (DGT)', desc: 'Solicita el número de matrícula y el permiso definitivo en Tráfico.', icon: CheckCircle2, done: false, link: 'https://sede.dgt.gob.es/' }
        ];
    });

    const [expandedStep, setExpandedStep] = useState(null);

    useEffect(() => {
        localStorage.setItem('importProcedures', JSON.stringify(steps));
    }, [steps]);

    const toggleStep = (id) => {
        setSteps(prev => prev.map(step =>
            step.id === id ? { ...step, done: !step.done } : step
        ));
    };

    const completedCount = steps.filter(s => s.done).length;
    const progress = (completedCount / steps.length) * 100;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="text-blue-500" size={24} /> Asistente de Trámites
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Guía paso a paso para legalizar tu vehículo en España.</p>
                </div>

                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progreso</span>
                        <span className="text-lg font-mono font-black text-blue-600 dark:text-blue-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700">
                        <motion.div
                            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 relative">
                {/* Connector Line */}
                <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800 -z-0"></div>

                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`relative z-10 rounded-2xl border transition-all duration-300 ${step.done
                                ? 'bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 opacity-70'
                                : expandedStep === step.id
                                    ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm scale-[1.01]'
                                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                    >
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleStep(step.id);
                                    }}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${step.done
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-300'
                                        }`}
                                >
                                    {step.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                </button>

                                <div className="flex items-center gap-3">
                                    <step.icon size={20} className={step.done ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                                    <span className={`font-bold text-sm tracking-tight ${step.done ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {step.title}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {step.link && !step.done && (
                                    <a
                                        href={step.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                                <ChevronDown
                                    size={18}
                                    className={`text-slate-400 transition-transform duration-300 ${expandedStep === step.id ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedStep === step.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-14 pb-5">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex items-center gap-3 p-4 bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100/50 dark:border-yellow-900/20 rounded-2xl">
                <Info className="text-yellow-600 dark:text-yellow-500 flex-shrink-0" size={18} />
                <p className="text-[11px] text-yellow-700 dark:text-yellow-400 font-medium leading-relaxed">
                    <strong>Nota:</strong> Estos trámites pueden variar según tu comunidad autónoma. Te recomendamos contactar con un gestor especializado para evitar errores en Hacienda.
                </p>
            </div>
        </div>
    );
};

export default ProcedureAssistant;
