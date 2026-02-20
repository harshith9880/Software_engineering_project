import NewsCard from './NewsCard';

const NewsGrid = ({ articles = [], loading = false }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-2xl h-[400px] border border-gray-100 flex flex-col">
                        <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                        <div className="p-5 space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-6 bg-gray-200 rounded w-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="space-y-2 pt-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!articles.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-gray-100 p-6 rounded-full text-gray-400 mb-4">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">No News Found</h3>
                <p className="text-gray-500 max-w-sm">We couldn't find any articles matching your search or preferences. Try something else!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-8 max-w-7xl mx-auto">
            {articles.map((article, index) => (
                <NewsCard key={article.id || index} article={article} />
            ))}
        </div>
    );
};

export default NewsGrid;
