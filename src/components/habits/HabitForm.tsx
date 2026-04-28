"use client";

import { useState } from "react";
import { validateHabitName } from "../../lib/validators";
import type { Habit } from "../../lib/habits";
import { HABIT_COLORS, DEFAULT_COLOR, getHabitEmoji } from "./HabitCard";

const EMOJI_OPTIONS = [
  "💧",
  "🙏",
  "📚",
  "💪",
  "🏃",
  "🚶",
  "🧘",
  "✍️",
  "🎓",
  "😴",
  "🍳",
  "🎵",
  "🤸",
  "💊",
  "🧹",
  "🌅",
  "🌿",
  "🧠",
  "🎯",
  "🛌",
  "🐾",
  "🌞",
  "🧴",
  "🏋️",
  "🚴",
  "🧪",
  "🖊️",
  "🗂️",
  "🌙",
  "✨",
];

type HabitFormProps = {
  initialHabit?: (Habit & { color?: string; emoji?: string }) | null;
  externalError?: string;
  onSave: (habitData: {
    name: string;
    description: string;
    frequency: "daily";
    color: string;
    emoji: string;
  }) => void;
  onCancel: () => void;
};

export default function HabitForm({
  initialHabit,
  externalError,
  onSave,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(initialHabit?.name ?? "");
  const [description, setDescription] = useState(
    initialHabit?.description ?? "",
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    initialHabit?.color ?? DEFAULT_COLOR,
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string>(
    initialHabit?.emoji ?? "",
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState("");

  const previewEmoji = selectedEmoji || getHabitEmoji(name) || "✨";
  const palette = HABIT_COLORS[selectedColor] ?? HABIT_COLORS[DEFAULT_COLOR];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateHabitName(name);
    if (!result.valid) {
      setError(result.error ?? "Invalid habit name");
      return;
    }
    onSave({
      name: result.value,
      description: description.trim(),
      frequency: "daily",
      color: selectedColor,
      emoji: selectedEmoji,
    });
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-card)",
        border: "1.5px solid var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Color accent bar */}
      <div style={{ height: "4px", background: palette.accent }} />

      <div className="p-5 space-y-5">
        <h2
          className="text-base font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {initialHabit ? "Edit habit" : "New habit"}
        </h2>

        {(error || externalError) && (
          <p
            className="rounded-lg px-3 py-2 text-sm"
            style={{ background: "#fff1f2", color: "#e11d48" }}
            aria-live="polite"
          >
            {error || externalError}
          </p>
        )}

        {/* Emoji + Name row */}
        <div>
          <label
            htmlFor="habit-name"
            className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Habit name
          </label>
          <div className="flex gap-2 items-center">
            {/* Emoji trigger */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker((v) => !v)}
              aria-label="Pick emoji"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl border transition focus:outline-none focus:ring-2"
              style={{
                background: palette.bg,
                borderColor: palette.accent + "44",
              }}
            >
              {previewEmoji}
            </button>
            <input
              id="habit-name"
              data-testid="habit-name-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition"
              style={{
                background: "var(--input-bg)",
                border: "1.5px solid var(--border)",
                color: "var(--text-primary)",
              }}
              placeholder="e.g. Drink water"
            />
          </div>

          {/* Emoji picker panel */}
          {showEmojiPicker && (
            <div
              className="mt-2 rounded-xl p-3"
              style={{
                background: "var(--bg-base)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Pick an emoji
              </p>
              <div className="emoji-scroll flex flex-wrap gap-1.5 overflow-x-auto">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      setSelectedEmoji(em);
                      setShowEmojiPicker(false);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition hover:scale-110 focus:outline-none focus:ring-2"
                    style={{
                      background:
                        selectedEmoji === em ? palette.bg : "var(--bg-card)",
                      border: `1.5px solid ${selectedEmoji === em ? palette.accent : "var(--border)"}`,
                    }}
                    aria-label={em}
                  >
                    {em}
                  </button>
                ))}
                {selectedEmoji && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEmoji("");
                      setShowEmojiPicker(false);
                    }}
                    className="flex h-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--bg-card)",
                      border: "1.5px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="habit-description"
            className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Description{" "}
            <span
              style={{
                color: "var(--text-muted)",
                textTransform: "none",
                fontWeight: 400,
              }}
            >
              (optional)
            </span>
          </label>
          <textarea
            id="habit-description"
            data-testid="habit-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition"
            style={{
              background: "var(--input-bg)",
              border: "1.5px solid var(--border)",
              color: "var(--text-primary)",
            }}
            placeholder="What does this habit involve?"
          />
        </div>

        {/* Color picker */}
        <div>
          <p
            className="text-xs font-semibold mb-2 uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Card color
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(HABIT_COLORS).map(([key, pal]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedColor(key)}
                aria-label={`Color: ${pal.label}`}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition focus:outline-none ${selectedColor === key ? "swatch-active" : ""}`}
                style={{
                  background: pal.accent,
                  borderColor:
                    selectedColor === key
                      ? "var(--text-primary)"
                      : "transparent",
                }}
              >
                {selectedColor === key && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency (hidden but required by spec) */}
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value="daily"
          disabled
          className="sr-only"
          aria-label="Frequency: Daily"
        >
          <option value="daily">Daily</option>
        </select>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button
            data-testid="habit-save-button"
            type="submit"
            className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition focus:outline-none focus:ring-2"
            style={{ background: "var(--green-accent)" }}
          >
            {initialHabit ? "Save changes" : "Add habit"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2"
            style={{
              background: "var(--bg-base)",
              color: "var(--text-secondary)",
              border: "1.5px solid var(--border)",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
