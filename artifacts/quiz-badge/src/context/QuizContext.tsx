/**
 * FILE: QuizContext.tsx
 * PURPOSE: Global quiz state — questions, answers, current index, and session info.
 * WHY: Using React Context + useReducer provides predictable state transitions without extra deps.
 */

import React, { createContext, useContext, useReducer } from "react";
import type { Question, Answer, GradeResult } from "../types/quiz.types";

interface QuizState {
  questions: Question[];
  answers: Answer[];
  currentIndex: number;
  started: boolean;
  completed: boolean;
  gradeResult: GradeResult | null;
  attemptId: string | null;
  userId: string | null;
}

type QuizAction =
  | { type: "SET_QUESTIONS"; payload: Question[] }
  | { type: "START_QUIZ"; payload: { attemptId: string; userId: string } }
  | { type: "RECORD_ANSWER"; payload: Answer }
  | { type: "NEXT_QUESTION" }
  | { type: "COMPLETE_QUIZ"; payload: GradeResult }
  | { type: "RESET" };

const initialState: QuizState = {
  questions: [],
  answers: [],
  currentIndex: 0,
  started: false,
  completed: false,
  gradeResult: null,
  attemptId: null,
  userId: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };
    case "START_QUIZ":
      return {
        ...state,
        started: true,
        attemptId: action.payload.attemptId,
        userId: action.payload.userId,
        answers: [],
        currentIndex: 0,
        completed: false,
        gradeResult: null,
      };
    case "RECORD_ANSWER":
      return { ...state, answers: [...state.answers, action.payload] };
    case "NEXT_QUESTION":
      return { ...state, currentIndex: state.currentIndex + 1 };
    case "COMPLETE_QUIZ":
      return { ...state, completed: true, gradeResult: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface QuizContextValue {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}
