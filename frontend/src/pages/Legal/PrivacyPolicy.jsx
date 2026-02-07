import React from 'react';
import { Shield, ArrowLeft, Mail, MapPin, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-8 group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al Inicio
                </Link>

                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="bg-slate-900 p-10 md:p-16 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <Shield size={32} className="text-blue-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Política de Privacidad</h1>
                            <p className="text-slate-300 text-lg max-w-2xl">
                                Tu privacidad es importante para nosotros. Aquí explicamos cómo recopilamos, usamos y protegemos tus datos.
                            </p>
                        </div>
                    </div>

                    <div className="p-10 md:p-16 space-y-12 text-slate-600 leading-relaxed">
                        <div className="border-b border-slate-100 pb-8">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Última actualización</p>
                            <p className="text-slate-900 font-medium">{new Date().toLocaleDateString()}</p>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                                Responsable del Tratamiento
                            </h2>
                            <div className="bg-slate-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Titular</p>
                                    <p className="font-medium text-slate-900">UNAI SANCHEZ PEREYRA</p>
                                    <p className="text-sm text-slate-500">IMPORTAR ESPAÑA</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">NIF</p>
                                    <p className="font-medium text-slate-900">49575893Z</p>
                                </div>
                                <div className="flex items-start">
                                    <MapPin size={18} className="text-blue-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dirección</p>
                                        <p className="font-medium text-slate-900">Donostia, Gipuzkoa</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Mail size={18} className="text-blue-500 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                                        <a href="mailto:74doktorr@gmail.com" className="font-medium text-blue-600 hover:underline">74doktorr@gmail.com</a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                                Finalidad del Tratamiento
                            </h2>
                            <p className="mb-4">Tratamos la información que nos facilitan las personas interesadas con el fin de:</p>
                            <ul className="space-y-3">
                                {[
                                    "Gestionar el envío de la información que nos soliciten.",
                                    "Facilitar ofertas de productos y servicios de su interés (Cálculo de impuestos, informes).",
                                    "Gestionar el formulario de contacto y soporte técnico."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 mr-3"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                                Legitimación
                            </h2>
                            <p className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl text-slate-700">
                                La base legal para el tratamiento de sus datos es el <strong>consentimiento del interesado</strong> al rellenar los formularios y aceptar esta política.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">4</span>
                                Destinatarios
                            </h2>
                            <p>Los datos no se cederán a terceros salvo obligación legal o para la prestación de servicios técnicos necesarios (hosting, email marketing) que cumplen con la normativa GDPR.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">5</span>
                                Derechos
                            </h2>
                            <p>Cualquier persona tiene derecho a obtener confirmación sobre si estamos tratando datos personales que les conciernan. Las personas interesadas tienen derecho a:</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {["Acceder a sus datos", "Rectificar datos inexactos", "Solicitar su supresión", "Limitar el tratamiento", "Oponerse al tratamiento", "Portabilidad de datos"].map((right, i) => (
                                    <li key={i} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <FileText size={16} className="text-slate-400 mr-2" />
                                        <span className="font-medium text-slate-700">{right}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
