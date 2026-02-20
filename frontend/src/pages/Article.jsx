import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, User, Share2, Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';

const Article = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [article, setArticle] = useState(state?.article || null);

    useEffect(() => {
        if (!article) {
            // In a real app, we would fetch the article by ID here
            // Since we don't have a specific article fetch endpoint yet, we'll redirect back if no data
            // (This is common when refreshing the details page if state wasn't persisted)
            navigate('/feed');
        }
    }, [article, navigate]);

    if (!article) return null;

    const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header Image & Back Button */}
            <div className="relative h-[450px] w-full">
                <img
                    src={article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200'}
                    className="w-full h-full object-cover"
                    alt={article.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all border border-white/30"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="absolute bottom-8 left-0 w-full px-4 sm:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                                {article.category || 'Breaking News'}
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                                {article.source?.name}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                            {article.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Sidebar Info */}
                <div className="col-span-1 border-t md:border-t-0 md:border-r border-gray-100 pt-8 md:pt-0">
                    <div className="sticky top-24 space-y-8">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Published</h4>
                            <p className="text-gray-900 font-medium flex items-center">
                                <Calendar size={16} className="mr-2 text-indigo-600" />
                                {formattedDate}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Source</h4>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 font-bold hover:underline flex items-center group"
                            >
                                {article.source?.name}
                                <ExternalLink size={14} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                <Share2 size={20} />
                            </button>
                            <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                <Bookmark size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Text */}
                <div className="col-span-1 md:col-span-3">
                    <div className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed">
                        <p className="text-xl font-medium text-gray-900 mb-8 leading-relaxed">
                            {article.description}
                        </p>

                        <p className="mb-6">
                            {article.content?.split('[+')[0] || "We are still gathering more details on this developing story. NewsHive journalists and automated scrapers are currently working to verify and synthesize information from multiple reputable sources to provide you with the most comprehensive coverage possible."}
                        </p>

                        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-8 my-10 rounded-r-2xl">
                            <p className="text-indigo-900 font-bold text-lg italic mb-0">
                                "Information is power, but personalized information is efficiency. NewsHive aims to bridge the gap between global events and personal relevance."
                            </p>
                        </div>

                        <p className="mb-10 text-gray-500 italic">
                            * This is an automated summary and snippet from the original source. For the full context and detailed report, please follow the link to the original website.
                        </p>

                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all hover:shadow-xl shadow-gray-200"
                        >
                            Read Original Article
                            <ExternalLink size={18} className="ml-2" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Article;
