import React from 'react';
import { Camera, CameraOff, AlertCircle, Eye, UserCheck } from 'lucide-react';
import { VisionMetrics } from '../types';
import { CameraStatus } from '../hooks/useCamera';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  errorMessage: string | null;
  metrics?: VisionMetrics;
  isRecording?: boolean;
  onRetry?: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  status,
  errorMessage,
  metrics,
  isRecording = false,
  onRetry,
}) => {
  return (
    <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transform -scale-x-100 ${
          status === 'active' ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
      />

      {/* Centering Face Framing Guide Overlay */}
      {status === 'active' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Subtle head framing outline */}
          <div className="w-56 h-72 border-2 border-indigo-400/20 rounded-[50%] transition-all duration-300 pointer-events-none" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRecording ? 'bg-red-400' : 'bg-emerald-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isRecording ? 'bg-red-500' : 'bg-emerald-500'}`} />
            </span>
            <span className="text-xs font-medium text-slate-300 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/50">
              {isRecording ? 'Analyzing Answer' : 'Camera Active'}
            </span>
          </div>

          {/* Real-time Vision Signal Badges on Video */}
          {metrics && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-200">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Eye Contact:</span>
                  <span className={`font-semibold ${metrics.eye_contact >= 70 ? 'text-emerald-400' : metrics.eye_contact >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {metrics.eye_contact}%
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-200">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Orientation:</span>
                  <span className="font-semibold text-slate-300">{metrics.head_orientation}</span>
                </div>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300">
                <span>Posture: </span>
                <span className={`font-semibold ${metrics.posture_score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {metrics.posture_score >= 80 ? 'Good' : 'Moderate'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Requesting State */}
      {status === 'requesting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 z-10">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-300">Connecting to webcam...</p>
          <p className="text-xs text-slate-500 mt-1">Please approve the browser camera permission request.</p>
        </div>
      )}

      {/* Permission Denied or Error State */}
      {(status === 'denied' || status === 'error') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 z-20">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-3 border border-red-500/20">
            <CameraOff className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-200 mb-1">Camera Access Required</h4>
          <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
            {errorMessage || 'Unable to access your camera. Please allow camera permissions in your browser and try again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Retry Access
            </button>
          )}
        </div>
      )}

      {/* Idle / Off State */}
      {status === 'idle' && (
        <div className="flex flex-col items-center justify-center text-slate-500 p-6 text-center">
          <Camera className="w-10 h-10 mb-2 opacity-50" />
          <p className="text-sm">Webcam preview is currently inactive</p>
        </div>
      )}
    </div>
  );
};
