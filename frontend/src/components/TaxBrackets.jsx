import React from 'react';
import { motion } from 'framer-motion';

const TaxBrackets = ({ currentCo2 }) => {
    const brackets = [
        { min: 0, max: 120, rate: 0, label: '0%' },
        { min: 121, max: 159, rate: 4.75, label: '4.75%' },
        { min: 160, max: 199, rate: 9.75, label: '9.75%' },
        { min: 200, max: 9999, rate: 14.75, label: '14.75%' },
    ];

    const getActiveBracketIndex = (co2) => {
        if (!co2) return -1;
        return brackets.findIndex(b => co2 >= b.min && co2 <= b.max);
    };

    const activeIndex = getActiveBracketIndex(currentCo2);

    return (
        <div className="grid grid-cols-4 gap-2">
            {brackets.map((bracket, index) => {
                const isActive = index === activeIndex;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: isActive ? 1.05 : 1,
                            borderColor: isActive ? 'rgba(37, 99, 235, 0.5)' : 'rgba(226, 232, 240, 1)'
                        }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative flex flex-col items-center justify-center p-2 rounded-lg border transition-colors duration-300 ${isActive
                            ? 'bg-blue-50 text-blue-700 shadow-sm z-10'
                            : 'bg-white text-slate-400'
                            }`}
                    >
                        <span className={`text-[10px] font-bold mb-0.5 relative z-10 ${isActive ? 'text-blue-700' : 'text-slate-400'}`}>
                            {bracket.label}
                        </span>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden relative z-10">
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="h-full bg-blue-600"
                                />
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TaxBrackets;
