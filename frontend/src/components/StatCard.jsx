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
            className="relative overflow-hidden bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all duration-300 group cursor-default"
        >
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 rotate-12">
                <Icon size={48} className="text-slate-900" />
            </div>

            <div className="relative z-10 flex items-center space-x-4">
                <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="p-3 bg-slate-50 rounded-lg text-slate-700 group-hover:text-blue-600 transition-colors border border-slate-100 shadow-sm"
                >
                    <Icon size={24} />
                </motion.div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5 truncate">{label}</p>
                    <h3 className="text-sm md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors break-words leading-tight" title={value}>
                        {value}
                    </h3>
                    {subValue && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{subValue}</p>}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
