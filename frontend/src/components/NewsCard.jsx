import { Calendar, ExternalLink, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsCard = ({ article }) => {
    const {
        id,
        title,
        description,
        urlToImage,
        source,
        publishedAt,
        url,
        category
    } = article;

    const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Placeholder image if thumbnail is missing
    const imageUrl = urlToImage || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop`;

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop';
                    }}
                />
                {category && (
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg uppercase tracking-wider">
                            {category}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3">
                    <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formattedDate}
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                        {source?.name || 'News Source'}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
                    {description || "Stay tuned for more updates on this story. NewsHive brings you the latest developments as they happen."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <Link
                        to={`/article/${id || btoa(url).substring(0, 10)}`}
                        state={{ article }}
                        className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 flex items-center"
                    >
                        Read More
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>

                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Open Original Source"
                    >
                        <ExternalLink size={18} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
