import React from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Mic,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multimodal AI Mock Interview Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Practice smarter. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Interview better.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Your real-time AI interview companion that simultaneously analyzes video posture, speech acoustics, and answer substance to elevate your performance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/setup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              Start Interview
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium border border-slate-800 transition-colors"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Quick Metrics Badge Banner */}
          <div className="mt-14 pt-8 border-t border-slate-800/60 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">4 Modes</p>
              <p className="text-xs text-slate-400 mt-0.5">Tech, HR, Practice, Sim</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3 Signals</p>
              <p className="text-xs text-slate-400 mt-0.5">Vision, Speech, Language</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Real-Time</p>
              <p className="text-xs text-slate-400 mt-0.5">WebSocket Streaming</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Actionable</p>
              <p className="text-xs text-slate-400 mt-0.5">Multimodal Coaching</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Workflow</h2>
            <h3 className="text-3xl font-bold text-white mt-2">How IntervuX Works</h3>
            <p className="text-slate-400 mt-3 text-sm">
              From the first question to the final analytics report in 4 seamless stages.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Select Track & Mode',
                desc: 'Choose between Technical or HR tracks, and toggle Practice mode with live coaching tips or full Simulation mode.',
                icon: Layers,
              },
              {
                step: '02',
                title: 'AI Delivers Question',
                desc: 'Dynamic question prompts spanning DSA, System Design, Operating Systems, or Behavioral STAR frameworks.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Real-Time Multimodal Capture',
                desc: 'OpenCV and MediaPipe track visual signals while Whisper and Web Audio analyze cadence, pauses, and filler words.',
                icon: Video,
              },
              {
                step: '04',
                title: 'Fusion Analytics & Coaching',
                desc: 'Our Multimodal Fusion Engine combines speech speed, eye contact, and answer depth into comprehensive coaching.',
                icon: BarChart3,
              },
            ].map((card, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative">
                <span className="text-xs font-mono font-bold text-indigo-400/80 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                  {card.step}
                </span>
                <card.icon className="w-8 h-8 text-indigo-400 mt-5 mb-3" />
                <h4 className="text-base font-semibold text-white">{card.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multimodal AI Capabilities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Core Architecture</h2>
            <h3 className="text-3xl font-bold text-white mt-2">Multimodal AI Fusion Pipeline</h3>
            <p className="text-slate-400 mt-3 text-sm">
              Observing real physical indicators without fabricating psychological deductions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Visual */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/20">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Computer Vision</h4>
              <p className="text-xs text-indigo-400 font-mono mt-1">OpenCV & MediaPipe</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Estimated Eye Contact percentage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Head orientation (Centered, Left, Right, Down)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Posture alignment and frame visibility
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Hand gesture and movement activity
                </li>
              </ul>
            </div>

            {/* Speech */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/20">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Speech & Vocalics</h4>
              <p className="text-xs text-purple-400 font-mono mt-1">Whisper & Audio Analysis</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Speaking speed (Words Per Minute)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Filler word detection ("um", "like", "you know")
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Pause duration and cadence pacing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Audio volume consistency
                </li>
              </ul>
            </div>

            {/* Language & Fusion */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/20">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Answer Evaluation & Fusion</h4>
              <p className="text-xs text-blue-400 font-mono mt-1">Structured LLM + Fusion Engine</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Relevance, technical depth, and structure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Weighted multimodal cross-signal scoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Contextual recommendations (e.g. pace vs depth)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Practice-mode real-time coaching tips
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to ace your upcoming interviews?</h2>
          <p className="text-slate-400 mt-3 text-sm">
            Launch an interactive mock session now with full computer vision, speech acoustics, and answer coaching.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/setup"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              Launch Interview Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
