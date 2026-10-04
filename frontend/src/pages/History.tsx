import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Interview } from '../types';
import {
  History as HistoryIcon,
  Video,
  ExternalLink,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');

  useEffect(() => {
    if (!ApiService.getCurrentStoredUser() && !localStorage.getItem('intervux_token')) {
      navigate('/login');
      return;
    }

    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getInterviews();
        setInterviews(data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [navigate]);

  const filtered = interviews.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterMode !== 'all' && item.mode !== filterMode) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>SESSION ARCHIVE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Interview History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse all past mock interviews, review feedback, and track your readiness.
          </p>
        </div>

        <Link
          to="/setup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Video className="w-4 h-4" />
          New Interview
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4 text-xs">
        <span className="text-slate-400 flex items-center gap-1.5 font-medium">
          <Filter className="w-3.5 h-3.5" /> Filters:
        </span>

        <div className="flex items-center gap-2">
          <label className="text-slate-400">Track:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Tracks</option>
            <option value="technical">Technical</option>
            <option value="hr">HR & Behavioral</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400">Mode:</label>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Modes</option>
            <option value="practice">Practice Mode</option>
            <option value="simulation">Simulation Mode</option>
          </select>
        </div>

        <span className="text-slate-500 ml-auto font-mono">
          Showing {filtered.length} of {interviews.length} sessions
        </span>
      </div>

      {/* History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading interview archive...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <p>No matching interview records found.</p>
            <Link to="/setup" className="inline-block mt-3 text-xs text-indigo-400 font-semibold hover:underline">
              Start a new interview session &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 bg-slate-950/60 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6 font-semibold">Date & Time</th>
                  <th className="py-3 px-6 font-semibold">Track & Mode</th>
                  <th className="py-3 px-6 font-semibold">Difficulty</th>
                  <th className="py-3 px-6 font-semibold">Overall</th>
                  <th className="py-3 px-6 font-semibold">Communication</th>
                  <th className="py-3 px-6 font-semibold">Technical</th>
                  <th className="py-3 px-6 font-semibold">Body Language</th>
                  <th className="py-3 px-6 font-semibold text-right">Detailed Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 text-slate-400">
                      <div className="flex items-center gap-1.5 text-white font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {new Date(item.started_at).toLocaleDateString()}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(item.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-4 px-6 capitalize">
                      <span className="font-semibold text-white">{item.type}</span>
                      <span className="text-slate-500 text-[11px] block">{item.mode}</span>
                    </td>
                    <td className="py-4 px-6 capitalize">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium text-[11px]">
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-base text-white">
                      {item.overall_score ? Math.round(item.overall_score) : '—'}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-300">
                      {item.communication_score ? Math.round(item.communication_score) : '—'}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-300">
                      {item.technical_score ? Math.round(item.technical_score) : '—'}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-300">
                      {item.body_language_score ? Math.round(item.body_language_score) : '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {item.status === 'completed' ? (
                        <Link
                          to={`/report/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/25 font-semibold transition-colors"
                        >
                          View Report <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <Link
                          to={`/interview/${item.id}`}
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
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
