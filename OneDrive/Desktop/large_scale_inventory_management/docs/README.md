# Large Scale Inventory Management System

A production-ready, full-stack inventory management system built with React.js, Node.js/Express, and MySQL. Supports role-based access control (Admin/Staff), real-time analytics, QR code generation & scanning, and comprehensive reporting.

---

## 🚀 Tech Stack

| Layer     | Technology                              |
|-----------|----------------------------------------|
| Frontend  | React.js 19, Vite, Recharts, React Router |
| Backend   | Node.js, Express.js                     |
| Database  | MySQL                                   |
| Auth      | JWT (JSON Web Tokens), bcrypt           |
| QR Code   | qrcode (generation), html5-qrcode (scanning) |

---

## 📁 Project Structure

```
large_scale_inventory_management/
├── frontend/                  # React.js Frontend
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── context/           # Auth Context (state management)
│       ├── pages/
│       │   ├── admin/         # Admin-only pages
│       │   └── staff/         # Staff-only pages
│       └── services/          # API service layer
├── backend/                   # Node.js Backend
│   ├── config/                # Database configuration
│   ├── controllers/           # Business logic
│   ├── middleware/             # Auth middleware
│   ├── routes/                # API route definitions
│   └── app.js                 # Express app entry
├── database/
│   └── schema.sql             # MySQL schema + seed data
└── docs/                      # Documentation
```

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd large_scale_inventory_management
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p -P 3307

# Run the schema
source database/schema.sql;
```

### 3. Backend Setup
```bash
cd backend
npm install
# Configure .env file with your MySQL credentials
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🔐 Default Credentials

| Role   | Username | Password  |
|--------|----------|-----------|
| Admin  | admin    | admin123  |
| Staff  | staff1   | admin123  |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint            | Description      | Auth |
|--------|--------------------|--------------------|------|
| POST   | /api/auth/login    | User login         | No   |
| POST   | /api/auth/register | Register user      | Admin|
| GET    | /api/auth/profile  | Get user profile   | Yes  |

### Products
| Method | Endpoint                  | Description            | Auth  |
|--------|--------------------------|------------------------|-------|
| GET    | /api/products            | Get all products       | Yes   |
| GET    | /api/products/:id        | Get product by ID      | Yes   |
| POST   | /api/products            | Create product         | Admin |
| PUT    | /api/products/:id        | Update product         | Admin |
| DELETE | /api/products/:id        | Delete product         | Admin |
| GET    | /api/products/low-stock  | Get low stock products | Yes   |
| GET    | /api/products/:id/qrcode | Generate QR code       | Yes   |

### Inventory
| Method | Endpoint                    | Description         | Auth  |
|--------|----------------------------|---------------------|-------|
| GET    | /api/inventory/transactions | Get transactions    | Yes   |
| POST   | /api/inventory/stock-in    | Add stock           | Admin |
| POST   | /api/inventory/stock-out   | Remove stock        | Admin |

### Suppliers
| Method | Endpoint             | Description       | Auth  |
|--------|---------------------|-------------------|-------|
| GET    | /api/suppliers       | Get all suppliers | Yes   |
| POST   | /api/suppliers       | Create supplier   | Admin |
| PUT    | /api/suppliers/:id   | Update supplier   | Admin |
| DELETE | /api/suppliers/:id   | Delete supplier   | Admin |

### Orders
| Method | Endpoint                  | Description      | Auth  |
|--------|--------------------------|------------------|-------|
| GET    | /api/orders              | Get all orders   | Yes   |
| GET    | /api/orders/:id          | Get order detail | Yes   |
| POST   | /api/orders              | Create order     | Admin |
| PATCH  | /api/orders/:id/status   | Update status    | Admin |
| DELETE | /api/orders/:id          | Delete order     | Admin |

### Dashboard & Reports
| Method | Endpoint                  | Description         | Auth |
|--------|--------------------------|---------------------|------|
| GET    | /api/dashboard/stats     | Dashboard statistics| Yes  |
| GET    | /api/dashboard/charts    | Chart data          | Yes  |
| GET    | /api/reports/inventory   | Inventory report    | Yes  |
| GET    | /api/reports/low-stock   | Low stock report    | Yes  |
| GET    | /api/reports/export/csv  | Export CSV           | Yes  |

---

## 🎯 Features

### Admin Features
- ✅ Full dashboard with analytics charts
- ✅ Product CRUD operations
- ✅ Inventory Stock In / Stock Out
- ✅ Supplier management
- ✅ Order tracking with status updates
- ✅ Reports with CSV export
- ✅ QR Code generation per product

### Staff Features
- ✅ Read-only dashboard with stats
- ✅ View products and inventory
- ✅ Low stock alerts
- ✅ QR Code scanning with webcam

---

## 🔀 Git Branching Strategy

```
main            ← Production-ready code
├── develop     ← Integration branch
│   ├── feature/auth       ← Authentication module
│   ├── feature/products   ← Product management
│   ├── feature/inventory  ← Inventory tracking
│   ├── feature/orders     ← Order management
│   └── feature/reports    ← Reporting module
```

---

## 📋 Configuration Items (SCM)

1. **Source Code** — Frontend (React) + Backend (Node.js) source files
2. **Database Schema** — `database/schema.sql` with table definitions and seed data
3. **Documentation** — `docs/README.md`, `docs/test-cases.md`
4. **Environment Config** — `.env` (not tracked in Git)
5. **Dependencies** — `package.json` for both frontend and backend

---

## 📄 License

This project is developed for academic evaluation purposes.
