export default function SplashScreen() {
  return (
    <main
      data-testid="splash-screen"
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-base)" }}
    >
      <section className="text-center">
        <div
          className="splash-icon mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl"
          style={{
            background: "var(--green-accent)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(22,163,74,0.35)",
          }}
        >
          ✓
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Habit Tracker
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Building better days, one habit at a time.
        </p>
        <div className="mt-8 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--green-accent)",
                opacity: i === 0 ? 1 : 0.35,
                animation: `splashPulse ${0.8 + i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
