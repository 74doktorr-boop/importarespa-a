import React from 'react';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogData';
import BlogCard from '../components/BlogCard';

const Blog = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-slate-900 mb-4"
                    >
                        Noticias y Guías de Importación
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto"
                    >
                        Todo lo que necesitas saber para traer tu coche de Alemania sin sorpresas.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <BlogCard post={post} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
