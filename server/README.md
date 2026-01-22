# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents
1. [Authentication Routes](#authentication-routes)
2. [Business Routes](#business-routes)
3. [Product Routes](#product-routes)
4. [Transaction Routes](#transaction-routes)
5. [Analytics Routes](#analytics-routes)
6. [AI Insights Routes](#ai-insights-routes)

---

## Authentication Routes
**Base Path:** `/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login with email and password | No |
| POST | `/google-login` | Login with Google OAuth | No |

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully"
}
```

**Errors:**
- `400` - Validation error (invalid email format, password required)
- `409` - Email already in use

---

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Validation error (email or password required)
- `401` - Invalid credentials

---

### POST /auth/google-login
Login with Google OAuth credential.

**Request Body:**
```json
{
  "credential": "google_jwt_token_here"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Validation error (credential required)
- `401` - Invalid Google credential

---

## Business Routes
**Base Path:** `/businesses`
**Auth Required:** Yes (except GET all businesses)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new business | Yes |
| GET | `/` | Get all businesses | No |
| GET | `/my` | Get current user's businesses | Yes |
| GET | `/:businessId` | Get business by ID | Yes (owner only) |
| PUT | `/:businessId` | Update business | Yes (owner only) |
| DELETE | `/:businessId` | Delete business | Yes (owner only) |

### POST /businesses
Create a new business (max 3 per user).

**Request Body:**
```json
{
  "name": "My Business",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Business description",
  "type": "Retail",
  "address": "123 Main St, City, Country"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "My Business",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Business description",
  "type": "Retail",
  "address": "123 Main St, City, Country",
  "UserId": 1,
  "createdAt": "2026-01-22T00:00:00.000Z",
  "updatedAt": "2026-01-22T00:00:00.000Z"
}
```

**Errors:**
- `401` - Unauthorized (token required)
- `409` - User has reached maximum of 3 businesses

---

### GET /businesses
Get all businesses (public endpoint).

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "My Business",
    "type": "Retail",
    "imageUrl": "https://example.com/image.jpg",
    "User": {
      "email": "user@example.com",
      "firstName": "John"
    }
  }
]
```

---

### GET /businesses/my
Get current user's businesses.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "My Business",
    "type": "Retail",
    "imageUrl": "https://example.com/image.jpg",
    "description": "Business description"
  }
]
```

**Errors:**
- `401` - Unauthorized

---

### GET /businesses/:businessId
Get business details by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "My Business",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Business description",
  "type": "Retail",
  "address": "123 Main St, City, Country",
  "UserId": 1
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not business owner)
- `404` - Business not found

---

### PUT /businesses/:businessId
Update business information.

**Request Body:**
```json
{
  "name": "Updated Business Name",
  "description": "Updated description",
  "type": "Technology",
  "address": "456 New St, City, Country"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Updated Business Name",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Updated description",
  "type": "Technology",
  "address": "456 New St, City, Country",
  "UserId": 1
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not business owner)
- `404` - Business not found

---

### DELETE /businesses/:businessId
Delete a business.

**Response:** `200 OK`
```json
{
  "message": "Business deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not business owner)
- `404` - Business not found

---

## Product Routes
**Base Path:** `/businesses/:businessId/products`
**Auth Required:** Yes (business owner only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all products for a business |
| POST | `/` | Create a new product |
| GET | `/:id` | Get product by ID |
| PUT | `/:id` | Update product |
| PATCH | `/:id/restock` | Restock product |
| PATCH | `/:id/deduct-stock` | Deduct stock |
| PATCH | `/:id/toggle-status` | Toggle active status |
| PATCH | `/:id/soft-delete` | Soft delete product |
| DELETE | `/:id` | Permanently delete product |

### GET /businesses/:businessId/products
Get all products for a business.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "stockKeepingUnit": "SKU-001",
    "basePrice": 50000,
    "sellingPrice": 75000,
    "stock": 100,
    "isActive": true,
    "imageUrl": "https://example.com/product.jpg",
    "Business": {
      "id": 1,
      "name": "My Business"
    }
  }
]
```

---

### POST /businesses/:businessId/products
Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "imageUrl": "https://example.com/product.jpg",
  "description": "Product description",
  "stockKeepingUnit": "SKU-001",
  "basePrice": 50000,
  "sellingPrice": 75000,
  "stock": 100,
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "BusinessId": 1,
  "name": "Product Name",
  "imageUrl": "https://example.com/product.jpg",
  "description": "Product description",
  "stockKeepingUnit": "SKU-001",
  "basePrice": 50000,
  "sellingPrice": 75000,
  "stock": 100,
  "isActive": true
}
```

**Errors:**
- `400` - Validation error (name, SKU, prices required)
- `401` - Unauthorized
- `403` - Forbidden

---

### GET /businesses/:businessId/products/:id
Get product by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Product Name",
  "stockKeepingUnit": "SKU-001",
  "basePrice": 50000,
  "sellingPrice": 75000,
  "stock": 100,
  "isActive": true,
  "description": "Product description",
  "Business": {
    "id": 1,
    "name": "My Business"
  }
}
```

**Errors:**
- `404` - Product not found

---

### PUT /businesses/:businessId/products/:id
Update product information.

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "basePrice": 55000,
  "sellingPrice": 80000,
  "stock": 150
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Updated Product Name",
  "basePrice": 55000,
  "sellingPrice": 80000,
  "stock": 150
}
```

---

### PATCH /businesses/:businessId/products/:id/restock
Increase product stock.

**Request Body:**
```json
{
  "quantity": 50
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Product Name",
  "stock": 150,
  "message": "Stock updated successfully"
}
```

---

### PATCH /businesses/:businessId/products/:id/deduct-stock
Decrease product stock.

**Request Body:**
```json
{
  "quantity": 10
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Product Name",
  "stock": 140,
  "message": "Stock deducted successfully"
}
```

---

### PATCH /businesses/:businessId/products/:id/toggle-status
Toggle product active status.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Product Name",
  "isActive": false
}
```

---

### PATCH /businesses/:businessId/products/:id/soft-delete
Soft delete a product (sets isDeleted flag).

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Product Name",
  "isDeleted": true,
  "message": "Product soft deleted successfully"
}
```

---

### DELETE /businesses/:businessId/products/:id
Permanently delete a product.

**Response:** `200 OK`
```json
{
  "message": "Product deleted successfully"
}
```

---

## Transaction Routes
**Base Path:** `/businesses/:businessId/transactions`
**Auth Required:** Yes (business owner only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all transactions for a business |
| GET | `/stats` | Get transaction statistics |
| POST | `/` | Create a new transaction |
| GET | `/:id` | Get transaction by ID |
| PUT | `/:id` | Update transaction |
| DELETE | `/:id` | Delete transaction |

### GET /businesses/:businessId/transactions
Get all transactions for a business.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "BusinessId": 1,
    "type": "income",
    "totalAmount": 500000,
    "paymentMethod": "cash",
    "notes": "Daily sales",
    "createdAt": "2026-01-22T10:00:00.000Z"
  }
]
```

---

### GET /businesses/:businessId/transactions/stats
Get transaction statistics.

**Response:** `200 OK`
```json
{
  "totalIncome": 5000000,
  "totalExpense": 2000000,
  "netProfit": 3000000,
  "incomeCount": 50,
  "expenseCount": 20
}
```

---

### POST /businesses/:businessId/transactions
Create a new transaction.

**Request Body:**
```json
{
  "type": "income",
  "totalAmount": 500000,
  "paymentMethod": "cash",
  "notes": "Product sales"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "BusinessId": 1,
  "type": "income",
  "totalAmount": 500000,
  "paymentMethod": "cash",
  "notes": "Product sales",
  "createdAt": "2026-01-22T10:00:00.000Z"
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden

---

### GET /businesses/:businessId/transactions/:id
Get transaction by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "BusinessId": 1,
  "type": "income",
  "totalAmount": 500000,
  "paymentMethod": "cash",
  "notes": "Product sales",
  "Business": {
    "id": 1,
    "name": "My Business"
  }
}
```

---

### PUT /businesses/:businessId/transactions/:id
Update transaction.

**Request Body:**
```json
{
  "type": "income",
  "totalAmount": 550000,
  "paymentMethod": "credit_card",
  "notes": "Updated notes"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "type": "income",
  "totalAmount": 550000,
  "paymentMethod": "credit_card",
  "notes": "Updated notes"
}
```

---

### DELETE /businesses/:businessId/transactions/:id
Delete a transaction.

**Response:** `200 OK`
```json
{
  "message": "Transaction deleted successfully"
}
```

---

## Analytics Routes
**Base Path:** `/businesses/:businessId/analytics`
**Auth Required:** Yes (business owner only)

| Endpoint | Description |
|----------|-------------|
| `/dashboard` | Complete business dashboard overview |
| `/financial` | Financial summary with date filters |
| `/profitability` | Overall profit margins |
| `/payment-methods` | Payment method breakdown |
| `/expenses` | Expense transactions list |
| `/top-products` | Best selling products |
| `/product-profitability` | Profit per product |
| `/product-performance` | Top & low performers |
| `/inventory` | Stock status & alerts |
| `/sales-trends` | Sales over time |

### GET /businesses/:businessId/analytics/dashboard
Get comprehensive dashboard data.

**Response:** `200 OK`
```json
{
  "business": {
    "id": 1,
    "name": "My Business",
    "type": "Retail"
  },
  "summary": {
    "totalProducts": 50,
    "totalTransactions": 120,
    "totalIncome": 10000000,
    "totalExpense": 4000000,
    "netProfit": 6000000
  },
  "topProducts": [...],
  "inventory": {...},
  "recentTransactions": [...]
}
```

---

### GET /businesses/:businessId/analytics/financial
Get financial summary.

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response:** `200 OK`
```json
{
  "totalIncome": 10000000,
  "totalExpense": 4000000,
  "netProfit": 6000000,
  "profitMargin": "60.00",
  "incomeCount": 80,
  "expenseCount": 40,
  "paymentMethods": {
    "cash": 5000000,
    "credit_card": 3000000,
    "e_wallet": 2000000
  }
}
```

---

### GET /businesses/:businessId/analytics/profitability
Get overall profitability metrics.

**Response:** `200 OK`
```json
{
  "totalRevenue": 10000000,
  "totalCost": 6000000,
  "totalProfit": 4000000,
  "profitMargin": "40.00"
}
```

---

### GET /businesses/:businessId/analytics/payment-methods
Get payment method statistics.

**Response:** `200 OK`
```json
[
  {
    "paymentMethod": "cash",
    "transactionCount": 50,
    "totalAmount": 5000000,
    "averageAmount": 100000
  },
  {
    "paymentMethod": "credit_card",
    "transactionCount": 20,
    "totalAmount": 3000000,
    "averageAmount": 150000
  }
]
```

---

### GET /businesses/:businessId/analytics/expenses
Get expense breakdown.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "totalAmount": 500000,
    "paymentMethod": "cash",
    "notes": "Office supplies",
    "createdAt": "2026-01-22T10:00:00.000Z"
  }
]
```

---

### GET /businesses/:businessId/analytics/top-products
Get top selling products.

**Query Parameters:**
- `limit` (optional): Number of products (default: 10)

**Response:** `200 OK`
```json
[
  {
    "ProductId": 1,
    "totalQuantitySold": 150,
    "totalRevenue": 5000000,
    "Product": {
      "name": "Product A",
      "stockKeepingUnit": "SKU-001"
    }
  }
]
```

---

### GET /businesses/:businessId/analytics/product-profitability
Get profitability per product.

**Response:** `200 OK`
```json
[
  {
    "product": {
      "id": 1,
      "name": "Product A",
      "sku": "SKU-001",
      "basePrice": 50000,
      "sellingPrice": 75000
    },
    "totalSold": 150,
    "totalRevenue": 11250000,
    "totalCost": 7500000,
    "totalProfit": 3750000,
    "profitMargin": 33.33
  }
]
```

---

### GET /businesses/:businessId/analytics/product-performance
Get product performance metrics.

**Response:** `200 OK`
```json
{
  "topPerformers": [...],
  "lowPerformers": [...]
}
```

---

### GET /businesses/:businessId/analytics/inventory
Get inventory status.

**Query Parameters:**
- `threshold` (optional): Low stock threshold (default: 10)

**Response:** `200 OK`
```json
{
  "lowStock": [...],
  "outOfStock": [...],
  "inStock": [...],
  "totalProducts": 50,
  "lowStockCount": 5,
  "outOfStockCount": 2
}
```

---

### GET /businesses/:businessId/analytics/sales-trends
Get sales trends over time.

**Query Parameters:**
- `period` (optional): daily/weekly/monthly (default: daily)
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Response:** `200 OK`
```json
[
  {
    "period": "2026-01-22",
    "totalSales": 1500000,
    "transactionCount": 25,
    "averageTransaction": 60000
  }
]
```

---

## AI Insights Routes
**Base Path:** `/businesses/:businessId/insights`
**Auth Required:** Yes (business owner only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all insights with filters |
| GET | `/latest` | Get latest insight |
| GET | `/summary` | Get latest digestible summary |
| GET | `/stats` | Get insight statistics |
| GET | `/:id` | Get insight by ID |
| GET | `/:id/summary` | Get summary for specific insight |
| POST | `/generate` | Manually generate insight |
| POST | `/:id/regenerate` | Regenerate insight |
| POST | `/:id/regenerate-summary` | Regenerate summary only |
| POST | `/cleanup` | Clean up old insights |
| DELETE | `/:id` | Delete insight |

### GET /businesses/:businessId/insights
Get all insights with optional filters.

**Query Parameters:**
- `limit` (optional): Number of insights (default: 10)
- `type` (optional): daily/weekly/monthly/custom
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Response:** `200 OK`
```json
{
  "count": 5,
  "data": [
    {
      "id": 1,
      "insightType": "daily",
      "content": "Full AI analysis...",
      "summary": {...},
      "generatedAt": "2026-01-22T06:00:00.000Z"
    }
  ]
}
```

---

### GET /businesses/:businessId/insights/latest
Get the latest insight.

**Query Parameters:**
- `type` (optional): daily/weekly/monthly (default: daily)

**Response:** `200 OK`
```json
{
  "id": 1,
  "insightType": "daily",
  "content": "Full AI-generated business analysis...",
  "summary": {
    "insights": [...]
  },
  "generatedAt": "2026-01-22T06:00:00.000Z",
  "metadata": {...}
}
```

**Errors:**
- `404` - No insights available yet

---

### GET /businesses/:businessId/insights/summary
Get latest digestible summary (for UI cards).

**Query Parameters:**
- `type` (optional): daily/weekly/monthly (default: daily)

**Response:** `200 OK`
```json
{
  "insightId": 1,
  "type": "daily",
  "generatedAt": "2026-01-22T06:00:00.000Z",
  "summary": {
    "insights": [
      {
        "id": "1",
        "message": "Profit margin declined to 18.5%",
        "type": "financial",
        "priority": "high",
        "trend": "negative",
        "icon": "trending-down",
        "value": "18.5%",
        "action": "Review pricing strategy"
      },
      {
        "id": "2",
        "message": "3 products are out of stock",
        "type": "inventory",
        "priority": "high",
        "trend": "warning",
        "icon": "alert-circle",
        "value": "3 items",
        "action": "Restock immediately"
      }
    ]
  }
}
```

---

### GET /businesses/:businessId/insights/stats
Get insight statistics.

**Response:** `200 OK`
```json
{
  "total": 25,
  "byType": {
    "daily": 20,
    "weekly": 3,
    "monthly": 1,
    "custom": 1
  },
  "latest": {
    "id": 25,
    "type": "daily",
    "generatedAt": "2026-01-22T06:00:00.000Z"
  }
}
```

---

### GET /businesses/:businessId/insights/:id
Get specific insight by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "insightType": "daily",
  "content": "Full AI analysis...",
  "generatedAt": "2026-01-22T06:00:00.000Z",
  "metadata": {...},
  "createdAt": "2026-01-22T06:00:00.000Z"
}
```

