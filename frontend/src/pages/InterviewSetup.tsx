import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { useCamera } from '../hooks/useCamera';
import { useMicrophone } from '../hooks/useMicrophone';
import {
  Code2,
  Users,
  Lightbulb,
  ShieldCheck,
  Zap,
  ArrowRight,
  Camera,
  Mic,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();

  const [type, setType] = useState<'technical' | 'hr'>('technical');
  const [mode, setMode] = useState<'practice' | 'simulation'>('practice');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-flight hardware test
  const { videoRef, status: camStatus, startCamera, stopCamera } = useCamera();
  const { status: micStatus, volume: micVolume, startMicrophone, stopMicrophone } = useMicrophone();

  useEffect(() => {
    // Automatically initialize camera and microphone for device pre-check
    startCamera();
    startMicrophone();

    return () => {
      stopCamera();
      stopMicrophone();
    };
  }, [startCamera, startMicrophone, stopCamera, stopMicrophone]);

  const handleStart = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Ensure user is logged in or create guest demo account seamlessly
      if (!ApiService.getCurrentStoredUser() && !localStorage.getItem('intervux_token')) {
        await ApiService.login('candidate@intervux.ai', 'DemoPass123!').catch(async () => {
          await ApiService.register('Guest Candidate', `guest_${Date.now()}@intervux.ai`, 'GuestPass123!');
        });
      }

      const interview = await ApiService.createInterview(type, mode, difficulty, questionCount);
      navigate(`/interview/${interview.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize mock interview. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SESSION CONFIGURATION</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Configure Your Mock Interview</h1>
        <p className="text-sm text-slate-400 mt-2">
          Customize your interview domain, coaching feedback level, and verify audiovisual devices.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Setup Options */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Track Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              1. Select Interview Track
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('technical')}
                className={`p-4 rounded-xl text-left border transition-all ${
                  type === 'technical'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Code2 className={`w-6 h-6 mb-2 ${type === 'technical' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <h4 className="font-semibold text-base text-white">Technical Interview</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  DSA, Operating Systems, DBMS, Networks, OOP, System Design.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setType('hr')}
                className={`p-4 rounded-xl text-left border transition-all ${
                  type === 'hr'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Users className={`w-6 h-6 mb-2 ${type === 'hr' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <h4 className="font-semibold text-base text-white">HR & Behavioral</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Leadership, Conflict resolution, Teamwork, Strengths, Failure.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Mode Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              2. Select Feedback Mode
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`p-4 rounded-xl text-left border transition-all ${
                  mode === 'practice'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Lightbulb className={`w-6 h-6 mb-2 ${mode === 'practice' ? 'text-amber-400' : 'text-slate-500'}`} />
                <h4 className="font-semibold text-base text-white">Practice Mode</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Real-time coaching alerts pop up during your answers for pacing and eye contact.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('simulation')}
                className={`p-4 rounded-xl text-left border transition-all ${
                  mode === 'simulation'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ShieldCheck className={`w-6 h-6 mb-2 ${mode === 'simulation' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <h4 className="font-semibold text-base text-white">Simulation Mode</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Strict exam environment. No live coaching interruptions; full report at completion.
                </p>
              </button>
            </div>
          </div>

          {/* 3. Difficulty & Length */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              3. Difficulty & Duration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Target Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        difficulty === diff
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Question Count</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        questionCount === count
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Device Pre-Check & Action */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Pre-Flight Device Check
              </h3>

              {/* Webcam Test Container */}
              <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative mb-4 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform -scale-x-100 ${
                    camStatus === 'active' ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {camStatus !== 'active' && (
                  <div className="text-center p-4">
                    <Camera className="w-8 h-8 text-slate-600 mx-auto mb-1.5" />
                    <p className="text-xs text-slate-400">
                      {camStatus === 'requesting' ? 'Requesting Camera...' : 'Camera Inactive'}
                    </p>
                  </div>
                )}
                {camStatus === 'active' && (
                  <span className="absolute bottom-2 right-2 text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Video Ready
                  </span>
                )}
              </div>

              {/* Microphone Volume Bar Test */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-6">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-indigo-400" /> Mic Input Level
                  </span>
                  <span className="font-mono text-slate-300">{micVolume}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-75"
                    style={{ width: `${Math.min(100, micVolume)}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Launch Interview Room
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
