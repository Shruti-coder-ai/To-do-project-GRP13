# To-Do App – Testing Summary

**Project:** Winter Internship To-Do App
**Group:** 13
**QA Member:** Kripa Naik
**Testing Status:** Planned QA checks completed; two observations remain
**Last Updated:** 24 November 2026
**Git Branch:** `feature/final-qa-testing`

## 1. Objective

The objective of QA testing is to verify the functionality, reliability, validation, database integration, and access permissions of the To-Do application.
Testing was conducted in two stages:

- **Stage 1:** Manual frontend testing using mock data, followed by independent backend API and PostgreSQL database testing.
- **Stage 2:** Integrated frontend-backend-database testing, including authentication, task management, admin functionality, and bug retesting.

Follow-up checks on 24 November included targeted integrated regression testing with `useMockData: false`. Testing was performed against the team's merged application code.

## 2. Testing Overview

### Initial Frontend Testing

The original 61 entries included 49 passes, two validation issues (one failed and one partial in the subsequent recorded snapshot), eight untested entries and two observations. These are historical results, not the final status.

### Final Testing Counts — 24 November 2026

| Metric | Original cases | Backend/integration entries | Total |
|---|---:|---:|---:|
| Documented entries | 61 | 21 | 82 |
| Passed | 59 | 21 | 80 |
| Failed | 0 | 0 | 0 |
| Partial | 0 | 0 | 0 |
| Not Tested | 0 | 0 | 0 |
| Unresolved observations | 2 | 0 | 2 |


- Confirmed bugs: 2; closed after retesting: 2; open confirmed bugs: 0.
- Targeted integrated regression: 25 checks performed, 25 passed, 0 failed.


Regression checks repeat existing cases and do not increase the 82-entry total. INT-18 and INT-19 also overlap TC-14 and TC-43; entries are not unique functionalities.

## 3. Features Tested

### Frontend Testing

- User registration, login, logout, and form validation.
- User dashboard and task display.
- Task creation, editing, deletion, completion, and reopening.
- Search by title and description.
- Status filtering and combined search/filter functionality.
- Task priority selection and editing.
- Admin login and dashboard display.
- Admin statistics, user listing, and task listing.
- Browser refresh and task visibility.
- Basic responsive layout checks using Chrome mobile emulation.

### Backend API Testing

- User registration and authentication.
- Duplicate registration and invalid input handling.
- JWT-protected API access.
- Task creation, retrieval, editing, deletion, and status filtering.
- Task title and priority validation.
- User-specific task access restrictions.
- Admin-only API permissions.
- Admin user activation and deactivation.
- Protection against admin self-role changes and self-deletion.
- Admin role changes and deletion of another test user (API and database only).

### Database Testing

- PostgreSQL connection and table verification.
- User registration records.
- Task insertion, retrieval, updates, and deletion.
- Task ownership and user isolation.
- Persistence of task data.

### Integration Testing

- Frontend login connected to backend authentication.
- Tasks created through the API appearing on the website.
- Task creation, editing, completion, and deletion through the website.
- Database-backed task visibility after refresh.
- Admin dashboard login.
- Retesting of previously identified frontend validation issues.

## 4. Testing Environment

| Component | Technology / Tool |
|---|---|
| Frontend | Angular 22 |
| Backend | Node.js + Fastify |
| Database | PostgreSQL 18 |
| API Testing | Thunder Client |
| Database Testing | pgAdmin 4 |
| Browser | Google Chrome |
| IDE | Visual Studio Code |
| Version Control | Git and GitHub |
| Operating System | Windows |
| Frontend URL | `http://localhost:4200` |
| Backend URL | `http://localhost:3000` |
| Testing Dates | 21 and 24 November 2026 |
| Regression configuration | `useMockData: false` |

## 5. Testing Results

### 5.1 Initial Frontend Testing — Mock Mode

Initial frontend testing covered authentication screens, task-management workflows, search, filtering, dashboard features, and basic admin views.
Additional checks included empty registration validation (TC-02), task retention after refresh (TC-21), empty task list feedback (TC-22), clearing search (TC-28), unregistered-email login rejection (TC-07), no-results search feedback (TC-27), task retention after logout and re-login in mock mode (TC-37), and responsive dashboard layout (TC-42).
Two task-title validation defects were identified:

- BUG-01: Incorrect warning displayed for excessively long task titles.
- BUG-02: Whitespace-only task titles were accepted in mock mode.

An `Invalid PrimeUI License` notification was also observed. Its impact remains unconfirmed.
These initial frontend results were recorded before real backend and database integration was verified.

### 5.2 Backend API Testing — 21 November 2026

| Test Scenario | Result |
|---|---|
| Valid user registration | PASS |
| Duplicate registration rejected | PASS |
| Invalid email rejected | PASS |
| Short password rejected | PASS |
| Valid login | PASS |
| Incorrect password rejected | PASS |
| Unauthorized task access rejected | PASS |
| Create task | PASS |
| Retrieve tasks | PASS |
| Edit task | PASS |
| Mark task completed | PASS |
| Filter pending/completed tasks | PASS |
| Delete task | PASS |
| Delete nonexistent task rejected | PASS |
| Whitespace-only task title rejected | PASS |
| Invalid task priority rejected | PASS |
| Cross-user task visibility restricted | PASS |
| Cross-user task modification rejected | PASS |
| Cross-user task deletion rejected | PASS |

Backend testing was performed using Thunder Client against the Fastify API.

### 5.3 Database Testing — 21 November 2026

