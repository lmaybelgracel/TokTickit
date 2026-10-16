# TokTickIT - Sprint 4 REST API Specification

## 1. Global Conventions & Protocol

- **Base URL**: `/api`
- **Data Format**: JSON (`Content-Type: application/json; charset=utf-8`)
- **Authentication**: JWT Bearer Token in `Authorization` header (`Authorization: Bearer <jwt_token>`)
- **Standard Error Response**:
  ```json
  {
    "error": "Human-readable error description",
    "details": []
  }
  ```
- **Concurrency & Stale Update Handling**:
  Mutating endpoints for ticket status transitions and record updates (`PATCH /api/staff/tickets/:id/status`, `PATCH /api/staff/tickets/:id/resolve`, and `PATCH /api/actions/:id`) require a mandatory `knownUpdatedAt` ISO timestamp in the request body.
  - **Missing Timestamp Validation (`422 Unprocessable Entity`)**: If the client omits `knownUpdatedAt`, the server rejects the request with HTTP `422 Unprocessable Entity`:
    ```json
    {
      "error": "Validation failed: knownUpdatedAt is required",
      "details": ["knownUpdatedAt: Field is mandatory to prevent stale updates."]
    }
    ```
  - **Stale Update Detection (`409 Conflict`)**: If the supplied `knownUpdatedAt` does not match the database record's current `updatedAt` timestamp (indicating concurrent modification by another user), the server aborts the transaction and returns HTTP `409 Conflict`:
    ```json
    {
      "error": "Conflict: The record has been modified by another user. Please refresh and try again.",
      "currentUpdatedAt": "2026-10-15T12:00:00.000Z"
    }
    ```


---

## 2. Actions Taken Endpoints

