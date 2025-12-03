import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import VehicleAnalyzer from './pages/VehicleAnalyzer';
import SuccessPage from './pages/SuccessPage';

import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import CookiesPolicy from './pages/Legal/CookiesPolicy';
import CookieBanner from './components/CookieBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GarageDrawer from './components/GarageDrawer';
import ContactModal from './components/ContactModal';
import MonetizationModal from './components/MonetizationModal';
import AboutModal from './components/AboutModal';

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
    const [isMonetizationOpen, setIsMonetizationOpen] = useState(false);
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
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-500 selection:text-white">
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
                            onOpenMonetization={() => setIsMonetizationOpen(true)}
                        />
                    } />
                    <Route path="/success" element={<SuccessPage />} />
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

            <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
            />

            <MonetizationModal
                isOpen={isMonetizationOpen}
                onClose={() => setIsMonetizationOpen(false)}
            />
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
