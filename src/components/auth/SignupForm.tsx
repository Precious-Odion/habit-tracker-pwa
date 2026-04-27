"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../lib/auth";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    const emailValue = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError("Please enter a valid email address");
      return;
    }

    const result = signup(emailValue, password);

    if (!result.success) {
      setError(result.error ?? "User already exists");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Start tracking your daily habits.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-600" aria-live="polite">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="signup-email"
              data-testid="auth-signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="signup-password"
              data-testid="auth-signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
          </div>

          <button
            data-testid="auth-signup-submit"
            type="submit"
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Sign up
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            className="font-semibold text-green-700 hover:underline"
            href="/login"
          >
            Log in
          </a>
        </p>
      </section>
    </main>
  );
}
