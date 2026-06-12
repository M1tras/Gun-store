# GUN STORE - Jahi- ja relvatarvete e-pood

> A modern, full-stack e-commerce platform for hunting and firearm accessories with secure authentication and admin controls.

---

## Quick Start

### Prerequisites
- **Node.js** v18+
- **Docker** & Docker Compose
- **npm**

---

## Step 1: Start the Database

### Launch MySQL container
```bash
docker-compose up -d
```

### Stop the database
```bash
docker-compose down
```

**Database Details:**
| Setting | Value |
|---------|-------|
| **Host** | localhost:3306 |
| **Database** | webshop_jager |
| **Username** | app |
| **Password** | app_pw |

---

## Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create environment file
cp .env.example .env

# Install dependencies
npm install

# (Optional) Seed database with sample data
npm run seed

# Start server
npm start
```

**Test Accounts Created by Seed:**
| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| admin@jager.ee | admin123 | Admin | Full access |
| user@jager.ee | user123 | User | No gun license |
| licensed@jager.ee | user123 | User | Has gun license |

**API Access:**
-  **API**: http://localhost:5000
-  **Swagger Docs**: http://localhost:5000/api/docs

---

## Step 3: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend Access:**
-  **App**: http://localhost:3000

---

##  Step 4: Run Tests

> ** Requirements**: Database must be running (Step 1)

```bash
# Navigate to backend
cd backend
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# Documentation tests (login, password, orders)
npx jest tests/documentation.test.js --forceExit

# All integration tests
npx jest tests/integration --forceExit

# Individual integration tests
npx jest tests/integration/auth.integration.test.js --forceExit
npx jest tests/integration/products.integration.test.js --forceExit
npx jest tests/integration/orders.integration.test.js --forceExit
```

---

##  Step 5: Test Coverage

###  Authentication Tests
- ✓ Register new account
- ✓ Login with credentials
- ✓ Get user profile
- ✓ Duplicate registration rejected
- ✓ Protected routes blocked without token
- ✓ Invalid tokens rejected

###  Product Tests
- ✓ List all products (public)
- ✓ Get product by ID
- ✓ 404 for unknown products
- ✓ Admin can create/update/delete products
- ✓ Regular users cannot modify products

###  Order Tests
- ✓ Place orders for non-restricted items
- ✓ Restricted items require gun license + age verification
- ✓ Licensed adults can order restricted items
- ✓ Underage users blocked even with license
- ✓ Admin order management
- ✓ Order status updates

---

##  Step 6: Project Structure

```
backend/
├── app.js                    Express app configuration
├── server.js                 Server entry point
├── swagger.js                OpenAPI specification
├── controllers/              Route handlers
├── middleware/               JWT authentication
├── models/                   Sequelize ORM models
├── routes/                   API routes with Swagger docs
└── tests/
    ├── documentation.test.js
    └── integration/
        ├── auth.integration.test.js
        ├── products.integration.test.js
        └── orders.integration.test.js

frontend/
├── src/
│   ├── api/                  Axios HTTP client
│   ├── components/           Navbar & UI components
│   ├── context/              Auth & Cart context
│   └── pages/                Page components
├── package.json
└── vite.config.js
```

---

##  Step 7: API Endpoints

 **Full Interactive Docs**: http://localhost:5000/api/docs

###  Authentication
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/auth/register` | New user registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get profile (requires token) |

###  Products
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin only |
| PUT | `/api/products/:id` | Admin only |
| DELETE | `/api/products/:id` | Admin only |

###  Orders
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/api/orders` | Authenticated users |
| POST | `/api/orders` | Authenticated users |
| GET | `/api/orders/admin` | Admin only |
| PATCH | `/api/orders/:id/status` | Admin only |

###  Health Check
| Method | Endpoint |
|--------|----------|
| GET | `/api/health` |
---
