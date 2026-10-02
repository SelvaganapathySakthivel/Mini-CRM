# Mini CRM — Enterprise Lead & Customer Relationship Management System

A full-stack, enterprise-grade Customer Relationship Management (CRM) application built for sales teams and account executives to manage client companies, sales leads, follow-up tasks, and executive performance metrics.

---

## 🌟 Key Features

### 1. Authentication & Security
- **JWT-Based Authentication**: Secure stateless session tokens stored in client storage and verified via custom Express middleware.
- **Password Protection**: Salting and one-way hashing with `bcryptjs`.
- **Protected Routing**: Role/auth-gated navigation on the frontend; unauthenticated traffic is automatically redirected to `/login`.

### 2. Companies Module
- **Organization Management**: Create, list, search, and view client accounts.
- **Associated Leads Linkage**: Dedicated organization detail view (`/companies/:id`) fetching non-deleted leads linked to each company (`GET /api/companies/:id/leads`).
- **Data Attributes**: Company Name, Email, Phone, Website, and Physical Address.

### 3. Leads Management
- **Lead Pipeline**: Complete CRUD workflow for tracking potential clients (`New`, `Contacted`, `Lost`).
- **Multi-Field Search**: Instant server-side search across lead name, email address, and phone number.
- **Reference Population**: Direct association with client companies and assigned team members.
- **Soft Delete Architecture**: Leads marked as deleted (`isDeleted: true`) are safely hidden from standard listings and company lead aggregations while preserving referential integrity.

### 4. Tasks & Follow-up Scheduling
- **Task Scheduling**: Create, edit, list, and complete follow-up actions and calls with due dates.
- **Assigned User Authorization Rule**: Only the specifically assigned agent is authorized to modify a task's status (`PATCH /api/tasks/:id/status`), strictly enforced by backend authorization (`403 Forbidden`).
- **Urgency Indicators**: Visual badges and color coding for overdue tasks and tasks due today.

### 5. Executive Dashboard
- **MongoDB Aggregation Pipelines**: Real-time business metrics computed entirely on the database engine.
- **Key Metrics**:
  - `totalLeads`: Count of all active (non-deleted) leads.
  - `qualifiedLeads`: Total leads in `Contacted` status.
  - `tasksDueToday`: Tasks scheduled for completion on the current date.
  - `completedTasks`: Total tasks with status `Completed`.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **UI & Components**: Material UI (MUI) v6
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with centralized Request/Response Interceptors
- **Icons**: Material UI Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Security & Utilities**: CORS, dotenv, Express JSON parser

---

## 📁 Project Structure

```text
Mini-CRM/
├── backend/
│   ├── controllers/
│   │   ├── authController.js        # Authentication & user directory
│   │   ├── companyController.js     # Company CRUD & associated leads
│   │   ├── leadController.js        # Lead CRUD, search, filter, soft delete
│   │   ├── taskController.js        # Task CRUD & assigned-user status updates
│   │   └── dashboardController.js   # MongoDB aggregation pipelines
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification middleware
│   ├── models/
│   │   ├── User.js                  # User schema & credentials
│   │   ├── Company.js               # Company profile schema
│   │   ├── Lead.js                  # Lead schema with references & soft delete flag
│   │   └── Task.js                  # Task schema with due date & assignments
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth routes
│   │   ├── companyRoutes.js         # /api/companies routes
│   │   ├── leadRoutes.js            # /api/leads routes
│   │   ├── taskRoutes.js            # /api/tasks routes
│   │   └── dashboardRoutes.js       # /api/dashboard routes
│   ├── .env.example                 # Backend environment variable template
│   ├── package.json
│   └── server.js                    # Express app entry & database connection
├── frontend/
│   ├── public/
│   │   └── _redirects               # SPA routing rule for static hosts
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx   # Auth route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state & user session
│   │   ├── hooks/
│   │   │   └── useAuth.js           # Auth context consumer hook
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx       # Layout for Login & Register
│   │   │   └── MainLayout.jsx       # Layout with persistent sidebar & header
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Real-time metrics & quick actions
│   │   │   ├── LeadsPage.jsx        # Leads table, search, filters & modals
│   │   │   ├── CompaniesPage.jsx    # Company directory & creation modal
│   │   │   ├── CompanyDetailPage.jsx# Company overview & associated leads
│   │   │   ├── TasksPage.jsx        # Task manager & quick status update
│   │   │   ├── LoginPage.jsx        # Sign-in page
│   │   │   ├── RegisterPage.jsx     # Registration page
│   │   │   └── NotFoundPage.jsx     # 404 handler
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx        # Route definitions
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with JWT interceptors
│   │   │   ├── authService.js
│   │   │   ├── companyService.js
│   │   │   ├── leadService.js
│   │   │   ├── taskService.js
│   │   │   └── dashboardService.js
│   │   ├── utils/
│   │   │   └── theme.js             # Material UI custom CRM theme
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example                 # Frontend environment variable template
│   ├── vercel.json                  # Vercel SPA rewrite configuration
│   ├── vite.config.js
│   └── package.json
├── .gitignore                       # Root Git ignore rules
└── README.md
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=production
```

