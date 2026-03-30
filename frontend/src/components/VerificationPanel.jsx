import { useState } from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle, ShieldCheck, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const VERDICT_CONFIG = {
    'VERIFIED': {
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badgeBg: 'bg-emerald-100',
        icon: <CheckCircle2 size={18} />,
        dot: 'bg-emerald-500',
    },
    'LIKELY TRUE': {
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badgeBg: 'bg-blue-100',
        icon: <ShieldCheck size={18} />,
        dot: 'bg-blue-500',
    },
    'UNVERIFIABLE': {
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        badgeBg: 'bg-gray-100',
        icon: <HelpCircle size={18} />,
        dot: 'bg-gray-400',
    },
    'NEEDS REVIEW': {
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        badgeBg: 'bg-orange-100',
        icon: <AlertTriangle size={18} />,
        dot: 'bg-orange-500',
    },
    'SUSPICIOUS': {
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        badgeBg: 'bg-red-100',
        icon: <XCircle size={18} />,
        dot: 'bg-red-500',
    },
};

const CHECK_LABEL = {
    factual_accuracy: 'Factual Accuracy',
    source_credibility: 'Source Credibility',
    temporal_consistency: 'Timeliness',
    regional_accuracy: 'Regional Accuracy',
};

const CHECK_CONFIG = {
    PASS: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: '✓ Pass' },
    WARN: { color: 'text-orange-600', bg: 'bg-orange-50', label: '⚠ Warn' },
    FAIL: { color: 'text-red-600', bg: 'bg-red-50', label: '✗ Fail' },
    UNKNOWN: { color: 'text-gray-500', bg: 'bg-gray-50', label: '? Unknown' },
};

export default function VerificationPanel({ verification, isLoading, error }) {
    const [expanded, setExpanded] = useState(false);

    if (isLoading) {
        return (
            <div className="mt-8 border border-indigo-100 rounded-2xl p-6 bg-indigo-50/40">
                <div className="flex items-center space-x-3 text-indigo-600">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="font-semibold text-sm">NewsHive Verification Agent analyzing article…</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-8 bg-indigo-100/60 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !verification) {
        return (
            <div className="mt-8 border border-gray-100 rounded-2xl p-5 bg-gray-50 text-sm text-gray-500">
                <HelpCircle size={16} className="inline mr-2" />
                Verification data unavailable for this article.
            </div>
        );
    }

    const cfg = VERDICT_CONFIG[verification.verdict] || VERDICT_CONFIG['UNVERIFIABLE'];

    return (
        <div className={`mt-8 border ${cfg.border} rounded-2xl overflow-hidden`}>
            {/* Header */}
            <div className={`${cfg.bg} px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                    <div className={`${cfg.color}`}>{cfg.icon}</div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">AI Verification</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-0.5">
                            <span className={`font-extrabold text-lg ${cfg.color}`}>{verification.verdict}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.color}`}>
                                {verification.confidence}% confidence
                            </span>
                        </div>
                    </div>
                </div>

                {/* Confidence Bar */}
                <div className="hidden sm:flex flex-col items-end space-y-1">
                    <span className="text-xs font-medium text-gray-500">Authenticity Score</span>
                    <div className="w-32 h-2 bg-white/60 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${cfg.dot} transition-all duration-1000`}
                            style={{ width: `${verification.confidence}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="px-6 py-4 bg-white">
                <p className="text-sm text-gray-700 leading-relaxed">{verification.summary}</p>

                {/* Check Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {Object.entries(verification.checks || {}).map(([key, value]) => {
                        const c = CHECK_CONFIG[value] || CHECK_CONFIG['UNKNOWN'];
                        return (
                            <div key={key} className={`flex items-center justify-between px-3 py-2 rounded-lg ${c.bg}`}>
                                <span className="text-xs font-medium text-gray-600">{CHECK_LABEL[key] || key}</span>
                                <span className={`text-xs font-bold ${c.color}`}>{c.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Expand button */}
                {(verification.cross_references?.length > 0 || verification.flags?.length > 0) && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-4 flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        {expanded ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />}
                        {expanded ? 'Show less' : 'Show cross-references & details'}
                    </button>
                )}

                {expanded && (
                    <div className="mt-4 space-y-4">
                        {verification.cross_references?.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cross-References</p>
                                <ul className="space-y-1.5">
                                    {verification.cross_references.map((ref, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-600">
                                            <span className="text-indigo-400 mr-2 mt-0.5">•</span>
                                            <span>{ref}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {verification.flags?.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">⚠ Flags</p>
                                <ul className="space-y-1.5">
                                    {verification.flags.map((flag, i) => (
                                        <li key={i} className="text-sm text-orange-700 flex items-start">
                                            <span className="mr-2">•</span>{flag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Powered by NewsHive AI Verification Agent</span>
                <span className="text-xs font-medium text-gray-500">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${cfg.dot}`} />
                    Auto-verified
                </span>
            </div>
        </div>
    );
}
