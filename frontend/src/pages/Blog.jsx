import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';

const Blog = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <Helmet>
                <title>Blog ImportarEspaña | Guías, Consejos y Noticias de Importación</title>
                <meta name="description" content="Aprende todo sobre importar coches de Alemania a España. Guías actualizadas 2025, impuestos, ITV y consejos para ahorrar dinero." />
            </Helmet>

            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        Blog & Recursos
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mt-4 mb-6">
                        Domina la Importación de Vehículos
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Guías detalladas, análisis de mercado y trucos de experto para que tu compra en Alemania sea un éxito rotundo.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.isArray(blogPosts) && blogPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col h-full"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} /> {post.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {post.readTime}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    <Link to={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>

                                <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-grow">
                                    {post.excerpt}
                                </p>

                                <Link
                                    to={`/blog/${post.slug}`}
                                    className="inline-flex items-center text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors mt-auto"
                                >
                                    Leer Artículo <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <BookOpen className="mx-auto text-blue-400 mb-6" size={48} />
                        <h2 className="text-3xl font-bold text-white mb-4">¿Listo para pasar a la acción?</h2>
                        <p className="text-slate-300 mb-8">
                            No te quedes solo en la teoría. Usa nuestra herramienta gratuita para analizar cualquier coche de Alemania en segundos.
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-white text-slate-900 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                            Ir al Analizador
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
