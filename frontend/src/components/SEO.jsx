import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, canonical }) => {
    useEffect(() => {
        // Update Title
        if (title) {
            document.title = `${title} | Importar España - Premium Services`;
        }

        // Update Description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && description) {
            metaDesc.setAttribute('content', description);
        }

        // Update Keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && keywords) {
            metaKeywords.setAttribute('content', keywords);
        }

        // Update OG Facebook
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && title) ogTitle.setAttribute('content', title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && description) ogDesc.setAttribute('content', description);

    }, [title, description, keywords]);

    return null; // This component doesn't render anything
};

export default SEO;
