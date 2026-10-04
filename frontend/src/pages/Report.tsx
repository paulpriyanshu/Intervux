import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiService } from '../services/api';
import { InterviewReportData } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import {
  PerformanceTimelineChart,
  MultimodalRadarChart,
  SpeechSpeedChart,
} from '../components/Charts';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Video,
  Mic,
  Clock,
  Sparkles,
  HelpCircle,
  Share2,
} from 'lucide-react';

export const Report: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const interviewId = Number(id);

  const [report, setReport] = useState<InterviewReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getReport(interviewId);
        setReport(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch interview report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-400">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm">Synthesizing multimodal interview analytics report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Unable to load report</h2>
        <p className="text-sm text-slate-400 max-w-sm mb-6">{error || 'Report data not found.'}</p>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { interview, score_cards, timeline, radar_scores, recommendations, questions, ai_mode_badge } = report;

  const overallScore = Math.round(interview.overall_score || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Multimodal Interview Report
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
              {interview.type} • {interview.mode}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Transparent AI Mode Badge */}
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            {ai_mode_badge}
          </span>
          <Link
            to="/setup"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            Practice Again
          </Link>
        </div>
      </div>

      {/* Hero Score Showcase Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex flex-col items-center justify-center shrink-0">
            <span className="text-4xl font-extrabold text-white">{overallScore}</span>
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Overall</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Evaluation Completed
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              {overallScore >= 80 ? 'Exceptional Readiness!' : overallScore >= 65 ? 'Solid Competency with Growth Areas' : 'Needs Practice & Structure'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Based on synthesized visual poise (eye contact, posture), audio acoustics (speaking speed, pauses, fillers), and answer clarity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center divide-x divide-slate-800/80 w-full md:w-auto justify-around">
          <div className="px-4">
            <p className="text-xl font-bold text-white">{Math.round(interview.communication_score || 0)}</p>
            <p className="text-[11px] text-slate-400">Communication</p>
          </div>
          <div className="px-4">
            <p className="text-xl font-bold text-white">{Math.round(interview.body_language_score || 0)}</p>
            <p className="text-[11px] text-slate-400">Body Language</p>
          </div>
          <div className="px-4">
            <p className="text-xl font-bold text-white">{Math.round(interview.speech_score || 0)}</p>
            <p className="text-[11px] text-slate-400">Speech & Pacing</p>
          </div>
        </div>
      </div>

      {/* 6 Category Score Cards */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-white mb-4">Competency Radar & Score Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {score_cards.map((card, idx) => (
            <ScoreCard key={idx} card={card} />
          ))}
        </div>
      </div>

      {/* Visual Charts: Multimodal Radar & Performance Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Radar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h4 className="text-sm font-semibold text-white mb-1">Signal Balance Radar</h4>
          <p className="text-xs text-slate-400 mb-4">Multimodal balance across delivery, clarity, and domain depth</p>
          <MultimodalRadarChart data={radar_scores} />
        </div>

        {/* Timeline Progression */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h4 className="text-sm font-semibold text-white mb-1">Question-by-Question Progression</h4>
          <p className="text-xs text-slate-400 mb-4">Answer evaluation score and eye contact stability timeline</p>
          <PerformanceTimelineChart data={timeline} />
        </div>
      </div>

      {/* Multimodal Cross-Signal Recommendations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Multimodal Fusion Recommendations</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Synthesized insights correlating body language, speaking cadence, and answer depth:
        </p>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3.5"
            >
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  rec.priority === 'high' ? 'bg-rose-400' : rec.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {rec.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase ${
                      rec.priority === 'high' ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">{rec.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Granular Question-by-Question Review */}
      <div className="space-y-8">
        <h3 className="text-lg font-bold text-white">Question-by-Question Diagnostic Review</h3>

        {questions.map((q) => {
          const resp = q.response;
          const vm = resp?.vision_metrics;
          const evalItem = resp?.answer_evaluation;
          let feedbackObj: any = {};
          if (evalItem?.feedback) {
            try {
              feedbackObj = JSON.parse(evalItem.feedback);
            } catch {}
          }

          return (
            <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Question {q.order_number}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{q.category}</span>
                </div>
                <span className="text-sm font-bold text-white">
                  Score: {evalItem?.overall_score ? Math.round(evalItem.overall_score) : 'N/A'} / 100
                </span>
              </div>

              <h4 className="text-base font-semibold text-white mb-4">"{q.question_text}"</h4>

              {/* Spoken Transcript */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-6">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Candidate Transcript:</span>
                <p className="text-xs text-slate-300 font-mono italic leading-relaxed">
                  {resp?.transcript ? `"${resp.transcript}"` : '(No spoken answer recorded)'}
                </p>
              </div>

              {/* Multimodal Telemetry Metrics */}
              {resp && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 text-xs">
                    <span className="text-slate-400">Eye Contact:</span>
                    <p className="font-semibold text-white mt-0.5">{vm?.eye_contact || 75}%</p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 text-xs">
                    <span className="text-slate-400">Speaking Speed:</span>
                    <p className="font-semibold text-white mt-0.5">{resp.speaking_speed} WPM</p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 text-xs">
                    <span className="text-slate-400">Filler Words:</span>
                    <p className="font-semibold text-white mt-0.5">{resp.filler_count} detected</p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 text-xs">
                    <span className="text-slate-400">Avg Pause:</span>
                    <p className="font-semibold text-white mt-0.5">{resp.pause_duration}s</p>
                  </div>
                </div>
              )}

              {/* Strengths & Suggestions */}
              {feedbackObj && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbackObj.strengths && (
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
                        Strengths
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {feedbackObj.strengths.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedbackObj.suggestions && (
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-2">
                        Areas for Coaching
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {feedbackObj.suggestions.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
