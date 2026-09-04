# Lab 2 UI Specification — Zen Green Theme & Presentation Standards

## 1. Overview & Design Philosophy
This document defines the complete UI specification for TokTickIT Lab 2, implementing the **Zen Green Theme**. The interface is designed to present a professional, clean, accessible, and responsive user experience for Requesters across Desktop, Tablet, and Mobile viewports.

---

## 2. Color Tokens & Theme System

| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| `color-primary-green` | `#006B3C` | App header bar, primary CTA buttons, strong title emphasis. |
| `color-secondary-green` | `#0B7A46` | Active tab indicators, focus outlines, hover states, secondary actions. |
| `color-pale-green` | `#EAF6EF` | Selected table row background, success banners, subtle section callouts. |
| `color-page-bg` | `#F5F7F6` | Quiet near-white main page background. |
| `color-surface-card` | `#FFFFFF` | Form cards, table containers, modal surfaces with subtle `#E0E6E2` border. |
| `color-text-main` | `#1A2E23` | High-contrast dark charcoal-green for body text and headings. |
| `color-text-muted` | `#5A6E63` | Subtitles, helper text, timestamps, secondary metadata. |
| `color-field-editable` | `#FFFFFF` | Background for active form input fields with neutral border (`#C2D1C8`). |
| `color-field-readonly` | `#F0F4F2` | Soft gray-green shading for read-only / system-generated fields. |
| `color-error-text` | `#B71C1C` | Error text, inline validation error messages, error alert borders. |
| `color-error-bg` | `#FDF2F2` | Background for field validation error callouts. |
| `color-warning-badge` | `#E65100` | Amber background for Medium priority badges and warning indicators. |
| `color-success-badge` | `#2E7D32` | Green confirmation badge text and icon tint. |

---

## 3. Priority and Status Badge Specification

To maintain visual clarity across table lists, cards, and detail views, Priority and Status badges use explicit color pairings:

### Requested Priority Badges
- **HIGH Priority:** Background `#FDF2F2`, Border `#F5C6CB`, Text `#B71C1C` (Dark Red).
- **MEDIUM Priority:** Background `#FFF3E0`, Border `#FFE0B2`, Text `#E65100` (Dark Amber).
- **LOW Priority:** Background `#E8F5E9`, Border `#C8E6C9`, Text `#2E7D32` (Dark Green).

### Current Status Badges
- **NEW Status:** Background `#EAF6EF`, Border `#B2DFDB`, Text `#006B3C` (Primary Zen Green).

---

## 4. Typography & Spacing Rules

- **Font Family:** Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Headings:**
  - `h1`: 24px (1.5rem), Bold (700), Line Height 1.2, Color `#006B3C`
  - `h2`: 20px (1.25rem), SemiBold (600), Line Height 1.3, Color `#1A2E23`
  - `h3`: 16px (1rem), SemiBold (600), Line Height 1.4, Color `#1A2E23`
- **Body Text:** 14px (0.875rem), Regular (400), Line Height 1.5.
- **Field Labels:** 13px (0.8125rem), Medium (500), Color `#1A2E23`, positioned directly above controls.
- **Spacing Grid:** Base unit 4px (Margins/Paddings: 4px, 8px, 12px, 16px, 24px, 32px).

---

## 5. Component States & Hierarchy

### Form Control States
1. **Initial / Default:** White background, neutral border (`#C2D1C8`), dark text.
2. **Focused:** Border changes to `#0B7A46`, 2px subtle green box-shadow outline.
3. **Read-Only / System Generated:** Soft gray-green shading (`#F0F4F2`), dark text, cursor `not-allowed`. Distinctly visual from editable fields.
4. **Invalid / Error:** Red border (`#B71C1C`), red inline validation message positioned directly below the field.
5. **Disabled / Busy:** Opacity 60%, cursor `not-allowed`, interactions blocked.

### Button Hierarchy
- **Primary Button (`btn-primary`):** Background `#006B3C`, text white, hover `#0B7A46`. Used for primary submission (Submit Ticket, Select Requester).
- **Secondary Button (`btn-secondary`):** White background, border `#006B3C`, text `#006B3C`, hover `#EAF6EF`. Used for Cancel, Clear Filters, Change Requester.
- **Destructive Button (`btn-danger`):** Background `#B71C1C`, text white, hover `#8E0000`. Used for Soft Removal confirmation.
- **Busy State:** Displays loading spinner inside button, text changes to "Submitting..." or "Processing...", button disabled.

---

## 6. Screen Layout Specifications

### 6.1 Development Requester Selection Screen
- **Purpose:** Testing mechanism to select active simulated Requester identity.
- **Layout:** Centered surface card (max-width 480px) on `#F5F7F6` background.
- **Elements:**
  - Title: "Select Development Requester"
  - Explanatory notice banner (Pale Green background) stating this is for Lab 2 testing only, not real login.
  - Active Requesters Dropdown (Select menu).
  - Primary "Continue to Application" button.
  - Loading skeleton state during initial fetch.
  - Empty state message if no active Requesters exist.

