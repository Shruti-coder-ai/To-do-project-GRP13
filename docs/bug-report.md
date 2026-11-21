# To-Do App – Bug Report

**Project:** Winter Internship To-Do App  
**Group:** 13  
**QA Member:** Kripa Naik  
**Status:** Integration testing performed; unresolved frontend validation issues remain  
**Last Updated:** 21 November 2026  
**Git Branch:** `feature/final-qa-testing`

## 1. Purpose

This document records defects identified during frontend, backend, database, and integration testing of the To-Do application.

Each confirmed bug includes reproduction steps, expected and actual results, severity, supporting evidence, and retesting status.

Initial bugs were discovered during frontend mock-mode testing on 20 November 2026 and subsequently retested against the integrated application on 21 November 2026.

## 2. Bug Severity

| Severity | Description |
|---|---|
| Critical | Major functionality is completely broken or a serious security issue exists. |
| High | An important feature does not work correctly. |
| Medium | A feature works incorrectly but has a workaround. |
| Low | Minor UI, layout, or validation-message issue. |

## 3. Bug Report Template

### Bug Details

- **Bug ID:**
- **Bug Title:**
- **Feature/Module:**
- **Date Reported:**
- **Severity:**
- **Environment:**
- **Related Test Case ID:**
- **Assigned Developer:**
- **Status:**

### Description

**Preconditions:**

**Steps to Reproduce:**

1.
2.
3.

**Expected Result:**

**Actual Result:**

**Evidence:**

**Retest Result:**

## 4. Bug Log

| Bug ID | Bug Title | Severity | Related Test Case | Status |
|---|---|---|---|---|
| BUG-01 | Incorrect validation message for excessively long title | Low | TC-14 | Closed |
| BUG-02 | Whitespace-only title validation and error feedback | Medium | TC-43 | Closed |

### BUG-01 — Incorrect Long-Title Validation Message

- **Module:** User task creation / validation
- **Date Reported:** 20 November 2026
- **Severity:** Low
- **Original Environment:** Angular frontend, Chrome, mock-data mode
- **Retest Environment:** Angular frontend connected to Fastify backend and PostgreSQL
- **Related Test Case:** TC-14
- **Assigned Developer:** Unassigned — frontend developer to review
- **Status:** Closed

**Preconditions:** Signed in as a regular user.

**Steps to Reproduce:**

1. Open the Create Task form.
2. Enter a task title containing approximately 300 characters.
3. Attempt to submit the form.
4. Observe the validation message.

**Expected Result:**

The application should reject a title exceeding the permitted maximum length and display a clear maximum-length validation message.

**Actual Result:**

Task creation is blocked, but the frontend incorrectly displays:

"Title is required (minimum 3 characters)."

This message describes a minimum-length requirement rather than the actual excessive-length problem.

**Evidence:**

- `docs/evidence/BUG-01-long-title-validation.png`
- `docs/evidence/BUG-01-integration-retest.png` — Integration retest, 21 November 2026.
**Suggested Fix:**

Implement separate validation messages for required, minimum-length, and maximum-length conditions. Ensure the message corresponds to the actual validation failure.

**Retest — 21 November 2026:**

- **Result:** FAIL
- **Observation:** The incorrect minimum-length warning was reproduced during integrated frontend testing.
- **Status:** Open
- **Next Action:** Frontend developer to correct the validation message and provide a fix for QA retesting.
-**Evidence:**
- `docs/evidence/BUG-01-integration-retest.png` — Integration retest, 21 November 2026


**Final Retest Result (21 November 2026):** PASS — A 300-character title was rejected with the correct maximum-length validation message. Issue resolved.

### BUG-02 — Whitespace-Only Task Title Validation

- **Module:** User task creation / validation
- **Date Reported:** 20 November 2026
- **Severity:** Medium
- **Original Environment:** Angular frontend, Chrome, mock-data mode
- **Retest Environment:** Angular frontend connected to Fastify backend and PostgreSQL
- **Related Test Case:** TC-43
- **Assigned Developer:** Unassigned — frontend developer to review
- **Status:** Closed

**Preconditions:** Signed in as a regular user.

**Steps to Reproduce:**

