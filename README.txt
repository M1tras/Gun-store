========================================
  GUN STORE - Jahi- ja relvatarvete e-pood
========================================

REQUIREMENTS
------------
  - Node.js v18+
  - Docker & Docker Compose
  - npm


========================================
  1. START THE DATABASE (Docker)
========================================

Start the MySQL database container:

  docker-compose up -d

Stop the database:

  docker-compose down

The database runs on localhost:3306.
Credentials are defined in docker-compose.yml:
  - Database : webshop_jager
  - User     : app
  - Password : app_pw


========================================
  2. BACKEND SETUP
========================================

Navigate to the backend directory:

  cd backend

Create the environment file from the example:

  cp .env.example .env

Install dependencies:

  npm install

(Optional) Seed the database with sample products and users:

  npm run seed

  Seed creates the following test accounts:
    admin@jager.ee     / admin123  (role: admin)
    user@jager.ee      / user123   (role: user, no gun license)
    licensed@jager.ee  / user123   (role: user, has gun license)

Start the backend server:

  npm start

The API runs on http://localhost:5000
Swagger UI is available at http://localhost:5000/api/docs


========================================
  3. FRONTEND SETUP
========================================

Navigate to the frontend directory:

  cd frontend

Install dependencies:

  npm install

Start the development server:

  npm run dev

The frontend runs on http://localhost:5173


========================================
  4. RUN TESTS
========================================

All tests are in the backend. Make sure the database
is running (step 1) before running tests.

  cd backend

--- Run all tests (documentation + integration) ---

  npm test

--- Run only documentation tests ---
  (login, wrong password, order creation)

  npx jest tests/documentation.test.js --forceExit

--- Run only integration tests ---

  npx jest tests/integration --forceExit

--- Run a specific integration test suite ---

  npx jest tests/integration/auth.integration.test.js --forceExit
  npx jest tests/integration/products.integration.test.js --forceExit
  npx jest tests/integration/orders.integration.test.js --forceExit


========================================
  5. INTEGRATION TEST COVERAGE
========================================

auth.integration.test.js
  - Register new account
  - Login with registered credentials
  - Get profile of logged-in user
  - Duplicate registration is rejected
  - Protected route blocked without token
  - Protected route blocked with invalid token

products.integration.test.js
  - List all products (public)
  - Get single product by ID
  - 404 for unknown product
  - Admin can create a product
  - Admin can update a product
  - Admin can delete a product
  - Regular user cannot create a product
  - Unauthenticated user cannot create a product

orders.integration.test.js
  - Place order for non-restricted item
  - Placed order appears in user order list
  - Unauthenticated user cannot place an order
  - User without gun license blocked on restricted items
  - Underage user blocked even with gun license
  - Licensed adult user can order restricted item
  - Order with non-existent product returns 404
  - Empty items array returns 400
  - Admin can view all orders
  - Admin can update order status
  - Invalid status value is rejected
  - Regular user cannot access admin order list


========================================
  6. PROJECT STRUCTURE
========================================

  backend/
    app.js                  Express app (no listen)
    server.js               Starts the server
    swagger.js              OpenAPI spec config
    controllers/            Route handler logic
    middleware/             JWT auth middleware
    models/                 Sequelize models
    routes/                 Express routers with Swagger JSDoc
    tests/
      documentation.test.js           3 tests from project docs
      integration/
        auth.integration.test.js
        products.integration.test.js
        orders.integration.test.js

  frontend/
    src/
      api/                  Axios client
      components/           Navbar
      context/              Auth and cart context
      pages/                All page components


========================================
  7. API ENDPOINTS
========================================

Full interactive docs: http://localhost:5000/api/docs

  Auth
    POST   /api/auth/register
    POST   /api/auth/login
    GET    /api/auth/me              (requires token)

  Products
    GET    /api/products
    GET    /api/products/:id
    POST   /api/products             (admin only)
    PUT    /api/products/:id         (admin only)
    DELETE /api/products/:id         (admin only)

  Orders
    GET    /api/orders               (requires token)
    POST   /api/orders               (requires token)
    GET    /api/orders/admin         (admin only)
    PATCH  /api/orders/:id/status    (admin only)

  Health
    GET    /api/health
