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

export const HABIT_COLORS: Record<
  string,
  { bg: string; darkBg: string; accent: string; label: string }
> = {
  sky: { bg: "#dbeafe", darkBg: "#1e3a5f", accent: "#3b82f6", label: "Sky" },
  rose: { bg: "#ffe4e6", darkBg: "#4c1d28", accent: "#f43f5e", label: "Rose" },
  amber: {
    bg: "#fef3c7",
    darkBg: "#3d2a0a",
    accent: "#f59e0b",
    label: "Amber",
  },
  violet: {
    bg: "#ede9fe",
    darkBg: "#2e1a5c",
    accent: "#7c3aed",
    label: "Violet",
  },
  teal: { bg: "#ccfbf1", darkBg: "#0d3330", accent: "#0d9488", label: "Teal" },
  green: {
    bg: "#dcfce7",
    darkBg: "#14341f",
    accent: "#16a34a",
    label: "Green",
  },
  orange: {
    bg: "#ffedd5",
    darkBg: "#3d1a05",
    accent: "#ea580c",
    label: "Orange",
  },
  pink: { bg: "#fce7f3", darkBg: "#3b0f2a", accent: "#db2777", label: "Pink" },
};

export const DEFAULT_COLOR = "green";

export function getHabitEmoji(name: string): string {
  const v = name.toLowerCase();
  if (v.includes("water") || v.includes("drink")) return "💧";
  if (v.includes("pray") || v.includes("bible") || v.includes("church"))
    return "🙏";
  if (v.includes("read") || v.includes("book")) return "📚";
  if (v.includes("workout") || v.includes("exercise") || v.includes("gym"))
    return "💪";
  if (v.includes("run")) return "🏃";
  if (v.includes("walk")) return "🚶";
  if (v.includes("meditat")) return "🧘";
  if (v.includes("journal") || v.includes("write") || v.includes("gratitude"))
    return "✍️";
  if (
    v.includes("study") ||
    v.includes("learn") ||
    v.includes("spanish") ||
    v.includes("language")
  )
    return "🎓";
  if (v.includes("sleep")) return "😴";
  if (v.includes("cook") || v.includes("meal")) return "🍳";
  if (v.includes("music") || v.includes("guitar") || v.includes("piano"))
    return "🎵";
  if (v.includes("stretch") || v.includes("yoga")) return "🤸";
  if (v.includes("vitamin") || v.includes("supplement")) return "💊";
  if (v.includes("clean") || v.includes("vacuum")) return "🧹";
  if (v.includes("morning")) return "🌅";
  return "✨";
}

function isDarkMode(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined")
    return false;
  return document.documentElement.getAttribute("data-theme") === "dark";
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

  const colorKey = (habit as Habit & { color?: string }).color ?? DEFAULT_COLOR;
  const customEmoji = (habit as Habit & { emoji?: string }).emoji;
  const emoji = customEmoji ?? getHabitEmoji(habit.name);

  const palette = HABIT_COLORS[colorKey] ?? HABIT_COLORS[DEFAULT_COLOR];

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className="habit-card animate-fade-in rounded-2xl overflow-hidden"
      style={{
        background: `var(--bg-card)`,
        border: `1.5px solid var(--border)`,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          background: isCompletedToday ? `var(--green-accent)` : palette.accent,
          height: "5px",
        }}
      />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl select-none"
            style={{
              background: palette.bg,
              border: `1.5px solid ${palette.accent}22`,
            }}
          >
            {isCompletedToday ? "✅" : emoji}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3
                  className="font-bold leading-tight truncate"
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                    textDecoration: isCompletedToday ? "line-through" : "none",
                    opacity: isCompletedToday ? 0.6 : 1,
                  }}
                >
                  {habit.name}
                </h3>
                {habit.description && (
                  <p
                    className="mt-0.5 text-xs leading-5 truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {habit.description}
                  </p>
                )}
              </div>

              <button
                data-testid={`habit-complete-${slug}`}
                type="button"
                onClick={() => onToggleComplete(habit)}
                aria-label={
                  isCompletedToday ? "Mark incomplete" : "Mark complete"
                }
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  borderColor: isCompletedToday
                    ? "var(--green-accent)"
                    : "var(--border)",
                  background: isCompletedToday
                    ? "var(--green-accent)"
                    : "transparent",
                  color: "#fff",
                }}
              >
                {isCompletedToday && (
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{
                  background: palette.bg,
                  color: palette.accent,
                }}
              >
                Daily
              </span>

              {streak > 0 && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{
                    background: "var(--green-light)",
                    color: "var(--green-accent)",
                  }}
                >
                  🔥
                  <span data-testid={`habit-streak-${slug}`}>
                    {streak} day{streak !== 1 ? "s" : ""}
                  </span>
                </span>
              )}

              {streak === 0 && (
                <span
                  data-testid={`habit-streak-${slug}`}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    background: "var(--bg-base)",
                    color: "var(--text-muted)",
                  }}
                >
                  No streak
                </span>
              )}

              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{
                  background: isCompletedToday
                    ? "var(--green-light)"
                    : "#fff3cd",
                  color: isCompletedToday ? "var(--green-accent)" : "#92650a",
                }}
              >
                {isCompletedToday ? "Done" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            data-testid={`habit-edit-${slug}`}
            type="button"
            onClick={() => onEdit(habit)}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2"
            style={{
              background: "var(--bg-base)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354z" />
            </svg>
            Edit
          </button>

          <button
            data-testid={`habit-delete-${slug}`}
            type="button"
            onClick={() => onDelete(habit)}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2"
            style={{
              background: "#fff1f2",
              color: "#e11d48",
              border: "1px solid #fecdd3",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z" />
            </svg>
            Delete
          </button>

          <div className="flex-1" />

          <button
            data-testid={`habit-complete-${slug}-btn`}
            type="button"
            onClick={() => onToggleComplete(habit)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2"
            style={{
              background: isCompletedToday
                ? "var(--green-light)"
                : "var(--green-accent)",
              color: isCompletedToday ? "var(--green-accent)" : "#fff",
              border: isCompletedToday
                ? "1px solid var(--green-mid)"
                : "1px solid transparent",
            }}
          >
            {isCompletedToday ? "Undo" : "Complete"}
          </button>
        </div>
      </div>
    </article>
  );
}