1. Open the Create Task form.
2. Enter only spaces in the title field.
3. Complete any other required fields.
4. Attempt to create the task.
5. Observe the resulting error message.

**Expected Result:**

Whitespace-only titles should be rejected, and the user should receive a clear validation message explaining that a valid task title is required.

**Original Actual Result — 20 November 2026:**

During mock-mode frontend testing, a task with a whitespace-only title was accepted.

**Integrated Actual Result — 21 November 2026:**

The backend correctly rejected the invalid title with HTTP 400, and the task was not created.

However, the frontend displayed a generic "Creation Failed" error with an HTTP failure response rather than a meaningful title-validation message.

**Evidence:**

- `docs/evidence/BUG-02-dashboard-blank-title-license.png` — original mock-mode evidence showing a task card with no visible title.
- `docs/evidence/BUG-02-integration-retest.png` — Integration retest, 21 November 2026.

The original screenshot supports the observation but does not show the form submission itself.

**Suggested Fix:**

Trim the title before frontend validation, reject whitespace-only input before submitting the request, and display a user-friendly error message.

**Retest — 21 November 2026:**

- **Result:** PARTIAL
- **Backend Validation:** PASS
- **Frontend Validation/Error Feedback:** Needs improvement
- **Status:** Partially Resolved — Frontend Fix Required
- **Next Action:** Frontend developer to improve validation and error feedback, followed by QA retesting.


**Final Retest Result (21 November 2026):** PASS — Whitespace-only titles were rejected with an appropriate frontend validation message. Issue resolved.



## 5. Observations Requiring Follow-up (Not Confirmed Bugs)

| ID | Observation | Required Follow-up |
|---|---|---|
| OBS-02 | `Invalid PrimeUI License` notification appeared during frontend testing | Determine whether the warning is related to development configuration or a licensing issue. Reference: `docs/evidence/dashboard-blank-title-license.png` |
| OBS-03 | Task form accepted a past due date | Confirm whether the project requirements prohibit past due dates before classifying this as a defect |

These observations are not counted as confirmed bugs until their expected behaviour and impact are established.

## 6. Testing Notes

### Initial Frontend Testing — 20 November 2026

- BUG-01 and BUG-02 were originally identified during Angular frontend mock-mode testing.
- Initial screenshots were retained under `docs/evidence/`.
- Mock-mode findings were not treated as proof of backend or PostgreSQL behaviour.

### Backend and Integration Retesting — 21 November 2026

- Testing was performed against the merged application using Angular, Fastify, PostgreSQL, Chrome, Thunder Client, and pgAdmin.
- Backend authentication, task CRUD, status filtering, and user-specific task permissions passed the tested scenarios.
- Database-backed task creation, updates, deletion, and persistence were verified.
- Admin user listing, task listing, statistics, activation/reactivation, and self-role/self-deletion protection passed.
- Frontend task creation, viewing, editing, completion, deletion, and refresh were verified.
- BUG-01 was reproduced and remains Open.
- BUG-02 was partially resolved: invalid task creation is blocked by the backend, but frontend validation feedback remains inadequate.

### Final Bug Retesting — 21 November 2026
-BUG-01: PASS — Long task titles are now rejected with the correct maximum-length validation message.
-BUG-02: PASS — Whitespace-only titles are rejected with an appropriate frontend validation message.
-Both reported bugs have been successfully retested and marked Closed.
-All 19 documented integration test cases now have a Pass status.

### Bug Reporting and Closure Procedure

- Share unresolved defects with the responsible developer or project manager, including reproduction steps and evidence.
- Developer notification has not yet been confirmed.
- Retest each defect after the corresponding fix is merged.
- Mark a bug Closed only after its expected behaviour is verified.
- Keep observations requiring clarification separate from confirmed defects.

## 7. Current Bug Summary

| Metric | Count |
|---|---:|
| Confirmed bugs | 2 |
| Open | 0 |
| Partially resolved | 0 |
| Closed | 2 |
| Observations requiring follow-up | 2 |

**Overall Status:** The tested core application workflows are functioning, but frontend validation issues remain. Final closure requires developer fixes and successful regression testing.