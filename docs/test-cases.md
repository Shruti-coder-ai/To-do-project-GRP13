# To-Do App – QA Test Cases

**Project:** To-Do App – Group 13

**QA Role:** Testing and Documentation

**QA Member:** Kripa Naik

**Git Branch:** feature/final-qa-testing

## 1. Purpose

The purpose of this document is to define test cases for checking the functionality, usability, reliability and security of the To-Do App.

Testing covers User and Admin roles, authentication, task management and filters. Testing was conducted in two stages: initial frontend testing using mock data, followed by backend API, PostgreSQL database, and integrated application testing on 21 November 2026, with follow-up checks and targeted integrated regression testing on 24 November 2026. Verified results and remaining limitations are documented below and in testing-summary.md.

## 2. Test Status

- Not Tested – Test has not been performed.
- Pass – Actual result matches expected result.
- Fail – Actual result does not match expected result.
- Blocked – Testing cannot be performed due to an unavailable dependency.
- Partial – Core functionality works, but part of the expected behaviour still needs improvement.
- Needs Clarification – Expected behaviour requires clarification.
- Needs Investigation – Observed issue requires further investigation.

## 3. Authentication Testing

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-01 | Valid registration | Enter valid registration details and submit | Account should be created successfully | Registration succeeded. | Pass |
| TC-02 | Empty registration fields | Leave required fields empty and submit | Validation messages should appear | Required-field validation displayed for empty registration fields (user-confirmed). Integrated regression (24 November): Required-field warnings appeared; empty registration prevented. | Pass |
| TC-03 | Invalid email | Enter an invalid email address | System should reject invalid email | Invalid email format rejected. Integrated regression (24 November): Invalid email rejected. | Pass |
| TC-04 | Duplicate registration | Register using an existing email | Duplicate account should be prevented | Duplicate account rejected. | Pass |
| TC-05 | Valid login | Enter correct email and password | User should log in successfully | Valid credentials opened user dashboard. | Pass |
| TC-06 | Invalid password | Enter an incorrect password | Login should be rejected | Incorrect password rejected. | Pass |
| TC-07 | Unregistered account | Enter an unregistered email | Login should be rejected | Login rejected with “Invalid email or password. Please verify your credentials.” Integrated regression (24 November): Unregistered account login rejected. | Pass |
| TC-08 | Empty login fields | Submit without entering credentials | Validation messages should appear | Required-field warnings displayed. Integrated regression (24 November): Required-field warnings appeared; login prevented. | Pass |
| TC-09 | Logout | Click the Logout option | User should be logged out | Logout returned to login. | Pass |
| TC-10 | Protected page after logout | Log out and try opening dashboard directly | Access should be denied or redirected to login | Direct user dashboard URL redirected to login after logout. Integrated regression (24 November): Dashboard URL redirected to login after logout. | Pass |

## 4. User Dashboard and Task Management

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-11 | View dashboard | Log in as a User | User dashboard should appear | User dashboard displayed. | Pass |
| TC-12 | Add task | Enter a valid task title and submit | Task should be created | Task created successfully. | Pass |
| TC-13 | Empty task title | Submit task without a title | Validation should appear | Empty title rejected. | Pass |
| TC-14 | Long task title | Enter a very long title | Input should be handled safely | Final retest on 21 November: 300-character title rejected with correct maximum-length warning (INT-18). | Pass |
| TC-15 | Add description | Enter task title and description | Task details should be saved | Task description saved. | Pass |
| TC-16 | View tasks | Open the task list | User's tasks should appear | Task list displayed. | Pass |
| TC-17 | Edit task | Change task details and save | Updated details should appear | Edited task displayed updated details. | Pass |
| TC-18 | Delete task | Select Delete on a task | Task should be removed | Task deletion and confirmation worked. | Pass |
| TC-19 | Mark completed | Mark a pending task as completed | Task status should change | Pending task marked completed. | Pass |
| TC-20 | Reopen task | Change a completed task back to pending | Task should become pending | Completed task reopened as pending. Integrated regression (24 November): Completed task reopened as pending and remained pending after refresh. | Pass |
| TC-21 | Refresh application | Add a task and refresh the page | Task should remain saved | Task remained after refreshing the page (user-confirmed, mock mode). | Pass |
| TC-22 | Empty task list | Open dashboard with no tasks | Suitable empty-state message should appear | Empty task list displayed an appropriate empty-state message (user-confirmed). Integrated regression (24 November): Appropriate empty-state message displayed. | Pass |

