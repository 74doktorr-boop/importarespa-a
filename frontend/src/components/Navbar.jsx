import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Info, Mail, Home, Warehouse, Menu, X, BookOpen, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onOpenGarage, garageCount, onOpenAbout, onReset, onOpenContact }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                    {/* Logo / Brand */}
                    <button
                        onClick={onReset}
                        className="flex items-center gap-3 group"
                    >
                        <img src="/logo.svg" alt="Importar España" className="h-10 w-auto" />
                        <div className="flex flex-col items-start">
                            <span className={`font-serif font-bold text-lg tracking-tight leading-none ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                                IMPORTAR ESPAÑA
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                                Premium Services
                            </span>
                        </div>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavButton icon={Home} label="Inicio" onClick={onReset} isScrolled={isScrolled} />
                        <Link to="/blog">
                            <NavButton icon={BookOpen} label="Blog" onClick={() => { }} isScrolled={isScrolled} />
                        </Link>
                        <Link to="/servicios">
                            <NavButton icon={ShieldCheck} label="Servicios" onClick={() => { }} isScrolled={isScrolled} />
                        </Link>
                        <NavButton icon={Info} label="Sobre Nosotros" onClick={onOpenAbout} isScrolled={isScrolled} />
                        <NavButton icon={Mail} label="Contacto" onClick={onOpenContact} isScrolled={isScrolled} />

                        <div className={`w-px h-6 mx-4 ${isScrolled ? 'bg-slate-200' : 'bg-slate-300'}`}></div>

                        <button
                            onClick={onOpenGarage}
                            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                        >
                            <Warehouse size={18} className="text-blue-200" />
                            <span className="text-sm font-bold">Garaje</span>
                            {garageCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                                    {garageCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`md:hidden p-2 rounded-lg ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            < AnimatePresence >
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            <MobileNavButton icon={Home} label="Inicio" onClick={() => { onReset(); setIsMobileMenuOpen(false); }} />
                            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>
                                <MobileNavButton icon={BookOpen} label="Blog" onClick={() => { }} />
                            </Link>
                            <Link to="/servicios" onClick={() => setIsMobileMenuOpen(false)}>
                                <MobileNavButton icon={ShieldCheck} label="Servicios" onClick={() => { }} />
                            </Link>
                            <MobileNavButton icon={Warehouse} label={`Garaje (${garageCount})`} onClick={() => { onOpenGarage(); setIsMobileMenuOpen(false); }} active />
                            <MobileNavButton icon={Info} label="Sobre Nosotros" onClick={() => { onOpenAbout(); setIsMobileMenuOpen(false); }} />
                            <MobileNavButton icon={Mail} label="Contacto" onClick={() => { onOpenContact(); setIsMobileMenuOpen(false); }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >
        </>
    );
};

const NavButton = ({ icon: Icon, label, onClick, isScrolled }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm ${isScrolled
            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
    >
        <Icon size={16} />
        <span>{label}</span>
    </button>
);

const MobileNavButton = ({ icon: Icon, label, onClick, active }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${active
            ? 'bg-slate-100 text-blue-600'
            : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
    >
        <Icon size={24} />
        <span>{label}</span>
    </button>
);

export default Navbar;
