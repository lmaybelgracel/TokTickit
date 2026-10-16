# TokTickIT - Sprint 4 UI & Style Specification

## 1. Zen Green Design System Foundations

The TokTickIT interface adheres strictly to the **Zen Green** design language established in Lab 2 and expanded in Lab 3. All new screens in Sprint 4 (Dashboards, Actions Taken panels, and Workflow controls) must maintain visual harmony, typography, spacing, and accessibility standards.

### 1.1. Color Tokens & Semantic Usage

| Token Name | Hex Value | Semantic Usage |
|:---|:---|:---|
| `--color-primary` | `#006B3C` | Brand identity, primary buttons, primary headers, active tab highlights |
| `--color-primary-hover` | `#00522E` | Hover state for primary buttons and interactive elements |
| `--color-primary-light` | `#EAF6EF` | Selected card backgrounds, badge backgrounds, active pill navigation |
| `--color-accent` | `#0B7A46` | Secondary headers, sub-navigation, progress indicators |
| `--color-text-main` | `#1A2E23` | High-contrast body text, primary data labels (WCAG AAA compliant) |
| `--color-text-muted` | `#4A5E53` | Subtitles, field hints, secondary metadata, table headers |
| `--color-border` | `#D6DFD9` | Card borders, table cell dividers, form input borders |
| `--color-bg-page` | `#F8FAF9` | Global application page background |
| `--color-bg-card` | `#FFFFFF` | Metric cards, content containers, modal dialog backgrounds |
| `--color-warning-bg` | `#FFFBEB` | Amber callout backgrounds, "Waiting for Requester", Follow-up Required banners |
| `--color-warning-border` | `#D97706` | Amber borders, follow-up flags, attention-required indicators |
| `--color-warning-text` | `#92400E` | High-contrast amber text for warning and follow-up badges |
| `--color-danger-bg` | `#FEF2F2` | Red error banners, cancelled status badges, urgent priority cards |
| `--color-danger-border` | `#DC2626` | Urgent priority indicators, form validation error outlines |
| `--color-danger-text` | `#991B1B` | Error messages, urgent priority text |
| `--color-info-bg` | `#EFF6FF` | Blue informative banners, claim notices |
| `--color-info-border` | `#2563EB` | Blue accent lines, status notes |
| `--color-info-text` | `#1D4ED8` | Informational text |

### 1.2. Status & Priority Badge Mappings

```
Status Badges:
- NEW:                    Background: #F1F5F9 | Text: #475569 (Slate Gray)
- OPEN:                   Background: #E0F2FE | Text: #0369A1 (Sky Blue)
- IN_PROGRESS:            Background: #FEF3C7 | Text: #B45309 (Warm Amber)
- WAITING_FOR_REQUESTER:  Background: #FFFBEB | Text: #92400E (Attention Amber)
- RESOLVED:               Background: #DEF7EC | Text: #03543F (Success Mint)
- CLOSED:                 Background: #F3F4F6 | Text: #374151 (Neutral Gray)
- REOPENED:               Background: #FEE2E2 | Text: #991B1B (Reopened Coral)
- CANCELLED:              Background: #FDE8E8 | Text: #9B1C1C (Soft Crimson)

Priority Badges:
- LOW:                    Background: #F1F5F9 | Text: #475569 (Subtle Gray)
- MEDIUM:                 Background: #E0F2FE | Text: #0369A1 (Moderate Blue)
- HIGH:                   Background: #FEF3C7 | Text: #B45309 (Warning Amber)
- URGENT:                 Background: #FDE8E8 | Text: #991B1B (Critical Red with Pulse Dot)
```

---

## 2. IT Staff Dashboard UI Specification

### 2.1. Screen Layout & Visual Hierarchy
- **Header Shell**: Persistent top navigation with Brand logo, "Dashboard" (active indicator), "Ticket Queue", "User Management" (Admin only), and User Profile / Logout menu.
- **Welcome & Operational Summary Banner**:
  - Gradient container (`linear-gradient(135deg, #006B3C 0%, #0B7A46 100%)`) with white text.
  - Greeting with authenticated staff member name, role badge, and current operational timestamp.
  - Quick refresh button with loading spinner indicator.
- **Operational Metric Cards Grid**:
  - 5 primary metric cards displayed on desktop (3+2 on desktop, 2x2+1 on tablet, stacked on mobile):
    1. **Unassigned Tickets**: Large numeric value, subtitle "Tickets awaiting owner", Green indicator bar, clickable drill-down linking to `/staff/queue?assignment=unassigned`.
    2. **My Assigned Tickets**: Large numeric value, subtitle "Tickets you are coordinating", Primary Green accent, clickable drill-down linking to `/staff/queue?assignment=mine`.
    3. **My Actions Recorded**: Large numeric value, subtitle "Actions performed by you", Accent Green bar, clickable drill-down linking to `/staff/queue?filter=my-actions` (current-user Actions Taken).
    4. **Urgent Tickets**: Large numeric value, Critical Red indicator dot, subtitle "Requiring immediate action", clickable drill-down linking to `/staff/queue?priority=URGENT`.
    5. **Waiting for Requester**: Large numeric value, Amber warning indicator, subtitle "Pending user response", clickable drill-down linking to `/staff/queue?status=WAITING_FOR_REQUESTER`.
- **Status & Priority Distribution Matrix**:
  - Compact visual breakdown displaying counts across all 8 statuses and 4 priority levels.
