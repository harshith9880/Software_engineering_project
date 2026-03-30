import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsGrid from '../components/NewsGrid';
import CategoryPill from '../components/CategoryPill';
import SearchBar from '../components/SearchBar';
import { Filter, UserCheck, RefreshCw } from 'lucide-react';
import { newsApi } from '../api/newsApi';

const CATEGORIES = ['All', 'Technology', 'Sports', 'Business', 'Entertainment', 'Science', 'Health', 'World'];

const Feed = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
    const [newsData, setNewsData] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const PAGE_SIZE = 8;

    const fetchNews = async () => {
        try {
            setLoading(true);
            const query = searchParams.get('search');
            const category = searchParams.get('category');

            let response;
            if (query) {
                response = await newsApi.searchNews(query);
            } else {
                // Try personalized first if preferences exist
                const prefs = JSON.parse(localStorage.getItem('newshive_preferences') || '[]');
                if (prefs.length > 0 && (!category || category === 'all')) {
                    response = await newsApi.getPersonalizedFeed(prefs);
                } else {
                    response = await newsApi.getTopHeadlines(category || '');
                }
            }

            setNewsData(response.data.data || response.data.articles || []);
            setPage(1);
        } catch (err) {
            console.error('Failed to fetch news', err);
            setNewsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
        setActiveCategory(searchParams.get('category') || 'All');
    }, [searchParams]);

    const handleCategoryChange = (cat) => {
        const params = new URLSearchParams(searchParams);
        if (cat.toLowerCase() === 'all') {
            params.delete('category');
        } else {
            params.set('category', cat.toLowerCase());
        }
        params.delete('search');
        setSearchParams(params);
    };

    const handleSearch = (searchQuery) => {
        if (searchQuery.trim()) {
            const params = new URLSearchParams(searchParams);
            params.set('search', searchQuery);
            params.delete('category');
            setSearchParams(params);
        }
    };

    const handleLoadMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setPage(p => p + 1);
            setLoadingMore(false);
        }, 600);
    };

    const visibleArticles = newsData.slice(0, page * PAGE_SIZE);
    const hasMore = visibleArticles.length < newsData.length;

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-6 md:space-y-0">
                    <div>
                        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2">
                            <UserCheck size={16} />
                            <span>Personalized for You</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            {searchParams.get('search') ? `Results for "${searchParams.get('search')}"` : 'Your News Feed'}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {newsData.length > 0 ? `${newsData.length} articles found` : 'Discover what\'s happening around the world today.'}
                        </p>
                    </div>
                    <div className="w-full md:w-auto md:min-w-[380px]">
                        <SearchBar onSearch={handleSearch} initialValue={searchParams.get('search') || ''} />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 overflow-x-auto">
                    <div className="flex items-center text-gray-500 font-medium whitespace-nowrap">
                        <Filter size={18} className="mr-2" />
                        <span>Categories:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <CategoryPill
                                key={cat}
                                label={cat}
                                active={activeCategory.toLowerCase() === cat.toLowerCase()}
                                onClick={() => handleCategoryChange(cat)}
                            />
                        ))}
                    </div>
                </div>

                {/* News Grid */}
                <NewsGrid articles={visibleArticles} loading={loading} />

                {/* Load More */}
                {!loading && hasMore && (
                    <div className="flex justify-center mt-10">
                        <button
                            id="load-more-btn"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="flex items-center px-8 py-3.5 bg-white border-2 border-indigo-100 rounded-2xl font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm active:scale-95"
                        >
                            {loadingMore ? (
                                <>
                                    <RefreshCw size={18} className="mr-2 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                `Load More Articles (${newsData.length - visibleArticles.length} remaining)`
                            )}
                        </button>
                    </div>
                )}

                {!loading && newsData.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">📰</p>
                        <h3 className="text-xl font-bold text-gray-700">No articles found</h3>
                        <p className="text-gray-400 mt-2">Try a different search or category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
