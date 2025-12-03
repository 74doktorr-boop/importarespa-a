import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Cookie } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.svg" alt="Importar España" className="h-8 w-auto" />
                            <span className="font-serif font-bold text-white text-lg">IMPORTAR ESPAÑA</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs">
                            La herramienta profesional líder para el cálculo de impuestos de importación de vehículos en España.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <Shield size={14} /> Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <FileText size={14} /> Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <Cookie size={14} /> Política de Cookies
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Andoain, Kaleberria</li>
                            <li>74doktorr@gmail.com</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <p>&copy; {new Date().getFullYear()} UNAI SANCHEZ PEREYRA. Todos los derechos reservados.</p>
                    <p>Hecho con ❤️ para importadores.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
