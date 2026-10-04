import React from 'react';
import { VisionMetrics } from '../types';
import { Mic, Volume2, Gauge, AlertTriangle, Eye, Activity } from 'lucide-react';

interface LiveMetricsProps {
  isListening: boolean;
  speakingSpeed: number; // WPM
  volume: number; // 0-100
  fillerCount: number;
  visionMetrics: VisionMetrics;
}

export const LiveMetrics: React.FC<LiveMetricsProps> = ({
  isListening,
  speakingSpeed,
  volume,
  fillerCount,
  visionMetrics,
}) => {
  // Speed color indicator
  const getSpeedStatus = (wpm: number) => {
    if (wpm === 0) return { label: 'Waiting for speech', color: 'text-slate-400' };
    if (wpm >= 130 && wpm <= 165) return { label: 'Optimal Pace', color: 'text-emerald-400' };
    if (wpm > 165) return { label: 'Speaking Fast', color: 'text-amber-400' };
    return { label: 'Deliberate / Slow', color: 'text-blue-400' };
  };

  const speedStatus = getSpeedStatus(speakingSpeed);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 1. Speech Listening & Volume */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-indigo-400" />
              Microphone
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className={`text-[11px] font-medium ${isListening ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isListening ? 'Listening' : 'Idle'}
              </span>
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Level
              </span>
              <span className="font-mono text-slate-300">{volume}%</span>
            </div>
            {/* Audio Volume Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${
                  volume > 80 ? 'bg-red-400' : volume > 20 ? 'bg-emerald-400' : 'bg-indigo-400'
                }`}
                style={{ width: `${Math.min(100, volume)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Speaking Speed (WPM) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              Speaking Speed
            </span>
            <span className={`text-[11px] font-medium ${speedStatus.color}`}>
              {speedStatus.label}
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-bold text-white tracking-tight">
              {speakingSpeed} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Target: 130 - 160 WPM</p>
          </div>
        </div>

        {/* 3. Eye Contact */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              Eye Contact
            </span>
            <span className="text-[11px] text-slate-400">{visionMetrics.head_orientation}</span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-bold tracking-tight text-white flex items-baseline gap-1">
              <span className={visionMetrics.eye_contact >= 70 ? 'text-emerald-400' : visionMetrics.eye_contact >= 50 ? 'text-amber-400' : 'text-red-400'}>
                {visionMetrics.eye_contact}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Focus on camera lens</p>
          </div>
        </div>

        {/* 4. Filler Words */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Filler Words
            </span>
            <span className={`text-[11px] font-medium ${fillerCount <= 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {fillerCount <= 2 ? 'Clean' : 'Noticeable'}
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-bold text-white tracking-tight">
              {fillerCount} <span className="text-xs font-normal text-slate-400">detected</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Pause silently instead of "um/like"</p>
          </div>
        </div>
      </div>
    </div>
  );
};
