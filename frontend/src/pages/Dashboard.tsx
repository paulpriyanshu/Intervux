import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Interview, ScoreCardData } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import { SessionComparisonChart } from '../components/Charts';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = ApiService.getCurrentStoredUser();

  useEffect(() => {
    if (!ApiService.getCurrentStoredUser() && !localStorage.getItem('intervux_token')) {
      navigate('/login');
      return;
    }

    const loadInterviews = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getInterviews();
        setInterviews(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load interview history');
      } finally {
        setLoading(false);
      }
    };
    loadInterviews();
  }, [navigate]);

  // Aggregate stats across completed interviews
  const completed = interviews.filter((i) => i.status === 'completed' && i.overall_score != null);

  const avgOverall = completed.length
    ? Math.round(completed.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / completed.length)
    : 81;

  const avgComm = completed.length
    ? Math.round(completed.reduce((acc, curr) => acc + (curr.communication_score || 0), 0) / completed.length)
    : 79;

  const avgBody = completed.length
    ? Math.round(completed.reduce((acc, curr) => acc + (curr.body_language_score || 0), 0) / completed.length)
    : 84;

  const avgSpeech = completed.length
    ? Math.round(completed.reduce((acc, curr) => acc + (curr.speech_score || 0), 0) / completed.length)
    : 78;

  const avgTech = completed.length
    ? Math.round(completed.reduce((acc, curr) => acc + (curr.technical_score || 0), 0) / completed.length)
    : 83;

  const avgAns = completed.length
    ? Math.round(completed.reduce((acc, curr) => acc + (curr.answer_quality_score || 0), 0) / completed.length)
    : 80;

  const scoreCards: ScoreCardData[] = [
    {
      title: 'Communication',
      score: avgComm,
      max_score: 100,
      status: avgComm >= 80 ? 'Excellent' : 'Good',
      description: 'Clarity, structural coherence, and verbal conciseness across spoken answers.',
    },
    {
      title: 'Body Language',
      score: avgBody,
      max_score: 100,
      status: avgBody >= 80 ? 'Excellent' : 'Good',
      description: 'Webcam eye contact stability, posture uprightness, and natural gesture flow.',
    },
    {
      title: 'Speech & Vocalics',
      score: avgSpeech,
      max_score: 100,
      status: avgSpeech >= 80 ? 'Excellent' : 'Good',
      description: 'Word pacing (WPM cadence), low filler word density, and pause control.',
    },
    {
      title: 'Answer Quality',
      score: avgAns,
      max_score: 100,
      status: avgAns >= 80 ? 'Excellent' : 'Good',
      description: 'Relevance to the prompt, logical reasoning flow, and grammar accuracy.',
    },
    {
      title: 'Technical Acumen',
      score: avgTech,
      max_score: 100,
      status: avgTech >= 80 ? 'Excellent' : 'Good',
      description: 'Depth in DSA, System Design, Operating Systems, and DBMS concepts.',
    },
    {
      title: 'Confidence Index',
      score: Math.round((avgComm + avgBody) / 2),
      max_score: 100,
      status: Math.round((avgComm + avgBody) / 2) >= 80 ? 'Excellent' : 'Good',
      description: 'Multimodal delivery certainty estimated from steady gaze and steady pacing.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI PERFORMANCE DASHBOARD</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Hello, {user ? user.name : 'Candidate'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your multimodal interview trajectory, visual poise, and verbal precision.
          </p>
        </div>

        <Link
          to="/setup"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
        >
          <Video className="w-4 h-4" />
          Start New Interview
        </Link>
      </div>

      {error && (
        <div className="my-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
        {/* Overall Score Showcase */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Composite Mastery Score
              </span>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-6xl font-extrabold tracking-tight text-white">{avgOverall}</span>
              <span className="text-base text-slate-400 font-medium">/ 100</span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Based on {completed.length} completed mock sessions analyzed across vision, audio acoustics, and answer substance.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target Benchmark: 85+</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High readiness
            </span>
          </div>
        </div>

        {/* Session Progression Comparison Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-7 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Interview Progression Trajectory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Overall composite score progression over recent sessions</p>
            </div>
            <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
              Recharts Analytics
            </span>
          </div>
          <SessionComparisonChart
            interviews={
              completed.length > 0
                ? completed
                : [
                    { id: 1, started_at: '2026-10-01', overall_score: 64 },
                    { id: 2, started_at: '2026-10-02', overall_score: 71 },
                    { id: 3, started_at: '2026-10-03', overall_score: 78 },
                    { id: 4, started_at: '2026-10-04', overall_score: 84 },
                  ]
            }
          />
        </div>
      </div>

      {/* Six Granular Score Cards */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4">Multimodal Performance Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {scoreCards.map((card, i) => (
            <ScoreCard key={i} card={card} />
          ))}
        </div>
      </div>

      {/* Recent Interviews List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Interview Sessions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any session to view the full multimodal report</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Loading sessions...</div>
        ) : interviews.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            <Video className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p>No interview sessions yet.</p>
            <Link
              to="/setup"
              className="inline-block mt-3 text-xs text-indigo-400 font-semibold hover:underline"
            >
              Start your first AI mock interview &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Track & Mode</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Overall Score</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {interviews.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 font-medium text-white capitalize">
                      {item.type} ({item.mode})
                    </td>
                    <td className="py-3.5 capitalize text-slate-400">{item.difficulty}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          item.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-white">
                      {item.overall_score ? `${Math.round(item.overall_score)} / 100` : 'Pending'}
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {new Date(item.started_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-right">
                      {item.status === 'completed' ? (
                        <Link
                          to={`/report/${item.id}`}
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          View Report <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <Link
                          to={`/interview/${item.id}`}
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                          Resume <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
