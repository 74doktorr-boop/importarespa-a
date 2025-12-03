import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VehicleAnalyzer from './pages/VehicleAnalyzer';
import SuccessPage from './pages/SuccessPage';

import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import CookiesPolicy from './pages/Legal/CookiesPolicy';
import CookieBanner from './components/CookieBanner';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
                <Routes>
                    <Route path="/" element={<VehicleAnalyzer />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/cookies" element={<CookiesPolicy />} />
                </Routes>
                <CookieBanner />
            </div>
        </Router>
    );
}

export default App;
