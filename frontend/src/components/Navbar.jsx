import { Link, useLocation } from 'react-router-dom';
import { Newspaper, Home, Settings, MessageSquare, Info, LayoutDashboard, BarChart3, Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { analyticsApi } from '../api/newsApi';

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notifRef = useRef(null);

    const navItems = [
        { path: '/', label: 'Home', icon: <Home size={18} /> },
        { path: '/feed', label: 'Feed', icon: <Newspaper size={18} /> },
        { path: '/preferences', label: 'Preferences', icon: <Settings size={18} /> },
        { path: '/chatbot', label: 'Chatbot', icon: <MessageSquare size={18} /> },
        { path: '/admin', label: 'Admin', icon: <LayoutDashboard size={18} /> },
        { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
        { path: '/about', label: 'About', icon: <Info size={18} /> },
    ];

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        analyticsApi.getNotifications()
            .then(res => {
                setNotifications(res.data.notifications || []);
                setUnreadCount(res.data.unread_count || 0);
            })
            .catch(() => {});
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAllRead = () => {
        setNotifications(n => n.map(notif => ({ ...notif, read: true })));
        setUnreadCount(0);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="bg-indigo-600 p-1.5 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
                                <Newspaper size={22} />
                            </div>
                            <span className="text-xl font-extrabold text-gray-900 tracking-tight">NewsHive</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive(item.path)
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {/* Notification Bell */}
                        <div className="relative ml-2" ref={notifRef}>
                            <button
                                id="notif-bell-btn"
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button onClick={markAllRead} className="text-xs text-indigo-600 font-semibold hover:underline">
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div
                                                    key={notif.id}
                                                    className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-indigo-50/40' : ''}`}
                                                >
                                                    {!notif.read && (
                                                        <span className="inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 mb-0.5" />
                                                    )}
                                                    <p className="text-sm font-semibold text-gray-900 leading-snug">{notif.title}</p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="text-xs text-indigo-600 font-medium">{notif.category}</span>
                                                        <span className="text-xs text-gray-400">{notif.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center space-x-2">
                        <div className="relative" ref={notifRef}>
                            <button onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-lg text-gray-600">
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className={`px-4 py-3 border-b border-gray-50 ${!notif.read ? 'bg-indigo-50/40' : ''}`}>
                                            <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                                            <span className="text-xs text-gray-400">{notif.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium ${isActive(item.path)
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
