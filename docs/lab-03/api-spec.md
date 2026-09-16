# TokTickIT - Sprint 3 REST API Specification

## 1. Authentication & Security Contract

### 1.1. Protocol & Headers
- **Authentication Mechanism:** Bearer JWT Token passed via `Authorization: Bearer <token>` header or Secure HTTP-only Cookie (`toktickit_session`).
- **Session Payload:** `{ userId: number, email: string, role: "REQUESTER" | "IT_STAFF" | "ADMINISTRATOR", mustChangePassword: boolean }`.
- **Token Expiration:** 24 hours. Explicit logout invalidates the client session.

### 1.2. HTTP Status Code Conventions
- `200 OK`: Request succeeded, returns requested data.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure, ill-formatted body, or invalid state transition.
- `401 Unauthorized`: Unauthenticated request (missing or invalid token).
- `403 Forbidden`: Authenticated user lacks permission for the role, ownership, or must change password.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Business conflict (e.g. duplicate email).
- `410 Gone`: Resource removed (e.g. soft-removed attachment).
- `500 Internal Server Error`: Unexpected server fault (sanitized, no internal stack traces leaked).

---

## 2. API Endpoints

### 2.1. Authentication APIs

#### `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
- **Responses:**
  - `200 OK`:
    ```json
    {
      "token": "eyJhbGciOi...",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "Jane Doe",
        "role": "IT_STAFF",
        "mustChangePassword": false
      }
    }
    ```
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid credentials or inactive account (`isActive = false`).

#### `POST /api/auth/logout`
- **Access:** Authenticated (Any role)
- **Response:** `200 OK` `{ "message": "Logged out successfully" }`

#### `GET /api/auth/me`
- **Access:** Authenticated (Any role)
- **Response:** `200 OK` Returns current user object.

#### `POST /api/auth/change-password`
- **Access:** Authenticated (Any role)
- **Request Body:**
  ```json
  {
    "currentPassword": "InitialPassword1",
    "newPassword": "SecurePassword123!"
  }
  ```
- **Responses:**
  - `200 OK`: `{ "message": "Password changed successfully", "mustChangePassword": false }`
  - `400 Bad Request`: Invalid current password, or new password fails complexity rules.

---

### 2.2. Requester Ticket APIs (Lab 2 Regression with Real Auth)

#### `GET /api/tickets/my`
- **Access:** Authenticated (`REQUESTER`)
- **Query Params:** `page`, `limit`, `search`, `category`, `priority`, `status`, `sort`, `order`
- **Behavior:** Enforces `requesterId = req.user.id` on server side.
- **Response:** `200 OK` Paginated ticket array matching Lab 2 contract.

#### `POST /api/tickets`
- **Access:** Authenticated (`REQUESTER`, `IT_STAFF`)
- **Request Body:** Multipart form-data with `categoryId`, `relatedSystemId`, `requestedPriority`, `summary`, `description`, optional attachments.
- **Behavior:** Stamps `requesterId = req.user.id`, generates `TKT-YYYYMMDD-XXXX` (e.g. `TKT-20260913-0001`, preserving Lab 2 format), initializes `itPriority = requestedPriority`, sets `currentStatus = NEW`.
- **Response:** `201 Created` with created Ticket object.

#### `GET /api/tickets/:id`
- **Access:** Authenticated (Owner Requester, IT Staff, Administrator)
- **Behavior:** Checks ownership if Requester (`requesterId === req.user.id`); IT Staff & Admin can view any ticket.
- **Data Privacy & Leak Prevention:**
  - If requested by `REQUESTER`: Response strictly returns `publicComments` only. The `internalNotes` array/field is strictly stripped and omitted from the response to prevent data leakage of confidential IT discussions to Requesters.
  - If requested by `IT_STAFF` or `ADMINISTRATOR`: Response includes both `publicComments` and `internalNotes` (or internal notes can be fetched via `GET /api/tickets/:id/notes`).
- **Response:** `200 OK` Detailed ticket object with Category, Related System, Attachments, and permitted comments.
- **Error:** `403 Forbidden` if another Requester attempts access.

---

### 2.3. IT Staff Ticket Queue & Operations APIs

#### `GET /api/staff/tickets`
- **Access:** Authenticated (`IT_STAFF`, `ADMINISTRATOR`)
- **Query Params:**
  - `search`: string (matches Ticket Number or Summary)
  - `category`: number (Category ID)
  - `status`: string (e.g. `NEW`, `OPEN`, `IN_PROGRESS`)
  - `priority`: string (Requested Priority: `LOW`, `MEDIUM`, `HIGH`, `URGENT`)
  - `itPriority`: string (IT Priority: `LOW`, `MEDIUM`, `HIGH`, `URGENT`)
  - `ownerId`: number | "unassigned" | "me"
  - `sort`: string (`createdAt`, `itPriority`, `currentStatus`, `ticketNumber`)
  - `order`: `asc` | `desc`
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Response:** `200 OK`
  ```json
  {
    "tickets": [...],
    "pagination": { "total": 45, "page": 1, "limit": 10, "totalPages": 5 }
  }
  ```

#### `PATCH /api/staff/tickets/:id/claim`
- **Access:** Authenticated (`IT_STAFF`, `ADMINISTRATOR`)
- **Behavior:** Sets `ownerId = req.user.id`. If status is `NEW`, transitions status to `OPEN`.
- **Response:** `200 OK` Updated Ticket object.

