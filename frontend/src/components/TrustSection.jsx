import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ChevronUp, Quote, ChevronLeft, ChevronRight, Car } from 'lucide-react';

const TrustSection = () => {
    return (
        <div className="bg-white">
            <Testimonials />
            <FAQ />
        </div>
    );
};

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const reviews = [
        {
            name: "Carlos M.",
            role: "Importó un Audi A4",
            text: "Me ahorré más de 4.000€ trayendo el coche yo mismo. La guía y los cálculos fueron exactos al céntimo. Imprescindible.",
            stars: 5,
            image: "/images/audi_a4.png",
            model: "Audi A4 Avant (2020)"
        },
        {
            name: "Laura G.",
            role: "Importó un VW California",
            text: "Tenía miedo con el papeleo de la DGT, pero con el checklist y los modelos de contrato fue facilísimo. Muy recomendado.",
            stars: 5,
            image: "/images/vw_california.png",
            model: "VW California Ocean"
        },
        {
            name: "David R.",
            role: "Importó un BMW Serie 3",
            text: "La herramienta de análisis es brutal. En un segundo sabes si el coche es rentable o no. Me evitó comprar un coche con costes ocultos.",
            stars: 5,
            image: "/images/bmw_320d.jpg",
            model: "BMW 320d Touring"
        },
        {
            name: "Elena P.",
            role: "Importó un Mercedes Clase A",
            text: "Increíble el ahorro. En España me pedían 35.000€ y lo he traído por 28.000€ todo incluido. Gracias por la ayuda.",
            stars: 5,
            image: "/images/mercedes_a200.jpg",
            model: "Mercedes-Benz A200"
        },
        {
            name: "Marc S.",
            role: "Importó un Porsche Macan",
            text: "Gestión impecable. El informe me dio la seguridad para comprar un coche de este calibre sin verlo presencialmente.",
            stars: 5,
            image: "/images/porsche_macan.jpg",
            model: "Porsche Macan S"
        }
    ];

    const nextReview = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    return (
        <section className="py-20 border-t border-slate-100 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Historias de Éxito
                    </h2>
                    <p className="text-lg text-slate-600">
                        Cientos de españoles ya han importado su coche con éxito.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevReview}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-3 bg-white rounded-full shadow-lg text-slate-600 hover:text-blue-600 hover:scale-110 transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextReview}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-3 bg-white rounded-full shadow-lg text-slate-600 hover:text-blue-600 hover:scale-110 transition-all"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="overflow-hidden px-4">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {/* Image Side */}
                                    <div className="relative h-64 md:h-auto overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
                                        <img
                                            src={reviews[currentIndex].image}
                                            alt={reviews[currentIndex].model}
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                                            <p className="text-white font-medium text-sm flex items-center gap-2">
                                                <Car size={16} />
                                                {reviews[currentIndex].model}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="p-8 md:p-12 flex flex-col justify-center relative">
                                        <Quote size={48} className="text-blue-50 absolute top-8 right-8" />

                                        <div className="flex gap-1 mb-6">
                                            {[...Array(reviews[currentIndex].stars)].map((_, i) => (
                                                <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>

                                        <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 font-medium">
                                            "{reviews[currentIndex].text}"
                                        </blockquote>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                {reviews[currentIndex].name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">{reviews[currentIndex].name}</h4>
                                                <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">{reviews[currentIndex].role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {reviews.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-blue-600 w-8' : 'bg-slate-300 hover:bg-slate-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "¿Es difícil importar un coche desde Alemania?",
            answer: "No es difícil, pero requiere seguir unos pasos concretos. Con nuestra guía y herramientas, simplificamos el proceso burocrático (ITV, DGT, Hacienda) para que cualquiera pueda hacerlo sin experiencia previa."
        },
        {
            question: "¿Cuánto dinero me puedo ahorrar?",
            answer: "Depende del modelo, pero el ahorro medio suele estar entre 3.000€ y 6.000€ respecto a comprar el mismo coche en España. Nuestra herramienta te calcula el ahorro exacto antes de que muevas un dedo."
        },
        {
            question: "¿Qué incluye el Pack Importador PRO?",
            answer: "Incluye todo lo necesario: La guía completa paso a paso, calculadora de costes en Excel, contratos bilingües (ES/DE) revisados por abogados, checklist de inspección mecánica y soporte para dudas."
        },
        {
            question: "¿Sirve para cualquier país?",
            answer: "Nuestra herramienta está optimizada para Alemania (el mayor mercado de Europa), pero la guía de trámites en España (ITV, Matriculación) es válida para importar desde cualquier país de la UE."
        }
    ];

    return (
        <section className="py-20 bg-slate-900 text-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Preguntas Frecuentes</h2>
                    <p className="text-slate-400">Resolvemos tus dudas sobre la importación.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FAQItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800 transition-colors"
            >
                <span className="font-bold text-lg">{faq.question}</span>
                {isOpen ? <ChevronUp className="text-blue-400" /> : <ChevronDown className="text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-0 text-slate-300 leading-relaxed border-t border-slate-700/50">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrustSection;
