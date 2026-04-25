import { STORAGE_KEYS } from './constants';

export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(key);
}

export function getUsers() {
  return getItem<any[]>(STORAGE_KEYS.USERS) ?? [];
}

export function saveUsers(users: any[]) {
  setItem(STORAGE_KEYS.USERS, users);
}

export function getHabits() {
  return getItem<any[]>(STORAGE_KEYS.HABITS) ?? [];
}

export function saveHabits(habits: any[]) {
  setItem(STORAGE_KEYS.HABITS, habits);
}

export function getSession() {
  return getItem<any>(STORAGE_KEYS.SESSION);
}

export function saveSession(session: any) {
  setItem(STORAGE_KEYS.SESSION, session);
}

export function clearSession() {
  removeItem(STORAGE_KEYS.SESSION);
}