import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, User, Phone, Mail, MapPin, Car, ShieldCheck, Loader2, MessageCircle } from 'lucide-react';
import axios from 'axios';

const ImportWizard = ({ isOpen, onClose, vehicleData }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        postalCode: ''
    });

    if (!isOpen) return null;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/submit-lead`, {
                customer: formData,
                vehicle: vehicleData
            });
            setSuccess(true);
        } catch (error) {
            console.error("Error submitting lead:", error);
            alert("Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 2 && (!formData.name || !formData.phone)) {
            alert("Por favor, completa tu nombre y teléfono.");
            return;
        }
        setStep(prev => prev + 1);
    };

    const renderStep = () => {
        if (success) {
            return (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">¡Solicitud Recibida!</h3>
                    <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                        Hemos recibido los datos del coche y tu contacto. Un experto de Importar España revisará el vehículo y te escribirá por WhatsApp en menos de 24h.
                    </p>
                    <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                        Volver al Inicio
                    </button>
                </div>
            );
        }

        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">¿Te interesa este coche?</h3>
                            <p className="text-slate-500">Confirma los detalles y nos encargamos del resto.</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-6 items-center">
                            <div className="w-24 h-24 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                <img src={vehicleData.imageUrl} alt={vehicleData.model} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{vehicleData.make} {vehicleData.model}</h4>
                                <div className="text-sm text-slate-500 mb-2">{vehicleData.year} • {vehicleData.mileage} km</div>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(vehicleData.totalCost || vehicleData.price)} (Est.)
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-600">
                                <ShieldCheck className="text-green-500" size={20} />
                                <span>Verificación de estado y documentación</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Car className="text-blue-500" size={20} />
                                <span>Transporte asegurado a tu domicilio</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Check className="text-slate-400" size={20} />
                                <span>Matriculación y trámites DGT incluidos</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                                Continuar <ArrowRight size={20} />
                            </button>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">O habla con un experto</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <button
                                onClick={() => {
                                    const message = `Hola, estoy interesado en importar este ${vehicleData.make} ${vehicleData.model} (${vehicleData.year}) que he visto en la web. Precio estimado: ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(vehicleData.totalCost || vehicleData.price)}. ¿Me puedes confirmar viabilidad?`;
                                    window.open(`https://wa.me/34666351319?text=${encodeURIComponent(message)}`, '_blank');
                                }}
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                            >
                                <MessageCircle size={20} />
                                Hablar por WhatsApp
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Tus Datos de Contacto</h3>
                            <p className="text-slate-500">Para enviarte el presupuesto final y contrato.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Ej. Juan Pérez"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (WhatsApp)</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="tel"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="+34 600 000 000"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Opcional)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="juan@ejemplo.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                            Siguiente <ArrowRight size={20} />
                        </button>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">¿Dónde te lo entregamos?</h3>
                            <p className="text-slate-500">Para calcular el transporte exacto a tu puerta.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Código Postal</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ej. 28001"
                                    value={formData.postalCode}
                                    onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 flex gap-3">
                            <ShieldCheck className="flex-shrink-0" size={20} />
                            <p>Al enviar, aceptas nuestra política de privacidad. Tus datos solo se usarán para gestionar esta solicitud.</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Solicitar Importación'}
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10"
                >
                    {/* Header */}
                    {!success && (
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-slate-100">
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`} />
                                ))}
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    <div className="p-8">
                        {renderStep()}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ImportWizard;
