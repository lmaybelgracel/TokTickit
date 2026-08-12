# TokTickIT (ตอกติ๊กกิต) - Full-Stack IT Service Desk Application

TokTickIT is an IT service desk web application for Account & Access, Hardware, Software, and Network requests built with **React**, **TypeScript**, **Vite**, **Bootstrap**, **Express**, **Prisma**, and **PostgreSQL**.

---

## 🏗️ Project Architecture & Structure

```
toktickit/
├── client/                 # React + TypeScript + Vite + Bootstrap frontend
│   ├── src/                # UI components & API integrations
│   └── tests/lab-01/       # Vitest UI tests
├── server/                 # Node.js + Express + TypeScript backend
│   ├── prisma/             # Prisma schema & migration/seed scripts
│   ├── src/                # REST API controllers & services
│   └── tests/lab-01/       # Supertest API tests
├── docs/lab-01/            # Documentation & submission evidence
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started (Setup Instructions)

### Prerequisites

- **Node.js**: v18+ or v20+
- **npm**: v9+
- **PostgreSQL**: v14+ running locally (default connection: `postgresql://toktickit:toktickit@localhost:5432/toktickit?schema=public`)

---

### 1. Backend Setup (`server/`)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma Client & run migrations
npx prisma generate
npx prisma migrate dev --name init

# Seed database
npm run prisma:seed

# Start backend server in development mode (PORT 3000)
npm run dev
```

---

### 2. Frontend Setup (`client/`)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start Vite frontend development server
npm run dev
```

---

### 🧪 Running Tests

#### Run Backend API Tests (Supertest / Vitest)
```bash
cd server
npm test
```

#### Run Frontend UI Tests (Vitest)
```bash
cd client
npm test
```

---

## 🌿 Git Branching Model & Workflow

- `main`: Protected stable release branch
- `lab1-staging`: Lab 1 integration branch
- `feature/*`: Feature development branches (`feature/1-project-foundation`, `feature/2-health-check`, `feature/3-category-seed`, `feature/4-category-list`)