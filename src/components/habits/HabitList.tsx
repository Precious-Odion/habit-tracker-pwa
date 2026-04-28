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

function SectionHeader({
  title,
  count,
  done,
}: {
  title: string;
  count: number;
  done?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        className="text-sm font-bold uppercase tracking-wide"
        style={{
          color: done ? "var(--green-accent)" : "var(--text-secondary)",
        }}
      >
        {title}
      </span>
      <span
        className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold"
        style={{
          background: done ? "var(--green-light)" : "var(--bg-base)",
          color: done ? "var(--green-accent)" : "var(--text-muted)",
          border: "1px solid var(--border)",
        }}
      >
        {count}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

export default function HabitList({
  habits,
  today,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitListProps) {
  const pendingHabits = habits.filter((h) => !h.completions.includes(today));
  const completedHabits = habits.filter((h) => h.completions.includes(today));

  if (habits.length === 0) {
    return (
      <section
        data-testid="empty-state"
        className="rounded-2xl border border-dashed p-10 text-center"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
        }}
      >
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{ background: "var(--green-light)" }}
        >
          🌱
        </div>
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          No habits yet
        </h2>
        <p
          className="mt-1.5 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Tap <strong>+ New Habit</strong> above to start building your streak.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {pendingHabits.length > 0 && (
        <section>
          <SectionHeader title="Pending" count={pendingHabits.length} />
          <div className="space-y-3">
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
          <SectionHeader
            title="Completed"
            count={completedHabits.length}
            done
          />
          <div className="space-y-3">
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
    </div>
  );
}
