# TokTickIT - Requester Ticketing MVP

TokTickIT is a full-stack IT service desk application built with React, TypeScript, Vite, Express, Prisma, and PostgreSQL. Lab 2 adds a responsive Requester workflow for selecting a temporary development identity, creating and finding owned tickets, viewing ticket details, and managing attachments.

> The Development Requester selector is a Lab 2 testing mechanism only. It is not authentication. Passwords, sessions, tokens, and role-based access are intentionally deferred to Lab 3.

## Lab 2 Features

- Select and persist an active Development Requester context
- Create a ticket with a backend-generated ticket number and initial `NEW` status
- Validate fields and JPG/JPEG, PNG, WEBP, or PDF attachments up to 5 MB each
- Search, filter, sort, and paginate the selected Requester's tickets
- View only tickets owned by the selected Requester
- Upload, download, and soft-remove attachments with an audit reason
- Use the responsive Zen Green UI on desktop, tablet, mobile, and 320 px screens

## Repository Structure

```text
TokTickIT/
|-- client/                         React, TypeScript, and Vite UI
|   |-- src/components/             Requester, ticket, and attachment screens
|   `-- src/__tests__/lab-02/       Component and UI tests
|-- server/                         Express and Prisma API
|   |-- prisma/                     Schema, migrations, and idempotent seed
|   `-- tests/lab-02/               API and integration tests
|-- e2e/lab-02/                    Playwright requester and visual flows
|-- docs/lab-02/                   Engineering contract and delivery evidence
|-- artifacts/lab-02/screenshots/  Responsive visual evidence
|-- .gitignore
`-- README.md
```

## Prerequisites

- Node.js 20 (see `.nvmrc`)
- npm 9 or later
- PostgreSQL 14 or later
- Chromium for Playwright (`npm run install:e2e`)

## Setup

Clone the repository and install each package:

```bash
git clone https://github.com/lmaybelgracel/TokTickit.git
cd TokTickit
npm install
cd server && npm install
cd ../client && npm install
```

Create local environment files:

```powershell
# Windows PowerShell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

```bash
# macOS/Linux
cp server/.env.example server/.env
cp client/.env.example client/.env
```

The example backend connection is `postgresql://toktickit:toktickit@localhost:5432/toktickit?schema=public`. Create the matching database/user or update `server/.env`, then prepare and seed the database:

```bash
cd server
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
```

The idempotent seed includes active and inactive Development Requesters, the four required categories, and realistic related systems. Inactive Requesters remain in the database but are excluded from the selector.

## Run the Application

Start the API in one terminal:

```bash
cd server
npm run dev
```

Start the web application in another terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:3000` by default.

## Tests and Builds

```bash
# Backend API and integration tests
cd server
npm test
npm run build

# Frontend component and UI tests
cd ../client
npm test
npm run build

# From the repository root: install Chromium once and run E2E/visual tests
cd ..
npm run install:e2e
npm run test:e2e
```

Playwright writes visual evidence to `artifacts/lab-02/screenshots/`. See the [test plan and traceability](docs/lab-02/tests.md) for the final test matrix.

## Lab 2 Documentation

- [Sprint engineering specification](docs/lab-02/specification.md)
- [Test plan and traceability](docs/lab-02/tests.md)
- [UI specification](docs/lab-02/ui-spec.md)
- [API specification](docs/lab-02/api-spec.md)
- [Peer review log](docs/lab-02/reviewer.md)
- [AI-use record and reflection](docs/lab-02/ai-use.md)

## Git Workflow

- Feature and documentation branches are created from `lab2-staging`.
- Every change reaches `lab2-staging` through a Pull Request linked to its Issue from the PR Development panel.
- A peer reviews, approves, and merges each feature PR; the author responds to review comments and pushes fixes to the same branch.
- The final reviewed release PR merges `lab2-staging` into `main`.

Secrets, environment files, build output, Playwright reports, test results, runtime uploads, and local database files are excluded by `.gitignore`.
