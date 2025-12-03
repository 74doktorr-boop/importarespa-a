import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail, User, Phone, MessageSquare, CheckCircle } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true); // Show loading state if desired, or just use it for success

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                // Success state
                setTimeout(() => {
                    setIsSubmitted(false);
                    onClose();
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    alert("¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.");
                }, 2000);
            } else {
                alert("Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.");
                setIsSubmitted(false);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error de conexión. Por favor, verifica tu conexión a internet.");
            setIsSubmitted(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                                <Mail className="text-blue-400" size={24} />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Contáctanos</h2>
                            <p className="text-slate-300">Estamos aquí para resolver tus dudas sobre importación.</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8 bg-slate-50">
                        {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600"
                                >
                                    <CheckCircle size={40} />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Enviando Mensaje!</h3>
                                <p className="text-slate-500 max-w-xs">Por favor espera un momento...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Nombre</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Teléfono</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="+34 600..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Asunto</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                        <select
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                                        >
                                            <option value="" disabled>Selecciona un motivo</option>
                                            <option value="Información General">Información General</option>
                                            <option value="Presupuesto Personalizado">Presupuesto Personalizado</option>
                                            <option value="Duda sobre Trámites">Duda sobre Trámites</option>
                                            <option value="Soporte Técnico">Soporte Técnico</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Mensaje</label>
                                    <textarea
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="¿En qué podemos ayudarte?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    <Send size={18} />
                                    Enviar Mensaje
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ContactModal;
