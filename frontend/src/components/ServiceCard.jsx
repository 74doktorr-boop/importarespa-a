import React from 'react';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, buttonText, link, recommended, onClick }) => {
    return (
        <div className={`relative bg-white dark:bg-slate-900 rounded-2xl p-8 border ${recommended ? 'border-blue-500 shadow-blue-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-800'} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full`}>
            {recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-500/30">
                    Recomendado
                </div>
            )}

            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${recommended ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <Icon size={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
                {description}
            </p>

            {onClick ? (
                <button
                    onClick={onClick}
                    className={`flex items-center justify-center w-full py-3 px-4 rounded-xl font-bold transition-colors ${recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                >
                    {buttonText} <ArrowRight size={18} className="ml-2" />
                </button>
            ) : (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-full py-3 px-4 rounded-xl font-bold transition-colors ${recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                >
                    {buttonText} <ArrowRight size={18} className="ml-2" />
                </a>
            )}
        </div>
    );
};

export default ServiceCard;
