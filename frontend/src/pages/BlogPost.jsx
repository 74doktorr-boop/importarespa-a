import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const BlogPost = () => {
    const { slug } = useParams();
    const post = blogPosts.find(p => p.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (post) {
            document.title = `${post.title} - Importar España`;
            // Here we could update meta tags dynamically if we had a helmet library, 
            // but for now title is good for user experience.
        }
    }, [post]);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Artículo no encontrado</h2>
                    <Link to="/blog" className="text-blue-600 hover:underline">Volver al blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-12">
            <article className="max-w-3xl mx-auto px-4 sm:px-6">
                <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Volver a noticias
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center text-slate-500 mb-8 border-b border-slate-100 pb-8">
                        <Calendar size={18} className="mr-2" />
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span className="text-blue-600 font-medium">Guía de Importación</span>
                    </div>

                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 md:h-96 object-cover rounded-2xl mb-10 shadow-lg"
                    />

                    <div
                        className="prose prose-lg prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* CTA Section */}
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            ¿Quieres saber el precio exacto para tu coche?
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Nuestra calculadora tiene en cuenta el CO2, la antigüedad y las tablas de Hacienda actualizadas.
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
                        >
                            Calcular Impuestos Ahora
                        </Link>
                    </div>
                </motion.div>
            </article>
        </div>
    );
};

export default BlogPost;
