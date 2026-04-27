# Habit Tracker PWA

## 📌 Project Overview

This project is a **mobile-first Habit Tracker Progressive Web App (PWA)** built as a direct implementation of a strict technical specification. The goal is not product exploration, but **accurate translation of requirements into deterministic, testable software**.

The application allows users to:

- Sign up and log in locally
- Create, edit, and delete habits
- Mark habits as completed for the current day
- Track current streaks based on consecutive completions
- Persist data across sessions using localStorage
- Install the app as a PWA
- Use the app offline after initial load without crashes

The implementation strictly follows the provided technical document and is validated through **unit, integration, and end-to-end tests**.

---

## ⚙️ Tech Stack

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **localStorage (persistence layer)**
- **Vitest (unit testing)**
- **React Testing Library (integration testing)**
- **Playwright (end-to-end testing)**

---

## 📁 Project Structure

```
src/
  app/
    globals.css
    layout.tsx
    page.tsx
    login/page.tsx
    signup/page.tsx
    dashboard/page.tsx

  components/
    auth/
      LoginForm.tsx
      SignupForm.tsx
    habits/
      HabitForm.tsx
      HabitList.tsx
      HabitCard.tsx
    shared/
      SplashScreen.tsx
      ProtectedRoute.tsx
      ServiceWorkerRegister.tsx

  lib/
    auth.ts
    habits.ts
    storage.ts
    streaks.ts
    slug.ts
    validators.ts
    constants.ts

  types/
    auth.ts
    habit.ts

public/
  icons/
  manifest.json
  sw.js

tests/
  unit/
    habits.test.ts
    slug.test.ts
    streaks.test.ts
    validators.test.ts
  integration/
    auth-flow.test.tsx
    habit-form.test.tsx
  e2e/
    app.spec.ts
```

---

🌐 Live Demo

🔗 Live URL: <https://habit-tracker-pwa-production.up.railway.app>

## 🚀 Setup Instructions

Clone the repository:

```bash
git clone <https://github.com/Precious-Odion/habit-tracker-pwa>
cd habit-tracker-pwa
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run Instructions

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

---

## 🧪 Test Instructions

Run all tests:

```bash
npm run test
```

Run specific suites:

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

### ⚠️ Note on Test Scripts

The technical requirement defines:

```json
"test:unit": "vitest run --coverage",
"test:integration": "vitest run"
```

This implementation refines them to target specific directories:

```json
"test:unit": "vitest run tests/unit --coverage",
"test:integration": "vitest run tests/integration"
```

This ensures faster execution and better test isolation while maintaining the required script names.

---

## 💾 Local Persistence Design

The application uses **localStorage** as a deterministic persistence layer.

### Keys

```txt
habit-tracker-users
habit-tracker-session
habit-tracker-habits
```

### Data Structures

**Users**

```ts
{
  id: string;
  email: string;
  password: string;
  createdAt: string;
}
```

**Session**

```ts
{
  userId: string;
  email: string;
}
```

**Habits**

```ts
{
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;
  completions: string[];
}
```

### Guarantees

- IDs are generated using `crypto.randomUUID()` (globally unique)
- Completion dates are stored as **ISO strings (YYYY-MM-DD)**
- Duplicate completion dates are prevented
- Data is scoped per user

---

## 📱 PWA Implementation

The application satisfies the PWA contract:

### Required Files

```
public/manifest.json
public/sw.js
public/icons/icon-192.png
public/icons/icon-512.png
```

How the service worker works:

The service worker (sw.js) caches the app shell
The app becomes installable via browser
Offline usage is supported after first load
App does not crash when offline

🧠 Why ServiceWorkerRegister.tsx Exists

src/components/shared/ServiceWorkerRegister.tsx

Next.js App Router runs both server and client components.

The service worker must be registered only on the client, because:

navigator.serviceWorker is not available on the server
Registering it in server components would cause runtime errors

This component:

Runs inside a useEffect
Ensures safe client-side registration
Keeps service worker logic isolated and predictable

This design ensures compliance with the requirement:

"The app must register the service worker on the client"

### Features Implemented

- Installable via browser prompt
- Service worker registered on client
- App shell caching strategy
- Offline support after first load
- No hard crash when offline

### Offline Behavior

The service worker caches:

```txt
/, /login, /signup, /dashboard
```

This allows the app shell to render even without network connectivity.

---

## ⚖️ Trade-offs and Limitations

- **No backend**: authentication is local and not secure (intended for this stage)
- **No multi-device sync**: data is tied to browser storage
- **Basic service worker strategy**: focuses on app shell caching, not full offline data sync
- **No advanced validation UI feedback system** beyond required scope
- **Duplicate habit names are prevented**, but UX feedback is minimal by design

These decisions align with the requirement to keep the system **deterministic and front-end focused**.

---

## 🧪 Test Coverage Summary

- **Unit Tests (Vitest)** → utilities in `src/lib`
- **Integration Tests (RTL)** → auth and habit flows
- **E2E Tests (Playwright)** → full user journey

### Coverage

```txt
96.15% line coverage in src/lib
```

This exceeds the required **80% minimum**.

---

## 🧪 Test Mapping (Requirement → Verification)

### Unit Tests

| File               | Behavior Verified           |
| ------------------ | --------------------------- |
| slug.test.ts       | slug normalization rules    |
| validators.test.ts | habit name validation rules |
| streaks.test.ts    | streak calculation logic    |
| habits.test.ts     | completion toggle behavior  |

---

### Integration Tests

| File                | Behavior Verified                       |
| ------------------- | --------------------------------------- |
| auth-flow.test.tsx  | signup/login flows, error handling      |
| habit-form.test.tsx | create/edit/delete/complete habit flows |

---

### End-to-End Tests

| File        | Behavior Verified                                             |
| ----------- | ------------------------------------------------------------- |
| app.spec.ts | full application flow, routing, persistence, offline behavior |

---

## 🎯 Requirement Compliance Summary

- Route contract fully implemented
- Local persistence strictly followed
- Utility functions implemented exactly as specified
- Required UI test IDs present
- Accessibility requirements satisfied
- PWA requirements satisfied
- Test titles match exact specification
- Coverage requirement exceeded

---

## 🧠 Final Notes

This project emphasizes:

- precision over creativity
- correctness over shortcuts
- testability over assumptions

Every feature is implemented **to satisfy a specification, not interpretation**.

---

## 🔗 Reference

Technical Requirements Document:

https://docs.google.com/document/d/1Gp2_0pZWWnQbLc6zLS1U4wI6kO8DCC07Ea5JFjOYXlI/edit?tab=t.0#heading=h.ng83bkry08h9

---