### 6.2 Create Ticket Screen
- **Layout:** Responsive container (max-width 896px).
- **Structure:**
  - **Header Section (Read-only / System Generated):**
    - Ticket Number (`TKT-YYYY-XXXXXX` placeholder / generated post-creation)
    - Ticket Date (Current timestamp)
    - Requester Name (From active session context)
  - **Classification Section:**
    - Category (Dropdown: Account and Access, Hardware, Software, Network)
    - Related System (Dropdown: Email, Campus Wi-Fi, VPN, LEB2 App, Grade Submission App, Printer, Corporate Laptop)
    - Requested Priority (Segmented control or Radio pill: Low, Medium, High)
  - **Content Section:**
    - Ticket Summary (Single-line input, required mark `*`, 5-150 chars)
    - Description (Multiline textarea, min-height 120px, required mark `*`, 10-2000 chars)
  - **Attachments Section:**
    - File selection dropzone / file picker.
    - File constraints helper text: "Allowed: JPG, PNG, WEBP, PDF | Max: 5 MB per file | Max active files: 5".
    - Selected attachment list with file name, file size, and remove button.
  - **Action Footer:**
    - Primary Submit Ticket button & Secondary Cancel button.

### 6.3 My Tickets Screen
- **Layout:** Full container (max-width 1200px).
- **Controls Bar:**
  - Search Box (Input with search icon: filters ticket number or summary).
  - Filter Dropdowns: Category, Priority, Status (`New`).
  - Clear Filters button.
  - Primary "Create Ticket" action button.
- **Desktop Table View ($\ge 768\text{px}$):**
  - Columns: Ticket No., Ticket Date, Summary, Category, Priority Badge, Status Badge, Action (View Detail).
  - Hover effect on rows, pale green highlight on selected row.
- **Mobile Card View ($< 768\text{px}$):**
  - Card layout per ticket showing Ticket No. (bold), Summary, Priority pill, Date, and View button.
- **Pagination Footer:**
  - Pagination metadata ("Showing 1 to 10 of 42 tickets"), Page size selector, Previous/Next navigation buttons.
- **Empty & No-Results States:**
  - Empty State (No tickets created yet): Illustration placeholder + "No tickets found. Create your first IT support ticket."
  - No-Results State (Search/Filter returned 0 items): "No tickets match your search filters." + Clear Filters button.

### 6.4 Ticket Detail Screen & Attachment Presentation
- **Layout:** Two-column split on Desktop, stacked on Mobile.
- **Main Detail Panel:** Read-only fields displaying Ticket No, Ticket Date, Requester, Category, Related System, Priority Badge, Status Badge, Summary, Description.
- **Active Attachment Presentation:**
  - Cards showing filename, size, upload date, "Download" button (`#0B7A46`), and "Soft Remove" button (`#B71C1C`). Lab 2 does not render files inline; download is the only active-file retrieval action.
- **Soft-Removed Attachment Visual State:**
  - Filename styling: Strikethrough text (`line-through`) with muted text color (`#5A6E63`).
  - Badge: Gray "Removed" pill badge (`#E0E6E2` background, `#5A6E63` text).
  - Metadata block: Displays removal timestamp (`Removed on YYYY-MM-DD HH:mm`) and removal reason callout box (`#F9F9F9` background, italic text).
  - Action buttons: the "Download" button is disabled with a lock icon and tooltip: "File removed - download unavailable"; no preview action is rendered.
- **Soft Removal Dialog:** Modal prompting user for a required removal reason (3-250 chars) before confirming soft removal.

---

## 7. Responsive Viewport Rules

| Viewport | Width Boundary | Layout Strategy |
| :--- | :--- | :--- |
| **Desktop** | $\ge 992\text{px}$ | Multi-column form layouts, full data table view, centered content max 1200px. |
| **Tablet** | $768\text{px} - 991\text{px}$ | Two-column form layouts, summary/description full width, table with horizontal scroll if needed. |
| **Mobile** | $< 768\text{px}$ | Single-column stacked fields, full-width touch-friendly buttons (min height 44px), card-based list view instead of wide tables. |

---

## 8. Accessibility & Non-Color Indicators

- **Required Fields:** Marked with red asterisk `*` accompanied by `aria-required="true"`.
- **Keyboard Navigation:** All interactive elements (inputs, buttons, select menus, pagination) must maintain visible focus rings (`color-secondary-green`).
- **Color Independence:** Statuses and Priorities use explicit text labels inside badges (e.g. "High", "Medium", "Low", "New") so meaning is not conveyed by color alone.
- **Screen Reader Support:** Icon-only buttons include `aria-label` and `title` tooltips.

---

## 9. Visual Inspection Checklist & Screenshot Artifacts

During responsive and visual QA (Issue 14), Playwright screenshots are captured and saved under `artifacts/lab-02/screenshots/`; they are re-verified during final integration (Issue 16):

- `artifacts/lab-02/screenshots/create-ticket/` (Desktop, Tablet, Mobile, Validation error state, Submitting state, Success state)
- `artifacts/lab-02/screenshots/my-tickets/` (Desktop table view, Mobile and 320 px small-mobile card views, Filtered state, No-results state, Dev Requester switched state)
- `artifacts/lab-02/screenshots/ticket-detail/` (Read-only detail view, Active attachments list, Soft-removed attachments metadata, and removal modal including a 320 px small-mobile check)
