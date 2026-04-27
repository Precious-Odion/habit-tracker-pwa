function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getPreviousDate(date: string): string {
  const current = new Date(`${date}T00:00:00.000Z`);
  current.setUTCDate(current.getUTCDate() - 1);
  return current.toISOString().split('T')[0];
}

export function calculateCurrentStreak(
  completions: string[],
  today: string = getTodayDate()
): number {
  const completedDates = new Set(completions);

  if (!completedDates.has(today)) {
    return 0;
  }

  let streak = 0;
  let cursor = today;

  while (completedDates.has(cursor)) {
    streak += 1;
    cursor = getPreviousDate(cursor);
  }

  return streak;
}