import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Share2, Bookmark, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import VerificationPanel from '../components/VerificationPanel';
import { verifyApi } from '../api/newsApi';

const Article = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [article, setArticle] = useState(state?.article || null);

    const [verification, setVerification] = useState(null);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [verifyError, setVerifyError] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!article) {
            navigate('/feed');
            return;
        }
        // Auto-trigger verification on mount
        setVerifyLoading(true);
        setVerifyError(false);
        verifyApi.verifyArticle(article)
            .then(res => {
                if (res.data.success && res.data.verification) {
                    setVerification(res.data.verification);
                } else {
                    setVerifyError(true);
                }
            })
            .catch(() => setVerifyError(true))
            .finally(() => setVerifyLoading(false));
    }, []);

    if (!article) return null;

    const pubDate = article.pubDate || article.publishedAt;
    const formattedDate = pubDate
        ? new Date(pubDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        : 'Date unknown';

    const sourceName = article.source_name || article.source?.name || 'Unknown Source';
    const imageUrl = article.image_url || article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop';
    const articleUrl = article.link || article.url || '#';

    const handleShare = () => {
        navigator.clipboard.writeText(articleUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Banner */}
            <div className="relative h-[420px] md:h-[520px] w-full">
                <img
                    src={imageUrl}
                    className="w-full h-full object-cover"
                    alt={article.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all border border-white/30 font-medium text-sm"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>

                <div className="absolute bottom-8 left-0 w-full px-4 sm:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {article.category && (
                                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                                    {Array.isArray(article.category) ? article.category[0] : article.category}
                                </span>
                            )}
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                                {sourceName}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                            {article.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Sidebar */}
                <div className="col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Published</h4>
                            <p className="text-gray-800 font-medium flex items-center text-sm">
                                <Calendar size={14} className="mr-2 text-indigo-600" />
                                {formattedDate}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Source</h4>
                            <a
                                href={articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 font-bold hover:underline flex items-center text-sm group"
                            >
                                {sourceName}
                                <ExternalLink size={12} className="ml-1" />
                            </a>
                        </div>

                        {/* Verification mini-badge in sidebar */}
                        {verification && (
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">AI Verdict</h4>
                                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                    verification.verdict === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                                    verification.verdict === 'LIKELY TRUE' ? 'bg-blue-100 text-blue-700' :
                                    verification.verdict === 'SUSPICIOUS' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                    <ShieldCheck size={12} className="mr-1" />
                                    {verification.verdict}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleShare}
                                title="Copy link"
                                className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors text-xs font-medium"
                            >
                                {copied ? '✓ Copied' : <Share2 size={18} />}
                            </button>
                            <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                <Bookmark size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-1 md:col-span-3">
                    <p className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                        {article.description}
                    </p>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                        {article.content?.split('[+')[0] || "NewsHive is currently gathering more details on this developing story. Our automated verification and aggregation systems are actively synthesizing information from multiple reputable sources to provide you with the most comprehensive and accurate coverage."}
                    </p>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-l-4 border-indigo-600 p-7 my-8 rounded-r-2xl">
                        <p className="text-indigo-900 font-bold text-lg italic">
                            "Information is power, but personalized & verified information is efficiency. NewsHive bridges the gap between global events and personal relevance."
                        </p>
                    </div>

                    <p className="mb-8 text-gray-400 italic text-sm">
                        * This is an automated summary from the original source. For the full context, follow the link below.
                    </p>

                    <a
                        href={articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all hover:shadow-xl"
                    >
                        Read Original Article
                        <ExternalLink size={18} className="ml-2" />
                    </a>

                    {/* === VERIFICATION PANEL === */}
                    <VerificationPanel
                        verification={verification}
                        isLoading={verifyLoading}
                        error={verifyError}
                    />
                </div>
            </div>
        </div>
    );
};

export default Article;
