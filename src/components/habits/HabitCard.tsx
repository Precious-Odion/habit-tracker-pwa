"use client";

import { calculateCurrentStreak } from "../../lib/streaks";
import { getHabitSlug } from "../../lib/slug";
import type { Habit } from "../../types/habit";

type HabitCardProps = {
  habit: Habit;
  today: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

function getHabitEmoji(name: string): string {
  const value = name.toLowerCase();

  if (value.includes("water")) return "💧";
  if (value.includes("pray") || value.includes("bible")) return "🙏";
  if (value.includes("read") || value.includes("book")) return "📚";
  if (
    value.includes("workout") ||
    value.includes("exercise") ||
    value.includes("gym")
  )
    return "💪";
  if (value.includes("run") || value.includes("walk")) return "🏃";
  if (value.includes("meditate")) return "🧘";
  if (value.includes("journal") || value.includes("write")) return "✍️";
  if (value.includes("study") || value.includes("learn")) return "🎓";
  if (value.includes("sleep")) return "😴";

  return "✨";
}

export default function HabitCard({
  habit,
  today,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);
  const emoji = getHabitEmoji(habit.name);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm transition-all ${
        isCompletedToday
          ? "border-green-200 bg-green-50 shadow-green-100"
          : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-2 ${
          isCompletedToday ? "bg-green-500" : "bg-gray-200"
        }`}
      />

      <div className="flex items-start gap-4 pl-2">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${
            isCompletedToday ? "bg-white shadow-sm" : "bg-gray-100"
          }`}
        >
          {emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-gray-950">{habit.name}</h3>

              {habit.description && (
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {habit.description}
                </p>
              )}
            </div>

            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${
                isCompletedToday
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-200 bg-white text-gray-300"
              }`}
              aria-label={
                isCompletedToday ? "Completed today" : "Not completed today"
              }
            >
              {isCompletedToday ? "✓" : ""}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              Daily
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isCompletedToday
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {isCompletedToday ? "Completed today" : "Pending today"}
            </span>
          </div>

          <p
            data-testid={`habit-streak-${slug}`}
            className="mt-4 text-sm font-bold text-gray-900"
          >
            Current streak: {streak} {streak === 1 ? "day" : "days"}
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <button
              data-testid={`habit-complete-${slug}`}
              type="button"
              onClick={() => onToggleComplete(habit)}
              className={`rounded-2xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 ${
                isCompletedToday
                  ? "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-300"
                  : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300"
              }`}
            >
              {isCompletedToday ? "Undo today" : "Complete today"}
            </button>

            <button
              data-testid={`habit-edit-${slug}`}
              type="button"
              onClick={() => onEdit(habit)}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Edit
            </button>

            <button
              data-testid={`habit-delete-${slug}`}
              type="button"
              onClick={() => onDelete(habit)}
              className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