---

### GET /businesses/:businessId/insights/:id/summary
Get digestible summary for specific insight.

**Response:** `200 OK`
```json
{
  "insightId": 1,
  "type": "daily",
  "generatedAt": "2026-01-22T06:00:00.000Z",
  "summary": {
    "insights": [...]
  }
}
```

---

### POST /businesses/:businessId/insights/generate
Manually trigger insight generation.

**Request Body:**
```json
{
  "type": "custom"
}
```

**Valid types:** daily, weekly, monthly, custom

**Response:** `201 Created`
```json
{
  "message": "Insight generated successfully",
  "insight": {
    "id": 1,
    "insightType": "custom",
    "content": "...",
    "generatedAt": "2026-01-22T10:00:00.000Z",
    "metadata": {...}
  }
}
```

**Errors:**
- `400` - Invalid insight type
- `404` - Business not found

**Note:** For daily insights, if already generated today, returns existing insight instead.

---

### POST /businesses/:businessId/insights/:id/regenerate
Regenerate a specific insight (deletes old, creates new).

**Response:** `200 OK`
```json
{
  "message": "Insight regenerated successfully",
  "insight": {
    "id": 2,
    "insightType": "daily",
    "content": "...",
    "generatedAt": "2026-01-22T10:30:00.000Z",
    "metadata": {...}
  }
}
```

