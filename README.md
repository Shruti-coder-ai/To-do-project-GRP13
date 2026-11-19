# 🌟 TaskFlow - Full-Stack To-Do Task Management (Frontend)

> **Winter Internship Project (Group 13)**  
> Modern, production-ready frontend for a role-based To-Do Task Management SaaS platform built with **Angular**, **Tailwind CSS 4**, **PrimeNG 22**, and **Chart.js**.

---

## 🚀 Live Tech Stack

- **Framework**: Angular 22 (Standalone Components, Signals & Reactive Architecture)
- **Styling**: Tailwind CSS 4 with `@tailwindcss/postcss` & custom CSS design tokens
- **UI Components**: PrimeNG 22 (`Aura` theme preset, `p-dialog`, `p-confirmdialog`, `p-chart`, `p-toast`)
- **Visualizations**: Chart.js 4 (Doughnut Status Chart, Bar Priority Chart)
- **Testing**: Vitest with Angular testing utilities (43 unit tests passing)
- **Backend Ready**: Pre-wired architecture for Fastify Node.js API & PostgreSQL integration

---

## 🎨 Design System

Styled with the **Dreamy Lavender + Soft Pink + Violet** aesthetic:
- **Primary Violet**: `#7054C8`
- **Soft Periwinkle**: `#A5A0F5`
- **Pastel Lavender**: `#EDE7FF`
- **Soft Pink Accent**: `#FCE7F3`
- **Warm Cream Glass Cards**: `#FFF9F2`
- **Deep Plum Typography**: `#332747`

---

## 👥 Role-Based Architecture

### 1. User Workspace (`/user/dashboard`)
- **KPI Metrics**: Total Tasks, Pending Tasks, Completed Tasks, and Live Completion Rate % with visual progress indicator.
- **Task Management**: Create, edit, toggle complete, and delete tasks with confirmation dialogs.
- **Filtering & Search**: Real-time search by title/description and instant filtering (`All`, `Pending`, `Completed`).
- **Safety**: Protected by `authGuard` and `roleGuard('USER')`.

### 2. Admin Workspace (`/admin/dashboard`)
- **System Overview**: Platform-wide user and task count metrics.
- **Chart.js Analytics**:
  - **Task Status Breakdown**: Doughnut chart comparing completed vs. pending tasks.
  - **Priority Distribution**: Bar chart categorizing tasks across Low, Medium, and High priority tiers.
- **User Governance**: Filter and search all registered users; activate or deactivate accounts with safety protection against deactivating administrators.
- **All Platform Tasks Oversight**: Global task table with search, priority tags, and user attribution.
- **Safety**: Protected by `authGuard` and `roleGuard('ADMIN')`.

### 3. Authentication
- **User Login**: `/login`
- **Dedicated Admin Portal**: `/admin-login`
- **User Registration**: `/register` (Standard user registration with cross-field password match validation; public admin signup disabled)

---

## 🔑 Development Credentials

| Role | Username | Email | Password | Dashboard |
|---|---|---|---|---|
| **Admin** | `angrevyas` | `angrevyas@gmail.com` | `Angre@123` | `/admin/dashboard` |
| **Admin (Demo)** | `Demo Administrator` | `admin@taskflow.dev` | `Admin@123` | `/admin/dashboard` |
| **User (Demo)** | `Demo User` | `user@taskflow.dev` | `User@123` | `/user/dashboard` |

---

## 🛠️ Project Setup & Installation

### Prerequisites
- Node.js (v18.19.0 or higher recommended)
- npm (v9+ recommended)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/` in your browser.

### 3. Build for Production
```bash
npm run build
```
Production build bundles will be generated in `dist/frontend/`.

### 4. Run Unit Tests
```bash
npm test -- --watch=false
```

---

## 📁 Project Directory Structure

```
src/
└── app/
    ├── components/
    │   ├── login/                     # Clean user sign-in form
    │   ├── register/                  # Signup with password confirmation validator
    │   ├── shared/
    │   │   ├── navbar/                # Global header with role chip & responsive menu
    │   │   └── sidebar/               # Role-adaptive sidebar & mobile navigation drawer
    │   ├── user/
    │   │   └── user-dashboard/        # Personal task board, stats, add/edit modal
    │   └── admin/
    │       ├── admin-login/           # Dedicated secure administrator portal
    │       └── admin-dashboard/       # Chart.js analytics, user governance, all tasks table
    ├── guards/
    │   ├── auth.guard.ts              # Session verification guard
    │   ├── role.guard.ts              # Strict role isolation guard
    │   └── guest.guard.ts             # Auto-redirect authenticated users away from auth forms
    ├── models/
    │   ├── user.model.ts              # User, Role, Status interfaces
    │   └── task.model.ts              # Task, Priority, Status interfaces
    └── services/
        ├── auth.service.ts            # Signal-based authentication state & session management
        ├── task.service.ts            # Task CRUD, filters, and metrics
        └── user.service.ts            # User management & account activation operations
```

---

## 🤝 Group Project Integration

This frontend is prepared for integration with:
- **Backend**: Node.js + Fastify
- **Database**: PostgreSQL
- To connect to the live backend API once deployed, set `useMockData: false` in `src/environments/environment.ts` and set your `apiUrl`.
