import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, subValue, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.5, delay: delay, type: "spring", stiffness: 300 }}
            className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors duration-300 group cursor-default shadow-lg hover:shadow-blue-500/10"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 rotate-12">
                <Icon size={48} />
            </div>

            <div className="relative z-10 flex items-center space-x-4">
                <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg text-blue-300 group-hover:text-white transition-colors border border-white/5 shadow-lg"
                >
                    <Icon size={24} />
                </motion.div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5 truncate">{label}</p>
                    <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-blue-200 transition-colors break-words leading-tight" title={value}>
                        {value}
                    </h3>
                    {subValue && <p className="text-[10px] text-gray-500 mt-0.5 truncate">{subValue}</p>}
                </div>
            </div>

            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>
    );
};

export default StatCard;
