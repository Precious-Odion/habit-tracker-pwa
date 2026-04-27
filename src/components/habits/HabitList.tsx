"use client";

import HabitCard from "./HabitCard";
import type { Habit } from "../../types/habit";

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
  const completedHabits = habits.filter((habit) =>
    habit.completions.includes(today),
  );

  const pendingHabits = habits.filter(
    (habit) => !habit.completions.includes(today),
  );

  if (habits.length === 0) {
    return (
      <section
        data-testid="empty-state"
        className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-green-50 text-3xl">
          ✨
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-950">No habits yet</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Create your first habit and start building your streak today.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {pendingHabits.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-950">Pending today</h2>
              <p className="text-sm text-gray-500">
                {pendingHabits.length} habit
                {pendingHabits.length === 1 ? "" : "s"} left
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {completedHabits.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-green-700">Completed</h2>
              <p className="text-sm text-gray-500">
                {completedHabits.length} habit
                {completedHabits.length === 1 ? "" : "s"} done today
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {completedHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
