import React from 'react';
import { Lightbulb, X } from 'lucide-react';

interface FeedbackCardProps {
  tip: string | null;
  onDismiss?: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ tip, onDismiss }) => {
  if (!tip) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/30 rounded-xl p-4 shadow-xl backdrop-blur-md flex items-center justify-between gap-3 animate-fade-in transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block">
            Practice Coaching Tip
          </span>
          <p className="text-sm font-medium text-slate-100 mt-0.5 leading-snug">
            {tip}
          </p>
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800/60 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
