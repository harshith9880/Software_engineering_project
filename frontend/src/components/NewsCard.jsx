import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck } from 'lucide-react';

const VERDICT_STYLE = {
    'VERIFIED': 'bg-emerald-100 text-emerald-700',
    'LIKELY TRUE': 'bg-blue-100 text-blue-700',
    'UNVERIFIABLE': 'bg-gray-100 text-gray-500',
    'NEEDS REVIEW': 'bg-orange-100 text-orange-700',
    'SUSPICIOUS': 'bg-red-100 text-red-700',
};

export default function NewsCard({ article, verificationBadge }) {
    const url = article.link || article.url || '#';
    const id = article.id || btoa(url).substring(0, 10);
    const imageUrl = article.image_url || article.urlToImage;
    const fallback = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop';

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={imageUrl || fallback}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = fallback; }}
                />
                {/* Category badge */}
                {article.category && (
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg uppercase tracking-wider">
                            {Array.isArray(article.category) ? article.category[0] : article.category}
                        </span>
                    </div>
                )}
                {/* Verification mini-badge */}
                {verificationBadge && (
                    <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${VERDICT_STYLE[verificationBadge] || VERDICT_STYLE['UNVERIFIABLE']}`}>
                            <ShieldCheck size={10} className="mr-0.5" />
                            {verificationBadge === 'VERIFIED' ? 'Verified' :
                             verificationBadge === 'LIKELY TRUE' ? 'Likely True' :
                             verificationBadge === 'SUSPICIOUS' ? 'Suspicious' : 'Check'}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-400 mb-3 space-x-2">
                    <span>{article.pubDate?.split('T')[0] || article.publishedAt?.split('T')[0] || ''}</span>
                    {(article.source_name || article.source?.name) && (
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-medium truncate max-w-[120px]">
                            {article.source_name || article.source?.name}
                        </span>
                    )}
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {article.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed flex-grow">
                    {article.description || "Stay tuned for more updates on this story."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <Link
                        to={`/article/${id}`}
                        state={{ article }}
                        className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 flex items-center"
                    >
                        Read More
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
}
