import React from 'react';
import { ScoreCardData } from '../types';

interface ScoreCardProps {
  card: ScoreCardData;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ card }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'good':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'fair':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-gradient-to-r from-emerald-500 to-teal-400';
    if (score >= 70) return 'bg-gradient-to-r from-indigo-500 to-purple-400';
    if (score >= 55) return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    return 'bg-gradient-to-r from-rose-500 to-red-400';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h4 className="text-sm font-medium text-slate-300">{card.title}</h4>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(card.status)}`}>
            {card.status}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-3xl font-bold text-white tracking-tight">{Math.round(card.score)}</span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60">
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(card.score)}`}
            style={{ width: `${Math.min(100, Math.max(0, card.score))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
