"use client";

import { calculateCurrentStreak } from "../lib/streaks";
import { getHabitSlug } from "../lib/slug";
import type { Habit } from "../lib/habits";

type HabitCardProps = {
  habit: Habit;
  today: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

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

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`rounded-3xl border p-5 shadow-sm ${
        isCompletedToday
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{habit.name}</h3>
          {habit.description && (
            <p className="mt-1 text-sm text-gray-600">{habit.description}</p>
          )}
          <p className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            Daily
          </p>
        </div>

        <span className="text-2xl">{isCompletedToday ? "✅" : "○"}</span>
      </div>

      <p
        data-testid={`habit-streak-${slug}`}
        className="mt-4 text-sm font-semibold text-gray-800"
      >
        Current streak: {streak} {streak === 1 ? "day" : "days"}
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <button
          data-testid={`habit-complete-${slug}`}
          type="button"
          onClick={() => onToggleComplete(habit)}
          className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          {isCompletedToday ? "Undo today" : "Complete today"}
        </button>

        <button
          data-testid={`habit-edit-${slug}`}
          type="button"
          onClick={() => onEdit(habit)}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Edit
        </button>

        <button
          data-testid={`habit-delete-${slug}`}
          type="button"
          onClick={() => onDelete(habit)}
          className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
