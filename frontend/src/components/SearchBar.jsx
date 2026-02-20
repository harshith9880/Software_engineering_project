import { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, initialValue = '', placeholder = "Search for news stories..." }) => {
    const [query, setQuery] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const clearSearch = () => {
        setQuery('');
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto group">
            <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Search size={22} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 placeholder:text-gray-400"
                />
                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-14 text-gray-400 hover:text-gray-600 px-2"
                    >
                        <X size={20} />
                    </button>
                )}
                <button
                    type="submit"
                    className="absolute right-3 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-colors shadow-lg shadow-indigo-200"
                >
                    <Search size={20} />
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
