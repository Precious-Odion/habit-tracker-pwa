export default function SplashScreen() {
  return (
    <main
      data-testid="splash-screen"
      className="min-h-screen flex items-center justify-center bg-green-50 px-4"
    >
      <section className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-3xl text-white">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
        <p className="mt-2 text-sm text-gray-600">
          Building better days, one habit at a time.
        </p>
      </section>
    </main>
  );
}
