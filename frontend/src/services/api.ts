import { AuthResponse, Interview, InterviewReportData, User } from '../types';

const BASE_URL = ''; // Uses Vite proxy to http://localhost:8000

export class ApiService {
  private static getToken(): string | null {
    return localStorage.getItem('intervux_token');
  }

  public static setToken(token: string): void {
    localStorage.setItem('intervux_token', token);
  }

  public static removeToken(): void {
    localStorage.removeItem('intervux_token');
    localStorage.removeItem('intervux_user');
  }

  public static getCurrentStoredUser(): User | null {
    const data = localStorage.getItem('intervux_user');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public static setStoredUser(user: User): void {
    localStorage.setItem('intervux_user', JSON.stringify(user));
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth Endpoints
  public static async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(data.access_token);
    this.setStoredUser(data.user);
    return data;
  }

  public static async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    this.setStoredUser(data.user);
    return data;
  }

  public static async getMe(): Promise<User> {
    const user = await this.request<User>('/api/auth/me');
    this.setStoredUser(user);
    return user;
  }

  // Interview Endpoints
  public static async getInterviews(): Promise<Interview[]> {
    return this.request<Interview[]>('/api/interviews');
  }

  public static async createInterview(
    type: 'technical' | 'hr',
    mode: 'practice' | 'simulation',
    difficulty: 'easy' | 'medium' | 'hard',
    question_count: number = 3
  ): Promise<Interview> {
    return this.request<Interview>('/api/interviews', {
      method: 'POST',
      body: JSON.stringify({ type, mode, difficulty, question_count }),
    });
  }

  public static async getInterview(id: number): Promise<Interview> {
    return this.request<Interview>(`/api/interviews/${id}`);
  }

  public static async completeInterview(id: number): Promise<Interview> {
    return this.request<Interview>(`/api/interviews/${id}/complete`, {
      method: 'POST',
    });
  }

  public static async deleteInterview(id: number): Promise<void> {
    return this.request<void>(`/api/interviews/${id}`, {
      method: 'DELETE',
    });
  }

  // Report Endpoints
  public static async getReport(interviewId: number): Promise<InterviewReportData> {
    return this.request<InterviewReportData>(`/api/reports/${interviewId}`);
  }

  // Submit Response (REST fallback)
  public static async submitResponse(data: {
    question_id: number;
    transcript: string;
    duration?: number;
    speaking_speed?: number;
    pause_duration?: number;
    filler_count?: number;
    volume_score?: number;
    vision?: any;
  }): Promise<any> {
    return this.request<any>('/api/responses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Question Bank
  public static async getQuestionBank(category?: string, difficulty?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    return this.request<any[]>(`/api/questions/bank?${params.toString()}`);
  }
}

