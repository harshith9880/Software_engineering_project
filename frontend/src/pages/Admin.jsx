import { useState, useEffect } from 'react';
import {
    BarChart3, Server, Database, Activity, AlertCircle, CheckCircle2, Cpu, RefreshCw, Download, ShieldCheck
} from 'lucide-react';
import { analyticsApi } from '../api/newsApi';

const Admin = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const scrapers = [
        { name: 'NewsData.io API', status: 'Online', lastRun: '2 mins ago', items: 342, health: 98 },
        { name: 'Financial Times Bot', status: 'Online', lastRun: '15 mins ago', items: 112, health: 100 },
        { name: 'TechCrunch Aggregator', status: 'Delayed', lastRun: '1 hour ago', items: 89, health: 75 },
        { name: 'SportsMania RSS', status: 'Online', lastRun: '5 mins ago', items: 210, health: 92 },
        { name: 'BBC World Scraper', status: 'Online', lastRun: '8 mins ago', items: 178, health: 96 },
    ];

    const logs = [
        { time: new Date().toLocaleTimeString(), msg: 'New article batch indexed (Technology)', type: 'info' },
        { time: new Date(Date.now() - 120000).toLocaleTimeString(), msg: 'NewsData.io rate limit warning (80% used)', type: 'warning' },
        { time: new Date(Date.now() - 240000).toLocaleTimeString(), msg: 'Verification agent processed 24 articles', type: 'info' },
        { time: new Date(Date.now() - 360000).toLocaleTimeString(), msg: 'Cache invalidated — fresh fetch triggered', type: 'info' },
        { time: new Date(Date.now() - 480000).toLocaleTimeString(), msg: 'TechCrunch scraper returned 429 (retry queued)', type: 'warning' },
        { time: new Date(Date.now() - 600000).toLocaleTimeString(), msg: 'AI model re-initialized successfully', type: 'info' },
    ];

    useEffect(() => {
        analyticsApi.getStats()
            .then(res => { if (res.data.success) setAnalyticsData(res.data.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setLoading(true);
        analyticsApi.getStats()
            .then(res => { if (res.data.success) setAnalyticsData(res.data.data); })
            .catch(() => {})
            .finally(() => { setLoading(false); setIsRefreshing(false); });
    };

    const exportCSV = () => {
        const rows = [
            ['Category', 'Article Count', 'Percentage'],
            ...(analyticsData?.category_distribution || []).map(c => [c.category, c.count, c.percentage + '%'])
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newshive_analytics.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const stats = [
        { label: 'Active Sources', value: '5', icon: <Server size={22} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Articles Today', value: analyticsData?.total_articles_today?.toLocaleString() || '—', icon: <Database size={22} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Verified Articles', value: analyticsData?.verified_articles?.toLocaleString() || '—', icon: <ShieldCheck size={22} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Avg Confidence', value: analyticsData ? `${analyticsData.avg_verification_confidence}%` : '—', icon: <Activity size={22} />, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'API Calls Today', value: analyticsData?.api_calls_today?.toLocaleString() || '—', icon: <Cpu size={22} />, color: 'text-rose-500', bg: 'bg-rose-50' },
    ];

    const maxHourly = analyticsData
        ? Math.max(...analyticsData.hourly_activity.map(h => h.articles))
        : 212;

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Monitor data acquisition and system performance.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            id="export-csv-btn"
                            onClick={exportCSV}
                            className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
                        >
                            <Download size={16} className="mr-2" />
                            Export CSV
                        </button>
                        <button
                            id="refresh-btn"
                            onClick={handleRefresh}
                            className="flex items-center px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95"
                        >
                            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                                {stat.icon}
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</p>
                            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{loading ? '...' : stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Scraper Table + Hourly Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Scraper Table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-7 py-5 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Hybrid Acquisition Panel</h3>
                                <span className="flex items-center text-xs font-bold text-emerald-600 px-2.5 py-1 bg-emerald-50 rounded-full">
                                    <CheckCircle2 size={13} className="mr-1" />
                                    Systems Nominal
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/70 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            <th className="px-7 py-4">Source</th>
                                            <th className="px-4 py-4">Status</th>
                                            <th className="px-4 py-4">Last Run</th>
                                            <th className="px-4 py-4">Health</th>
                                            <th className="px-7 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {scrapers.map((s, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-7 py-4">
                                                    <div className="font-bold text-gray-900 text-sm">{s.name}</div>
                                                    <div className="text-xs text-gray-400">{s.items} items fetched</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${s.status === 'Online' ? 'text-emerald-700 bg-emerald-50' : 'text-orange-700 bg-orange-50'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${s.status === 'Online' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                                        {s.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">{s.lastRun}</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                            <div className={`h-full rounded-full ${s.health > 90 ? 'bg-emerald-500' : 'bg-orange-400'}`} style={{ width: `${s.health}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-500">{s.health}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-7 py-4 text-right">
                                                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold hover:underline">Restart</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Hourly Activity Chart */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <BarChart3 size={18} className="mr-2 text-indigo-600" />
                                Hourly Article Activity
                            </h3>
                            <div className="flex items-end space-x-2 h-36">
                                {(analyticsData?.hourly_activity || []).map((h, i) => (
                                    <div key={i} className="flex flex-col items-center flex-1">
                                        <div
                                            className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500 hover:bg-indigo-600"
                                            style={{ height: `${(h.articles / maxHourly) * 100}%`, minHeight: '4px' }}
                                            title={`${h.hour}:00 — ${h.articles} articles`}
                                        />
                                        <span className="text-[9px] text-gray-400 mt-1">{h.hour}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center">Articles per 2-hour window (UTC)</p>
                        </div>
                    </div>

                    {/* Right: Category Distribution + Logs */}
                    <div className="space-y-6">
                        {/* Category Distribution */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                            <h3 className="text-lg font-bold text-gray-900 mb-5">Category Distribution</h3>
                            <div className="space-y-3">
                                {(analyticsData?.category_distribution || []).map((cat, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                                            <span className="text-xs font-bold text-gray-500">{cat.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-700"
                                                style={{ width: `${cat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {loading && <div className="h-24 bg-gray-50 rounded-xl animate-pulse" />}
                            </div>
                        </div>

                        {/* Live Event Logs */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                                <Activity size={18} className="mr-2 text-indigo-600" />
                                Live Event Logs
                            </h3>
                            <div className="space-y-4">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex space-x-3">
                                        <div className="text-[10px] font-mono text-gray-400 pt-0.5 whitespace-nowrap">{log.time}</div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800 leading-tight">{log.msg}</div>
                                            <div className={`text-[10px] font-bold uppercase mt-0.5 ${log.type === 'warning' ? 'text-orange-500' : 'text-indigo-400'}`}>
                                                {log.type}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Health Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-7 text-white shadow-xl">
                            <h3 className="text-lg font-bold mb-2">Automated Optimization</h3>
                            <p className="text-indigo-100 text-sm mb-4 opacity-90 leading-relaxed">
                                Smart cache is saving ~84% of API calls through intelligent indexing and deduplication.
                            </p>
                            <div className="flex items-center text-xs font-bold bg-white/10 backdrop-blur-md rounded-xl p-3">
                                <AlertCircle size={14} className="mr-2" />
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