| Test Scenario | Result |
|---|---|
| PostgreSQL database connection | PASS |
| Users and tasks tables verified | PASS |
| Registered user stored in database | PASS |
| Created task stored in database | PASS |
| Task updates reflected in database-backed results | PASS |
| Deleted task removed from database | PASS |
| Tasks associated with the correct user | PASS |
| User-specific task isolation | PASS |

Database records were inspected using pgAdmin, and database-backed behaviour was verified through the API and frontend.

### 5.4 Admin Testing — 21 November 2026

| Test Scenario | Result |
|---|---|
| Regular user denied access to admin API | PASS |
| Admin login and dashboard access | PASS |
| Retrieve registered users | PASS |
| Retrieve platform tasks | PASS |
| Retrieve admin statistics | PASS |
| Deactivate test user | PASS |
| Reactivate test user | PASS |
| Prevent admin from changing own role | PASS |
| Prevent admin from deleting own account | PASS |

User activation and reactivation were tested using a dummy account. The account was restored to ACTIVE after testing.

### 5.5 Frontend-Backend-Database Integration — 21 November 2026

| Test Scenario | Result |
|---|---|
| User login through integrated frontend | PASS |
| API-created task appears on dashboard | PASS |
| Create task through website | PASS |
| View created task | PASS |
| Edit task through website | PASS |
| Mark task completed | PASS |
| Delete task through website | PASS |
| Deleted task remains absent after refresh | PASS |
| Database-backed task persistence | PASS |
| Admin dashboard login | PASS |
| Excessively long title validation | PASS after final retest (INT-18) |
| Whitespace-only title error feedback | PASS after final retest (INT-19) |

The main integrated task-management workflow functioned correctly during testing.

### 5.6 Bug Retesting — 21 November 2026

| Bug | Earlier result | Final retest | Status |
|---|---|---|---|
| BUG-01 / INT-18 | Long title rejected with misleading minimum-length warning | Correct maximum-length warning displayed | Closed — Pass |
| BUG-02 / INT-19 | API rejected whitespace-only title with HTTP 400, but UI showed generic creation failure | Appropriate frontend validation displayed; invalid task rejected | Closed — Pass |


Refer to `docs/bug-report.md` for reproduction steps and evidence.

### 5.7 Additional Testing — 24 November 2026

| Test ID | Scenario | Result |
|---|---|---|
| INT-20 | Admin changes another user's role | PASS — HTTP 200; USER → ADMIN → USER verified in PostgreSQL |
| INT-21 | Admin deletes disposable user and associated tasks | PASS — HTTP 204; user and tasks absent in PostgreSQL |
| TC-32 | Admin activation/deactivation through website | PASS |
| TC-34 | Normal user opens Admin dashboard directly | PASS — redirected to User Dashboard |
| TC-35, TC-36 | Admin API permissions and cross-user task access | PASS — earlier API verification (INT-11, INT-10) |
| TC-38 | Two-account task visibility | PASS — first user's task not visible to second user |
| TC-39 | Edited task persists after refresh | PASS |
| TC-40 | Deleted task stays absent after refresh | PASS — earlier integration verification (INT-17) |
| TC-41 | Backend unavailable during task creation | PASS — creation failure displayed; backend restarted afterward |
| TC-42 | Mobile responsiveness retest | PASS — Chrome device emulation |


INT-20 and INT-21 were API/database checks, not website workflows. All eight formerly untested entries are now covered.

### 5.8 Targeted Integrated Regression — 24 November 2026

The Angular frontend was configured with `useMockData: false` and the Fastify backend and PostgreSQL database were connected. Previously tested scenarios were repeated through the website to check continued functionality after integration.

| Category | Existing test IDs | Result |
|---|---|---|
| Authentication and access | TC-02, TC-03, TC-07, TC-08, TC-10, TC-49, TC-50, TC-51, TC-52 | 9/9 Pass |
| Task management and persistence | TC-20, TC-22, TC-47, TC-48, TC-53, TC-54, TC-56, TC-57 | 8/8 Pass |
| Search and filters | TC-26, TC-27, TC-28, TC-44, TC-45, TC-46, TC-55 | 7/7 Pass |
| Admin charts and statistics | TC-59 | 1/1 Pass |
| **Total** | **25 checks** | **25/25 Pass** |


No new failures were reported. This was targeted regression, not a full repeat of all 82 entries. Results were manually confirmed by the tester; not every UI check required a separate database query.

**Final backend/integration results:** 21 passed, 0 failed, 0 partial.

## 6. Outstanding Observations and Scope Limits

- TC-60: Past due dates are accepted; expected behaviour requires team clarification.
- TC-61: Invalid PrimeUI License notification requires investigation; impact remains unconfirmed.


No confirmed bugs remain open. Full-suite regression, additional browsers, physical mobile devices and exhaustive edge cases were outside the targeted regression scope. Admin role changes and account deletion were verified at API/database level only. Some original entries retain their initial mock-mode scope; see `docs/test-cases.md`.

## 7. Optional UX Enhancements (Not Confirmed Bugs)

- Option to hide completed tasks on the main dashboard.
- Additional filters by due date and priority.
- Logout confirmation prompt — team agreed to retain existing behaviour; no change required.

These are suggestions and have not been established as mandatory project requirements.

## 8. Conclusion

Planned QA activities have been completed, including independent frontend and backend testing, PostgreSQL verification, core end-to-end integrated workflows, permission checks, bug retesting and targeted integrated regression.

Of 82 documented entries, 80 passed and two remain observations. All 21 backend/integration entries passed. Both confirmed bugs were closed after successful retesting, and all 25 targeted regression checks passed without new reported failures.

**Final Status:** Planned QA testing completed; two observations remain for team clarification or investigation. These results do not establish that the application is defect-free or that every scenario was repeated end-to-end.
