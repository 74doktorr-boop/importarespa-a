import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calculator, FileCheck } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: Search,
            title: "1. Busca tu Coche",
            description: "Encuentra el coche de tus sueños en mobile.de o autoscout24. Copia el enlace del anuncio."
        },
        {
            icon: Calculator,
            title: "2. Analiza al Instante",
            description: "Pega el enlace en nuestro analizador. Calculamos impuestos, transporte y costes ocultos en segundos."
        },
        {
            icon: FileCheck,
            title: "3. Importa con Seguridad",
            description: "Descarga el informe completo, la guía de trámites y el contrato bilingüe. Compra sin miedos."
        }
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Importar nunca fue tan fácil
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Olvídate de las hojas de cálculo complicadas y la burocracia. Te guiamos paso a paso.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200 -z-10"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-shadow"
                        >
                            <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-sm">
                                <step.icon size={40} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