## 5. Search and Filters

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-23 | View all tasks | Select All Tasks | All user's tasks should appear | All filter displayed tasks. | Pass |
| TC-24 | Pending filter | Select Pending | Only pending tasks should appear | Pending filter worked. | Pass |
| TC-25 | Completed filter | Select Completed | Only completed tasks should appear | Completed filter worked. | Pass |
| TC-26 | Search existing task | Search for an existing title | Matching task should appear | Existing task search returned match. Integrated regression (24 November): Only matching task titles displayed. | Pass |
| TC-27 | Search unavailable task | Search for a nonexistent title | No matching tasks message should appear | A no-results message appeared for a nonexistent search query. Integrated regression (24 November): No-results message displayed; unrelated tasks absent. | Pass |
| TC-28 | Clear search | Clear the search input | Full task list should return | Clearing search restored the full task list (user-confirmed). Integrated regression (24 November): Clearing search restored the full task list. | Pass |

## 6. Admin Dashboard and Permissions

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-29 | Admin login | Log in with valid Admin credentials | Admin dashboard should appear | Admin credentials opened admin dashboard. | Pass |
| TC-30 | View registered users | Open Admin user section | Registered users should be displayed | Registered users list displayed. | Pass |
| TC-31 | View all tasks | Open Admin task section | Admin should see all users' tasks | All Platform Tasks displayed task details. | Pass |
| TC-32 | Manage users | Perform an available user-management action | Action should work according to Admin permissions | 24 November: Admin deactivated and reactivated a test user through the website; API also verified (INT-13). | Pass |
| TC-33 | View statistics | Open Admin statistics | Task statistics should be displayed correctly | Statistics and charts displayed; displayed task totals were internally consistent. | Pass |
| TC-34 | User opens Admin page | Log in as User and access Admin page | Access should be denied | 24 November: Normal user opening Admin dashboard directly was redirected to User Dashboard. | Pass |
| TC-35 | User accesses Admin API | Attempt an Admin-only API request as User | Backend should reject unauthorised access | USER request to Admin API returned HTTP 403 (INT-11). | Pass |
| TC-36 | Access another user's task | Attempt to view or modify another user's task | Access should be denied | GET excluded private tasks; cross-user PUT and DELETE returned HTTP 404 (INT-10). | Pass |

## 7. Database and Reliability Testing

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-37 | Task persistence in mock mode | Create a task, log out, and log back into the same account | Task should remain saved | User confirmed the task remained after re-login to the same account; this does not verify PostgreSQL persistence. | Pass |
| TC-38 | User data isolation | Create tasks using two User accounts | Each User should see only their own tasks | 24 November: Task created by first user was not visible to second user; API isolation also verified (INT-10). | Pass |
| TC-39 | Update persistence | Edit a task and reload | Updated details should remain saved | 24 November: Edited task details remained saved after browser refresh. | Pass |
| TC-40 | Delete persistence | Delete a task and reload | Deleted task should not reappear | Deleted task did not reappear after refresh (INT-17). | Pass |
| TC-41 | Backend unavailable | Attempt an action when server is unavailable | Clear error should appear | 24 November: With backend stopped, task creation displayed a creation failure error; backend restarted afterward. | Pass |
| TC-42 | Responsive layout | Open application at desktop and mobile screen sizes | Layout should remain usable | 24 November: Mobile responsiveness retest confirmed by tester using Chrome device emulation; not a physical-device test. | Pass |

