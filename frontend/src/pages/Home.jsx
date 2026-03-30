import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryPill from '../components/CategoryPill';
import NewsCard from '../components/NewsCard';
import { newsApi } from '../api/newsApi';
import { Sparkles, TrendingUp, Zap, Settings, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [trendingNews, setTrendingNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const carouselRef = useRef(null);

    const categories = [
        'Technology', 'Sports', 'Business', 'Entertainment', 'World', 'Science', 'Health'
    ];

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const prefs = JSON.parse(localStorage.getItem('newshive_preferences') || '[]');
                let response;
                if (prefs.length > 0) {
                    response = await newsApi.getPersonalizedFeed(prefs);
                } else {
                    response = await newsApi.getTopHeadlines();
                }
                setTrendingNews(response.data.data || response.data.articles || []);
            } catch (err) {
                console.error('Failed to fetch trending news', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    // Auto-rotate carousel
    useEffect(() => {
        if (trendingNews.length === 0) return;
        const timer = setInterval(() => {
            setCarouselIndex(i => (i + 1) % Math.min(trendingNews.length, 5));
        }, 4000);
        return () => clearInterval(timer);
    }, [trendingNews.length]);

    const handleSearch = (q) => {
        if (q.trim()) navigate(`/feed?search=${encodeURIComponent(q)}`);
    };

    const handleCategoryClick = (cat) => {
        navigate(`/feed?category=${cat.toLowerCase()}`);
    };

    const featuredArticle = trendingNews[carouselIndex];
    const gridArticles = trendingNews.slice(0, 4);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="relative pt-16 pb-24 px-4 bg-gradient-to-b from-indigo-50/60 to-white overflow-hidden">
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-40 pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold mb-8">
                        <Sparkles size={14} className="mr-2" />
                        AI-Powered · Verified · Personalized
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                        News That Matters <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                            Verified for You
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        NewsHive aggregates the world's most important stories, verifies them with our AI agent, and filters them based on your interests.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-10">
                        <SearchBar onSearch={handleSearch} initialValue="" placeholder="Search any topic, event, or keyword…" />
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <CategoryPill
                                key={cat}
                                label={cat}
                                onClick={() => handleCategoryClick(cat)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Carousel */}
            <section className="py-14 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                <TrendingUp size={22} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-900">Trending Now</h2>
                                <p className="text-sm text-gray-400">Live updates from multiple verified sources</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/feed')} className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm transition-colors">
                            View All →
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Featured Carousel Card */}
                            {featuredArticle && (
                                <div ref={carouselRef} className="relative mb-8 rounded-3xl overflow-hidden group cursor-pointer border border-gray-100 shadow-xl"
                                    onClick={() => navigate(`/article/${carouselIndex}`, { state: { article: featuredArticle } })}>
                                    <img
                                        src={featuredArticle.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1400&auto=format&fit=crop'}
                                        alt={featuredArticle.title}
                                        className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1400&auto=format&fit=crop'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-8">
                                        {featuredArticle.category && (
                                            <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-3">
                                                {Array.isArray(featuredArticle.category) ? featuredArticle.category[0] : featuredArticle.category}
                                            </span>
                                        )}
                                        <h3 className="text-white text-xl md:text-3xl font-extrabold leading-tight max-w-3xl">
                                            {featuredArticle.title}
                                        </h3>
                                        <p className="text-white/70 text-sm mt-2">{featuredArticle.source_name} · {featuredArticle.pubDate?.split('T')[0]}</p>
                                    </div>
                                    {/* Carousel dots */}
                                    <div className="absolute bottom-4 right-4 flex space-x-1.5">
                                        {trendingNews.slice(0, 5).map((_, i) => (
                                            <button key={i} onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === carouselIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                                        ))}
                                    </div>
                                    {/* Arrows */}
                                    <button onClick={(e) => { e.stopPropagation(); setCarouselIndex(i => (i - 1 + 5) % Math.min(trendingNews.length, 5)); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 hover:bg-white/40 transition-all">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setCarouselIndex(i => (i + 1) % Math.min(trendingNews.length, 5)); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 hover:bg-white/40 transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}

                            {/* News Card Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {gridArticles.map((article, i) => (
                                    <NewsCard key={i} article={article} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Feature Cards */}
            <section className="py-20 bg-gray-50/70">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Everything You Need</h2>
                        <p className="text-gray-500">NewsHive is your all-in-one news intelligence platform.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "AI Chatbot",
                                description: "Ask our Gemini-powered AI anything — get news summaries, category digests, or explore specific topics in seconds.",
                                icon: <Zap className="text-indigo-600" size={30} />,
                                link: "/chatbot",
                                color: "bg-indigo-50"
                            },
                            {
                                title: "Smart Preferences",
                                description: "Pick the categories you love. Your feed adapts instantly to show only what matters to you.",
                                icon: <Settings className="text-orange-500" size={30} />,
                                link: "/preferences",
                                color: "bg-orange-50"
                            },
                            {
                                title: "Admin & Analytics",
                                description: "Monitor scraper health, track API performance, and export detailed usage reports in real time.",
                                icon: <LayoutDashboard className="text-emerald-500" size={30} />,
                                link: "/admin",
                                color: "bg-emerald-50"
                            }
                        ].map((f, i) => (
                            <div key={i}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                                onClick={() => navigate(f.link)}>
                                <div className={`${f.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed mb-6">{f.description}</p>
                                <span className="text-indigo-600 font-bold group-hover:translate-x-2 transition-transform inline-block">
                                    Get Started →
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
