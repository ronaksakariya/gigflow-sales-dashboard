# GigFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Tech Stack

**Backend**
- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JWT (HttpOnly cookies) + bcryptjs
- Zod (request validation)

**Frontend**
- React 19 + TypeScript
- Vite
- TailwindCSS v4 + shadcn/ui
- React Hook Form + Zod
- Axios (with credentials)
- Sonner (toast notifications)

**Infrastructure**
- Docker + Docker Compose
- Nginx (production frontend serving + API proxy)

## Project Structure

```
gigflow-smart-leads/
├── gigflow-backend/
│   ├── src/
│   │   ├── config/          # DB connection, env validation
│   │   ├── constants/       # App-wide constants (roles, statuses, pagination)
│   │   ├── controllers/     # Route handlers (auth, leads, user)
│   │   ├── middleware/      # Auth, RBAC, error handling
│   │   ├── models/          # Mongoose schemas (User, Lead)
│   │   ├── routes/          # Express route definitions (auth, leads, user)
│   │   ├── types/           # TypeScript interfaces & types
│   │   ├── utils/           # Helpers (CSV, response, token)
│   │   ├── validators/      # Zod schemas (auth, leads, user)
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── gigflow-frontend/
│   ├── src/
│   │   ├── api/              # Axios instance & API modules (auth, leads, users)
│   │   ├── components/
│   │   │   ├── common/       # Pagination, EmptyState
│   │   │   ├── layout/       # Navbar, ProtectedRoute
│   │   │   ├── leads/        # LeadTable, LeadRow, LeadFilters, LeadForm, LeadDetailModal
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   └── theme-provider.tsx
│   │   ├── context/          # AuthContext
│   │   ├── hooks/            # useAuth, useLeads, useDebounce
│   │   ├── lib/              # cn() utility
│   │   ├── pages/            # LoginPage, RegisterPage, DashboardPage, UsersPage
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # formatDate
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd gigflow-smart-leads
   ```

2. **Backend setup**
   ```bash
   cd gigflow-backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm install
   npm run dev
   ```

3. **Frontend setup**
   ```bash
   cd gigflow-frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173)

### Docker

Pull from Docker Hub

```bash
docker pull ronaksakariya/gigflow-backend
docker pull ronaksakariya/gigflow-frontend
```

Run with Docker Compose

```bash
# Clone the repository
git clone https://github.com/ronaksakariya/gigflow-sales-dashboard.git
cd gigflow-smart-leads

# Create .env file
cp .env.example .env
# Edit .env and set your JWT_SECRET
docker compose up -d
```

Open [http://localhost](http://localhost) in your browser.

### Creating an Admin User

All new registrations default to the `sales` role. To promote a user to `admin`:

1. Register a user through the app at [http://localhost](http://localhost)
2. Run the following command to update their role:

```bash
docker compose exec mongo mongosh gigflow --eval \
  'db.users.updateOne({email: "your-email@example.com"}, {$set: {role: "admin"}})'
```

3. Log out and log back in — the user will now have admin access (Users page, delete leads).

### Docker Hub

| Image | Link |
|-------|------|
| Backend | [ronaksakariya/gigflow-backend](https://hub.docker.com/r/ronaksakariya/gigflow-backend) |
| Frontend | [ronaksakariya/gigflow-frontend](https://hub.docker.com/r/ronaksakariya/gigflow-frontend) |

## Environment Variables

### Backend (`gigflow-backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret for signing JWTs | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

### Frontend (`gigflow-frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### Docker Compose (root `.env`)

| Variable | Description | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/gigflow` |
| `JWT_SECRET` | JWT signing secret (required) | — |

## Features

### Authentication
- JWT-based auth with HttpOnly cookies
- User registration (defaults to `sales` role)
- Admin-only user role management (promote/demote via Users page)
- Protected routes (frontend + backend middleware)
- Password hashing with bcryptjs

### Leads Management (CRUD)
- Create, read, update, delete leads
- Fields: Name, Email, Status, Source, Created At
- Statuses: New, Contacted, Qualified, Lost
- Sources: Website, Instagram, Referral

### Advanced Filtering & Search
- Filter by status and source simultaneously
- Search by name or email (case-insensitive)
- Sort by latest/oldest
- Clear all filters with one click
- All filters compose together

### Pagination
- Backend pagination (10 records per page by default)
- Skip/limit with metadata (total, page, totalPages, hasNextPage, hasPrevPage)

### Debounced Search
- 400ms debounce to reduce API calls while typing

### CSV Export
- Export filtered leads to CSV (authenticated via axios blob download)
- Respects current status, source, search, and sort filters
- Downloads as `gigflow-leads.csv`

### Role-Based Access Control
- **Admin**: Full access including delete leads + manage user roles via Users page
- **Sales**: Can create, read, update, export leads (cannot delete or manage roles)
- Registration defaults to `sales`; only admins can promote users to `admin`

### Toast Notifications
- Success/error toasts for all user actions (login, register, CRUD, export, role changes)
- Top-center position with dark mode support

### Dark Mode
- System preference detection
- Manual toggle (sun/moon icon in navbar)
- Keyboard shortcut: press `D`
- Persisted in localStorage with cross-tab sync

---

## API Documentation

All endpoints are prefixed with `/api`.

### Authentication

#### `POST /api/auth/register`

Register a new user. All users are assigned the `sales` role by default.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "sales"
  }
}
```

Sets `gigflow_token` HttpOnly cookie.

---

#### `POST /api/auth/login`

Authenticate an existing user.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "sales"
  }
}
```

Sets `gigflow_token` HttpOnly cookie.

---

#### `POST /api/auth/logout` 🔒

Clear the auth cookie.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### `GET /api/auth/me` 🔒

Get the currently authenticated user.

**Response (200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

### Users

Admin-only endpoints for user management.

#### `GET /api/users` 🔒 Admin only

List all users with their roles.

**Response (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ]
}
```

---

#### `PATCH /api/users/:id/role` 🔒 Admin only

Change a user's role.

**Body:**
```json
{
  "role": "admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "admin"
  }
}
```

---

### Leads

All lead endpoints require authentication. Sales role can access all except DELETE (admin only).

#### `GET /api/leads` 🔒 Sales+

List leads with filtering, search, sorting, and pagination.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | string | Filter: `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | Filter: `Website`, `Instagram`, `Referral` |
| `search` | string | Search by name or email |
| `sort` | string | `latest` (default) or `oldest` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 10, max: 100) |

**Response (200):**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### `POST /api/leads` 🔒 Sales+

Create a new lead.

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",
  "source": "Website"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { "_id": "...", "name": "Jane Smith", ... }
}
```

---

#### `GET /api/leads/:id` 🔒 Sales+

Get a single lead by ID.

**Response (200):**
```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": { "_id": "...", "name": "Jane Smith", ... }
}
```

---

#### `PUT /api/leads/:id` 🔒 Sales+

Update a lead.

**Body:** Any subset of lead fields.
```json
{
  "status": "Qualified",
  "source": "Instagram"
}
```

**Response (200):** Updated lead object.

---

#### `DELETE /api/leads/:id` 🔒 Admin only

Delete a lead.

**Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

#### `GET /api/leads/export` 🔒 Sales+

Export leads as CSV. Accepts same query parameters as the list endpoint (status, source, search, sort).

**Response (200):** CSV file download (`text/csv`).

---

### Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Validation errors include field-level details:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email address",
    "password": "Password must be at least 6 characters"
  }
}
```

**Common Status Codes:** 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (conflict/duplicate), 500 (server error)

---

🔒 = Requires authentication cookie | Sales+ = admin or sales role | Admin only = requires admin role