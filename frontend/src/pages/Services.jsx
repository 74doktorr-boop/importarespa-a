import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Wrench, Truck } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
    const services = [
        {
            icon: ShieldCheck,
            title: "Informe CarVertical",
            description: "¿Kilómetros reales? ¿Accidentes ocultos? No te la juegues. Saca el informe oficial con el VIN del coche.",
            buttonText: "Obtener Informe",
            link: "https://www.carvertical.com/es/land/vin-check?utm_source=affiliate&utm_medium=importarespana", // Affiliate Placeholder
            recommended: true
        },
        {
            icon: FileText,
            title: "Seguro de Coche",
            description: "Compara entre más de 20 aseguradoras y encuentra la póliza perfecta para tu coche importado con el mejor precio.",
            buttonText: "Comparar Seguros",
            link: "https://www.rastreator.com/seguros-coche?utm_source=importarespana", // Affiliate Placeholder
            recommended: false
        },
        {
            icon: Truck,
            title: "Transporte a España",
            description: "¿Necesitas traerlo? Gestionamos el transporte en camión portacoches desde cualquier punto de Alemania.",
            buttonText: "Pedir Presupuesto",
            link: "/#contact", // Internal link
            recommended: false
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-slate-900 mb-4"
                    >
                        Servicios Extra para tu Importación
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto"
                    >
                        Herramientas y servicios seleccionados para que tu compra sea segura y rentable.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ServiceCard {...service} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-blue-900/20">
                    <h2 className="text-3xl font-bold mb-4">¿Necesitas ayuda personalizada?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                        Si prefieres que nos encarguemos de todo (negociación, transporte, matriculación), contrata nuestro servicio llave en mano.
                    </p>
                    <a
                        href="/#contact"
                        className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                    >
                        Contactar con el Equipo
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Services;