### 2.1. List Actions Taken for Ticket
- **URL**: `GET /api/tickets/:id/actions`
- **Access**: Authenticated (`REQUESTER` [must own ticket], `IT_STAFF`, `ADMINISTRATOR`)
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "ticketId": 142,
      "performedById": 2,
      "performedBy": {
        "id": 2,
        "name": "Lisa Martinez",
        "email": "lisa.martinez@toktickit.com",
        "role": "IT_STAFF"
      },
      "actionDateTime": "2026-10-15T09:30:00.000Z",
      "description": "Inspected network interface and verified DHCP lease failure on switch port 14.",
      "result": "Port rebooted; client IP assigned successfully.",
      "followUpRequired": true,
      "followUpNote": "Monitor connection stability over the next 4 hours for packet loss.",
      "attachmentNotes": "Log capture saved as dhcp_diag.txt in IT shared drive.",
      "createdAt": "2026-10-15T09:35:00.000Z",
      "updatedAt": "2026-10-15T09:35:00.000Z"
    }
  ]
  ```
- **Error Responses**:
  - `401 Unauthorized`: Missing or invalid token.
  - `403 Forbidden`: Requester attempting to access actions on a ticket owned by another user.
  - `404 Not Found`: Ticket does not exist.

---

### 2.2. Create Action Taken
- **URL**: `POST /api/tickets/:id/actions`
- **Access**: `IT_STAFF`, `ADMINISTRATOR` (Strictly forbidden for `REQUESTER`)
- **Request Body**:
  ```json
  {
    "actionDateTime": "2026-10-15T09:30:00.000Z",
    "description": "Replaced faulty RAM module in slot B2.",
    "result": "System passed MemTest86 diagnostic with zero errors.",
    "followUpRequired": false,
    "followUpNote": null,
    "attachmentNotes": "RAM replacement photo attached to ticket."
  }
  ```
- **Validation Rules**:
  - `description`: String, required, 3–2000 characters.
  - `result`: String, required, 2–1000 characters.
  - `followUpRequired`: Boolean, default `false`.
  - `followUpNote`: Required (3–1000 characters) if `followUpRequired === true`. Must be null or omitted if `false`.
  - `actionDateTime`: ISO DateTime string, optional (defaults to server `now()`). Must not be in the future.
  - `attachmentNotes`: String, optional, max 500 characters.
- **Response `201 Created`**:
  ```json
  {
    "id": 2,
    "ticketId": 142,
    "performedById": 2,
    "performedBy": {
      "id": 2,
      "name": "Lisa Martinez",
      "email": "lisa.martinez@toktickit.com",
      "role": "IT_STAFF"
    },
    "actionDateTime": "2026-10-15T09:30:00.000Z",
    "description": "Replaced faulty RAM module in slot B2.",
    "result": "System passed MemTest86 diagnostic with zero errors.",
    "followUpRequired": false,
    "followUpNote": null,
    "attachmentNotes": "RAM replacement photo attached to ticket.",
    "createdAt": "2026-10-15T09:32:00.000Z",
    "updatedAt": "2026-10-15T09:32:00.000Z"
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Not logged in.
  - `403 Forbidden`: User has role `REQUESTER`.
  - `404 Not Found`: Ticket does not exist.
  - `422 Unprocessable Entity`: Validation failure (missing description, follow-up note missing when required, or future timestamp).

---

### 2.3. Update Action Taken
- **URL**: `PATCH /api/actions/:id`
- **Access**: `IT_STAFF`, `ADMINISTRATOR`
- **Request Body**:
  ```json
  {
    "description": "Updated diagnostics notes after additional testing.",
    "result": "Verified sustained throughput at 1 Gbps.",
    "followUpRequired": true,
    "followUpNote": "Schedule follow-up cable replacement next week.",
    "attachmentNotes": "Updated speedtest results.",
    "knownUpdatedAt": "2026-10-15T09:32:00.000Z"
  }
  ```
- **Response `200 OK`**: Returns updated `ActionTaken` object.
- **Error Responses**:
  - `403 Forbidden`: Requester calling endpoint.
  - `404 Not Found`: Action Taken record does not exist.
  - `409 Conflict`: `knownUpdatedAt` does not match latest record in database.
  - `422 Unprocessable Entity`: Field validation failure.

---

## 3. Dashboard Endpoints

### 3.1. Requester Dashboard
- **URL**: `GET /api/dashboard/requester`
- **Access**: `REQUESTER`
- **Response `200 OK`**:
  ```json
  {
    "metrics": {
      "totalOpenTickets": 3,
      "waitingForRequester": 1,
      "resolvedOrClosed": 5
    },
    "recentTickets": [
      {
        "id": 142,
        "ticketNumber": "TKT-2026-000142",
        "summary": "VPN connection drops every 15 minutes",
        "currentStatus": "WAITING_FOR_REQUESTER",
        "requestedPriority": "HIGH",
        "updatedAt": "2026-10-15T09:30:00.000Z"
      }
    ],
    "recentlyResolved": [
      {
        "id": 139,
        "ticketNumber": "TKT-2026-000139",
        "summary": "Request second monitor for workstation",
        "currentStatus": "RESOLVED",
        "resolutionSummary": "Dual display adapter installed and tested.",
        "resolvedAt": "2026-10-14T16:00:00.000Z"
      }
    ]
  }
  ```

---

### 3.2. IT Staff & Administrator Dashboard
- **URL**: `GET /api/dashboard/staff`
- **Access**: `IT_STAFF`, `ADMINISTRATOR`
- **Response `200 OK`**:
  ```json
  {
    "metrics": {
      "unassignedTickets": 4,
      "myAssignedTickets": 6,
      "myActionsTakenCount": 8,
      "urgentTickets": 2,
      "waitingForRequester": 5,
      "totalActiveTickets": 17
    },
    "statusDistribution": {
      "NEW": 4,
      "OPEN": 5,
      "IN_PROGRESS": 6,
      "WAITING_FOR_REQUESTER": 5,
      "RESOLVED": 8,
      "CLOSED": 14,
      "REOPENED": 1,
      "CANCELLED": 2
    },
    "priorityDistribution": {
      "LOW": 3,
      "MEDIUM": 7,
      "HIGH": 5,
      "URGENT": 2
    },
    "recentQueueActivity": [
      {
        "id": 145,
        "ticketNumber": "TKT-2026-000145",
        "summary": "Payroll portal login failing with 500 error",
        "currentStatus": "IN_PROGRESS",
        "itPriority": "URGENT",
        "owner": {
          "id": 2,
          "name": "Lisa Martinez"
        },
        "updatedAt": "2026-10-15T11:45:00.000Z"
      }
    ],
    "adminStats": {
      "totalUsers": 10,
      "activeUsers": 9,
      "inactiveUsers": 1,
      "roleCounts": {
        "ADMINISTRATOR": 2,
        "IT_STAFF": 3,
        "REQUESTER": 5
      }
    }
  }
  ```
  *(Note: `adminStats` is included when the caller has role `ADMINISTRATOR`, and omitted or null for `IT_STAFF`)*.

---

## 4. Ticket Workflow & Resolution Endpoints

### 4.1. General Status Transition
- **URL**: `PATCH /api/staff/tickets/:id/status`
- **Access**: `IT_STAFF`, `ADMINISTRATOR`
- **Request Body**:
  ```json
  {
    "currentStatus": "IN_PROGRESS",
    "knownUpdatedAt": "2026-10-15T10:00:00.000Z"
  }
  ```
- **Rules**:
  - `knownUpdatedAt`: Mandatory ISO DateTime string. If omitted, the request is rejected with `422 Unprocessable Entity` (`"knownUpdatedAt is required"`).
  - `currentStatus`: Mandatory target status string. (For backward compatibility, the server also accepts `status` in the payload).
  - Rejects transition to `RESOLVED` with `422 Unprocessable Entity` (`"Transition to RESOLVED must be performed via /api/staff/tickets/:id/resolve with resolutionSummary"`).
  - Enforces State Transition Matrix. Invalid transitions return `422 Unprocessable Entity`.
  - Rejects stale updates with `409 Conflict` when `knownUpdatedAt !== ticket.updatedAt`.

---

### 4.2. Formal Ticket Resolution
- **URL**: `PATCH /api/staff/tickets/:id/resolve`
- **Access**: `IT_STAFF`, `ADMINISTRATOR`
- **Request Body**:
  ```json
  {
    "resolutionSummary": "Reconfigured firewall port forward and re-authenticated RADIUS client. Problem verified resolved.",
    "knownUpdatedAt": "2026-10-15T10:00:00.000Z"
  }
  ```
- **Validation**:
  - `knownUpdatedAt`: Mandatory ISO DateTime string. If omitted, the request is rejected with `422 Unprocessable Entity` (`"knownUpdatedAt is required"`).
  - `resolutionSummary`: Required, 3–500 characters.
  - Rejects stale updates with `409 Conflict` when `knownUpdatedAt !== ticket.updatedAt`.
  - Automatically sets `currentStatus = "RESOLVED"`, `resolvedAt = now()`, and `resolvedById = caller.id`.
- **Response `200 OK`**: Returns updated `Ticket` object.

---

### 4.3. Requester Problem Resolution Indication
- **URL**: `PATCH /api/tickets/:id/resolve-indication`
- **Access**: `REQUESTER` (Must own ticket)
- **Request Body**:
  ```json
  {
    "indicated": true
  }
  ```
- **Behavior**: Sets `requesterResolvedIndication: true` without changing `Ticket.currentStatus`.
- **Response `200 OK`**: Returns `{ "success": true, "requesterResolvedIndication": true }`.
