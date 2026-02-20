const CategoryPill = ({ label, active = false, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${active
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 translate-y-[-1px]'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
        >
            {label}
        </button>
    );
};

export default CategoryPill;