#### `PATCH /api/staff/tickets/:id/assign`
- **Access:** Authenticated (`IT_STAFF`, `ADMINISTRATOR`)
- **Request Body:** `{ "ownerId": 4 }`
- **Behavior:** Validates target user is active and has role `IT_STAFF` or `ADMINISTRATOR`.
- **Response:** `200 OK` Updated Ticket object.
- **Error:** `400 Bad Request` if target user invalid.

#### `PATCH /api/staff/tickets/:id/priority`
- **Access:** Authenticated (`IT_STAFF`, `ADMINISTRATOR`)
- **Request Body:** `{ "itPriority": "HIGH" }`
- **Response:** `200 OK` Updated Ticket object.

#### `PATCH /api/staff/tickets/:id/status`
- **Access:** Authenticated (`IT_STAFF`, `ADMINISTRATOR`)
- **Request Body:**
  ```json
  {
    "status": "IN_PROGRESS"
  }
  ```
- **Behavior:** Validates transition from current status against BR-19 State Transition Matrix (`OPEN`, `IN_PROGRESS`, `WAITING_FOR_REQUESTER`, `CLOSED`, `REOPENED`, `CANCELLED`).
- **Resolution Summary Guard:** Direct transition to `RESOLVED` via this general status endpoint is strictly rejected (`422 Unprocessable Entity`). Resolving a ticket requires providing a `resolutionSummary` and must be executed via `PATCH /api/staff/tickets/:id/resolve`.
- **Responses:**
  - `200 OK`: Updated Ticket object.
  - `400 Bad Request`: Invalid transition.
  - `422 Unprocessable Entity`: Attempting to transition to `RESOLVED` directly without resolution endpoint.

#### `PATCH /api/staff/tickets/:id/resolve`
- **Access:** Authenticated (`IT_STAFF`, `ADMINISTRATOR`)
- **Request Body:**
  ```json
  {
    "resolutionSummary": "Hardware battery replaced with new OEM battery unit."
  }
  ```
- **Behavior:** Transitions ticket status to `RESOLVED` per BR-19 & BR-20. Validates that `resolutionSummary` is present, non-empty, non-whitespace, and between 3 and 500 characters.
- **Responses:**
  - `200 OK`: Updated Ticket object with status `RESOLVED`.
  - `400 Bad Request`: Current status does not permit transition to `RESOLVED`.
  - `422 Unprocessable Entity`: Missing, empty, or invalid `resolutionSummary`.

---

### 2.4. Comments & Internal Notes APIs

#### `GET /api/tickets/:id/comments`
- **Access:** Authenticated (Owner Requester, IT Staff, Administrator)
- **Response:** `200 OK` Array of Public Comments with Author info.

#### `POST /api/tickets/:id/comments`
- **Access:** Authenticated (Owner Requester, IT Staff, Administrator)
- **Request Body:** `{ "content": "Please check if the power cord is plugged in." }`
- **Behavior:** Rejects empty content. Stamps `authorId = req.user.id`.
- **Response:** `201 Created` Created PublicComment object.

#### `GET /api/tickets/:id/notes`
- **Access:** Authenticated (`IT_STAFF`, `ADMINISTRATOR` only)
- **Response:** `200 OK` Array of Internal Notes with Author info.
- **Error:** `403 Forbidden` if accessed by a Requester.

#### `POST /api/tickets/:id/notes`
- **Access:** Authenticated (`IT_STAFF`, `ADMINISTRATOR` only)
- **Request Body:** `{ "content": "Checked BIOS logs; device motherboard may need replacement." }`
- **Response:** `201 Created` Created InternalNote object.
- **Error:** `403 Forbidden` if accessed by a Requester.

#### `PATCH /api/tickets/:id/resolve-indication`
- **Access:** Authenticated (`REQUESTER` - Ticket Owner only)
- **Request Body:** `{ "appearsResolved": true }`
- **Response:** `200 OK` Updated ticket with `requesterResolvedIndication` updated.

---

### 2.5. Administrator User Management APIs

#### `GET /api/admin/users`
- **Access:** Authenticated (`ADMINISTRATOR` only)
- **Query Params:** `search`, `role`
- **Response:** `200 OK` Array of User objects (without `passwordHash`).

#### `POST /api/admin/users`
- **Access:** Authenticated (`ADMINISTRATOR` only)
- **Request Body:**
  ```json
  {
    "name": "Alex Thompson",
    "email": "alex.thompson@toktickit.com",
    "role": "IT_STAFF",
    "initialPassword": "InitialPassword123!",
    "isActive": true
  }
  ```
- **Responses:**
  - `201 Created`: Created User object.
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Duplicate email address.

#### `PATCH /api/admin/users/:id`
- **Access:** Authenticated (`ADMINISTRATOR` only)
- **Request Body:** `{ "name": "...", "email": "...", "role": "...", "isActive": true }`
- **Behavior:**
  - Enforces BR-07 (Admin cannot deactivate self).
  - Enforces BR-08 (Admin cannot change self away from ADMINISTRATOR).
  - Enforces BR-09 (Cannot deactivate or demote the last active Administrator).
- **Responses:**
  - `200 OK`: Updated User object.
  - `400 Bad Request`: Safety violation.
  - `409 Conflict`: Duplicate email.

#### `POST /api/admin/users/:id/reset-password`
- **Access:** Authenticated (`ADMINISTRATOR` only)
- **Request Body:** `{ "newInitialPassword": "TemporaryPassword1!" }`
- **Behavior:** Hashes new password, updates `passwordHash`, sets `mustChangePassword = true`.
- **Response:** `200 OK` `{ "message": "Password reset successfully" }`.
