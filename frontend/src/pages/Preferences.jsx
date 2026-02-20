import { useState, useEffect } from 'react';
import { Save, CheckCircle2, RotateCcw } from 'lucide-react';

const Preferences = () => {
    const allCategories = [
        { id: 'technology', label: 'Technology', icon: '💻' },
        { id: 'sports', label: 'Sports', icon: '⚽' },
        { id: 'finance', label: 'Finance & Business', icon: '📈' },
        { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
        { id: 'science', label: 'Science', icon: '🔬' },
        { id: 'health', label: 'Health', icon: '🏥' },
        { id: 'politics', label: 'Politics', icon: '⚖️' },
        { id: 'world', label: 'Global News', icon: '🌐' },
    ];

    const [selected, setSelected] = useState([]);
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('news_preferences');
        if (saved) {
            setSelected(JSON.parse(saved));
        }
    }, []);

    const toggleCategory = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        localStorage.setItem('news_preferences', JSON.stringify(selected));
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
    };

    const reset = () => {
        setSelected([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Fine-tune Your Feed</h1>
                    <p className="text-gray-600 text-lg">Select the topics you care about most, and we'll prioritize them in your personalized view.</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                    <div className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {allCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`flex items-center p-4 rounded-2xl border-2 transition-all ${selected.includes(cat.id)
                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                            : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-2xl mr-4">{cat.icon}</span>
                                    <span className={`font-bold ${selected.includes(cat.id) ? 'text-indigo-900' : 'text-gray-700'}`}>
                                        {cat.label}
                                    </span>
                                    {selected.includes(cat.id) && (
                                        <div className="ml-auto text-indigo-600">
                                            <CheckCircle2 size={20} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
                            <button
                                onClick={reset}
                                className="flex items-center text-gray-400 hover:text-gray-600 font-medium transition-colors"
                            >
                                <RotateCcw size={18} className="mr-2" />
                                Clear All
                            </button>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {showSaved && (
                                    <span className="text-emerald-600 font-bold flex items-center animate-in fade-in slide-in-from-right-4 duration-300">
                                        <CheckCircle2 size={18} className="mr-1.5" />
                                        Saved Successfully!
                                    </span>
                                )}
                                <button
                                    onClick={handleSave}
                                    className="flex-grow sm:flex-initial flex items-center justify-center px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                >
                                    <Save size={20} className="mr-2" />
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-900 px-8 py-6 text-white text-center">
                        <p className="text-indigo-100 text-sm opacity-80">
                            Note: Preferences are stored locally on your device for immediate personalization.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preferences;
