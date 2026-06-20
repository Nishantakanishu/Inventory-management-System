# StockSync: Inventory & Order Management System

StockSync is a production-ready, full-stack Inventory and Order Management System designed to streamline catalog operations, client registrations, and transaction tracking.

---

## 1. Project Overview
StockSync provides businesses with a central portal to:
* **Manage Catalog Items (Products):** Maintain a repository of items with unique SKU tracking, strict price checks, and real-time stock balances.
* **Maintain Client Profiles (Customers):** Register customers with unique email contacts to track transactions.
* **Process Sales Transactions (Orders):** Validate stock, deduct stock counts, compute invoices, and handle transaction rollbacks cleanly on the backend.
* **Real-time Overview (Dashboard):** Display low-stock warnings and aggregations to ensure prompt catalog replenishment.

---

## 2. Features
- **Transaction-Safe Order Creation:** Validates customer, product info, and stock availability concurrently inside an isolated PostgreSQL transaction.
- **Automatic Stock Deductions & Restoration:** Automatically reduces inventory counts upon order placement. If an order is canceled, stock quantities are fully restored.
- **Intuitive Management UI:** Responsive sidebar layouts, search filters, modals, verification confirmation dialogs, and instant toast notifications.
- **Production Containerization:** Optimized multi-stage Docker builds configured to run as non-root profiles.

---

## 3. Tech Stack
### Backend
- **Python 3.12**
- **FastAPI:** High-performance, async API framework.
- **SQLAlchemy ORM:** Database object-relational mapping.
- **Pydantic Validation:** Input verification and type enforcement.
- **Alembic:** Migration support.

### Frontend
- **React & Vite:** Ultra-fast hot module replacement bundler.
- **Tailwind CSS:** Modern utility-first styles.
- **Axios:** Centralized API client service.
- **React Router v6:** Declares client paths.
- **Lucide React:** Beautiful UI icons.

### Database & Orchestration
- **PostgreSQL 17**
- **Docker & Docker Compose**

---

## 4. Folder Structure
```
inventory-management-system/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers (products, customers, orders, dashboard)
│   │   ├── core/         # Settings & database session creators
│   │   ├── models/       # SQLAlchemy schema models
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/     # Core business logic (Order transactions)
│   │   └── main.py       # FastAPI application entrypoint
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── alembic.ini
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # Views (Dashboard, Products, Customers, Orders, Details)
│   │   ├── components/   # Shared elements
│   │   ├── services/     # Axios client configuration
│   │   ├── layouts/      # Sidebar & toast layout containers
│   │   ├── context/      # React Context state management
│   │   ├── App.jsx       # Routing configurations
│   │   └── main.jsx      # DOM renderer
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 5. Environment Variables
### Backend Configurations
- `DATABASE_URL`: Connection string. Example: `postgresql://postgres:postgres@postgres:5432/inventory_db`
- `POSTGRES_DB`: Name of the database.
- `POSTGRES_USER`: Database master user.
- `POSTGRES_PASSWORD`: Database master password.
- `SECRET_KEY`: Security salt.

### Frontend Configurations
- `VITE_API_URL`: Root path to the backend REST API endpoints.

---

## 6. Setup & Execution

### Option A: Docker Compose (Recommended)
Launch the entire stack (PostgreSQL database, backend REST API, and static Nginx frontend) with one command:
```bash
docker-compose up --build
```
- **React Frontend:** http://localhost:80 (Mapped to standard HTTP)
- **FastAPI API Documentation (Swagger):** http://localhost:8000/docs
- **PostgreSQL Database:** Port `5432`

---

### Option B: Local Development Setup
If you prefer running services directly on your host machine:

#### 1. Setup the Database
Ensure PostgreSQL is running and create a blank database:
```sql
CREATE DATABASE inventory_db;
```

#### 2. Run Backend API
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Set environment variable or configure .env file
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db"
uvicorn app.main:app --reload
```

#### 3. Run Frontend Server
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 to access the dashboard.

---

## 7. API Documentation
All endpoints return standard HTTP statuses (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 409 Conflict, 422 Validation Error, and 500 Server Error).

### Products Endpoint
- `POST /api/products`: Create a product.
- `GET /api/products`: Fetch all products.
- `GET /api/products/{id}`: Fetch product details.
- `PUT /api/products/{id}`: Edit product fields.
- `DELETE /api/products/{id}`: Remove product.

### Customers Endpoint
- `POST /api/customers`: Register new customer.
- `GET /api/customers`: List customers.
- `GET /api/customers/{id}`: Fetch customer details.
- `DELETE /api/customers/{id}`: Delete customer.

### Orders Endpoint
- `POST /api/orders`: Place new order.
- `GET /api/orders`: List transaction logs.
- `GET /api/orders/{id}`: Fetch detailed invoice layout.
- `DELETE /api/orders/{id}`: Cancel/Refund transaction (reverts stock levels).

### Dashboard Endpoint
- `GET /api/dashboard/summary`: Returns summary statistics:
  ```json
  {
    "total_products": 100,
    "total_customers": 50,
    "total_orders": 200,
    "low_stock_products": 12
  }
  ```

---

## 8. Deployment Configurations
### Backend API
- **Render:** Connect Repository, specify Environment: `Python`, Build Command: `pip install -r backend/requirements.txt`, Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Configure PostgreSQL database instance and wire up the `DATABASE_URL` environment setting.
- **Railway:** Deploy directly by pointing to `/backend/Dockerfile`. Define environment variables.

### Frontend Client
- **Vercel / Netlify:** Import the repository, select directory `/frontend`, Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`. Set build-time argument `VITE_API_URL` pointing to the public URL of your deployed backend.

---

## 9. Interface Showcase (Placeholder Sections)
Below is where visual interface walk-throughs go:
- **Dashboard Metric Cards:** Sleek modern overview stats showing stock balances.
- **Order Wizard:** Real-time stock reservation drop-down selections.
