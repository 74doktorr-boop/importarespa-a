import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import VehicleAnalyzer from './pages/VehicleAnalyzer';
import SuccessPage from './pages/SuccessPage';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Services from './pages/Services';

import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import CookiesPolicy from './pages/Legal/CookiesPolicy';
import CookieBanner from './components/CookieBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GarageDrawer from './components/GarageDrawer';
import ContactModal from './components/ContactModal';
import AboutModal from './components/AboutModal';
import WhatsAppAgent from './components/WhatsAppAgent';
import ScrollToTop from './components/ScrollToTop';
import LeadMagnetModal from './components/LeadMagnetModal';

// Wrapper component to use hooks like useLocation
const AppContent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Global State
    const [garageVehicles, setGarageVehicles] = useState(() => {
        try {
            const saved = localStorage.getItem('garageVehicles');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load garage from localStorage", e);
            return [];
        }
    });

    const [isGarageOpen, setIsGarageOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    // Persist Garage
    useEffect(() => {
        localStorage.setItem('garageVehicles', JSON.stringify(garageVehicles));
    }, [garageVehicles]);

    // Garage Actions
    const addToGarage = (vehicleData) => {
        const newVehicle = {
            id: Date.now(),
            ...vehicleData,
            addedAt: new Date().toISOString()
        };
        setGarageVehicles(prev => [newVehicle, ...prev]);
        setIsGarageOpen(true);
    };

    const removeFromGarage = (id) => {
        setGarageVehicles(prev => prev.filter(v => v.id !== id));
    };

    const clearGarage = () => {
        setGarageVehicles([]);
    };

    // Navigation Handlers
    const handleReset = () => {
        if (location.pathname !== '/') {
            navigate('/');
        } else {
            setResetKey(prev => prev + 1);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            <Navbar
                onOpenGarage={() => setIsGarageOpen(true)}
                garageCount={garageVehicles.length}
                onOpenAbout={() => setIsAboutOpen(true)}
                onReset={handleReset}
                onOpenContact={() => setIsContactOpen(true)}
            />

            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={
                        <VehicleAnalyzer
                            key={resetKey}
                            onAddToGarage={addToGarage}
                            onOpenContact={() => setIsContactOpen(true)}
                        />
                    } />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/servicios" element={<Services />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/cookies" element={<CookiesPolicy />} />
                </Routes>
            </main>

            <Footer />
            <CookieBanner />

            {/* Global Modals & Drawers */}
            <GarageDrawer
                isOpen={isGarageOpen}
                onClose={() => setIsGarageOpen(false)}
                vehicles={garageVehicles}
                onRemove={removeFromGarage}
                onClear={clearGarage}
            />

            <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />

            {/* About Modal is currently inside VehicleAnalyzer, but should be global if possible. 
                However, it relies on specific animations. For now, we'll keep it simple or move it if needed.
                Actually, the user wants "Sobre Nosotros" to work everywhere. 
                Let's assume we can render a global About modal or keep it simple.
                The previous implementation had the About modal inside VehicleAnalyzer.
                We need to decide if we move the About modal content here or keep it.
                Given the complexity of the About modal (it was part of the main page render), 
                let's see if we can extract it or if we just use a simple modal for now.
                
                Wait, the About Modal in VehicleAnalyzer was quite complex. 
                Let's check if we can just pass the state down or if we need to move the component.
                The About Modal was inline in VehicleAnalyzer. We should probably extract it to a component.
                For this step, I will NOT include the About Modal in App.jsx yet, 
                I will focus on the structure and then extract the About Modal from VehicleAnalyzer.
            */}
            <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
            />

            {/* Global Floating Agent */}
            <WhatsAppAgent />
            <ScrollToTop />
            <LeadMagnetModal />

        </div>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
