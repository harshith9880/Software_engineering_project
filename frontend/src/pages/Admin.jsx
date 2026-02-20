import { useState } from 'react';
import {
    BarChart3,
    Server,
    Database,
    Activity,
    AlertCircle,
    CheckCircle2,
    Cpu,
    RefreshCw
} from 'lucide-react';

const Admin = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const stats = [
        { label: 'Active News Sources', value: '42', icon: <Server size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Articles Scraped Today', value: '1,284', icon: <Database size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'API Uptime', value: '99.9%', icon: <Activity size={24} />, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'CPU Usage', value: '24%', icon: <Cpu size={24} />, color: 'text-rose-500', bg: 'bg-rose-50' },
    ];

    const scrapers = [
        { name: 'Google News Scraper', status: 'Online', lastRun: '2 mins ago', items: 342, health: 98 },
        { name: 'Financial Times Bot', status: 'Online', lastRun: '15 mins ago', items: 112, health: 100 },
        { name: 'TechCrunch Aggregator', status: 'Delayed', lastRun: '1 hour ago', items: 89, health: 75 },
        { name: 'SportsMania RSS', status: 'Online', lastRun: '5 mins ago', items: 210, health: 92 },
    ];

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-2">Monitor data acquisition and system performance.</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95"
                    >
                        <RefreshCw size={18} className={`mr-2 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
                        Refresh All Systems
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                                {stat.icon}
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Scraper Status */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Hybrid Acquisition Panel</h3>
                                <span className="flex items-center text-xs font-bold text-emerald-600 px-2.5 py-1 bg-emerald-50 rounded-full">
                                    <CheckCircle2 size={14} className="mr-1" />
                                    All Systems Nominal
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Source Name</th>
                                            <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Last Run</th>
                                            <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Health</th>
                                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {scrapers.map((scraper, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="font-bold text-gray-900">{scraper.name}</div>
                                                    <div className="text-xs text-gray-400">{scraper.items} items fetched</div>
                                                </td>
                                                <td className="px-4 py-5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${scraper.status === 'Online' ? 'text-emerald-700 bg-emerald-50' : 'text-orange-700 bg-orange-50'
                                                        }`}>
                                                        {scraper.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-5 text-sm text-gray-600">{scraper.lastRun}</td>
                                                <td className="px-4 py-5">
                                                    <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${scraper.health > 90 ? 'bg-emerald-500' : 'bg-orange-400'}`}
                                                            style={{ width: `${scraper.health}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">Restart</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* System Logs */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <BarChart3 size={20} className="mr-2 text-indigo-600" />
                                Live Event Logs
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { time: '14:23:01', msg: 'New article batch indexed (Sports)', type: 'info' },
                                    { time: '14:22:45', msg: 'User preference set updated', type: 'info' },
                                    { time: '14:20:12', msg: 'NewsAPI connection reset', type: 'warning' },
                                    { time: '14:15:33', msg: 'Chatbot model re-initialized', type: 'info' },
                                    { time: '14:10:05', msg: 'Memory limit caveat triggered', type: 'warning' }
                                ].map((log, i) => (
                                    <div key={i} className="flex space-x-4">
                                        <div className="text-xs font-mono text-gray-400 pt-1">{log.time}</div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800 leading-tight">{log.msg}</div>
                                            <div className={`text-[10px] font-bold uppercase ${log.type === 'warning' ? 'text-orange-500' : 'text-indigo-400'}`}>
                                                {log.type}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-8 w-full py-3 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors">
                                View Full Logs Archive
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl">
                            <h3 className="text-lg font-bold mb-2">Automated Optimization</h3>
                            <p className="text-indigo-100 text-sm mb-6 opacity-90 leading-relaxed">
                                The smart cache is currently saving 84% of API calls by intelligent indexing.
                            </p>
                            <div className="flex items-center text-xs font-bold bg-white/10 backdrop-blur-md rounded-xl p-3">
                                <AlertCircle size={16} className="mr-2" />
                                System Health: EXCELLENT
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
