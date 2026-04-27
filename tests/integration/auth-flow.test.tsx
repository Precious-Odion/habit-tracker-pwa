import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "../../src/components/auth/LoginForm";
import SignupForm from "../../src/components/auth/SignupForm";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("submits the signup form and creates a session", () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") || "null",
    );

    expect(session).not.toBeNull();
    expect(session.email).toBe("test@mail.com");
  });

  it("shows an error for duplicate signup email", () => {
    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([
        {
          id: "1",
          email: "test@mail.com",
          password: "123456",
          createdAt: new Date().toISOString(),
        },
      ]),
    );

    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByText("User already exists")).toBeDefined();
  });

  it("submits the login form and stores the active session", () => {
    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([
        {
          id: "1",
          email: "test@mail.com",
          password: "123456",
          createdAt: new Date().toISOString(),
        },
      ]),
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByTestId("auth-login-submit"));

    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") || "null",
    );

    expect(session).not.toBeNull();
    expect(session.email).toBe("test@mail.com");
  });

  it("shows an error for invalid login credentials", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "wrong@mail.com" },
    });

    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByTestId("auth-login-submit"));

    expect(screen.getByText("Invalid email or password")).toBeDefined();
  });
});
