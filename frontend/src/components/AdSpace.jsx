import React from 'react';
import { motion } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';

/**
 * AdSpace Component
 * Used to display premium ads or in-house services promotion.
 */
const AdSpace = ({ type = 'horizontal', className = '', id = '' }) => {
    const isHorizontal = type === 'horizontal';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group cursor-pointer ${className}`}
            id={id}
        >
            <div className={`relative flex flex-col md:flex-row items-center p-6 gap-6 ${isHorizontal ? 'md:flex-row' : 'md:flex-col'}`}>
                {/* Visual Accent */}
                <div className={`shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500`}>
                    <Sparkles size={40} />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Recomendado</span>
                        <Info size={14} className="text-slate-400" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                        ¿Buscas el coche perfecto sin moverte de casa?
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                        Contrata nuestro servicio de **Revisión Premium** en Alemania. Un técnico experto inspeccionará el coche por ti antes de que pagues un céntimo.
                    </p>
                </div>

                {/* CTA Button */}
                <div className="shrink-0">
                    <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all shadow-xl active:scale-95 text-sm uppercase tracking-wider">
                        Ver Detalles
                    </button>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] dark:opacity-[0.05] pointer-events-none transform translate-x-1/4 -translate-y-1/4 group-hover:scale-125 transition-transform duration-1000">
                    <Sparkles size={180} />
                </div>
            </div>

            {/* Disclaimer for SEO/Legal */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Contenido patrocinado • www.importarespaña.com selecciona cuidadosamente sus aliados.
            </div>
        </motion.div>
    );
};

export default AdSpace;
