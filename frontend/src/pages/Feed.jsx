import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsGrid from '../components/NewsGrid';
import { newsApi } from '../api/newsApi';
import CategoryPill from '../components/CategoryPill';
import SearchBar from '../components/SearchBar';
import { Filter, UserCheck, Search } from 'lucide-react';

const Feed = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');

    const categories = ['All', 'Technology', 'Sports', 'Finance', 'Entertainment', 'Science', 'Health', 'Business'];

    const fetchNews = async () => {
        try {
            setLoading(true);
            const query = searchParams.get('search');
            const category = searchParams.get('category');

            let response;
            if (query) {
                response = await newsApi.searchNews(query);
            } else {
                response = await newsApi.getTopHeadlines(category === 'all' ? '' : category);
            }

            setArticles(response.data.articles || []);
        } catch (err) {
            console.error("Failed to fetch news", err);
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
        params.delete('search'); // Clear search when category changes
        setSearchParams(params);
    };

    const handleSearch = (query) => {
        const params = new URLSearchParams(searchParams);
        params.set('search', query);
        params.delete('category'); // Clear category when searching
        setSearchParams(params);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
                    <div>
                        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2">
                            <UserCheck size={16} />
                            <span>Personalized for You</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            {searchParams.get('search') ? `Results for "${searchParams.get('search')}"` : 'Your Morning Brief'}
                        </h1>
                        <p className="text-gray-500 mt-2">Discover what's happening around the world today.</p>
                    </div>

                    <div className="w-full md:w-auto md:min-w-[400px]">
                        <SearchBar onSearch={handleSearch} initialValue={searchParams.get('search') || ''} />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 overflow-x-auto custom-scrollbar">
                    <div className="flex items-center text-gray-500 font-medium whitespace-nowrap">
                        <Filter size={18} className="mr-2" />
                        <span>Categories:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <CategoryPill
                                key={cat}
                                label={cat}
                                active={activeCategory.toLowerCase() === cat.toLowerCase()}
                                onClick={() => handleCategoryChange(cat)}
                            />
                        ))}
                    </div>
                </div>

                {/* Results */}
                <NewsGrid articles={articles} loading={loading} />
            </div>
        </div>
    );
};

export default Feed;
