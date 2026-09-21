# TokTickIT - Sprint 3 UI Specification

## 1. Zen Green Design System & Theme Reusability

Sprint 3 reuses and extends the **Zen Green Design System** established in Lab 2. All typography, color tokens, button styles, card layouts, form conventions, and badges remain uniform across both existing and new screens.

### 1.1. Color Tokens
| Token Name | Hex Code | Primary Purpose in Sprint 3 |
| :--- | :--- | :--- |
| **Primary Green** | `#006B3C` | App header, primary CTA buttons, active pagination items, Brand logo |
| **Secondary Green**| `#0B7A46` | Focus outlines, hover states, secondary actions, outline buttons |
| **Pale Green** | `#EAF6EF` | Selected rows, public comments background, NEW & LOW badges |
| **Page Background**| `#F5F7F6` | Screen canvas background across all viewports |
| **Surface Cards** | `#FFFFFF` | Form cards, queue container, detail sections, modal dialogs |
| **Text Main** | `#1A2E23` | High-contrast body text, headings, input labels |
| **Text Muted** | `#5A6E63` | Subtitles, timestamp metadata, placeholder labels |
| **Border Gray** | `#E0E6E2` | Table borders, input borders, divider lines |
| **Internal Note Accent** | `#FFF8E1` | Private internal notes background tint |
| **Internal Note Border** | `#FFA000` | Private internal notes distinct left accent border |
| **Error / Alert** | `#B71C1C` | Form validation messages, deactivation warnings, danger actions |

### 1.2. Role Badge Styling
| Role | Background | Text Color | Border |
| :--- | :--- | :--- | :--- |
| **Requester** | `#E8F5E9` | `#2E7D32` | 1px solid `#C8E6C9` |
| **IT Staff** | `#E3F2FD` | `#1565C0` | 1px solid `#BBDEFB` |
| **Administrator** | `#F3E5F5` | `#6A1B9A` | 1px solid `#E1BEE7` |

> **Enum Mapping Note:** The database and API contracts use SCREAMING_SNAKE_CASE enum values (`REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`). The UI badges use human-readable title casing display strings (`Requester`, `IT Staff`, `Administrator`). Frontend components map database enum keys to these display strings when rendering.

### 1.3. Ticket Status Badges
- `New`: Background `#EAF6EF`, Text `#006B3C`
- `Open`: Background `#E1F5FE`, Text `#0277BD`
- `In Progress`: Background `#FFF3E0`, Text `#EF6C00`
- `Waiting for Requester`: Background `#EDE7F6`, Text `#512DA8`
- `Resolved`: Background `#E8F5E9`, Text `#2E7D32`
- `Closed`: Background `#ECEFF1`, Text `#455A64`
- `Reopened`: Background `#FBE9E7`, Text `#D84315`
- `Cancelled`: Background `#FFEBEE`, Text `#C62828`

---

## 2. Application Shell & Navigation

The application shell adapts dynamically based on the authenticated user's role:
- **Header Top Bar:**
  - Left: TokTickIT Brand logo and Sprint environment indicator.
  - Center/Nav Links:
    - **Requester:** `My Tickets`, `+ Create Ticket`
    - **IT Staff:** `Ticket Queue`, `+ Create Ticket`
    - **Administrator:** `User Management`
  - Right:
    - Authenticated user name and Role badge (e.g. `Pae Karn [IT Staff]`).
    - `Logout` button (triggers session destruction and redirects to `/login`).

---

## 3. Screen Specifications

### 3.1. Login Screen (`/login`)
- **Structure:** Centered Zen Green card (max width 440px) on `#F5F7F6` background.
- **Form Controls:**
  - Email address input (type `email`, required, autofocus).
  - Password input (type `password`, with toggle visibility icon).
  - Primary button: `Sign In` (with loading spinner during API request).
- **Validation & Feedback:**
  - Inline error alert if credentials invalid or account inactive (generic safe message).
  - Disabled submit button while in-flight.

### 3.2. Mandatory Change Password Screen (`/change-password`)
- **Trigger:** Rendered automatically when an authenticated user has `mustChangePassword = true`.
- **Notice Banner:** Amber callout informing user that an initial or reset password was detected.
- **Form Controls:**
  - Current Password input.
  - New Password input (with password complexity checklist).
  - Confirm New Password input.
  - Primary button: `Save New Password & Continue`.
- **Validation Rules:**
  - Minimum 8 characters, >=1 uppercase, >=1 lowercase, >=1 number.
  - Confirmation password must match exactly.
  - Submission updates password and navigates to role landing screen.