---

### POST /businesses/:businessId/insights/:id/regenerate-summary
Regenerate summary only (keeps full insight).

**Response:** `200 OK`
```json
{
  "message": "Summary regenerated successfully",
  "insightId": 1,
  "summary": {
    "insights": [...]
  }
}
```

---

### POST /businesses/:businessId/insights/cleanup
Clean up old insights.

**Request Body:**
```json
{
  "daysToKeep": 90
}
```

**Response:** `200 OK`
```json
{
  "message": "Cleaned up insights older than 90 days",
  "deletedCount": 15
}
```

**Errors:**
- `400` - daysToKeep must be at least 30

---

### DELETE /businesses/:businessId/insights/:id
Delete a specific insight.

**Response:** `200 OK`
```json
{
  "message": "Insight deleted successfully",
  "deletedId": 1
}
```

---

## AI Insights Routes
**Base Path:** `/businesses/:businessId/insights`
**Auth Required:** Yes (business owner only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all insights for a business |
| GET | `/latest` | Get latest insight |
| GET | `/summary` | Get latest insight summary |
| GET | `/stats` | Get insight statistics |
| GET | `/:id` | Get insight by ID |
| GET | `/:id/summary` | Get summary for specific insight |
| POST | `/generate` | Generate new insight |
| POST | `/regenerate/:id` | Regenerate existing insight |
| POST | `/:id/regenerate-summary` | Regenerate summary only |
| POST | `/:id/send-email` | Send email for specific insight |
| POST | `/send-bulk-email` | Send bulk email reports |
| POST | `/cleanup` | Cleanup old insights |
| DELETE | `/:id` | Delete insight |

### GET /businesses/:businessId/insights
Get all insights for a business with optional filters.

**Query Parameters:**
- `limit` (number, default: 10) - Maximum number of insights to return
- `type` (string) - Filter by insight type (daily/weekly/monthly/custom)
- `startDate` (string, ISO 8601) - Filter insights from this date
- `endDate` (string, ISO 8601) - Filter insights until this date

**Response:** `200 OK`
```json
{
  "count": 10,
  "data": [
    {
      "id": 1,
      "insightType": "daily",
      "content": "Full markdown analysis...",
      "summary": {
        "insights": [
          {
            "id": "1",
            "icon": "trending-down",
            "type": "financial",
            "trend": "negative",
            "value": "Rp -7.4M",
            "message": "Net loss due to high operational expenses",
            "action": "Audit operational overhead to reduce expenses by 5-10%",
            "priority": "high"
          }
        ]
      },
      "generatedAt": "2026-01-22T07:00:00.000Z",
      "createdAt": "2026-01-22T07:05:23.000Z"
    }
  ]
}
```

---

### GET /businesses/:businessId/insights/latest
Get the most recent insight for a business.

**Query Parameters:**
- `type` (string, default: "daily") - Type of insight to retrieve

**Response:** `200 OK`
```json
{
  "id": 1,
  "insightType": "daily",
  "content": "Full markdown analysis...",
  "summary": {
    "insights": [...]
  },
  "generatedAt": "2026-01-22T07:00:00.000Z",
  "metadata": {
    "business": {...},
    "financial": {...},
    "topProducts": [...],
    "inventory": {...}
  }
}
```

**Errors:**
- `404` - No insights available yet

---

### GET /businesses/:businessId/insights/summary
Get digestible summary of latest insight.

**Query Parameters:**
- `type` (string, default: "daily") - Type of insight

**Response:** `200 OK`
```json
{
  "insightId": 1,
  "type": "daily",
  "generatedAt": "2026-01-22T07:00:00.000Z",
  "summary": {
    "insights": [
      {
        "id": "1",
        "icon": "trending-down",
        "type": "financial",
        "trend": "negative",
        "value": "Rp -7.4M",
        "message": "Net loss due to high operational expenses",
        "action": "Audit operational overhead to reduce expenses by 5-10%",
        "priority": "high"
      },
      {
        "id": "2",
        "icon": "package",
        "type": "inventory",
        "trend": "warning",
        "value": "7 Items",
        "message": "46% of products are low on stock",
        "action": "Immediately restock top-performing items",
        "priority": "high"
      }
    ]
  }
}
```

---

### GET /businesses/:businessId/insights/stats
Get statistics about insights for a business.

**Response:** `200 OK`
```json
{
  "total": 45,
  "byType": {
    "daily": 30,
    "weekly": 10,
    "monthly": 3,
    "custom": 2
  },
  "latest": {
    "id": 45,
    "type": "daily",
    "generatedAt": "2026-01-22T07:00:00.000Z"
  }
}
```

---

### GET /businesses/:businessId/insights/:id
Get a specific insight by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "insightType": "weekly",
  "content": "Full markdown analysis...",
  "generatedAt": "2026-01-20T07:00:00.000Z",
  "metadata": {
    "business": {...},
    "financial": {...}
  },
  "createdAt": "2026-01-20T07:05:23.000Z"
}
```

**Errors:**
- `404` - Insight not found

---

### GET /businesses/:businessId/insights/:id/summary
Get digestible summary for a specific insight.

**Response:** `200 OK`
```json
{
  "insightId": 1,
  "type": "weekly",
  "generatedAt": "2026-01-20T07:00:00.000Z",
  "summary": {
    "insights": [...]
  }
}
```

**Errors:**
- `404` - Insight not found or summary not available

---

### POST /businesses/:businessId/insights/generate
Manually generate a new AI insight for the business.

**Request Body:**
```json
{
  "type": "custom"
}
```

**Response:** `201 Created`
```json
{
  "message": "Insight generated successfully",
  "insight": {
    "id": 1,
    "insightType": "custom",
    "content": "Full analysis...",
    "generatedAt": "2026-01-22T10:30:00.000Z",
    "metadata": {...}
  }
}
```

**Errors:**
- `400` - Invalid insight type
- `200` - Daily insight already generated today (returns existing)

**Note:** Valid types are: `daily`, `weekly`, `monthly`, `custom`

---

### POST /businesses/:businessId/insights/regenerate/:id
Regenerate an existing insight (useful if AI response was poor).

**Response:** `200 OK`
```json
{
  "message": "Insight regenerated successfully",
  "insight": {
    "id": 2,
    "insightType": "daily",
    "content": "New analysis...",
    "generatedAt": "2026-01-22T10:35:00.000Z",
    "metadata": {...}
  }
}
```

**Errors:**
- `404` - Original insight not found

**Note:** This deletes the old insight and creates a new one with the same type.

---

### POST /businesses/:businessId/insights/:id/regenerate-summary
Regenerate only the digestible summary for an existing insight.

**Response:** `200 OK`
```json
{
  "message": "Summary regenerated successfully",
  "insightId": 1,
  "summary": {
    "insights": [...]
  }
}
```

**Errors:**
- `404` - Insight not found

---

### POST /businesses/:businessId/insights/:id/send-email
**NEW:** Manually send an email report for a specific insight.

**Response:** `200 OK`
```json
{
  "message": "Email sent successfully",
  "email": "owner@example.com",
  "businessName": "My Business"
}
```

**Errors:**
- `404` - Insight not found
- `500` - Email sending failed (business owner email not found, SMTP error)

**Note:** Email will be sent to the business owner's registered email address with a professionally formatted HTML report including key insights cards and detailed analysis.

---

### POST /businesses/:businessId/insights/send-bulk-email
**NEW:** Send email reports for the latest insights to one or multiple businesses.

**Request Body:**
```json
{
  "type": "daily",
  "businessIds": [1, 2, 3]
}
```

**Parameters:**
- `type` (string, default: "daily") - Type of insight to send
- `businessIds` (array, optional) - Array of business IDs to send to. If not provided, only sends to the current business.

**Response:** `200 OK`
```json
{
  "message": "Bulk email sending completed",
  "sent": 2,
  "failed": 1,
  "total": 3,
  "errors": [
    {
      "businessId": 3,
      "businessName": "Business Name",
      "reason": "No email address"
    }
  ]
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not business owner)

