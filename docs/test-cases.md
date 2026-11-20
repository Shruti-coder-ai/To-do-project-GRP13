
# To-Do App – QA Test Cases

**Project:** To-Do App – Group 13  
**QA Role:** Testing and Documentation  
**QA Member:** Kripa Naik  
**Git Branch:** feature/testing-docs

## 1. Purpose

The purpose of this document is to define test cases for checking the functionality, usability, reliability and security of the To-Do App.

Testing covers User and Admin roles, authentication, task management and filters. Database persistence and backend access permissions remain outside the verified scope of this mock-mode run.

## 2. Test Status

- Not Tested – Test has not been performed.
- Pass – Actual result matches expected result.
- Fail – Actual result does not match expected result.
- Blocked – Testing cannot be performed due to an unavailable dependency.

## 3. Authentication Testing

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-01 | Valid registration | Enter valid registration details and submit | Account should be created successfully | Registration succeeded. | Pass |
| TC-02 | Empty registration fields | Leave required fields empty and submit | Validation messages should appear | Required-field validation displayed for empty registration fields (user-confirmed). | Pass |
| TC-03 | Invalid email | Enter an invalid email address | System should reject invalid email | Invalid email format rejected. | Pass |
| TC-04 | Duplicate registration | Register using an existing email | Duplicate account should be prevented | Duplicate account rejected. | Pass |
| TC-05 | Valid login | Enter correct email and password | User should log in successfully | Valid credentials opened user dashboard. | Pass |
| TC-06 | Invalid password | Enter an incorrect password | Login should be rejected | Incorrect password rejected. | Pass |
| TC-07 | Unregistered account | Enter an unregistered email | Login should be rejected | Login rejected with “Invalid email or password. Please verify your credentials.” | Pass |
| TC-08 | Empty login fields | Submit without entering credentials | Validation messages should appear | Required-field warnings displayed. | Pass |
| TC-09 | Logout | Click the Logout option | User should be logged out | Logout returned to login. | Pass |
| TC-10 | Protected page after logout | Log out and try opening dashboard directly | Access should be denied or redirected to login | Direct user dashboard URL redirected to login after logout. | Pass |

## 4. User Dashboard and Task Management

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-11 | View dashboard | Log in as a User | User dashboard should appear | User dashboard displayed. | Pass |
| TC-12 | Add task | Enter a valid task title and submit | Task should be created | Task created successfully. | Pass |
| TC-13 | Empty task title | Submit task without a title | Validation should appear | Empty title rejected. | Pass |
| TC-14 | Long task title | Enter a very long title | Input should be handled safely | Long title was rejected, but incorrect minimum-length validation message appeared. | Fail |
| TC-15 | Add description | Enter task title and description | Task details should be saved | Task description saved. | Pass |
| TC-16 | View tasks | Open the task list | User's tasks should appear | Task list displayed. | Pass |
| TC-17 | Edit task | Change task details and save | Updated details should appear | Edited task displayed updated details. | Pass |
| TC-18 | Delete task | Select Delete on a task | Task should be removed | Task deletion and confirmation worked. | Pass |
| TC-19 | Mark completed | Mark a pending task as completed | Task status should change | Pending task marked completed. | Pass |
| TC-20 | Reopen task | Change a completed task back to pending | Task should become pending | Completed task reopened as pending. | Pass |
| TC-21 | Refresh application | Add a task and refresh the page | Task should remain saved | Task remained after refreshing the page (user-confirmed, mock mode). | Pass |
| TC-22 | Empty task list | Open dashboard with no tasks | Suitable empty-state message should appear | Empty task list displayed an appropriate empty-state message (user-confirmed). | Pass |

## 5. Search and Filters

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-23 | View all tasks | Select All Tasks | All user's tasks should appear | All filter displayed tasks. | Pass |
| TC-24 | Pending filter | Select Pending | Only pending tasks should appear | Pending filter worked. | Pass |
| TC-25 | Completed filter | Select Completed | Only completed tasks should appear | Completed filter worked. | Pass |
| TC-26 | Search existing task | Search for an existing title | Matching task should appear | Existing task search returned match. | Pass |
| TC-27 | Search unavailable task | Search for a nonexistent title | No matching tasks message should appear | A no-results message appeared for a nonexistent search query. | Pass |
| TC-28 | Clear search | Clear the search input | Full task list should return | Clearing search restored the full task list (user-confirmed). | Pass |

