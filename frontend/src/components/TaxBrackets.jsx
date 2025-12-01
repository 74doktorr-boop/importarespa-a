import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
                            borderColor: isActive ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.05)'
                        }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative flex flex-col items-center justify-center p-2 rounded-lg border transition-colors duration-300 ${isActive
                            ? 'bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)] z-10'
                            : 'bg-white/5 text-gray-500'
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeGlow"
                                className="absolute inset-0 bg-blue-500/10 rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                        <span className={`text-[10px] font-bold mb-0.5 relative z-10 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                            {bracket.label}
                        </span>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative z-10">
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="h-full bg-blue-500"
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
