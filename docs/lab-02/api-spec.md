# Lab 2 REST API Specification — TokTickIT Backend Contracts

## 1. Overview & General Standards

This document defines the REST API contract for TokTickIT Lab 2. All APIs follow standard HTTP methods, return JSON formatted payloads, and enforce data ownership boundaries.

### General Conventions
- **Base URL:** `/api`
- **Context Header:** All requester-dependent endpoints require the header `X-Development-Requester-Id: <id>` to specify the active testing identity context.
- **Date Format:** ISO 8601 string (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Standard Error Response:**
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Human readable error summary message",
      "details": [
        { "field": "summary", "message": "Summary must be at least 5 characters long." }
      ]
    }
  }
  ```

---

## 2. HTTP Status Codes

| Status Code | Meaning | Use Case |
| :--- | :--- | :--- |
| **200 OK** | Success | Successful retrieval, listing, update, or soft removal. |
| **201 Created** | Resource Created | Successful creation of a Ticket or Attachment. |
| **400 Bad Request** | Validation Failure / Client Error | Missing required fields, invalid file type/size, attachment limit exceeded. |
| **403 Forbidden** | Ownership Violation | Attempting to view or modify a ticket/attachment belonging to another Requester. |
| **404 Not Found** | Resource Not Found | Requesting non-existent Ticket ID, Category ID, or Attachment ID. |
| **410 Gone** | Resource Removed | Attempting to download or preview a soft-removed attachment. |
| **422 Unprocessable Entity** | Business Rule Violation | Inactive requester attempting operation, duplicate ticket submission. |
| **500 Internal Server Error**| Server Error | Unexpected server or database error. Safe message returned to client. |

---

## 3. API Endpoints Contract

### 3.1 `GET /api/requesters`
Retrieve all active Development Requesters available for identity selection.

- **Headers:** None required.
- **Query Parameters:** None.
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Jennifer Anderson",
      "email": "jennifer.a@kmutt.ac.th",
      "department": "Faculty of Engineering",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Michael Brown",
      "email": "michael.b@kmutt.ac.th",
      "department": "School of Information Technology",
      "isActive": true
    }
  ]
  ```

---

### 3.2 `GET /api/categories`
Retrieve active ticket classification categories.

- **Response (200 OK):**
  ```json
  [
    { "id": 1, "name": "Account and Access", "description": "Login, passwords, permission requests" },
    { "id": 2, "name": "Hardware", "description": "Laptops, monitors, printers, peripherals" },
    { "id": 3, "name": "Software", "description": "OS, office apps, specialized tools" },
    { "id": 4, "name": "Network", "description": "Wi-Fi, VPN, campus network connectivity" }
  ]
  ```

---

### 3.3 `GET /api/related-systems`
Retrieve active related systems options.

- **Response (200 OK):**
  ```json
  [
    { "id": 1, "name": "Email", "category": "Account and Access" },
    { "id": 2, "name": "Campus Wi-Fi", "category": "Network" },
    { "id": 3, "name": "VPN", "category": "Network" },
    { "id": 4, "name": "LEB2 App", "category": "Software" },
    { "id": 5, "name": "Grade Submission App", "category": "Software" },
    { "id": 6, "name": "Printer", "category": "Hardware" },
    { "id": 7, "name": "Corporate Laptop", "category": "Hardware" }
  ]
  ```

---

### 3.4 `POST /api/tickets`
Create a new validated IT ticket for the active Development Requester.

- **Headers:** `X-Development-Requester-Id: 1`
- **Request Body (JSON):**
  ```json
  {
    "categoryId": 2,
    "relatedSystemId": 7,
    "requestedPriority": "MEDIUM",
    "summary": "Laptop battery drains quickly",
    "description": "My laptop battery is draining much faster than usual even when the system is idle. This started happening after last week's Windows update."
  }
  ```
- **Validation Rules:**
  - `X-Development-Requester-Id`: Required, must correspond to an active Requester.
  - `categoryId`: Required, must exist in DB.
  - `relatedSystemId`: Required, must exist in DB.
  - `requestedPriority`: Required, Enum: `LOW`, `MEDIUM`, `HIGH`.
  - `summary`: Required, string 5–150 characters after trim.
  - `description`: Required, string 10–2000 characters after trim.
- **Response (201 Created):**
  ```json
  {
    "id": 101,
    "ticketNumber": "TKT-2026-001234",
    "summary": "Laptop battery drains quickly",
    "description": "My laptop battery is draining much faster than usual even when the system is idle.",
    "requestedPriority": "MEDIUM",
    "currentStatus": "NEW",
    "requesterId": 1,
    "categoryId": 2,
    "relatedSystemId": 7,
    "createdAt": "2026-09-01T10:15:30.000Z",
    "updatedAt": "2026-09-01T10:15:30.000Z"
  }
  ```