### Frontend (`frontend/.env`)

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

*(For production, set `VITE_API_BASE_URL` to your live deployed backend URL, e.g., `https://api.yourcrm.com/api`)*

---

## 🚀 Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance

---

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd Mini-CRM
```

---

### Step 2: Backend Setup & Launch
```bash
cd backend
npm install

# Create and configure .env
cp .env.example .env
# Open .env and add your MONGO_URI and JWT_SECRET

# Start backend development server
npm run dev
# Or start production server
npm start
```
The backend API will run at `http://localhost:5000`.

---

### Step 3: Frontend Setup & Launch
In a separate terminal window:
```bash
cd frontend
npm install

# Create and configure .env
cp .env.example .env

# Start frontend development server
npm run dev
```
The frontend application will be accessible at `http://localhost:5173`.

---

## 📡 API Overview

### Authentication
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/auth/users` | List all registered users (for assignments) | Yes |

### Companies
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/api/companies` | Create a company | Yes |
| `GET` | `/api/companies` | List all companies | Yes |
| `GET` | `/api/companies/:id` | Get single company details | Yes |
| `GET` | `/api/companies/:id/leads` | Get non-deleted leads belonging to company | Yes |

### Leads
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/api/leads` | Create a new lead | Yes |
| `GET` | `/api/leads` | List leads (with pagination, search, status filter) | Yes |
| `GET` | `/api/leads/:id` | Get lead details | Yes |
| `PUT` | `/api/leads/:id` | Update lead details | Yes |
| `PATCH` | `/api/leads/:id/status` | Update lead status (`New`, `Contacted`, `Lost`) | Yes |
| `DELETE` | `/api/leads/:id` | Soft delete lead (`isDeleted: true`) | Yes |

### Tasks
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/api/tasks` | Create task for a lead | Yes |
| `GET` | `/api/tasks` | List tasks (with status, assignedTo, lead filters) | Yes |
| `GET` | `/api/tasks/:id` | Get task details | Yes |
| `PUT` | `/api/tasks/:id` | Update task | Yes |
| `PATCH` | `/api/tasks/:id/status` | Update status (Only assigned user authorized) | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task | Yes |

### Dashboard
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `GET` | `/api/dashboard/stats` | Aggregated real-time metrics | Yes |

---

## 🔒 Authentication & Authorization Architecture

### 1. Authentication Flow
1. User submits credentials at `/login` or `/register`.
2. Backend verifies credentials and returns a signed JWT containing `{ userId, email }`.
3. Client stores token in `localStorage`.
4. The Axios request interceptor attaches `Authorization: Bearer <token>` to all subsequent requests.
5. If any request returns `401 Unauthorized` (e.g., token expired), the response interceptor removes local tokens and routes the user to `/login`.

### 2. Task Status Authorization Rule
- Modifying a task's status via `PATCH /api/tasks/:id/status` is strictly restricted to the user to whom the task is assigned (`task.assignedTo === req.user.userId`).
- Unauthorized users receive a `403 Forbidden` response.
- The UI reflects this rule by locking the status menu for unassigned users while the backend serves as the single source of truth.

### 3. Soft Delete Architecture
- Leads are never permanently purged from the database when deleted via `/api/leads/:id`.
- Instead, the backend sets `isDeleted: true`.
- All standard lead queries, company lead sub-queries, and dashboard count calculations automatically filter for `{ isDeleted: false }`.

### 4. Database Aggregations (Dashboard)
- Metrics are calculated entirely on MongoDB using `$facet` and aggregation pipelines:
```javascript
const stats = await Lead.aggregate([
  {
    $facet: {
      totalLeads: [{ $match: { isDeleted: false } }, { $count: "count" }],
      qualifiedLeads: [{ $match: { isDeleted: false, status: "Contacted" } }, { $count: "count" }],
    },
  },
]);
```

---

## 🌐 Production Deployment Guide

### Option A: Deploying Backend on Render / Railway
1. Push your code to GitHub.
2. In your Render/Railway dashboard, create a new **Web Service** connected to the repository root with root directory set to `backend`.
3. Set the Build Command: `npm install`
4. Set the Start Command: `node server.js`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_connection_string`
   - `JWT_SECRET`: `your_production_secret`
   - `CORS_ORIGIN`: `https://your-frontend-domain.vercel.app`
   - `NODE_ENV`: `production`

### Option B: Deploying Frontend on Vercel / Netlify
1. Create a new project in Vercel or Netlify pointing to the repository.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com/api`
6. Deploy. The included `vercel.json` and `_redirects` ensure SPA client routes resolve on page refresh.

---

## 🧪 Testing

Run backend test suites:
```bash
cd backend
npm test
```
Or execute the end-to-end 24-workflow QA verification:
```bash
node test_e2e_qa_audit.js
```
