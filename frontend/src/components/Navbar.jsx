import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Info, Mail, Home, Warehouse, Menu, X } from 'lucide-react';

const Navbar = ({ onOpenGarage, garageCount, onOpenAbout, onReset }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                    {/* Logo / Brand */}
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                            <Car size={18} />
                        </div>
                        <span className="font-black text-lg tracking-tighter text-white">
                            IMPORTAR <span className="text-blue-400">ESPAÑA</span>
                        </span>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavButton icon={Home} label="Inicio" onClick={onReset} />
                        <NavButton icon={Info} label="Sobre Nosotros" onClick={onOpenAbout} />
                        <NavButton icon={Mail} label="Contacto" onClick={() => window.location.href = 'mailto:74doktorr@gmail.com'} />

                        <div className="w-px h-6 bg-white/10 mx-2"></div>

                        <button
                            onClick={onOpenGarage}
                            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                        >
                            <Warehouse size={18} className="text-blue-400 group-hover:text-blue-300" />
                            <span className="text-sm font-bold text-gray-200 group-hover:text-white">Garaje</span>
                            {garageCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg ring-2 ring-black">
                                    {garageCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            <MobileNavButton icon={Home} label="Inicio" onClick={() => { onReset(); setIsMobileMenuOpen(false); }} />
                            <MobileNavButton icon={Warehouse} label={`Garaje (${garageCount})`} onClick={() => { onOpenGarage(); setIsMobileMenuOpen(false); }} active />
                            <MobileNavButton icon={Info} label="Sobre Nosotros" onClick={() => { onOpenAbout(); setIsMobileMenuOpen(false); }} />
                            <MobileNavButton icon={Mail} label="Contacto" onClick={() => { window.location.href = 'mailto:74doktorr@gmail.com'; setIsMobileMenuOpen(false); }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const NavButton = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
    >
        <Icon size={16} />
        <span>{label}</span>
    </button>
);

const MobileNavButton = ({ icon: Icon, label, onClick, active }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-300 border border-white/5'
            }`}
    >
        <Icon size={24} />
        <span>{label}</span>
    </button>
);

export default Navbar;