## 8. Additional Manual Scenarios

| Test ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-43 | Whitespace-only task title | Whitespace-only title should be rejected with a clear validation message | Final retest on 21 November: whitespace-only title rejected with appropriate frontend validation (INT-19); API returned HTTP 400 (INT-08). | Pass |
| TC-44 | Search by description | Matching tasks displayed | Search matched descriptions Integrated regression (24 November): Search matched task description. | Pass |
| TC-45 | Case-insensitive search | Search ignores letter case | Search worked regardless of case Integrated regression (24 November): Uppercase and lowercase searches returned the same matches. | Pass |
| TC-46 | Search with status filter | Results satisfy search and status | Combined search and status filters worked Integrated regression (24 November): Pending filter and search returned matching pending tasks. | Pass |
| TC-47 | Edit cancellation | Cancel leaves original task unchanged | Original task remained unchanged Integrated regression (24 November): Cancelling edit preserved original task details. | Pass |
| TC-48 | Delete cancellation | Cancel leaves task unchanged | Task remained Integrated regression (24 November): Cancelling deletion preserved the task. | Pass |
| TC-49 | Password visibility | Visibility toggle changes display | Toggle worked Integrated regression (24 November): Password visibility toggle worked in both directions. | Pass |
| TC-50 | Short registration password | Minimum length enforced | At least 6 characters warning shown Integrated regression (24 November): Minimum password-length warning appeared; registration prevented. | Pass |
| TC-51 | Password confirmation mismatch | Mismatch rejected | Mismatch rejected Integrated regression (24 November): Mismatched passwords rejected. | Pass |
| TC-52 | User credentials on admin login page | User should not obtain admin access | Redirected to User Dashboard Integrated regression (24 November): Normal user did not gain Admin dashboard access. | Pass |
| TC-53 | Priority display and editing | Priority displays and updates | High, Medium and Low displayed; edit worked Integrated regression (24 November): Priority changed from Low to High and displayed correctly. | Pass |
| TC-54 | Priority on refresh | Selected priority remains | Priority persisted after refresh Integrated regression (24 November): High priority retained after refresh. | Pass |
| TC-55 | Whitespace search | Blank search should not unexpectedly filter tasks | Task list remained unchanged Integrated regression (24 November): Whitespace search left task list unchanged. | Pass |
| TC-56 | Duplicate task titles | App handles same title without corruption | Two tasks with same title and different descriptions created Integrated regression (24 November): Duplicate titles with different descriptions remained separate. | Pass |
| TC-57 | Browser restart and re-login persistence | Previously created tasks should remain for same user | Initially verified in mock mode. Integrated regression (24 November): Previously created tasks remained visible after logout, browser restart and re-login. | Pass |
| TC-58 | Admin user action control visibility | User management actions visible | Activate/Deactivate control visible; action not executed | Pass |
| TC-59 | Admin charts and task priority distribution | Charts render | Status doughnut and priority bar charts displayed Integrated regression (24 November): Status and priority charts and statistics displayed correctly. | Pass |
| TC-60 | Due date in the past | Behaviour follows product requirements | Past date accepted; requirement not established | Needs Clarification |
| TC-61 | Admin license notification | UI should not show unexpected license warning | Invalid PrimeUI License toast appeared | Needs Investigation |

## 9. Testing Notes

1. Initial manual testing used Angular mock mode; subsequent testing used the integrated Angular, Fastify and PostgreSQL application.
2. Integration and database verification were performed on 21 November, with additional checks on 24 November.
3. Current statuses reflect confirmed results and final retests; original mock-only checks remain identified where applicable. The 25 selected regression checks were repeated with mock data disabled.
4. BUG-01 and BUG-02 were reported, fixed and successfully retested (INT-18 and INT-19).
5. TC-60 and TC-61 remain observations; logout confirmation was an optional enhancement declined by the team.
6. Results are based on tester-confirmed checks; overlapping entries are not unique functionalities.