## 6. Admin Dashboard and Permissions

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-29 | Admin login | Log in with valid Admin credentials | Admin dashboard should appear | Admin credentials opened admin dashboard. | Pass |
| TC-30 | View registered users | Open Admin user section | Registered users should be displayed | Registered users list displayed. | Pass |
| TC-31 | View all tasks | Open Admin task section | Admin should see all users' tasks | All Platform Tasks displayed task details. | Pass |
| TC-32 | Manage users | Perform an available user-management action | Action should work according to Admin permissions | Activate/Deactivate control visible; no account action executed. | Not Tested |
| TC-33 | View statistics | Open Admin statistics | Task statistics should be displayed correctly | Statistics and charts displayed; displayed task totals were internally consistent. | Pass |
| TC-34 | User opens Admin page | Log in as User and access Admin page | Access should be denied | User credentials on admin login redirected to user dashboard; direct admin URL access not tested. | Not Tested |
| TC-35 | User accesses Admin API | Attempt an Admin-only API request as User | Backend should reject unauthorised access | Backend Admin API not tested (mock mode). | Not Tested |
| TC-36 | Access another user's task | Attempt to view or modify another user's task | Access should be denied | Cross-user task access not tested. | Not Tested |

## 7. Database and Reliability Testing

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-37 | Task persistence in mock mode | Create a task, log out, and log back into the same account | Task should remain saved | User confirmed the task remained after re-login to the same account; this does not verify PostgreSQL persistence. | Pass |
| TC-38 | User data isolation | Create tasks using two User accounts | Each User should see only their own tasks | Two-account task isolation not tested. | Not Tested |
| TC-39 | Update persistence | Edit a task and reload | Updated details should remain saved | Edited-task persistence after reload not verified. | Not Tested |
| TC-40 | Delete persistence | Delete a task and reload | Deleted task should not reappear | Deleted-task persistence after reload not verified. | Not Tested |
| TC-41 | Backend unavailable | Attempt an action when server is unavailable | Clear error should appear | Backend outage behaviour not tested (mock mode). | Not Tested |
| TC-42 | Responsive layout | Open application at desktop and mobile screen sizes | Layout should remain usable | User checked the dashboard in Chrome mobile device view and reported no overlapping or cut-off elements. | Pass |

## 8. Additional Manual Scenarios

| Test ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-43 | Whitespace-only task title | Reject a title consisting only of spaces | Task was created with spaces as title | Fail |
| TC-44 | Search by description | Matching tasks displayed | Search matched descriptions | Pass |
| TC-45 | Case-insensitive search | Search ignores letter case | Search worked regardless of case | Pass |
| TC-46 | Search with status filter | Results satisfy search and status | Combined search and status filters worked | Pass |
| TC-47 | Edit cancellation | Cancel leaves original task unchanged | Original task remained unchanged | Pass |
| TC-48 | Delete cancellation | Cancel leaves task unchanged | Task remained | Pass |
| TC-49 | Password visibility | Visibility toggle changes display | Toggle worked | Pass |
| TC-50 | Short registration password | Minimum length enforced | At least 6 characters warning shown | Pass |
| TC-51 | Password confirmation mismatch | Mismatch rejected | Mismatch rejected | Pass |
| TC-52 | User credentials on admin login page | User should not obtain admin access | Redirected to User Dashboard | Pass |
| TC-53 | Priority display and editing | Priority displays and updates | High, Medium and Low displayed; edit worked | Pass |
| TC-54 | Priority on refresh | Selected priority remains | Priority persisted after refresh | Pass |
| TC-55 | Whitespace search | Blank search should not unexpectedly filter tasks | Task list remained unchanged | Pass |
| TC-56 | Duplicate task titles | App handles same title without corruption | Two tasks with same title and different descriptions created | Pass |
| TC-57 | Browser restart and re-login persistence | Previously created tasks should remain for same user | User confirmed previously created tasks remain visible after logging in; dashboard screenshot supplied. Verified in frontend mock mode only. | Pass |
| TC-58 | Admin user action control visibility | User management actions visible | Activate/Deactivate control visible; action not executed | Pass |
| TC-59 | Admin charts and task priority distribution | Charts render | Status doughnut and priority bar charts displayed | Pass |
| TC-60 | Due date in the past | Behaviour follows product requirements | Past date accepted; requirement not established | Needs Clarification |
| TC-61 | Admin license notification | UI should not show unexpected license warning | Invalid PrimeUI License toast appeared | Needs Investigation |

## 9. Testing Notes

1. Manual testing was performed in Google Chrome on Angular localhost:4200 with `useMockData: true`.
2. User and Admin dashboards were checked in frontend mock mode; backend and PostgreSQL were not verified.
3. Pass/Fail reflects only scenarios confirmed in the testing conversation; partial checks remain Not Tested.
4. Failed test cases will be documented in `bug-report.md`.
5. Failed cases will be retested after fixes.
6. No test will be marked as Passed without actual verification.

**Overall Testing Status:** Frontend mock-mode manual testing partially complete; integration and permission checks pending.

**Last Updated:** 20 November 2026.