**Use Cases:**
1. Send to current business only:
```json
{
  "type": "weekly"
}
```

2. Send to multiple businesses (admin feature):
```json
{
  "type": "monthly",
  "businessIds": [1, 2, 3, 4]
}
```

**Note:** Emails include:
- Professional Material UI light mode design
- Key insights cards with priority levels
- Trend indicators (positive/negative/warning)
- Actionable recommendations
- Detailed analysis section
- Optimized for Gmail and major email clients

---

### POST /businesses/:businessId/insights/cleanup
Manually cleanup old insights (admin feature).

**Request Body:**
```json
{
  "daysToKeep": 90
}
```

**Response:** `200 OK`
```json
{
  "message": "Cleaned up insights older than 90 days",
  "deletedCount": 15
}
```

**Errors:**
- `400` - daysToKeep must be at least 30

---

### DELETE /businesses/:businessId/insights/:id
Delete a specific insight.

**Response:** `200 OK`
```json
{
  "message": "Insight deleted successfully",
  "deletedId": 1
}
```

**Errors:**
- `404` - Insight not found

---

## Email Report Features

### Email Design
- **Material UI Light Mode** - Clean, professional appearance
- **Table-based Layout** - Ensures consistent rendering across email clients
- **Gmail Optimized** - Tested for Gmail web, iOS, and Android
- **Responsive** - Adapts to mobile and desktop clients

