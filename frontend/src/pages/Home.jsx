import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryPill from '../components/CategoryPill';
import NewsGrid from '../components/NewsGrid';
import { newsApi } from '../api/newsApi';
import { Sparkles, TrendingUp, Zap, Settings, LayoutDashboard } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [trendingNews, setTrendingNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        'Technology', 'Sports', 'Finance', 'Entertainment', 'Global', 'Science', 'Health'
    ];

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setLoading(true);
                // Mocking trending or fetching top headlines
                const response = await newsApi.getTopHeadlines();
                setTrendingNews(response.data.articles || []);
            } catch (err) {
                console.error("Failed to fetch trending news", err);
                // Fallback to empty or mock
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const handleSearch = (query) => {
        navigate(`/feed?search=${encodeURIComponent(query)}`);
    };

    const handleCategoryClick = (category) => {
        navigate(`/feed?category=${category.toLowerCase()}`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 bg-gradient-to-b from-indigo-50/50 to-white overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-50"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold mb-8 animate-bounce-slow">
                        <Sparkles size={16} className="mr-2" />
                        Empowering Your Daily Awareness
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        News That Matters <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
                            Personalized for You
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                        NewsHive aggregates the world's most important stories and filters them based on your interests. No noise, just news.
                    </p>

                    <div className="mb-12">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
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

            {/* Trending Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                <TrendingUp size={24} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                        </div>
                        <button
                            onClick={() => navigate('/feed')}
                            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                        >
                            View All Headlines
                        </button>
                    </div>

                    <NewsGrid articles={trendingNews.slice(0, 4)} loading={loading} />
                </div>
            </section>

            {/* Features/Quick Links */}
            <section className="py-20 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "AI Chatbot",
                            description: "Talk to our AI to find specific news or get summaries of complex topics.",
                            icon: <Zap className="text-indigo-600" size={32} />,
                            link: "/chatbot",
                            color: "bg-indigo-50"
                        },
                        {
                            title: "Smart Preferences",
                            description: "Tell us what you like and we'll craft a unique news feed just for you.",
                            icon: <Settings className="text-orange-500" size={32} />,
                            link: "/preferences",
                            color: "bg-orange-50"
                        },
                        {
                            title: "Insightful Admin",
                            description: "Monitor news scraping status and system health in real-time.",
                            icon: <LayoutDashboard className="text-emerald-500" size={32} />,
                            link: "/admin",
                            color: "bg-emerald-50"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate(feature.link)}>
                            <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed mb-6">{feature.description}</p>
                            <span className="text-indigo-600 font-bold group-hover:translate-x-2 transition-transform inline-block">
                                Get Started &rarr;
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
