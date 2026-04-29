"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login(email.trim(), password);
    if (!result.success) {
      setError(result.error ?? "Invalid email or password");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white"
            style={{
              background: "var(--green-accent)",
              boxShadow: "0 6px 24px rgba(22,163,74,0.3)",
            }}
          >
            ✓
          </div>
          <h1
            className="text-2xl font-extrabold"
            style={{ color: "var(--text-primary)" }}
          >
            Welcome back
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Log in to continue your habits.
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {error && (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-sm font-medium"
              style={{ background: "#fff1f2", color: "#e11d48" }}
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <input
                id="login-email"
                data-testid="auth-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition"
                style={{
                  background: "var(--input-bg)",
                  border: "1.5px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  data-testid="auth-login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 pr-11 text-sm outline-none transition"
                  style={{
                    background: "var(--input-bg)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.477 10.477A3 3 0 0012 15a3 3 0 002.523-4.523"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.712 6.712C4.68 8.09 3.24 9.97 2.458 12c1.274 4.057 5.064 7 9.542 7 1.61 0 3.13-.33 4.5-.91M17.288 17.288C19.32 15.91 20.76 14.03 21.542 12c-1.274-4.057-5.064-7-9.542-7-1.61 0-3.13.33-4.5.91"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              data-testid="auth-login-submit"
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-green-300 active:scale-95"
              style={{ background: "var(--green-accent)" }}
            >
              Log in
            </button>
          </form>

          <p
            className="mt-5 text-center text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-semibold hover:underline"
              style={{ color: "var(--green-accent)" }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