### Email Content Structure
1. **Header Section**
   - Business name and insight type
   - Generation date and time

2. **Key Insights Cards**
   - Visual priority indicators (high/medium/low)
   - Type badges (financial, inventory, product, etc.)
   - Trend indicators with emojis (📈📉⚠️➡️)
   - Metric values when applicable
   - Clear messages and actionable recommendations

3. **Detailed Analysis**
   - Full AI-generated markdown content
   - Converted to HTML for email display

4. **Footer**
   - Automated report disclaimer
   - Dashboard login reminder

### Insight Card Types
- **Financial** - Revenue, profit margins, expenses (🔵 Blue)
- **Inventory** - Stock levels, restocking alerts (🟠 Orange)
- **Product** - Product performance analysis (🟣 Purple)
- **Operations** - Operational efficiency (🟢 Green)
- **Growth** - Growth opportunities (🔴 Pink)
- **Alert** - Urgent alerts (🔴 Red)

### Priority Levels
- **High** - Red left border, urgent action required
- **Medium** - Orange left border, important but not urgent
- **Low** - Green left border, informational

---

## Automated Email Schedule

AI insights are automatically generated and emailed based on the following schedule:

| Type | Schedule | Recipients |
|------|----------|------------|
| Daily | Every day at 7:00 AM (WIB) | All business owners |
| Weekly | Every Monday at 7:00 AM (WIB) | All business owners |
| Monthly | 1st of month at 7:00 AM (WIB) | All business owners |

