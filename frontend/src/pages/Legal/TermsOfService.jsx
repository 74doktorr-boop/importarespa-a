import React from 'react';
import { FileText, ArrowLeft, Scale, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-8 group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al Inicio
                </Link>

                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="bg-slate-900 p-10 md:p-16 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <Scale size={32} className="text-indigo-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Términos y Condiciones</h1>
                            <p className="text-slate-300 text-lg max-w-2xl">
                                Condiciones de uso, responsabilidades y marco legal de nuestros servicios.
                            </p>
                        </div>
                    </div>

                    <div className="p-10 md:p-16 space-y-12 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                                Identificación
                            </h2>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <p className="mb-2">El titular del sitio web es:</p>
                                <p className="font-medium text-slate-900 text-lg">UNAI SANCHEZ PEREYRA</p>
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 text-sm">
                                    <div>
                                        <span className="font-bold text-slate-400 uppercase tracking-widest text-xs block mb-1">NIF</span>
                                        <span className="text-slate-900 font-medium">49575893Z</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-400 uppercase tracking-widest text-xs block mb-1">Domicilio</span>
                                        <span className="text-slate-900 font-medium">Donostia, Gipuzkoa</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                                Objeto
                            </h2>
                            <p>Las presentes condiciones generales tienen por objeto regular el acceso y uso del sitio web y de sus contenidos y servicios. El acceso al sitio web implica la aceptación sin reservas de las presentes condiciones.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                                Uso del Sitio Web
                            </h2>
                            <p className="mb-4">El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que el Titular ofrece a través de su portal y con carácter enunciativo pero no limitativo, a no emplearlos para:</p>
                            <ul className="space-y-3">
                                {[
                                    "Incurrir en actividades ilícitas, ilegales o contrarias a la buena fe.",
                                    "Difundir contenidos o propaganda de carácter racista, xenófobo o ilegal.",
                                    "Provocar daños en los sistemas físicos y lógicos del Titular o de terceros."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <AlertCircle size={18} className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 text-sm font-bold">4</span>
                                Propiedad Intelectual
                            </h2>
                            <p>Todos los contenidos del sitio web (textos, gráficos, logotipos, iconos, imágenes, software, etc.) son propiedad exclusiva del Titular o de terceros que han autorizado su inclusión en el sitio web y están protegidos por la legislación sobre propiedad intelectual e industrial.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 text-sm font-bold">5</span>
                                Exclusión de Garantías y Responsabilidad
                            </h2>
                            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-xl space-y-4">
                                <p className="text-slate-700">
                                    El Titular no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar errores u omisiones en los contenidos o falta de disponibilidad del portal.
                                </p>
                                <div className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-slate-600 font-medium">
                                        Los cálculos de impuestos ofrecidos son <strong>estimaciones basadas en la normativa vigente</strong>, pero no constituyen asesoramiento fiscal vinculante.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;


