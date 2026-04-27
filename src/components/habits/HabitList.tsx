"use client";

import HabitCard from "./HabitCard";
import type { Habit } from "../lib/habits";

type HabitListProps = {
  habits: Habit[];
  today: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export default function HabitList({
  habits,
  today,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <section
        data-testid="empty-state"
        className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center"
      >
        <h2 className="text-lg font-semibold text-gray-900">No habits yet</h2>
        <p className="mt-2 text-sm text-gray-600">
          Create your first habit to start tracking your progress.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
