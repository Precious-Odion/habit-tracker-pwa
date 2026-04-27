import { describe, expect, it } from 'vitest';
import { toggleHabitCompletion, type Habit } from '../../src/components/lib/habits';

const baseHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: 'Drink enough water daily',
  frequency: 'daily',
  createdAt: '2026-04-25T00:00:00.000Z',
  completions: [],
};

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(baseHabit, '2026-04-25');

    expect(result.completions).toContain('2026-04-25');
  });

  it('removes a completion date when the date already exists', () => {
    const habit = {
      ...baseHabit,
      completions: ['2026-04-25'],
    };

    const result = toggleHabitCompletion(habit, '2026-04-25');

    expect(result.completions).not.toContain('2026-04-25');
  });

  it('does not mutate the original habit object', () => {
    const result = toggleHabitCompletion(baseHabit, '2026-04-25');

    expect(baseHabit.completions).toEqual([]);
    expect(result.completions).toEqual(['2026-04-25']);
  });

  it('does not return duplicate completion dates', () => {
    const habit = {
      ...baseHabit,
      completions: ['2026-04-25', '2026-04-25'],
    };

    const result = toggleHabitCompletion(habit, '2026-04-26');

    expect(result.completions).toEqual(['2026-04-25', '2026-04-26']);
  });
});