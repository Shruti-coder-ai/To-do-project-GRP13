# To-Do App – Testing Summary

**Project:** Winter Internship To-Do App  
**Group:** 13  
**QA Member:** Kripa Naik  
**Testing Status:** Frontend mock-mode QA partially completed  
**Last Updated:** 20 November 2026

## 1. Objective

Verify the To-Do application's observable frontend behaviour, identify issues, and document remaining integration and security testing.

## 2. Testing Overview

| Metric | Count |
|---|---:|
| Total documented test cases (original 42 + 19 additional) | 61 |
| Passed | 49 |
| Failed | 2 |
| Not Tested | 8 |
| Blocked | 0 |
| Needs Investigation / Clarification | 2 |
| Confirmed bugs logged | 2 |

**Counting note:** The two cases marked Needs Investigation / Clarification are included in the total but excluded from Pass/Fail and Not Tested. Counts reflect documented test cases, not the number of conversational testing steps.

## 3. Features Tested

- User registration, login, validation, password visibility, logout and redirect after logout
- Task creation, viewing, editing, deletion, completion and reopening
- Search by title/description, case-insensitive search, status filtering and combined search/filter behaviour
- Task priority selection, editing and refresh behaviour
- Admin login, dashboard metrics and charts, registered users and platform task list
- Role-based login redirection: regular user credentials entered on Admin Login opened User Dashboard, not Admin Dashboard

## 4. Testing Environment

| Component | Observed environment / scope |
|---|---|
| Frontend | Angular, `http://localhost:4200/` |
| Browser / OS | Google Chrome on Windows |
| Editor | Visual Studio Code |
| Version control | Git / GitHub |
| Data mode | `useMockData: true` in frontend environment |
| Backend | Not verified; configured API URL `http://localhost:3000/api` was not used for these mock-mode tests |
| Database | PostgreSQL integration not verified |

## 5. Results

Additional manual checks passed: empty registration validation (TC-02), task retention after refresh (TC-21), empty task list message (TC-22), clearing search restores the task list (TC-28), unregistered-email login rejection (TC-07), no-results search feedback (TC-27), task retention after logout and re-login in mock mode (TC-37), and responsive dashboard layout in Chrome mobile emulation (TC-42). This does not establish backend or database persistence.

Core user task-management and basic admin views worked during manual frontend testing. Two confirmed task-title validation defects were observed (screenshots in `docs/evidence/`): an incorrect warning for excessively long titles and acceptance of whitespace-only titles. Admin user activation/deactivation controls were visible but no account status was changed.

A subsequent mock-mode test and dashboard screenshot confirmed that previously created tasks remained visible after re-login, so the earlier task-disappearance observation was withdrawn. The screenshot also shows a blank-title task card and an `Invalid PrimeUI License` notification; the latter requires investigation. Acceptance of past due dates requires a product requirement decision.

## 6. Outstanding Testing

- Backend API behaviour, authentication/authorization enforcement and PostgreSQL persistence
- Direct admin URL access by a regular user and admin-only API requests
- Cross-user data isolation
- Admin account activation/deactivation behaviour on a safe test account
- Genuinely empty task list, registration required fields, and other unverified edge cases identified in `test-cases.md`

## 7. Optional UX Enhancements (Not Bugs)

- Option to hide completed tasks on the main dashboard
- Filters by due date and priority
- Logout confirmation prompt

These suggestions were not established as mandatory requirements.

## 8. Conclusion

The frontend's main user workflows and initial admin screens were manually checked in mock-data mode, with 49 documented passes and 2 documented failures. This is **not** a completed end-to-end or database QA sign-off. Open bugs and outstanding checks are documented in `bug-report.md` and `test-cases.md`.
