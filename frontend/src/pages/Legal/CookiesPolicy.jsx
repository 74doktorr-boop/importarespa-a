import React from 'react';
import { Cookie, ArrowLeft, Settings, Info, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiesPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-8 group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al Inicio
                </Link>

                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="bg-slate-900 p-10 md:p-16 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <Cookie size={32} className="text-amber-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Política de Cookies</h1>
                            <p className="text-slate-300 text-lg max-w-2xl">
                                Información transparente sobre cómo utilizamos las cookies para mejorar tu experiencia.
                            </p>
                        </div>
                    </div>

                    <div className="p-10 md:p-16 space-y-12 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                                ¿Qué son las cookies?
                            </h2>
                            <div className="flex items-start gap-4 bg-slate-50 p-6 rounded-2xl">
                                <Info size={24} className="text-slate-400 flex-shrink-0 mt-1" />
                                <p>
                                    Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                                ¿Qué tipos de cookies utiliza esta web?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                        <Settings size={20} className="text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">Cookies Técnicas</h3>
                                    <p className="text-sm text-slate-500">
                                        Permiten la navegación a través de la web y la utilización de las diferentes opciones o servicios que en ella existan.
                                    </p>
                                </div>
                                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                                        <ShieldCheck size={20} className="text-green-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">Cookies de Análisis</h3>
                                    <p className="text-sm text-slate-500">
                                        Permiten el seguimiento y análisis del comportamiento de los usuarios para introducir mejoras en función del uso.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                                Desactivación de cookies
                            </h2>
                            <p className="mb-4">Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador:</p>
                            <div className="space-y-3">
                                {[
                                    { browser: "Chrome", path: "Configuración > Privacidad y seguridad > Cookies y otros datos de sitios" },
                                    { browser: "Firefox", path: "Opciones > Privacidad y seguridad > Cookies y datos del sitio" },
                                    { browser: "Safari", path: "Preferencias > Privacidad" },
                                    { browser: "Edge", path: "Configuración > Cookies y permisos del sitio" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="font-bold text-slate-900">{item.browser}</span>
                                        <span className="text-xs text-slate-500 font-mono bg-white px-2 py-1 rounded border border-slate-200">{item.path}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiesPolicy;


