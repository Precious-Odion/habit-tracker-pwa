import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import DashboardPage from "../../src/app/dashboard/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// clean DOM after each test
afterEach(() => cleanup());

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();

    // create fake logged-in user session
    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify({
        userId: "user-1",
        email: "test@mail.com",
      }),
    );

    // empty habits
    localStorage.setItem("habit-tracker-habits", JSON.stringify([]));
  });

  it("shows a validation error when habit name is empty", () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("create-habit-button"));

    fireEvent.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByText("Habit name is required")).toBeInTheDocument();
  });

  it("creates a new habit and renders it in the list", () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("create-habit-button"));

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink Water" },
    });

    fireEvent.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", () => {
    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "",
          frequency: "daily",
          createdAt: "2026-01-01",
          completions: [],
        },
      ]),
    );

    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("habit-edit-drink-water"));

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink More Water" },
    });

    fireEvent.click(screen.getByTestId("habit-save-button"));

    expect(
      screen.getByTestId("habit-card-drink-more-water"),
    ).toBeInTheDocument();
  });

  it("deletes a habit only after explicit confirmation", () => {
    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "",
          frequency: "daily",
          createdAt: "2026-01-01",
          completions: [],
        },
      ]),
    );

    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("habit-delete-drink-water"));

    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    expect(
      screen.queryByTestId("habit-card-drink-water"),
    ).not.toBeInTheDocument();
  });

  it("toggles completion and updates the streak display", () => {
    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "",
          frequency: "daily",
          createdAt: "2026-01-01",
          completions: [],
        },
      ]),
    );

    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("habit-complete-drink-water"));

    expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent(
      "1",
    );
  });
});
