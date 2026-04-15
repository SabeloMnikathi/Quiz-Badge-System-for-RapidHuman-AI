/**
 * FILE: useQuizSession.ts
 * PURPOSE: Guards against multiple quiz attempts per browser session using sessionStorage.
 * WHY: Enforces the one-attempt-per-session rule without requiring server state.
 */

const SESSION_KEY = "quiz_attempt_id";
const USER_KEY = "quiz_user_id";

export function useQuizSession() {
  const getSession = () => {
    const attemptId = sessionStorage.getItem(SESSION_KEY);
    const userId = sessionStorage.getItem(USER_KEY);
    if (attemptId && userId) return { attemptId, userId };
    return null;
  };

  const saveSession = (attemptId: string, userId: string) => {
    sessionStorage.setItem(SESSION_KEY, attemptId);
    sessionStorage.setItem(USER_KEY, userId);
  };

  const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const hasSession = () => getSession() !== null;

  return { getSession, saveSession, clearSession, hasSession };
}
