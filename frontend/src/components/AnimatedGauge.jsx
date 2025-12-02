import React from 'react';
import { motion } from 'framer-motion';

const AnimatedGauge = ({ value, max = 300, label, unit }) => {
    // Calculate percentage for the stroke dasharray
    const percentage = Math.min(Math.max(value / max, 0), 1);
    const circumference = 2 * Math.PI * 40; // radius 40
    const strokeDashoffset = circumference - percentage * circumference;

    // Determine color based on CO2 value (Green -> Yellow -> Red)
    let color = '#10B981'; // Green
    if (value > 120) color = '#FBBF24'; // Yellow
    if (value > 160) color = '#F59E0B'; // Orange
    if (value > 200) color = '#EF4444'; // Red

    return (
        <div className="flex flex-col items-center justify-center relative">
            <div className="relative w-32 h-32">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200"
                    />
                    {/* Animated Foreground Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="64"
                        cy="64"
                        r="40"
                        stroke={color}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{value}</span>
                    <span className="text-xs text-slate-400">{unit}</span>
                </div>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
        </div>
    );
};

export default AnimatedGauge;
