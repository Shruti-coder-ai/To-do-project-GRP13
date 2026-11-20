# To-Do App – Testing Summary

**Project:** Winter Internship To-Do App  
**Group:** 13  
**QA Member:** Kripa Naik  
**Testing Status:** Core frontend, backend, database, and integration scenarios tested; outstanding issues remain  
**Last Updated:** 21 November 2026  
**Git Branch:** `feature/final-qa-testing`

## 1. Objective

The objective of QA testing is to verify the functionality, reliability, validation, database integration, and access permissions of the To-Do application.

Testing was conducted in two stages:

- **Stage 1:** Manual frontend testing using mock data, followed by independent backend API and PostgreSQL database testing.
- **Stage 2:** Integrated frontend-backend-database testing, including authentication, task management, admin functionality, and bug retesting.

Testing was performed against the team's merged application code.

## 2. Testing Overview

### Initial Frontend Testing
- Total documented test cases: 61
- Passed: 49
- Failed: 2
- Not Tested: 8
- Needs Investigation / Clarification: 2

These figures represent the original frontend testing snapshot.
TC-14 and TC-43 were subsequently retested during integration.

### Backend and Integration Testing
- Total additional test cases: 19
- Passed: 17
- Failed: 1
- Partial: 1

### Overall Documentation
- Total test-case entries: 80
- Confirmed bugs: 2
- Bugs open: 1
- Bugs partially resolved: 1

Note: Integration retests of TC-14 and TC-43 are also documented
as INT-18 and INT-19. These are separate test executions,
not additional unique defects.

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
| Testing Date | 21 November 2026 |

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
| Excessively long title validation | FAIL |
| Whitespace-only title error feedback | PARTIAL |

The main integrated task-management workflow functioned correctly during testing.

### 5.6 Bug Retesting

**BUG-01 — Incorrect Long-Title Validation Message**

- **Status:** Open
- **Retest Result:** FAIL
- **Observation:** A 300-character task title still displayed a minimum-length validation warning instead of an appropriate maximum-length message.
- **Impact:** Task submission is blocked, but the user receives misleading feedback.

**BUG-02 — Whitespace-Only Task Title**

- **Status:** Partially Resolved — Frontend Fix Required
- **Retest Result:** PARTIAL
- **Observation:** The backend correctly rejected whitespace-only titles with HTTP 400, preventing invalid task creation.
- **Remaining Issue:** The frontend displayed a generic "Creation Failed" message instead of explaining the title validation error.

Refer to `docs/bug-report.md` for detailed reproduction steps.

## 6. Outstanding Testing and Issues

The following areas require further testing, investigation, or confirmation:

- Admin changing another user's role and deleting a disposable test account.
- Full regression testing after developers fix BUG-01 and BUG-02.
- Rechecking any original test cases not yet verified against the integrated application.
- Investigating the PrimeUI license notification.
- Confirming expected behaviour for past due dates with the team.
- Additional browser, responsive-layout, and edge-case regression testing.

**Note:** Backend authorization, PostgreSQL persistence, cross-user task isolation, and admin activation/deactivation were verified on 21 November and are no longer listed as untested.

## 7. Optional UX Enhancements (Not Confirmed Bugs)

- Option to hide completed tasks on the main dashboard.
- Additional filters by due date and priority.
- Logout confirmation prompt.

These are suggestions and have not been established as mandatory project requirements.

## 8. Final Conclusion

QA testing verified the application's main user workflows, backend authentication, task APIs, PostgreSQL integration, user-level access restrictions, and several administrative operations.

The integrated application successfully supported user login, task creation, viewing, editing, completion, deletion, and database-backed persistence.

Two previously identified validation issues were retested. BUG-01 remains open, while BUG-02 is partially resolved because backend validation works but frontend error feedback requires improvement.

**Overall Result:** Core tested functionality is working, with outstanding frontend validation defects and some remaining admin and regression scenarios.

Final QA sign-off is pending developer fixes, retesting, and completion of the remaining documented test cases.