### 3.3. Requester Regression Screens
- **Create Ticket (`/create-ticket`):**
  - Uses authenticated user identity automatically. Development Requester Selector is completely removed.
  - Pre-populates requester identity in read-only info card.
  - Retains all Lab 2 validation, category loading, and attachment upload controls.
- **My Tickets (`/tickets`):**
  - Displays exclusively tickets owned by the authenticated Requester.
  - Retains search, multi-filters, sorting, pagination, and empty/no-results states.
- **Requester Ticket Detail (`/tickets/:id`):**
  - Read-only ticket summary and attachments section.
  - **Public Comments Panel:** Displays chronological public comments with author name and timestamp. Form to append new comments.
  - **Problem Appears Resolved:** Prominent button allowing Requester to notify IT Staff that the issue is resolved.

### 3.4. IT Staff Ticket Queue Screen (`/staff/queue`)
- **Structure:** High-density operational data table on Desktop; Ticket Card stack on Mobile.
- **Controls & Toolbar:**
  - Search input with 250ms debounce (searches Ticket Number and Summary).
  - Filter Bar: Category dropdown, Status dropdown, Priority dropdown, IT Priority dropdown, Ownership filter (`All`, `Unassigned`, `Assigned to Me`).
  - Sort header controls (Ticket No, Created Date, IT Priority, Status).
  - Pagination controls (Items per page: 10, 25, 50, Previous/Next navigation).
- **Row Elements:**
  - Ticket No (clickable link to `/staff/tickets/:id`), Created Date, Summary, Category, Requested Priority badge, IT Priority badge, Status badge, Ticket Owner (User name or `Unassigned` badge).

### 3.5. IT Staff Ticket Detail Screen (`/staff/tickets/:id`)
- **Header:** Back to Queue link, Ticket Number heading, Status badge, IT Priority badge.
- **Operational Toolbar:**
  - `Claim Ticket` button (when unassigned): Instantly sets current IT Staff as owner.
  - `Reassign` dropdown/button: Select active IT Staff or Administrator.
  - `IT Priority` select control: Adjust priority (`LOW`, `MEDIUM`, `HIGH`).
  - `Status Transition` selector: Dropdown offering only permitted next states according to state matrix. If `Resolved` selected, presents modal/drawer for mandatory `resolutionSummary`.
- **Content Panels:**
  - Request Details (Requester info, Category, Related System, Dates).
  - Summary & Description.
  - Attachments section (with download and soft-removal capability).
  - **Dual Communication Panel:**
    - **Tab 1: Public Comments:** Styled with `#EAF6EF` green tint. Visible to all parties.
    - **Tab 2: Internal Notes:** Styled with `#FFF8E1` yellow tint and `#FFA000` border with a bold "Private: Visible only to IT Staff & Admin" lock banner.
    - Each tab includes input textarea and append submit button.

### 3.6. Administrator User Management Screen (`/admin/users`)
- **Toolbar:** Search bar (searches name or email), Role filter dropdown (`All`, `Requester`, `IT Staff`, `Administrator`), `+ Create User` CTA button.
- **User Table (Desktop):**
  - Columns: Full Name, Email Address, Role badge, Status badge (`Active` green / `Inactive` gray), Must Change Password indicator, Actions (`Edit`, `Reset Password`).
- **User Card Stack (Mobile):** Responsive card layout preserving all actions.
- **Create User Drawer / Modal:**
  - Full Name, Email Address, Role selection (Radio / Dropdown with exactly 1 choice), Initial Password input, Active status toggle.
- **Edit User Modal:**
  - Edit Full Name, Email Address, Role selection, Active status toggle.
  - Safety Guards: Deactivation toggle and Role change are disabled if editing self or last active Administrator.
- **Reset Password Modal:**
  - Input field for new initial password. Confirmation dialog noting user will be forced to change it upon login.

---

## 4. Responsive & Accessibility Matrix
- **Desktop Viewport (&ge; 992px):** Multi-column form layouts, full data tables, side-by-side comment/note feeds, max container width 1200px.
- **Tablet Viewport (768px - 991px):** Two-column forms, scrollable data tables, stacked detail sections.
- **Mobile Viewport (&lt; 768px):** Single-column stacked forms, card-based lists replacing tables, minimum touch target height 44px.
- **Small Mobile Viewport (320px):** Tested at 320x568px. Long emails, ticket numbers, and file names break safely with `word-break: break-word` and no horizontal page scroll.
- **Accessibility:**
  - Semantic HTML landmarks (`<header>`, `<nav>`, `<main>`, `<section>`).
  - Form controls have associated `<label>` and `aria-required="true"`.
  - Contrast ratios conform to WCAG 2.1 AA (&ge; 4.5:1 for text).
  - Visible green focus outlines (`#0B7A46`) on all interactive controls.
