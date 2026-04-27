"use client";

import { useState } from "react";
import { validateHabitName } from "../lib/validators";
import type { Habit } from "../lib/habits";

type HabitFormProps = {
  initialHabit?: Habit | null;
  onSave: (habitData: {
    name: string;
    description: string;
    frequency: "daily";
  }) => void;
  onCancel: () => void;
};

export default function HabitForm({
  initialHabit,
  onSave,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(initialHabit?.name ?? "");
  const [description, setDescription] = useState(
    initialHabit?.description ?? "",
  );
  const [error, setError] = useState("");

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
    });
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {initialHabit ? "Edit habit" : "Create habit"}
      </h2>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="habit-name"
            className="block text-sm font-medium text-gray-700"
          >
            Habit name
          </label>
          <input
            id="habit-name"
            data-testid="habit-name-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
            placeholder="Drink Water"
          />
        </div>

        <div>
          <label
            htmlFor="habit-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="habit-description"
            data-testid="habit-description-input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
          />
        </div>

        <div>
          <label
            htmlFor="habit-frequency"
            className="block text-sm font-medium text-gray-700"
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value="daily"
            disabled
            className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            data-testid="habit-save-button"
            type="submit"
            className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Save Habit
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
