/**
 * FILE: AdminQuestionForm.tsx
 * PURPOSE: Form for creating or editing a quiz question in the admin panel.
 * WHY: Isolates form state and validation from the AdminPage orchestration logic.
 */

import { useState } from "react";
import type { Question } from "../types/quiz.types";

interface AdminQuestionFormProps {
  initial?: Question;
  onSubmit: (data: Omit<Question, "id" | "created_at">) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const emptyForm = {
  text: "",
  options: ["", "", "", ""],
  correct_index: 0,
  order: 0,
};

export function AdminQuestionForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save Question",
}: AdminQuestionFormProps) {
  const [form, setForm] = useState({
    text: initial?.text ?? emptyForm.text,
    options: initial?.options ?? [...emptyForm.options],
    correct_index: initial?.correct_index ?? emptyForm.correct_index,
    order: initial?.order ?? emptyForm.order,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...form.options];
    updated[idx] = value;
    setForm((f) => ({ ...f, options: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim() || form.options.some((o) => !o.trim())) {
      setError("All fields are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save question.");
    } finally {
      setSaving(false);
    }
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows={3}
          value={form.text}
          onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          placeholder="Enter the question..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Answer Options</label>
        {form.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <input
              type="radio"
              name="correct"
              checked={form.correct_index === idx}
              onChange={() => setForm((f) => ({ ...f, correct_index: idx }))}
              className="accent-indigo-500"
            />
            <span className="text-sm font-semibold text-gray-500 w-5">{optionLabels[idx]}</span>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${optionLabels[idx]}`}
            />
          </div>
        ))}
        <p className="text-xs text-gray-400">Select the radio button next to the correct answer.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Order / Position</label>
        <input
          type="number"
          className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={form.order}
          min={0}
          onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value, 10) || 0 }))}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
