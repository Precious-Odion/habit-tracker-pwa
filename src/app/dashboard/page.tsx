"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import HabitForm from "../../components/habits/HabitForm";
import HabitList from "../../components/habits/HabitList";
import ThemeToggle from "../../components/shared/ThemeToggle";
import { getCurrentSession, logout } from "../../lib/auth";
import { getHabits, saveHabits } from "../../lib/storage";
import { toggleHabitCompletion, type Habit } from "../../lib/habits";

type HabitWithExtras = Habit & { color?: string; emoji?: string };

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();

  const [habits, setHabits] = useState<HabitWithExtras[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithExtras | null>(
    null,
  );
  const [habitToDelete, setHabitToDelete] = useState<HabitWithExtras | null>(
    null,
  );
  const [formError, setFormError] = useState("");

  const session = getCurrentSession();
  const today = getTodayDate();

  const completedCount = habits.filter((h) =>
    h.completions.includes(today),
  ).length;

  useEffect(() => {
    if (!session) return;
    const allHabits = getHabits() as HabitWithExtras[];
    setHabits(allHabits.filter((h) => h.userId === session.userId));
  }, [session?.userId]);

  function persistUserHabits(updated: HabitWithExtras[]) {
    if (!session) return;
    const allHabits = getHabits() as HabitWithExtras[];
    const others = allHabits.filter((h) => h.userId !== session.userId);
    saveHabits([...others, ...updated]);
    setHabits(updated);
  }

  function handleSaveHabit(habitData: {
    name: string;
    description: string;
    frequency: "daily";
    color: string;
    emoji: string;
  }) {
    if (!session) return;

    const duplicate = habits.some(
      (h) =>
        h.name.toLowerCase() === habitData.name.toLowerCase() &&
        h.id !== editingHabit?.id,
    );

    if (duplicate) {
      setFormError("A habit with this name already exists");
      return;
    }

    setFormError("");

    if (editingHabit) {
      persistUserHabits(
        habits.map((h) =>
          h.id === editingHabit.id
            ? {
                ...h,
                name: habitData.name,
                description: habitData.description,
                frequency: "daily" as const,
                color: habitData.color,
                emoji: habitData.emoji,
              }
            : h,
        ),
      );
      setEditingHabit(null);
      setShowForm(false);
      return;
    }

    const newHabit: HabitWithExtras = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: habitData.name,
      description: habitData.description,
      frequency: "daily",
      createdAt: new Date().toISOString(),
      completions: [],
      color: habitData.color,
      emoji: habitData.emoji,
    };

    persistUserHabits([...habits, newHabit]);
    setShowForm(false);
  }

  function handleToggleComplete(habit: HabitWithExtras) {
    const updated = toggleHabitCompletion(habit, today) as HabitWithExtras;
    persistUserHabits(
      habits.map((h) =>
        h.id === habit.id
          ? { ...updated, color: habit.color, emoji: habit.emoji }
          : h,
      ),
    );
  }

  function handleEdit(habit: HabitWithExtras) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleDeleteRequest(habit: HabitWithExtras) {
    setHabitToDelete(habit);
  }

  function handleConfirmDelete() {
    if (!habitToDelete) return;
    persistUserHabits(habits.filter((h) => h.id !== habitToDelete.id));
    setHabitToDelete(null);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <ProtectedRoute>
      <main
        data-testid="dashboard-page"
        className="min-h-screen pb-12"
        style={{ background: "var(--bg-base)" }}
      >
        {/* Header */}
        <header
          className="relative overflow-hidden px-4 pt-10 pb-6"
          style={{ background: "var(--green-accent)" }}
        >
          {/* Decorative blobs */}
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full"
            style={{ background: "rgba(255,255,255,0.10)" }}
          />
          <div
            className="pointer-events-none absolute -left-6 -bottom-6 h-24 w-24 rounded-full"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />

          <div className="relative mx-auto max-w-xl">
            {/* Top row: app name + controls */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Habit Tracker
              </span>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  data-testid="auth-logout-button"
                  type="button"
                  onClick={handleLogout}
                  className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/40"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 2.75C2 1.784 2.784 1 3.75 1h4.5a.75.75 0 0 1 0 1.5h-4.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h4.5a.75.75 0 0 1 0 1.5h-4.5A1.75 1.75 0 0 1 2 13.25Zm9.47 4-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L11.47 9H6.75a.75.75 0 0 1 0-1.5Z"
                    />
                  </svg>
                  Log out
                </button>
              </div>
            </div>

            {/* Greeting */}
            <div>
              <h1 className="text-2xl font-extrabold text-white leading-tight">
                Stay consistent. 🌿
              </h1>
              <p
                className="mt-1 text-sm"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {formatDate(today)}
              </p>
            </div>

            {/* Progress pill */}
            {habits.length > 0 && (
              <div
                className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
                    <span>Today's progress</span>
                    <span>
                      {completedCount}/{habits.length}
                    </span>
                  </div>
                  <div
                    className="h-2 w-full rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.25)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width:
                          habits.length > 0
                            ? `${Math.round((completedCount / habits.length) * 100)}%`
                            : "0%",
                        background: "#fff",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="mx-auto max-w-xl px-4">
          {/* Toolbar */}
          <div className="mt-5 mb-4 flex items-center justify-between gap-3">
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Your habits
              </h2>
              {habits.length > 0 && (
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {habits.length - completedCount} pending · {completedCount}{" "}
                  done
                </p>
              )}
            </div>

            <button
              data-testid="create-habit-button"
              type="button"
              onClick={() => {
                setEditingHabit(null);
                setFormError("");
                setShowForm(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-green-300 active:scale-95"
              style={{ background: "var(--green-accent)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" />
              </svg>
              New Habit
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="mb-5">
              <HabitForm
                initialHabit={editingHabit}
                externalError={formError}
                onSave={handleSaveHabit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingHabit(null);
                  setFormError("");
                }}
              />
            </div>
          )}

          {/* List */}
          <HabitList
            habits={habits}
            today={today}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        </div>

        {/* Delete modal */}
        {habitToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
            style={{ background: "var(--modal-overlay)" }}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6 animate-fade-in"
              style={{
                background: "var(--bg-card)",
                border: "1.5px solid var(--border)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ background: "#fff1f2" }}
              >
                🗑️
              </div>
              <h2
                className="mt-3 text-base font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Delete habit?
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                "{habitToDelete.name}" will be removed permanently.
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setHabitToDelete(null)}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--bg-base)",
                    color: "var(--text-secondary)",
                    border: "1.5px solid var(--border)",
                  }}
                >
                  Keep it
                </button>

                <button
                  data-testid="confirm-delete-button"
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition focus:outline-none focus:ring-2"
                  style={{ background: "#e11d48" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