**Overall Testing Status:** All documented scenarios exercised; 59 of 61 original cases and 21 of 21 integration/API entries passed. Two observations remain. Targeted integrated regression: 25/25 passed (repeat executions, not additional test-case entries).

**Last Updated:** 24 November 2026.

## Integration and Backend Testing — 21 and 24 November 2026

The following tests were performed against the Fastify backend,

PostgreSQL database, and integrated Angular application.

| Test ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| INT-01 | Register a new user | User created successfully | HTTP 201; user stored in PostgreSQL | Pass |
| INT-02 | Register duplicate email | Duplicate registration rejected | HTTP 409 | Pass |
| INT-03 | Invalid email and short password | Invalid registration rejected | HTTP 400 | Pass |
| INT-04 | Login with valid and invalid credentials | Correct authentication responses | HTTP 200 and 401 respectively | Pass |
| INT-05 | Access tasks without authentication | Access denied | HTTP 401 | Pass |
| INT-06 | Create, view, edit, complete and delete tasks using API | All CRUD operations succeed | Verified using Thunder Client and PostgreSQL | Pass |
| INT-07 | Filter tasks by Pending and Completed status | Correct filtered tasks returned | Filters returned expected results | Pass |
| INT-08 | Submit whitespace-only title through API | Invalid title rejected | HTTP 400 | Pass |
| INT-09 | Submit invalid task priority | Invalid priority rejected | HTTP 400 | Pass |
| INT-10 | Access another user's tasks | Cross-user access prevented | GET excluded private tasks; PUT and DELETE returned 404 | Pass |
| INT-11 | Access admin API using USER account | Access denied | HTTP 403 | Pass |
| INT-12 | Admin views users, tasks and statistics | Admin data returned successfully | All three endpoints returned HTTP 200 | Pass |
| INT-13 | Admin changes another user's account status | Account status updates successfully | INACTIVE and ACTIVE changes returned HTTP 200 | Pass |
| INT-14 | Admin attempts to change own role or delete own account | Self-modification blocked | Both operations returned HTTP 400 | Pass |
| INT-15 | Website displays tasks created through API | PostgreSQL-backed tasks visible | Private Task User 1 appeared after login | Pass |
| INT-16 | Website task create, edit, complete and delete | All task operations work end-to-end | Full workflow verified | Pass |
| INT-17 | Deleted task remains deleted after refresh | Deletion persists | Task did not reappear after refresh | Pass |
| INT-18 | Long-title validation retest | Correct maximum-length warning | Correct maximum-length validation message displayed; task rejected | Pass |
| INT-19 | Whitespace-only title retest | Task rejected with clear validation message | Task rejected with appropriate frontend validation message | Pass |
| INT-20 | Admin changes another user’s role | Role updates successfully | 24 November: HTTP 200; USER → ADMIN → USER verified in PostgreSQL (API only) | Pass |
| INT-21 | Admin deletes another user and associated tasks | User and tasks removed | 24 November: HTTP 204; user and associated tasks absent in PostgreSQL (API only) | Pass |

## Targeted Integrated Regression Testing — 24 November 2026

Environment: Angular frontend with `useMockData: false` in both environment configurations, Fastify backend and PostgreSQL. The tester confirmed the results of 25 selected repeat checks through the website.

| Category | Existing test IDs | Passed |
|---|---|---:|
| Authentication and access | TC-02, TC-03, TC-07, TC-08, TC-10, TC-49, TC-50, TC-51, TC-52 | 9 |
| Task management and persistence | TC-20, TC-22, TC-47, TC-48, TC-53, TC-54, TC-56, TC-57 | 8 |
| Search and filters | TC-26, TC-27, TC-28, TC-44, TC-45, TC-46, TC-55 | 7 |
| Admin charts | TC-59 | 1 |
| Total | 25 repeat checks | 25 |

**Result:** 25 passed, 0 failed; no new failures reported. This was targeted regression, not a complete rerun of all 82 entries. The two existing observations (TC-60 and TC-61) remain unresolved.
