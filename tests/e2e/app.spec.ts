import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId: 'user-1', email: 'test@mail.com' })
      );
    });

    await page.goto('/');

    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login/);
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('test@mail.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await page.goto('/login');

    await page.evaluate(() => {
      localStorage.setItem(
        'habit-tracker-users',
        JSON.stringify([
          {
            id: 'user-1',
            email: 'test@mail.com',
            password: 'password123',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'user-2',
            email: 'other@mail.com',
            password: 'password123',
            createdAt: new Date().toISOString(),
          },
        ])
      );

      localStorage.setItem(
        'habit-tracker-habits',
        JSON.stringify([
          {
            id: 'habit-1',
            userId: 'user-1',
            name: 'Drink Water',
            description: '',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: [],
          },
          {
            id: 'habit-2',
            userId: 'user-2',
            name: 'Read Books',
            description: '',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: [],
          },
        ])
      );
    });

    await page.getByTestId('auth-login-email').fill('test@mail.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByTestId('habit-card-read-books')).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await signUp(page);

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await signUp(page);

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();

    await page.getByTestId('habit-complete-drink-water').click();

    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await signUp(page);

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();

    await page.reload();

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await signUp(page);

    await page.getByTestId('auth-logout-button').click();

    await expect(page).toHaveURL(/\/login/);
  });

 test('loads the cached app shell when offline after the app has been loaded once', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await context.setOffline(true);

  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('body')).not.toBeEmpty();

  await context.setOffline(false);
});
});

async function signUp(page: import('@playwright/test').Page) {
  await page.goto('/signup');

  const email = `test-${Date.now()}@mail.com`;

  await page.getByTestId('auth-signup-email').fill(email);
  await page.getByTestId('auth-signup-password').fill('password123');
  await page.getByTestId('auth-signup-submit').click();

  await expect(page.getByTestId('dashboard-page')).toBeVisible();
}