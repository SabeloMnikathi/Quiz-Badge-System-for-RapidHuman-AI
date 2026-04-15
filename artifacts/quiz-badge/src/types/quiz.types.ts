/**
 * FILE: quiz.types.ts
 * PURPOSE: All shared TypeScript interfaces used across the quiz system.
 * WHY: Centralizing types ensures a single source of truth and prevents `any` usage.
 */

export interface Question {
  id: string;
  text: string;
  options: string[];
  correct_index: number;
  order: number;
  created_at: string;
}

export interface Answer {
  question_id: string;
  selected_index: number | null;
  time_taken: number;
}

export interface Attempt {
  id: string;
  user_id: string;
  answers: Answer[];
  started_at: string;
  completed_at: string | null;
  passed: boolean | null;
  badge_url: string | null;
}

export interface Badge {
  id: string;
  user_id: string;
  attempt_id: string;
  awarded_at: string;
  image_url: string | null;
}

export interface GradeResult {
  passed: boolean;
  correct_count: number;
  total: number;
}

export interface QuizSession {
  attemptId: string;
  userId: string;
}
