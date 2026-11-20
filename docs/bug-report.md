
# To-Do App – Bug Report

**Project:** Winter Internship To-Do App  
**Group:** 13  
**QA Member:** Kripa Naik  
**Status:** Frontend manual QA in progress (mock mode)  
**Last Updated:** 20 November 2026

## 1. Purpose

This document is used to record bugs and issues identified while testing the To-Do application.

Each bug should include clear steps to reproduce the issue, expected results, actual results, and its current status.

## 2. Bug Severity

| Severity | Description |
|---|---|
| Critical | Major functionality is completely broken or there is a serious security issue. |
| High | An important feature does not work correctly. |
| Medium | A feature works incorrectly but has a workaround. |
| Low | Minor UI, layout, or text issue. |

## 3. Bug Report Template

Use this format whenever a bug is discovered.

### Bug Details

- **Bug ID:**
- **Bug Title:**
- **Feature/Module:**
- **Date Reported:**
- **Severity:**
- **Environment:** 
- **Related Test Case ID:**
- **Assigned Developer:**
- **Status:** Open / In Progress / Fixed / Retested / Closed

### Description

**Preconditions:**

**Steps to Reproduce:**

1.
2.
3.

**Expected Result:**

**Actual Result:**

**Evidence:** Screenshot or screen recording, if available.

**Retest Result:**

## 4. Bug Log

| Bug ID | Bug Title | Severity | Related Test Case | Status |
|---|---|---|---|---|
| BUG-01 | Wrong validation message for excessively long title | Low | TC-14 | Open |
| BUG-02 | Whitespace-only task title accepted | Medium | TC-43 | Open |

### BUG-01 — Incorrect long-title validation message

- **Module:** User task creation / validation
- **Date Reported:** 20 November 2026 (documented)
- **Severity:** Low
- **Environment:** Angular at `http://localhost:4200/`, Chrome, mock data mode
- **Related Test Case:** TC-14
- **Assigned Developer:** Unassigned
- **Status:** Open

**Preconditions:** Signed in as a regular user.

**Steps to Reproduce:**
1. Open the create-task form.
2. Enter an excessively long task title (approximately 300 characters).
3. Try to submit the form.

**Expected Result:** Long input is handled safely and any validation message accurately explains the maximum length restriction.

**Actual Result:** Submission was blocked, but the displayed message referred to a minimum-length requirement instead of a maximum-length restriction.

**Evidence:** `evidence/long-title-validation.png` shows the long entered title and incorrect minimum-length validation message.

**Suggested fix:** Validate trimmed title length using distinct minimum- and maximum-length checks, and display the corresponding error message.

**Retest Result:** Not retested after a fix.

### BUG-02 — Whitespace-only title accepted

- **Module:** User task creation / validation
- **Date Reported:** 20 November 2026 (documented)
- **Severity:** Medium
- **Environment:** Angular at `http://localhost:4200/`, Chrome, mock data mode
- **Related Test Case:** TC-43
- **Assigned Developer:** Unassigned
- **Status:** Open

**Preconditions:** Signed in as a regular user.

**Steps to Reproduce:**
1. Open the create-task form.
2. Enter only spaces in the task title field.
3. Complete any other required fields and submit.

**Expected Result:** Title is trimmed or rejected with a meaningful required-title message.

**Actual Result:** Task was created with a whitespace-only title.

**Evidence:** `evidence/dashboard-blank-title-license.png` shows a task card with no visible title. This supports the finding but does not show the form submission steps.

**Suggested fix:** Trim the task title before required/minimum-length validation and prevent submission if the trimmed title is empty.

**Retest Result:** Not retested after a fix.

## 5. Observations Requiring Follow-up (Not Confirmed Bugs)

| ID | Observation | Next Check |
|---|---|---|
| OBS-02 | Admin dashboard displayed an `Invalid PrimeUI License` toast | Confirm whether this is an expected development-only license/configuration warning; screenshot: `evidence/dashboard-blank-title-license.png`; investigate |
| OBS-03 | Task form accepted a past due date | Confirm whether past dates should be prohibited; no requirement was established |

## 6. Testing Notes

- Findings are from **frontend mock mode** (`useMockData: true`), not backend/PostgreSQL testing.
- Notify the responsible frontend developer or project manager about open issues, with reproduction steps and evidence; notification has not yet been confirmed.
- Attach screenshots or recordings if available.
- Reproduce and isolate observations before converting them to confirmed bugs.
- Retest after fixes and close issues only after verification.
