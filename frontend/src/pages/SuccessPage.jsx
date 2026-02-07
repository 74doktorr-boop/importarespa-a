import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const SuccessPage = () => {

    useEffect(() => {
        // Trigger confetti on load
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const downloads = [
        {
            id: 1,
            title: "La Biblia del Importador",
            desc: "Guía Maestra Paso a Paso (PDF)",
            url: "/assets/guia_maestra_importacion.pdf", // Placeholder
            color: "bg-blue-500"
        },
        {
            id: 2,
            title: "Checklist de Inspección",
            desc: "Herramienta de Verificación (PDF)",
            url: "/assets/checklist_inspeccion_vehiculo.pdf", // Placeholder
            color: "bg-purple-500"
        },
        {
            id: 3,
            title: "Contrato Compraventa",
            desc: "Modelo Bilingüe ES/DE (Word/PDF)",
            url: "/assets/contrato_compraventa.pdf", // Placeholder
            color: "bg-green-500"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl w-full bg-[#1e293b] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-green-500/20 blur-[100px] pointer-events-none"></div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/50 relative z-10"
                >
                    <CheckCircle className="text-white w-12 h-12" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 relative z-10">¡Pago Confirmado!</h1>
                <p className="text-xl text-gray-400 mb-12 relative z-10">Gracias por unirte al club de importadores inteligentes.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
                    {downloads.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1) }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
                        >
                            <div className={`w-12 h-12 ${item.color}/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                                <Download className={`${item.color.replace('bg-', 'text-')} w-6 h-6`} />
                            </div>
                            <h3 className="font-bold text-white mb-1">{item.title}</h3>
                            <p className="text-xs text-gray-500 mb-4">{item.desc}</p>
                            <button
                                onClick={() => alert("En una app real, esto descargaría el archivo. Como es una demo, asegúrate de tener los archivos en la carpeta public/assets.")}
                                className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors"
                            >
                                Descargar
                            </button>
                        </motion.div>
                    ))}
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 font-bold transition-colors relative z-10"
                >
                    <ArrowRight className="mr-2 transform rotate-180" />
                    Volver al Analizador
                </Link>
            </motion.div>
        </div>
    );
};

export default SuccessPage;