- **Recent Queue Activity Panel**:
  - Clean table displaying up to 5 recently updated tickets across the organization.
  - Columns: Ticket Number, Summary, Priority Badge, Status Badge, Owner Name, Last Updated relative time.
  - Clicking any row navigates directly to `StaffTicketDetail` for that ticket.
- **Quick Actions Toolbar**:
  - Prominent buttons for "View Full Ticket Queue", "Create New Ticket", and "Search Tickets".

---

## 3. Requester Dashboard UI Specification

### 3.1. Screen Layout & Visual Hierarchy
- **Header Shell**: Persistent top navigation with Brand logo, "Dashboard" (active indicator), "My Tickets", "Create Ticket", and User Profile / Logout menu.
- **Welcome Banner**:
  - Clean card container with Zen Green accent border.
  - Greeting with requester name and summary caption: "Track your active service requests and recent updates."
- **Personal Metric Cards Grid**:
  - 3 metric cards on desktop:
    1. **Total Open Tickets**: Numeric count of non-terminal tickets owned by the caller. Links to `/my-tickets?status=open`.
    2. **Action Required**: Highlighted in Amber if count > 0 ("Waiting for your reply"), links to `/my-tickets?status=waiting`.
    3. **Resolved / Closed**: Clean muted card showing completed tickets, links to `/my-tickets?status=resolved`.
- **Recent Ticket Progress List**:
  - Up to 5 most recently updated owned tickets.
  - Each item displays: Ticket Number, Subject, Current Status Badge, Last Update timestamp, and a direct button "View Details".
- **Empty State Behavior**:
  - If user has zero tickets: Displays a calming Zen Green illustration with text "You have no active tickets. Everything is running smoothly!" and a large "Create Your First Ticket" button.

---

## 4. Actions Taken on Ticket Detail UI Specification

### 4.1. Visual Placement & Structure
- Situated directly below the primary Ticket Information Card and above the Public Comments / Internal Notes dual-stream panel.
- Header: **Actions Taken (ประวัติการปฏิบัติงาน)** with count badge (e.g. `[ 3 ]`).
- Role-Specific Controls:
  - For IT Staff / Admin: Displays a green button "+ Record Action Taken" (เพิ่มบันทึกการทำงาน).
  - For Requesters: Button is hidden; view-only mode is enforced.

### 4.2. Actions Taken List View
- Renders as a structured card timeline or bordered table.
- Each Action Item displays:
  - **Header Row**: Action Date/Time (formatted as `DD/MM/YYYY, HH:mm`), Performed By badge with staff name, and optional "Edit" icon/button (staff only).
  - **Action Description**: Clean typography describing the work executed.
  - **Result Box**: Sub-box with light gray background (`#F1F5F9`) stating the direct outcome.
  - **Follow-up Banner (Conditional)**: If `followUpRequired = true`, renders an Amber Callout Box (`border-left: 4px solid #D97706; background: #FFFBEB`) displaying:
    - Label: **Follow-up Required (ต้องติดตามงานต่อ)**
    - Note: Verbatim follow-up instructions.
  - **Attachment Notes (Conditional)**: If present, displayed with a small paperclip indicator (`Notes on Files: ...`).

### 4.3. Record / Edit Action Modal Dialog
- Accessible modal window with backdrop overlay (`rgba(0, 0, 0, 0.4)`).
- Form Controls:
  1. **Action Date & Time**: `datetime-local` input pre-filled with current local time.
  2. **Action Description**: Textarea with placeholder "Describe the technical steps or troubleshooting performed...", character counter (3–2000 chars).
  3. **Result**: Textarea with placeholder "Describe the technical outcome...", character counter (2–1000 chars).
  4. **Follow-Up Required**: Zen Green toggle switch / checkbox.
  5. **Follow-up Note**: Appears with smooth transition when toggle is enabled. Marked with red asterisk (*), character counter (3–1000 chars).
  6. **Attachment Notes**: Text input for file references (optional, max 500 chars).
- Actions: "Cancel" (neutral outline) and "Save Action" (solid Zen Green button). Disabled with spinner during network submission.

---

## 5. Responsive Design Standards

| Viewport Category | Width Range | Layout Adaptation Rules |
|:---|:---|:---|
| **Desktop** | `>= 1280px` | 4-column metric grid, full-width data tables, multi-column form rows, side-by-side action bars |
| **Tablet** | `768px – 1024px` | 2-column metric grid, responsive table with horizontal card fallback, collapsed sidebars |
| **Mobile** | `375px – 480px` | Single-column stacked cards, full-width buttons, modal fills 95% of viewport width, zero horizontal scrolling |
| **Small Mobile** | `320px` | Minimized padding (8px), stacked header elements, wrapped badges |

---

## 6. Accessibility & WCAG 2.1 AA Checklist

- [x] **Color Contrast**: All primary text (`#1A2E23` on `#FFFFFF` / `#F8FAF9`) achieves a contrast ratio > 7:1 (exceeds AAA). Secondary text achieves > 4.5:1.
- [x] **Non-Color Status Cues**: Every status badge pairs color with clear text labels and distinct border styles.
- [x] **Keyboard Navigation**: All interactive elements (metric cards, modal buttons, tabs) possess visible focus rings (`outline: 2px solid #006B3C; outline-offset: 2px`).
- [x] **Screen Reader Support**: Semantic HTML (`<main>`, `<section>`, `<nav>`, `<header>`, `<table>`) with appropriate `aria-label` attributes on modal dialogs and icon buttons.
- [x] **Form Usability**: Explicit `<label for="...">` associations for all form fields; real-time inline validation placed directly below inputs.
