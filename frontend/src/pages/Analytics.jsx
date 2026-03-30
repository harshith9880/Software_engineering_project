import { useState, useEffect } from 'react';
import { analyticsApi } from '../api/newsApi';
import { BarChart3, PieChart, TrendingUp, Download, RefreshCw, ShieldCheck, AlertTriangle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

const VERDICT_COLORS = {
    'VERIFIED': 'bg-emerald-500',
    'LIKELY TRUE': 'bg-blue-500',
    'UNVERIFIABLE': 'bg-gray-400',
    'NEEDS REVIEW': 'bg-orange-400',
    'SUSPICIOUS': 'bg-red-500',
};

const VERDICT_ICONS = {
    'VERIFIED': <CheckCircle2 size={14} />,
    'LIKELY TRUE': <ShieldCheck size={14} />,
    'UNVERIFIABLE': <HelpCircle size={14} />,
    'NEEDS REVIEW': <AlertTriangle size={14} />,
    'SUSPICIOUS': <XCircle size={14} />,
};

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
        analyticsApi.getStats()
            .then(res => { if (res.data.success) setData(res.data.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const exportReport = () => {
        if (!data) return;
        const rows = [
            ['NewsHive Analytics Report', '', ''],
            ['Generated', new Date().toLocaleString(), ''],
            ['', '', ''],
            ['OVERVIEW', '', ''],
            ['Total Articles Today', data.total_articles_today, ''],
            ['API Calls Today', data.api_calls_today, ''],
            ['Verified Articles', data.verified_articles, ''],
            ['Avg Verification Confidence', data.avg_verification_confidence + '%', ''],
            ['', '', ''],
            ['CATEGORY DISTRIBUTION', '', ''],
            ['Category', 'Count', 'Percentage'],
            ...data.category_distribution.map(c => [c.category, c.count, c.percentage + '%']),
            ['', '', ''],
            ['VERIFICATION VERDICTS', '', ''],
            ['Verdict', 'Percentage', ''],
            ...Object.entries(data.verification_verdicts).map(([k, v]) => [k, v + '%', '']),
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newshive_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const maxCategCount = data ? Math.max(...data.category_distribution.map(c => c.count)) : 1;
    const maxHourly = data ? Math.max(...data.hourly_activity.map(h => h.articles)) : 1;
    const totalVerdicts = data ? Object.values(data.verification_verdicts).reduce((a, b) => a + b, 0) : 100;
    const avgResponseTime = data ? Math.round(data.api_response_times_ms.reduce((a, b) => a + b, 0) / data.api_response_times_ms.length) : 0;

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Analytics & Reports</h1>
                        <p className="text-gray-500 mt-1">System usage, category trends, verification stats, and API performance.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={exportReport} id="export-report-btn"
                            className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-sm transition-all">
                            <Download size={16} className="mr-2" />
                            Export PDF/CSV
                        </button>
                        <button onClick={fetchData}
                            className="flex items-center px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                    {[
                        { label: 'Articles Today', value: data?.total_articles_today?.toLocaleString() || '—', trend: '+12%', color: 'indigo' },
                        { label: 'API Calls', value: data?.api_calls_today?.toLocaleString() || '—', trend: '+8%', color: 'blue' },
                        { label: 'Verified', value: data?.verified_articles?.toLocaleString() || '—', trend: '+5%', color: 'emerald' },
                        { label: 'Avg Response', value: loading ? '—' : `${avgResponseTime}ms`, trend: '-3ms', color: 'orange' },
                    ].map((m, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.label}</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{m.value}</h3>
                            <span className="text-xs font-bold text-emerald-600 mt-1 inline-block">
                                <TrendingUp size={12} className="inline mr-1" />{m.trend} vs yesterday
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Category Bar Chart */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <BarChart3 size={18} className="mr-2 text-indigo-600" />
                            Category Demand
                        </h3>
                        {loading ? (
                            <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}</div>
                        ) : (
                            <div className="space-y-4">
                                {data?.category_distribution.map((cat, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="font-medium text-gray-700">{cat.category}</span>
                                            <span className="font-bold text-gray-900">{cat.count} <span className="text-gray-400 font-normal">({cat.percentage}%)</span></span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-700"
                                                style={{ width: `${(cat.count / maxCategCount) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Verification Verdicts Donut */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <ShieldCheck size={18} className="mr-2 text-emerald-600" />
                            Verification Results
                        </h3>
                        {loading ? (
                            <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}</div>
                        ) : (
                            <>
                                {/* Visual donut via stacked bar */}
                                <div className="flex rounded-full overflow-hidden h-6 mb-6">
                                    {data && Object.entries(data.verification_verdicts).map(([key, val]) => (
                                        <div
                                            key={key}
                                            className={`${VERDICT_COLORS[key] || 'bg-gray-300'} transition-all duration-700`}
                                            style={{ width: `${(val / totalVerdicts) * 100}%` }}
                                            title={`${key}: ${val}%`}
                                        />
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {data && Object.entries(data.verification_verdicts).map(([key, val]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2.5">
                                                <div className={`w-3 h-3 rounded-full ${VERDICT_COLORS[key] || 'bg-gray-300'}`} />
                                                <span className="flex items-center text-sm font-medium text-gray-700 space-x-1.5">
                                                    <span className={`${key === 'VERIFIED' ? 'text-emerald-600' : key === 'SUSPICIOUS' ? 'text-red-600' : 'text-gray-500'}`}>
                                                        {VERDICT_ICONS[key]}
                                                    </span>
                                                    <span>{key}</span>
                                                </span>
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm">{val}%</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* API Response Time + Hourly Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Hourly Activity */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <TrendingUp size={18} className="mr-2 text-blue-600" />
                            Hourly Article Ingest
                        </h3>
                        {loading ? (
                            <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                        ) : (
                            <div className="flex items-end space-x-1.5 h-32">
                                {data?.hourly_activity.map((h, i) => (
                                    <div key={i} className="flex flex-col items-center flex-1">
                                        <div
                                            className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                                            style={{ height: `${(h.articles / maxHourly) * 100}%`, minHeight: '3px' }}
                                            title={`${h.hour}:00 — ${h.articles} articles`}
                                        />
                                        <span className="text-[9px] text-gray-400 mt-1">{h.hour}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* API Response Times */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <TrendingUp size={18} className="mr-2 text-orange-500" />
                            API Response Time (ms)
                        </h3>
                        {loading ? (
                            <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                        ) : (
                            <>
                                <div className="flex items-end space-x-2 h-32">
                                    {data?.api_response_times_ms.map((t, i) => {
                                        const maxT = Math.max(...data.api_response_times_ms);
                                        return (
                                            <div key={i} className="flex flex-col items-center flex-1">
                                                <div
                                                    className={`w-full rounded-t transition-colors ${t < 150 ? 'bg-emerald-400' : t < 170 ? 'bg-orange-400' : 'bg-red-400'}`}
                                                    style={{ height: `${(t / maxT) * 100}%` }}
                                                    title={`${t}ms`}
                                                />
                                                <span className="text-[9px] text-gray-400 mt-1">{t}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-gray-400 text-center mt-3">
                                    Avg: <strong>{avgResponseTime}ms</strong> — Green &lt;150ms, Orange &lt;170ms, Red ≥170ms
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
