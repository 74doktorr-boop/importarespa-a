import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Cookie } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-400 py-16 border-t border-slate-800">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/logo-dark.svg" alt="Importar España" className="h-10 w-auto" />
                            <div className="flex flex-col">
                                <span className="font-serif font-bold text-white text-xl tracking-tight">IMPORTAR ESPAÑA</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Premium Services</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm text-slate-500">
                            La herramienta profesional líder para el cálculo de impuestos de importación de vehículos en España.
                            Simplificamos la burocracia para que tú disfrutes del viaje.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <Shield size={14} className="group-hover:text-blue-500 transition-colors" /> Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <FileText size={14} className="group-hover:text-blue-500 transition-colors" /> Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <Cookie size={14} className="group-hover:text-blue-500 transition-colors" /> Política de Cookies
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contacto</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                                Donostia, Gipuzkoa
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                                74doktorr@gmail.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                    <p>&copy; {new Date().getFullYear()} UNAI SANCHEZ PEREYRA. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-2">
                        <span>Hecho con</span>
                        <span className="text-red-500">❤️</span>
                        <span>para importadores</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
