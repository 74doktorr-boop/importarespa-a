import React from 'react';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, buttonText, link, recommended }) => {
    return (
        <div className={`relative bg-white rounded-2xl p-8 border ${recommended ? 'border-blue-500 shadow-blue-100' : 'border-slate-200'} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full`}>
            {recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Recomendado
                </div>
            )}

            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${recommended ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                <Icon size={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
                {description}
            </p>

            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center w-full py-3 px-4 rounded-xl font-bold transition-colors ${recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
            >
                {buttonText} <ArrowRight size={18} className="ml-2" />
            </a>
        </div>
    );
};

export default ServiceCard;
