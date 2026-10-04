import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Interview, Question } from '../types';
import { useCamera } from '../hooks/useCamera';
import { useMicrophone } from '../hooks/useMicrophone';
import { useInterviewSocket } from '../hooks/useInterviewSocket';
import { CameraPreview } from '../components/CameraPreview';
import { InterviewQuestion } from '../components/InterviewQuestion';
import { LiveMetrics } from '../components/LiveMetrics';
import { FeedbackCard } from '../components/FeedbackCard';
import {
  Clock,
  Play,
  Square,
  ArrowRight,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const InterviewRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const interviewId = Number(id);
  const navigate = useNavigate();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [interviewElapsed, setInterviewElapsed] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedbackDialog, setFeedbackDialog] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Overall session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setInterviewElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MM:SS
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // 1. Hardware Hooks
  const {
    videoRef,
    status: camStatus,
    errorMessage: camError,
    startCamera,
    stopCamera,
    captureSampledFrame,
  } = useCamera();

  const {
    status: micStatus,
    errorMessage: micError,
    volume,
    transcript,
    speakingSpeed,
    fillerCount,
    duration: answerDuration,
    startMicrophone,
    stopMicrophone,
    setTranscript,
  } = useMicrophone();

  // 2. WebSocket Hook
  const {
    isConnected,
    connectionStatus,
    currentQuestion: wsQuestion,
    liveMetrics,
    coachingTip,
    lastQuestionFeedback,
    sendVideoFrame,
    sendAudioChunk,
    completeQuestion,
    requestCompleteInterview,
  } = useInterviewSocket({
    interviewId,
    onInterviewCompleted: () => {
      navigate(`/report/${interviewId}`);
    },
    onQuestionStarted: (newQ) => {
      setActiveQuestion(newQ);
      setIsEvaluating(false);
      setFeedbackDialog(null);
    },
  });

  // Load Interview data from backend API
  useEffect(() => {
    const loadInterview = async () => {
      try {
        const data = await ApiService.getInterview(interviewId);
        setInterview(data);
        if (data.questions && data.questions.length > 0) {
          setActiveQuestion(data.questions[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load interview session.');
      }
    };
    loadInterview();

    // Start video on entry
    startCamera();

    return () => {
      stopCamera();
      stopMicrophone();
    };
  }, [interviewId, startCamera, stopCamera, stopMicrophone]);

  // Synchronize WebSocket pushed question if available
  useEffect(() => {
    if (wsQuestion) {
      setActiveQuestion(wsQuestion);
      if (interview && interview.questions) {
        const idx = interview.questions.findIndex((q) => q.id === wsQuestion.id);
        if (idx !== -1) setCurrentQuestionIndex(idx);
      }
    }
  }, [wsQuestion, interview]);

  // Periodic frame sampling loop (sends 1 sampled JPEG frame every 1.5 seconds during answer)
  useEffect(() => {
    if (!isAnswering || camStatus !== 'active') return;

    const sampleInterval = setInterval(() => {
      const frameBase64 = captureSampledFrame();
      if (frameBase64) {
        sendVideoFrame(frameBase64, speakingSpeed);
      }
    }, 1500);

    return () => clearInterval(sampleInterval);
  }, [isAnswering, camStatus, captureSampledFrame, sendVideoFrame, speakingSpeed]);

  // Periodic audio telemetry chunk to WebSocket
  useEffect(() => {
    if (!isAnswering) return;

    const audioInterval = setInterval(() => {
      sendAudioChunk(volume, speakingSpeed, transcript);
    }, 1000);

    return () => clearInterval(audioInterval);
  }, [isAnswering, volume, speakingSpeed, transcript, sendAudioChunk]);

  // Handle Question Feedback Dialog
  useEffect(() => {
    if (lastQuestionFeedback) {
      setIsEvaluating(false);
      setFeedbackDialog(lastQuestionFeedback);
    }
  }, [lastQuestionFeedback]);

  // Start Candidate Answer
  const handleStartAnswer = async () => {
    setError(null);
    await startMicrophone();
    setIsAnswering(true);
  };

  // End Candidate Answer
  const handleEndAnswer = async () => {
    setIsAnswering(false);
    stopMicrophone();
    setIsEvaluating(true);

    if (activeQuestion) {
      const sent = completeQuestion(activeQuestion.id, transcript, answerDuration);

      const fallbackToRest = async () => {
        try {
          const resp = await ApiService.submitResponse({
            question_id: activeQuestion.id,
            transcript: transcript || 'Candidate completed spoken response.',
            duration: answerDuration || 20,
            speaking_speed: speakingSpeed || 140,
            pause_duration: 1.5,
            filler_count: fillerCount || 0,
            volume_score: volume || 75,
            vision: liveMetrics,
          });

          let evalData: any = {};
          if (resp.answer_evaluation?.feedback) {
            try {
              evalData = JSON.parse(resp.answer_evaluation.feedback);
            } catch {}
          }

          setFeedbackDialog({
            question_id: activeQuestion.id,
            overall_score: Math.round(resp.answer_evaluation?.overall_score || 75),
            strengths: evalData.strengths || ['Clear and structured communication'],
            weaknesses: evalData.weaknesses || ['Could expand with specific examples'],
            suggestions: evalData.suggestions || ['Structure your explanation with concrete metrics'],
            speech_metrics: {
              speaking_speed: resp.speaking_speed || 140,
              filler_count: resp.filler_count || 0,
              pause_duration: resp.pause_duration || 1.5,
            },
            vision_metrics: liveMetrics,
          });
          setIsEvaluating(false);
        } catch (err: any) {
          console.error('Evaluation fallback error:', err);
          setIsEvaluating(false);
          setError(err.message || 'Evaluation encountered an error. Please continue to next question.');
        }
      };

      if (!sent) {
        await fallbackToRest();
      } else {
        // Safety timeout: If WebSocket response does not arrive within 6 seconds, invoke fallback
        setTimeout(() => {
          setIsEvaluating((current) => {
            if (current) {
              fallbackToRest();
            }
            return current;
          });
        }, 6000);
      }
    }
  };


  // Advance to next question manually or proceed from feedback dialog
  const handleNextQuestion = () => {
    setFeedbackDialog(null);
    if (!interview || !interview.questions) return;

    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < interview.questions.length) {
      setCurrentQuestionIndex(nextIdx);
      setActiveQuestion(interview.questions[nextIdx]);
      setTranscript('');
    } else {
      // Complete entire interview
      requestCompleteInterview();
    }
  };

  const totalQuestions = interview?.questions?.length || 3;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-white">IntervuX</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase font-semibold">
            {interview?.type || 'Technical'} • {interview?.mode || 'Practice'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* WebSocket Connection Status */}
          <div className="flex items-center gap-1.5 text-xs">
            {isConnected ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Connected</span>
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reconnecting...</span>
              </span>
            )}
          </div>

          {/* Session Timer */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-sm text-slate-200">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTimer(interviewElapsed)}</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Error Banners */}
        {(error || camError || micError) && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error || camError || micError}</span>
          </div>
        )}

        {/* Practice Mode Live Coaching Tip Alert */}
        {interview?.mode === 'practice' && coachingTip && (
          <FeedbackCard tip={coachingTip} />
        )}

        {/* Webcam Preview Screen */}
        <div className="w-full">
          <CameraPreview
            videoRef={videoRef}
            status={camStatus}
            errorMessage={camError}
            metrics={liveMetrics}
            isRecording={isAnswering}
            onRetry={startCamera}
          />
        </div>

        {/* Current Question */}
        <InterviewQuestion
          question={activeQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />

        {/* Live Metrics Telemetry Bar */}
        <LiveMetrics
          isListening={isAnswering}
          speakingSpeed={speakingSpeed}
          volume={volume}
          fillerCount={fillerCount}
          visionMetrics={liveMetrics}
        />

        {/* Interim Spoken Transcript Preview */}
        {transcript && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-medium text-slate-300">Live Speech Transcript Preview:</span>
              <span>{answerDuration}s elapsed</span>
            </div>
            <p className="text-slate-200 font-mono italic leading-relaxed">
              "{transcript}"
            </p>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div className="text-xs text-slate-400">
            {isAnswering ? (
              <span className="flex items-center gap-2 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Active speech recording in progress... Press "End Answer" when finished.
              </span>
            ) : isEvaluating ? (
              <span className="flex items-center gap-2 text-indigo-400 font-medium">
                <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                Multimodal AI is evaluating your answer and signals...
              </span>
            ) : (
              <span>Ready. Press "Start Answer" when you are prepared to speak.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isAnswering ? (
              <button
                onClick={handleStartAnswer}
                disabled={isEvaluating}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Answer
              </button>
            ) : (
              <button
                onClick={handleEndAnswer}
                className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 animate-pulse"
              >
                <Square className="w-4 h-4 fill-white" />
                End Answer
              </button>
            )}

            {!isAnswering && !isEvaluating && currentQuestionIndex + 1 < totalQuestions && (
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                Skip Question
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Intermediate Question Evaluation Dialog */}
      {feedbackDialog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Question {currentQuestionIndex + 1} Evaluated
              </span>
              <span className="text-xl font-bold text-white">
                Score: {feedbackDialog.overall_score} / 100
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Multimodal Signal Feedback</h3>

            {/* Strengths */}
            {feedbackDialog.strengths && feedbackDialog.strengths.length > 0 && (
              <div className="mb-3">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Strengths</span>
                <ul className="mt-1 space-y-1 text-xs text-slate-300">
                  {feedbackDialog.strengths.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {feedbackDialog.suggestions && feedbackDialog.suggestions.length > 0 && (
              <div className="mb-6">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Recommendations</span>
                <ul className="mt-1 space-y-1 text-xs text-slate-300">
                  {feedbackDialog.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              {currentQuestionIndex + 1 < totalQuestions ? 'Next Question' : 'Complete Interview & View Report'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
