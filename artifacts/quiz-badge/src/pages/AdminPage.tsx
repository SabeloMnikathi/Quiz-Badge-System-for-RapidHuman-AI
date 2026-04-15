/**
 * FILE: AdminPage.tsx
 * PURPOSE: Password-gated admin dashboard for creating, editing, and deleting quiz questions.
 * WHY: Provides a secure UI for content management without a full auth system.
 */

import { useState } from "react";
import { useQuestions } from "../hooks/useQuestions";
import { AdminQuestionForm } from "../components/AdminQuestionForm";
import { createQuestion, updateQuestion, deleteQuestion } from "../services/questionsService";
import type { Question } from "../types/quiz.types";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Access</h1>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Enter admin password"
          autoFocus
        />
        {error && <p className="text-sm text-red-500 mb-3">Incorrect password.</p>}
        <button
          type="submit"
          className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 transition-colors"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}

export function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const { questions, loading, error, reload } = useQuestions();

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  const handleCreate = async (data: Omit<Question, "id" | "created_at">) => {
    await createQuestion(data);
    setShowNewForm(false);
    reload();
  };

  const handleUpdate = async (data: Omit<Question, "id" | "created_at">) => {
    if (!editingQuestion) return;
    await updateQuestion(editingQuestion.id, data);
    setEditingQuestion(null);
    reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    await deleteQuestion(id);
    reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin — Questions</h1>
          <button
            onClick={() => { setShowNewForm(true); setEditingQuestion(null); }}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Question
          </button>
        </div>

        {showNewForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Question</h2>
            <AdminQuestionForm
              onSubmit={handleCreate}
              onCancel={() => setShowNewForm(false)}
              submitLabel="Create Question"
            />
          </div>
        )}

        {loading && <p className="text-gray-500 text-sm">Loading questions...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {editingQuestion?.id === q.id ? (
                <>
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Edit Question</h2>
                  <AdminQuestionForm
                    initial={q}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingQuestion(null)}
                    submitLabel="Update Question"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">Order {q.order}</span>
                      <p className="text-gray-900 font-medium mt-1">{q.text}</p>
                      <ul className="mt-2 space-y-1">
                        {q.options.map((opt, idx) => (
                          <li key={idx} className={`text-sm ${idx === q.correct_index ? "text-green-600 font-semibold" : "text-gray-500"}`}>
                            {["A", "B", "C", "D"][idx]}. {opt}
                            {idx === q.correct_index && " ✓"}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setEditingQuestion(q); setShowNewForm(false); }}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          {!loading && questions.length === 0 && !showNewForm && (
            <p className="text-center text-gray-400 py-12 text-sm">No questions yet. Add your first one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
