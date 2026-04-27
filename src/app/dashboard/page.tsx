"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import HabitForm from "../../components/habits/HabitForm";
import HabitList from "../../components/habits/HabitList";
import { getCurrentSession, logout } from "../../components/lib/auth";
import { getHabits, saveHabits } from "../../components/lib/storage";
import { toggleHabitCompletion, type Habit } from "../../components/lib/habits";

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export default function DashboardPage() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const [formError, setFormError] = useState("");

  const session = getCurrentSession();
  const today = getTodayDate();

  useEffect(() => {
    if (!session) return;

    const allHabits = getHabits() as Habit[];
    const userHabits = allHabits.filter(
      (habit) => habit.userId === session.userId,
    );

    setHabits(userHabits);
  }, [session?.userId]);

  function persistUserHabits(updatedUserHabits: Habit[]) {
    if (!session) return;

    const allHabits = getHabits() as Habit[];
    const otherUsersHabits = allHabits.filter(
      (habit) => habit.userId !== session.userId,
    );

    const updatedAllHabits = [...otherUsersHabits, ...updatedUserHabits];

    saveHabits(updatedAllHabits);
    setHabits(updatedUserHabits);
  }

  function handleSaveHabit(habitData: {
    name: string;
    description: string;
    frequency: "daily";
  }) {
    if (!session) return;

    const duplicateHabit = habits.some(
      (habit) =>
        habit.name.toLowerCase() === habitData.name.toLowerCase() &&
        habit.id !== editingHabit?.id,
    );

    if (duplicateHabit) {
      setFormError("A habit with this name already exists");
      return;
    }

    setFormError("");

    if (editingHabit) {
      const updatedHabits = habits.map((habit) =>
        habit.id === editingHabit.id
          ? {
              ...habit,
              name: habitData.name,
              description: habitData.description,
              frequency: "daily" as const,
            }
          : habit,
      );

      persistUserHabits(updatedHabits);
      setEditingHabit(null);
      setShowForm(false);
      return;
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: habitData.name,
      description: habitData.description,
      frequency: "daily",
      createdAt: new Date().toISOString(),
      completions: [],
    };

    persistUserHabits([...habits, newHabit]);
    setShowForm(false);
  }

  function handleToggleComplete(habit: Habit) {
    const updatedHabit = toggleHabitCompletion(habit, today);

    const updatedHabits = habits.map((item) =>
      item.id === habit.id ? updatedHabit : item,
    );

    persistUserHabits(updatedHabits);
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleDeleteRequest(habit: Habit) {
    setHabitToDelete(habit);
  }

  function handleConfirmDelete() {
    if (!habitToDelete) return;

    const updatedHabits = habits.filter(
      (habit) => habit.id !== habitToDelete.id,
    );

    persistUserHabits(updatedHabits);
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
        className="min-h-screen bg-gray-50 px-4 py-6"
      >
        <section className="mx-auto max-w-3xl">
          <header className="relative overflow-hidden rounded-3xl bg-linear-to-br from-green-600 to-green-500 p-6 text-white shadow-lg">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-100">
                  Habit Tracker
                </p>

                <h1 className="mt-1 text-3xl font-bold leading-tight">
                  Stay consistent.
                  <br />
                  Build better habits.
                </h1>

                <p className="mt-2 text-sm text-green-100">
                  Signed in as{" "}
                  <span className="font-semibold">{session?.email}</span>
                </p>
              </div>

              <button
                data-testid="auth-logout-button"
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                Log out
              </button>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          </header>

          <section className="mt-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Your habits
              </h2>
              <p className="text-sm text-gray-600">
                Complete daily habits and keep your streak alive.
              </p>
            </div>

            <button
              data-testid="create-habit-button"
              type="button"
              onClick={() => {
                setEditingHabit(null);
                setFormError("");
                setShowForm(true);
              }}
              className="rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              + Create
            </button>
          </section>

          <section className="mt-5">
            {showForm && (
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
            )}
          </section>

          <section className="mt-6">
            <HabitList
              habits={habits}
              today={today}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          </section>
        </section>

        {habitToDelete && (
          <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900">Delete habit?</h2>
              <p className="mt-2 text-sm text-gray-600">
                This will remove “{habitToDelete.name}” from your habit list.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setHabitToDelete(null)}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  data-testid="confirm-delete-button"
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}
