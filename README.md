
# Component-Based-App-Week-Week5-Angular-Basics

A component-based **Student Portal** built with **Angular 17** (standalone components, signals, reactive forms, routing, and services).

##  Project Structure

```
src/app/
├── components/
│   ├── navbar/          # Top navigation bar
│   ├── login/           # Login page with reactive form
│   ├── dashboard/       # Summary stats & quick access
│   ├── students/        # CRUD for student records
│   ├── courses/         # Course listings
│   └── grades/          # Grade records with filter
├── services/
│   ├── auth.service.ts  # Login / logout / session
│   └── student.service.ts  # Students, courses & grades data
├── models/
│   └── student.model.ts # TypeScript interfaces
├── guards/
│   └── auth.guard.ts    # Route protection
├── app.routes.ts        # Lazy-loaded route definitions
├── app.config.ts        # Application providers
└── app.component.ts     # Root shell component
```

---

##  Features Implemented

| Feature | Details |
|---|---|
| **Routing** | Lazy-loaded routes for Dashboard, Students, Courses, Grades |
| **Route Guard** | `authGuard` redirects unauthenticated users to `/login` |
| **Reactive Forms** | Login form + Add/Edit student form with validation |
| **Services** | `AuthService` (session) + `StudentService` (data sharing via signals) |
| **Angular Signals** | Reactive state with `signal()`, `computed()`, `asReadonly()` |
| **Components** | Navbar, Login, Dashboard, Students, Courses, Grades |
| **CRUD** | Add, Edit, Delete students with modal confirmation |
| **Search** | Live search/filter on students list |
| **Standalone** | All components use Angular 17 standalone API |

---

##  Setup Instructions

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/student-portal.git
cd student-portal

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Open your browser at **http://localhost:4200**

### Demo Credentials

| Role    | Username  | Password    |
|---------|-----------|-------------|
| Admin   | `admin`   | `admin123`  |
| Student | `student` | `student123`|

---

##  Build for Production

```bash
npm run build
```
Output is placed in `dist/student-portal/`.

---

##  Run Tests

```bash
npm test
```

---

##  Technologies Used

- **Angular 17** — Standalone components, Signals
- **Angular Router** — Lazy loading, route guards
- **Angular Forms** — Reactive forms with validators
- **TypeScript** — Strict mode enabled
- **CSS** — Component-scoped styles, no external UI library

---

##  Assignment Checklist

- [x] Component-based architecture
- [x] Reusable standalone components
- [x] Angular routing with lazy loading
- [x] Route guard (`canActivate`)
- [x] Reactive forms with validation
- [x] Services for data sharing (`StudentService`, `AuthService`)
- [x] Clean code practices (JSDoc comments, single-responsibility)
- [x] README with setup instructions

---

*Submitted for Week 5 — Angular Basics | Assignment 1*
Author Shreyash Sable
shreyash.patil069@gmail.com
