# To-Do App – Bug Report

**Project:** Winter Internship To-Do App  
**Group:** 13  
**QA Member:** Kripa Naik  
**Status:** Both confirmed bugs closed; two observations remain  
**Last Updated:** 24 November 2026  
**Git Branch:** `feature/final-qa-testing`

## 1. Purpose

This document records defects identified during frontend, backend, database and integration testing, including reproduction steps, severity, evidence and retest results. Initial defects were identified in mock mode on 20 November, retested against the integrated application on 21 November, and followed by additional testing on 24 November 2026.

## 2. Bug Severity

| Severity | Description |
|---|---|
| Critical | Major functionality completely broken or serious security issue. |
| High | Important feature does not work correctly. |
| Medium | Feature works incorrectly but has a workaround. |
| Low | Minor UI, layout or validation-message issue. |

## 3. Bug Report Template

Record the bug ID, title, module, date reported, severity, environment, related test case, assigned developer, status, preconditions, reproduction steps, expected and actual results, evidence and retest result.

## 4. Bug Log

| Bug ID | Bug Title | Severity | Related Test Case | Status |
|---|---|---|---|---|
| BUG-01 | Incorrect validation message for excessively long title | Low | TC-14 / INT-18 | Closed |
| BUG-02 | Whitespace-only title validation and error feedback | Medium | TC-43 / INT-19 | Closed |

### BUG-01 — Incorrect Long-Title Validation Message

- **Module:** User task creation / validation
- **Date Reported:** 20 November 2026
- **Severity:** Low
- **Original Environment:** Angular frontend, Chrome, mock-data mode
- **Retest Environment:** Angular, Fastify and PostgreSQL
- **Related Test Cases:** TC-14, INT-18
- **Assigned Developer:** Formal assignment not recorded; frontend review required at time of reporting.
- **Current Status:** Closed

**Preconditions:** Signed in as a regular user.

**Steps to Reproduce:**

1. Open the Create Task form.
2. Enter a title containing approximately 300 characters.
3. Attempt to submit the form.
4. Observe the validation message.

**Expected Result:** Reject titles exceeding the maximum length and display a clear maximum-length warning.

**Original Actual Result:** Task creation was blocked, but the frontend incorrectly displayed "Title is required (minimum 3 characters)."

**Evidence:**

- `docs/evidence/BUG-01-long-title-validation.png` — original finding.
- `docs/evidence/BUG-01-integration-retest.png` — initial integration retest, 21 November 2026.

**Suggested Fix:** Separate required, minimum-length and maximum-length validation messages.

**Initial Integration Retest — 21 November 2026:** FAIL. The incorrect minimum-length warning was reproduced. The issue remained open at that stage.

**Final Retest — 21 November 2026:** PASS. A 300-character title was rejected with the correct maximum-length validation message. Issue resolved and closed.

### BUG-02 — Whitespace-Only Task Title Validation

- **Module:** User task creation / validation
- **Date Reported:** 20 November 2026
- **Severity:** Medium
- **Original Environment:** Angular frontend, Chrome, mock-data mode
- **Retest Environment:** Angular, Fastify and PostgreSQL
- **Related Test Cases:** TC-43, INT-08, INT-19
- **Assigned Developer:** Formal assignment not recorded; frontend review required at time of reporting.
- **Current Status:** Closed

**Preconditions:** Signed in as a regular user.

**Steps to Reproduce:**

1. Open the Create Task form.
2. Enter only spaces in the title field.
3. Complete any other required fields.
4. Attempt to create the task.
5. Observe the resulting error message.

**Expected Result:** Reject whitespace-only titles and display a meaningful title-validation message.

**Original Actual Result — 20 November 2026:** A whitespace-only title was accepted in mock mode.

**Initial Integrated Actual Result — 21 November 2026:** The backend rejected the title with HTTP 400 and no task was created. The frontend displayed a generic "Creation Failed" error instead of a meaningful title-validation message.

**Evidence:**

