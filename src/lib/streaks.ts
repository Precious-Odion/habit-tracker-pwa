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
  const uniqueSortedCompletions = Array.from(new Set(completions)).sort();

  if (!uniqueSortedCompletions.includes(today)) {
    return 0;
  }

  const completedDates = new Set(uniqueSortedCompletions);

  let streak = 0;
  let currentDate = today;

  while (completedDates.has(currentDate)) {
    streak += 1;
    currentDate = getPreviousDate(currentDate);
  }

  return streak;
}