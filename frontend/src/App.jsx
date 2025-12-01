import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VehicleAnalyzer from './pages/VehicleAnalyzer';
import SuccessPage from './pages/SuccessPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-dark to-[#1a2c4e] text-white">
                <Routes>
                    <Route path="/" element={<VehicleAnalyzer />} />
                    <Route path="/success" element={<SuccessPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
