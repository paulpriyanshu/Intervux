export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Question {
  id: number;
  interview_id: number;
  question_text: string;
  category: string;
  difficulty: string;
  order_number: number;
  response?: ResponseData;
}

export interface VisionMetrics {
  id?: number;
  eye_contact: number;
  face_visibility: number;
  head_orientation: string;
  posture_score: number;
  gesture_score: number;
}

export interface AnswerEvaluation {
  id?: number;
  relevance: number;
  clarity: number;
  technical_depth: number;
  structure: number;
  grammar: number;
  confidence: number;
  overall_score: number;
  feedback: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
}

export interface ResponseData {
  id: number;
  question_id: number;
  transcript: string;
  duration: number;
  speaking_speed: number;
  pause_duration: number;
  filler_count: number;
  volume_score: number;
  vision_metrics?: VisionMetrics;
  answer_evaluation?: AnswerEvaluation;
}

export interface Recommendation {
  id: number;
  interview_id: number;
  category: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Interview {
  id: number;
  user_id: number;
  type: 'technical' | 'hr';
  mode: 'practice' | 'simulation';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'in_progress' | 'completed';
  started_at: string;
  ended_at?: string;
  overall_score?: number;
  communication_score?: number;
  technical_score?: number;
  body_language_score?: number;
  speech_score?: number;
  answer_quality_score?: number;
  questions?: Question[];
  recommendations?: Recommendation[];
}

export interface ScoreCardData {
  title: string;
  score: number;
  max_score: number;
  status: string;
  description: string;
}

export interface TimelinePoint {
  question_number: number;
  question_category: string;
  overall_score: number;
  eye_contact: number;
  speaking_speed: number;
  filler_count: number;
}

export interface InterviewReportData {
  interview: Interview;
  score_cards: ScoreCardData[];
  timeline: TimelinePoint[];
  radar_scores: Array<{ subject: string; A: number; fullMark: number }>;
  recommendations: Recommendation[];
  questions: Question[];
  ai_mode_badge: string;
}
