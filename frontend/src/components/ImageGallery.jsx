import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

const ImageGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) return null;

    const nextImage = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="w-full space-y-4">
            {/* Main Image Stage */}
            <div
                className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 group cursor-pointer shadow-2xl shadow-blue-900/20"
                onClick={() => setIsFullscreen(true)}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`Vehicle view ${currentIndex + 1}`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="h-full w-full object-cover"
                    />
                </AnimatePresence>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 duration-300"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 duration-300"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Fullscreen Trigger */}
                <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                >
                    <Maximize2 className="w-5 h-5" />
                </button>

                {/* Counter Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-medium border border-white/10">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails Strip */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 snap-start ${currentIndex === idx
                                    ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-slate-50 opacity-100 scale-105'
                                    : 'opacity-60 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex]}
                                alt="Fullscreen view"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 md:left-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 md:right-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Fullscreen Thumbnails */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                    className={`w-16 h-12 rounded-md overflow-hidden transition-all ${currentIndex === idx ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-80'
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageGallery;
