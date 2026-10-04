import React from 'react';
import { Question } from '../types';
import { HelpCircle, Tag, Zap } from 'lucide-react';

interface InterviewQuestionProps {
  question: Question | null;
  questionIndex: number;
  totalQuestions: number;
}

export const InterviewQuestion: React.FC<InterviewQuestionProps> = ({
  question,
  questionIndex,
  totalQuestions,
}) => {
  if (!question) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center animate-pulse">
        <p className="text-sm text-slate-400">Loading next question...</p>
      </div>
    );
  }

  const difficultyColors: Record<string, string> = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const badgeColor = difficultyColors[question.difficulty.toLowerCase()] || difficultyColors.medium;

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background subtle gradient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header tags */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
            <Tag className="w-3 h-3 text-slate-400" />
            {question.category}
          </span>
        </div>

        <span className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${badgeColor}`}>
          <Zap className="w-3 h-3" />
          {question.difficulty}
        </span>
      </div>

      {/* Question Text */}
      <div className="flex items-start gap-3">
        <HelpCircle className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 leading-snug">
          "{question.question_text}"
        </h2>
      </div>
    </div>
  );
};
