import React from 'react';
import { ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const InsurancePromo = ({ vehicleData }) => {
    const insuranceUrl = `https://www.rastreator.com/seguros-coche?utm_source=importarespana&utm_medium=affiliate&make=${vehicleData?.make || ''}&model=${vehicleData?.model || ''}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group"
        >
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                        <ShieldCheck size={24} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Seguro de Coche</span>
                </div>

                <h3 className="text-xl font-bold mb-2">Ahorra hasta 300€ en tu seguro</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    Compara precios para tu <span className="font-bold">{vehicleData?.make} {vehicleData?.model}</span> importado.
                </p>

                <a
                    href={insuranceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white text-blue-600 w-full py-3 rounded-xl font-bold transition-all hover:bg-blue-50 shadow-lg"
                >
                    Comparar ahora <ArrowRight size={18} />
                </a>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </motion.div>
    );
};

export default InsurancePromo;
