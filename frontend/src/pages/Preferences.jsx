import { useState, useEffect } from 'react';
import { Check, Sparkles, Save } from 'lucide-react';

const ALL_CATEGORIES = [
    { id: 'technology', label: 'Technology', emoji: '💻', color: 'indigo' },
    { id: 'sports', label: 'Sports', emoji: '⚽', color: 'emerald' },
    { id: 'business', label: 'Finance & Business', emoji: '📈', color: 'amber' },
    { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: 'pink' },
    { id: 'science', label: 'Science', emoji: '🔬', color: 'violet' },
    { id: 'health', label: 'Health', emoji: '❤️', color: 'rose' },
    { id: 'world', label: 'Global / World', emoji: '🌍', color: 'sky' },
    { id: 'politics', label: 'Politics', emoji: '🏛️', color: 'orange' },
    { id: 'environment', label: 'Environment', emoji: '🌿', color: 'teal' },
    { id: 'education', label: 'Education', emoji: '📚', color: 'cyan' },
];

const COLOR_MAP = {
    indigo: { border: 'border-indigo-300', bg: 'bg-indigo-50', text: 'text-indigo-700', check: 'bg-indigo-600' },
    emerald: { border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-700', check: 'bg-emerald-600' },
    amber: { border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-700', check: 'bg-amber-600' },
    pink: { border: 'border-pink-300', bg: 'bg-pink-50', text: 'text-pink-700', check: 'bg-pink-600' },
    violet: { border: 'border-violet-300', bg: 'bg-violet-50', text: 'text-violet-700', check: 'bg-violet-600' },
    rose: { border: 'border-rose-300', bg: 'bg-rose-50', text: 'text-rose-700', check: 'bg-rose-600' },
    sky: { border: 'border-sky-300', bg: 'bg-sky-50', text: 'text-sky-700', check: 'bg-sky-600' },
    orange: { border: 'border-orange-300', bg: 'bg-orange-50', text: 'text-orange-700', check: 'bg-orange-600' },
    teal: { border: 'border-teal-300', bg: 'bg-teal-50', text: 'text-teal-700', check: 'bg-teal-600' },
    cyan: { border: 'border-cyan-300', bg: 'bg-cyan-50', text: 'text-cyan-700', check: 'bg-cyan-600' },
};

const Preferences = () => {
    const [selected, setSelected] = useState([]);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('newshive_preferences');
        if (stored) setSelected(JSON.parse(stored));
    }, []);

    const toggle = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem('newshive_preferences', JSON.stringify(selected));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const selectAll = () => {
        setSelected(ALL_CATEGORIES.map(c => c.id));
        setSaved(false);
    };

    const clearAll = () => {
        setSelected([]);
        setSaved(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold mb-5">
                        <Sparkles size={14} className="mr-2" />
                        Personalize Your Feed
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Your Preferences</h1>
                    <p className="text-gray-500 text-lg">
                        Select the categories you care about. Your news feed will be tailored to your choices.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-gray-500">
                        {selected.length} of {ALL_CATEGORIES.length} selected
                    </span>
                    <div className="flex gap-3">
                        <button onClick={selectAll} className="text-sm text-indigo-600 font-semibold hover:underline">Select All</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={clearAll} className="text-sm text-gray-500 font-semibold hover:underline">Clear All</button>
                    </div>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {ALL_CATEGORIES.map(cat => {
                        const isSelected = selected.includes(cat.id);
                        const c = COLOR_MAP[cat.color];
                        return (
                            <button
                                key={cat.id}
                                id={`pref-${cat.id}`}
                                onClick={() => toggle(cat.id)}
                                className={`relative flex items-center p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer group
                                    ${isSelected
                                        ? `${c.border} ${c.bg} shadow-md`
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <span className="text-3xl mr-4">{cat.emoji}</span>
                                <div className="flex-grow">
                                    <p className={`font-bold text-base ${isSelected ? c.text : 'text-gray-900'}`}>
                                        {cat.label}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {isSelected ? 'Added to your feed' : 'Click to include'}
                                    </p>
                                </div>
                                {/* Checkbox */}
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ml-3 flex-shrink-0
                                    ${isSelected ? `${c.check} border-transparent` : 'border-gray-300 bg-white'}`}>
                                    {isSelected && <Check size={14} color="white" strokeWidth={3} />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Save Button */}
                <div className="flex justify-center">
                    <button
                        id="save-preferences-btn"
                        onClick={handleSave}
                        disabled={selected.length === 0}
                        className={`flex items-center px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg
                            ${selected.length === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : saved
                                    ? 'bg-emerald-500 text-white shadow-emerald-200 scale-105'
                                    : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl active:scale-95'
                            }`}
                    >
                        {saved ? (
                            <>
                                <Check size={20} className="mr-2" />
                                Preferences Saved!
                            </>
                        ) : (
                            <>
                                <Save size={20} className="mr-2" />
                                Save Preferences
                            </>
                        )}
                    </button>
                </div>

                {saved && (
                    <p className="text-center text-emerald-600 font-medium mt-4 text-sm animate-bounce">
                        ✓ Your feed has been updated based on your selections.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Preferences;
