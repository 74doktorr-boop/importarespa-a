import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const BlogCard = ({ post }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-slate-500 text-xs mb-3">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight">
                    {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                </p>
                <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 mt-auto"
                >
                    Leer artículo <ArrowRight size={16} className="ml-1" />
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;
