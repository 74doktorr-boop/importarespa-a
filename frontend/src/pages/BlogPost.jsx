import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';
import { ArrowLeft, Calendar, Clock, Share2, User } from 'lucide-react';

const BlogPost = () => {
    const { slug } = useParams();
    const [hasVoted, setHasVoted] = useState(false);
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300">
            <Helmet>
                <title>{post.title} | ImportarEspaña</title>
                <meta name="description" content={post.metaDescription} />
                <meta name="keywords" content={post.keywords} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.metaDescription} />
                <meta property="og:image" content={post.image} />
                <meta property="og:type" content="article" />
            </Helmet>

            <article className="container mx-auto px-4 max-w-4xl">
                <Link
                    to="/blog"
                    className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 font-medium"
                >
                    <ArrowLeft size={20} className="mr-2" /> Volver al Blog
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400 text-sm mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <span className="flex items-center gap-2">
                            <Calendar size={16} /> {post.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={16} /> {post.readTime} lectura
                        </span>
                        <span className="flex items-center gap-2">
                            <User size={16} /> Equipo ImportarEspaña
                        </span>
                    </div>

                    <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-12 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div
                        className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300 prose-img:rounded-2xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Share & Feedback Section */}
                    <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-900 dark:text-white">¿Te ha sido útil?</span>
                            {!hasVoted ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setHasVoted(true)}
                                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-green-100 dark:hover:bg-green-900/30 text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 font-bold transition-colors"
                                    >
                                        Sí
                                    </button>
                                    <button
                                        onClick={() => setHasVoted(true)}
                                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 font-bold transition-colors"
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg border border-green-100 dark:border-green-800"
                                >
                                    ¡Gracias por tu opinión!
                                </motion.span>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: post.title,
                                        text: post.excerpt,
                                        url: window.location.href,
                                    });
                                }
                            }}
                            className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors w-full md:w-auto justify-center"
                        >
                            <Share2 size={18} /> Compartir Artículo
                        </button>
                    </div>
                </motion.div>
            </article>
        </div>
    );
};

export default BlogPost;
