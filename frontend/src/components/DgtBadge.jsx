import React from 'react';

const DgtBadge = ({ label }) => {
    if (!label) return null;

    const getBadgeStyles = (type) => {
        switch (type) {
            case '0':
                return {
                    bg: 'bg-[#003399]', // Blue
                    text: '0',
                    subtext: 'EMISIONES',
                    border: 'border-[#003399]'
                };
            case 'ECO':
                return {
                    bg: 'bg-gradient-to-b from-[#003399] to-[#009933]', // Blue to Green
                    text: 'ECO',
                    subtext: '',
                    border: 'border-[#009933]'
                };
            case 'C':
                return {
                    bg: 'bg-[#009933]', // Green
                    text: 'C',
                    subtext: '',
                    border: 'border-[#009933]'
                };
            case 'B':
                return {
                    bg: 'bg-[#FFCC00]', // Yellow
                    text: 'B',
                    subtext: '',
                    border: 'border-[#FFCC00]'
                };
            default:
                return null;
        }
    };

    const style = getBadgeStyles(label);
    if (!style) return null;

    return (
        <div className={`relative w-16 h-16 rounded-full ${style.bg} flex flex-col items-center justify-center border-2 border-white shadow-md overflow-hidden group hover:scale-110 transition-transform duration-300 ring-1 ring-slate-200`}>
            {/* Glossy Effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-full pointer-events-none"></div>

            <span className={`font-black text-white ${label === 'ECO' ? 'text-lg' : 'text-3xl'} leading-none drop-shadow-md`}>
                {style.text}
            </span>
            {style.subtext && (
                <span className="text-[6px] font-bold text-white uppercase tracking-tighter leading-none mt-0.5">
                    {style.subtext}
                </span>
            )}

            {/* DGT Logo placeholder/text */}
            <div className="absolute bottom-1.5 text-[4px] font-bold text-white/80 tracking-widest">
                DGT
            </div>
        </div>
    );
};

export default DgtBadge;