---

### 3.5 `GET /api/tickets`
Retrieve paginated list of tickets owned by the active Development Requester.

- **Headers:** `X-Development-Requester-Id: 1`
- **Query Parameters:**
  - `search` (optional): Filter ticketNumber or summary (case-insensitive substring).
  - `category` (optional): Filter by Category ID.
  - `priority` (optional): Filter by Requested Priority (`LOW`, `MEDIUM`, `HIGH`).
  - `status` (optional): Filter by Status (`NEW`).
  - `sort` (optional): Sort field & order (`createdAt:desc`, `createdAt:asc`, `updatedAt:desc`). Default: `createdAt:desc`.
  - `page` (optional): Page number (default: `1`).
  - `pageSize` (optional): Items per page (default: `10`, max: `50`).
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 101,
        "ticketNumber": "TKT-2026-001234",
        "summary": "Laptop battery drains quickly",
        "requestedPriority": "MEDIUM",
        "currentStatus": "NEW",
        "category": { "id": 2, "name": "Hardware" },
        "relatedSystem": { "id": 7, "name": "Corporate Laptop" },
        "createdAt": "2026-09-01T10:15:30.000Z",
        "updatedAt": "2026-09-01T10:15:30.000Z"
      }
    ],
    "pagination": {
      "totalItems": 1,
      "totalPages": 1,
      "currentPage": 1,
      "pageSize": 10
    }
  }
  ```

---

### 3.6 `GET /api/tickets/:id`
Retrieve read-only ticket details owned by the active Development Requester.

- **Headers:** `X-Development-Requester-Id: 1`
- **Response (200 OK):**
  ```json
  {
    "id": 101,
    "ticketNumber": "TKT-2026-001234",
    "summary": "Laptop battery drains quickly",
    "description": "My laptop battery is draining much faster than usual...",
    "requestedPriority": "MEDIUM",
    "currentStatus": "NEW",
    "requester": { "id": 1, "name": "Jennifer Anderson", "email": "jennifer.a@kmutt.ac.th" },
    "category": { "id": 2, "name": "Hardware" },
    "relatedSystem": { "id": 7, "name": "Corporate Laptop" },
    "attachments": [
      {
        "id": 501,
        "filename": "battery_diagnostic.png",
        "fileSize": 1048576,
        "mimeType": "image/png",
        "isRemoved": false,
        "uploadedAt": "2026-09-01T10:16:00.000Z"
      }
    ],
    "createdAt": "2026-09-01T10:15:30.000Z",
    "updatedAt": "2026-09-01T10:15:30.000Z"
  }
  ```
- **Error (403 Forbidden):** Returned if ticket belongs to a different `requesterId`.
  ```json
  {
    "error": {
      "code": "FORBIDDEN_ACCESS",
      "message": "You do not have permission to view this ticket."
    }
  }
  ```

---

### 3.7 `POST /api/tickets/:id/attachments`
Upload a supporting attachment to an owned ticket.

- **Headers:** `X-Development-Requester-Id: 1`
- **Request Format:** `multipart/form-data` with field `file`.
- **Validation Rules:**
  - Allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `application/pdf`.
  - Max file size: 5,242,880 bytes (5 MB).
  - Max active attachments per ticket: 5.
- **Response (201 Created):**
  ```json
  {
    "id": 502,
    "ticketId": 101,
    "filename": "system_info.pdf",
    "fileSize": 204800,
    "mimeType": "application/pdf",
    "isRemoved": false,
    "uploadedAt": "2026-09-01T10:20:00.000Z"
  }
  ```

---

### 3.8 `GET /api/attachments/:id/download`
Download an active attachment owned by the active Requester.

- **Headers:** `X-Development-Requester-Id: 1`
- **Response (200 OK):** Binary file stream with headers `Content-Type: <mimeType>` and `Content-Disposition: attachment; filename="<filename>"`.
- **Error (410 Gone):** Returned if attachment is soft-removed.
  ```json
  {
    "error": {
      "code": "ATTACHMENT_REMOVED",
      "message": "This attachment has been removed and is no longer available for download."
    }
  }
  ```

---

### 3.9 `DELETE /api/attachments/:id`
Soft-remove an attachment owned by the active Requester.

- **Headers:** `X-Development-Requester-Id: 1`
- **Request Body (JSON):**
  ```json
  {
    "removalReason": "Outdated diagnostic log attached by mistake"
  }
  ```
- **Validation Rules:** `removalReason` is required, string between 3 and 250 characters after trim.
- **Response (200 OK):**
  ```json
  {
    "id": 501,
    "isRemoved": true,
    "removedAt": "2026-09-01T10:25:00.000Z",
    "removalReason": "Outdated diagnostic log attached by mistake"
  }
  ```