**Schedule Rules:**
- Daily insights skip Mondays (weekly runs instead)
- Daily insights skip 1st of month (monthly runs instead)
- Weekly insights skip 1st of month if it falls on Monday

**Email Delivery:**
- 1 second delay between emails to avoid rate limiting
- Failed emails are logged but don't stop the batch
- Email status included in generation summary logs

---

## Error Responses

All endpoints may return these standard error responses:

### 400 Bad Request
```json
{
  "message": "Validation error description"
}
```

### 401 Unauthorized
```json
{
  "message": "Token not provided" | "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "You do not have access to this business"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "message": "User has reached the maximum number of businesses allowed."
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## Data Types Reference

### Business Types
- Technology Services
- Food & Beverage
- Marketing & Advertising
- Retail
- Agriculture & Commodities
- (or custom type)

### Transaction Types
- `income` - Revenue/sales
- `expense` - Costs/purchases

### Payment Methods
- `cash`
- `credit_card`
- `e_wallet`

### Insight Types
- `daily` - Generated daily at 7 AM (WIB)
- `weekly` - Generated every Monday at 7 AM (WIB)
- `monthly` - Generated 1st of month at 7 AM (WIB)
- `custom` - Manually generated

### Insight Priority Levels
- `high` - Requires immediate attention
- `medium` - Important but not urgent
- `low` - Informational

### Insight Trends
- `positive` - Good news/improvement 📈
- `negative` - Decline/concern 📉
- `warning` - Alert/attention needed ⚠️
- `neutral` - Stable/informational ➡️

### Insight Categories
- `financial` - Revenue, profit, expenses
- `inventory` - Stock levels, restocking
- `product` - Product performance
- `operations` - Business operations
- `growth` - Growth opportunities
- `alert` - Urgent alerts

---

## Rate Limiting
- AI insight generation: Automatically limited by cron schedule (3 second delay between businesses)
- Manual generation: No specific limit (use responsibly, AI API costs apply)
- Email sending: 1 second delay between emails to prevent rate limiting

## Cron Job Schedule
- **Daily insights:** Every day at 7:00 AM (Asia/Jakarta)
  - Skips Mondays and 1st of month
  - Automatically sends emails
- **Weekly insights:** Every Monday at 7:00 AM (Asia/Jakarta)
  - Skips 1st of month if it falls on Monday
  - Automatically sends emails
- **Monthly insights:** 1st day of month at 7:00 AM (Asia/Jakarta)
  - Automatically sends emails
- **Cleanup job:** Every Sunday at 3:00 AM (Asia/Jakarta)
  - Removes insights older than 90 days

---

## AI Insight Generation Details

### Data Sources
Insights are generated from:
- Financial transactions (income/expenses)
- Product performance metrics
- Inventory levels
- Profitability analysis
- Payment method trends

### AI Processing
1. Data collection from business analytics
2. Context preparation with business information
3. Full analysis generation using Gemini AI
4. Digestible summary extraction (3-5 key insights)
5. Storage in database with metadata
6. Optional email notification

### Summary Card Generation
Each insight summary contains 3-5 cards with:
- Unique ID for tracking
- Visual icon identifier
- Category type and color coding
- Trend direction with emoji
- Optional metric value
- Clear problem statement
- Specific actionable recommendation
- Priority level for triage

### Best Practices
- Run manual generation during off-peak hours
- Use `custom` type for ad-hoc analysis
- Review automated insights daily
- Act on high-priority recommendations first
- Keep insights for at least 90 days for trend analysis

---