import { getUsers, saveUsers, saveSession, clearSession } from './storage';

export function signup(email: string, password: string) {
  const users = getUsers();

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return { success: false, error: 'User already exists' };
  }

  const newUser = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);

  const session = {
    userId: newUser.id,
    email: newUser.email,
  };

  saveSession(session);

  return { success: true, user: newUser };
}

export function login(email: string, password: string) {
  const users = getUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const session = {
    userId: user.id,
    email: user.email,
  };

  saveSession(session);

  return { success: true, user };
}

export function logout() {
  clearSession();
}

export function getCurrentSession() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("habit-tracker-session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}