- `docs/evidence/BUG-02-dashboard-blank-title-license.png` — original mock-mode screenshot showing a task card with no visible title. It does not show form submission itself.
- `docs/evidence/BUG-02-integration-retest.png` — initial integration retest, 21 November 2026.

**Suggested Fix:** Trim the title before validation, reject whitespace-only input and display a user-friendly validation message.

**Initial Integration Retest — 21 November 2026:** PARTIAL. Backend validation passed; frontend feedback required improvement. The issue was partially resolved at that stage.

**Final Retest — 21 November 2026:** PASS. Whitespace-only titles were rejected with an appropriate frontend validation message. Issue resolved and closed.

## 5. Observations Requiring Follow-up (Not Confirmed Bugs)

| ID | Observation | Required Follow-up | Status |
|---|---|---|---|
| OBS-02 | Invalid PrimeUI License notification | Investigate development configuration or licensing; related evidence: `docs/evidence/BUG-02-dashboard-blank-title-license.png`. | Needs Investigation (TC-61) |
| OBS-03 | Task form accepted a past due date | Confirm whether requirements prohibit past due dates. | Needs Clarification (TC-60) |

These observations are not confirmed defects. The optional logout confirmation prompt was discussed with the team, which agreed to retain the existing behaviour. No change is required for that suggestion.

## 6. Testing Notes

### Initial Frontend Testing — 20 November 2026

- BUG-01 and BUG-02 were identified in Angular mock mode.
- Initial screenshots were retained under `docs/evidence/`.
- Mock-mode findings were not treated as proof of backend or PostgreSQL behaviour.

### Backend and Integration Retesting — 21 November 2026

- Angular, Fastify, PostgreSQL, Chrome, Thunder Client and pgAdmin were used.
- Authentication, task CRUD, status filtering, permissions and database-backed persistence passed the tested scenarios.
- Admin listing, statistics, activation/reactivation and self-role/self-deletion protection passed.
- Website task creation, viewing, editing, completion, deletion and refresh were verified.
- Initial integration retests reproduced BUG-01 and partially resolved BUG-02; both subsequently passed their final defect retests and were closed.
- All 19 integration/API entries documented on that date passed after final retesting.

### Follow-up and Targeted Integrated Regression — 24 November 2026

- Additional permission, persistence, backend outage and responsive-layout checks passed. Mobile checks used Chrome device emulation.
- Admin role changes and deletion of a disposable user with associated tasks passed at API and PostgreSQL level (INT-20 and INT-21), not through the website.
- With mock data disabled, 25 selected existing scenarios were repeated on the integrated application. All 25 passed; no new failures were reported.
- Regression checks covered registration and login validation, logout access protection, task reopening, empty state, search and filters, cancellation, priority editing and persistence, duplicate titles, browser restart persistence, Admin login restrictions and charts.
- This was targeted regression, not a full rerun of all 82 documented entries. The 25 repeated checks do not increase the test-case count.
- BUG-01 and BUG-02 remain closed based on their successful final retests on 21 November; the targeted regression round did not separately repeat those two defect-specific tests.

### Bug Reporting and Closure Procedure

- Share unresolved defects with the responsible developer or project manager, including reproduction steps and evidence.
- Formal developer notification and assignment records are not independently confirmed in this report.
- Retest defects after fixes are merged and close only after expected behaviour is verified.
- Keep observations separate from confirmed defects.

## 7. Current Bug Summary

| Metric | Count |
|---|---:|
| Confirmed bugs | 2 |
| Open | 0 |
| Partially resolved | 0 |
| Closed | 2 |
| Observations requiring follow-up | 2 |
| New failures in targeted regression | 0 |

**Overall Status:** Core tested workflows are functioning. Both confirmed defects have been successfully retested and closed. Of 82 documented test-case entries, 80 passed and two remain observations; all 21 backend/integration entries and all 25 targeted regression checks passed. No confirmed defects remain open within the tested scope. This does not establish that the application is defect-free or constitute formal project-manager sign-off.
