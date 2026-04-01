# Test Cases — Inventory Management System

## 1. Authentication Module

### TC-001: Successful Admin Login
- **Description:** Admin user can login with valid credentials
- **Precondition:** Admin user exists in database
- **Steps:**
  1. Navigate to login page
  2. Enter username: `admin`
  3. Enter password: `admin123`
  4. Click "Sign In"
- **Expected:** Redirected to Admin Dashboard, JWT token stored in localStorage

### TC-002: Successful Staff Login
- **Description:** Staff user can login with valid credentials
- **Steps:**
  1. Navigate to login page
  2. Enter username: `staff1`, password: `admin123`
  3. Click "Sign In"
- **Expected:** Redirected to Staff Dashboard

### TC-003: Invalid Login
- **Description:** Login fails with wrong credentials
- **Steps:**
  1. Enter invalid username/password
  2. Click "Sign In"
- **Expected:** Error message "Invalid credentials"

### TC-004: Protected Route Access
- **Description:** Unauthenticated user cannot access dashboard
- **Steps:**
  1. Without logging in, navigate to `/admin/dashboard`
- **Expected:** Redirected to login page

### TC-005: Role-Based Access
- **Description:** Staff user cannot access admin routes
- **Steps:**
  1. Login as staff
  2. Navigate to `/admin/products`
- **Expected:** Redirected to staff dashboard

---

## 2. Product Management Module

### TC-006: View Product List
- **Description:** User can view all products
- **Steps:**
  1. Login as admin
  2. Navigate to Products page
- **Expected:** Product table displays with all columns

### TC-007: Search Products
- **Description:** User can search products by name or SKU
- **Steps:**
  1. Enter search term "keyboard" in search bar
- **Expected:** Only matching products displayed

### TC-008: Add New Product
- **Description:** Admin can add a new product
- **Steps:**
  1. Click "Add Product"
  2. Fill in: Name, SKU, Price, Quantity
  3. Click "Create"
- **Expected:** Product created, success toast, table updated

### TC-009: Edit Product
- **Description:** Admin can edit existing product
- **Steps:**
  1. Click edit icon on a product row
  2. Modify product name
  3. Click "Update"
- **Expected:** Product updated successfully

### TC-010: Delete Product
- **Description:** Admin can delete a product
- **Steps:**
  1. Click delete icon on product row
  2. Confirm deletion
- **Expected:** Product removed from list

### TC-011: Duplicate SKU Prevention
- **Description:** System prevents duplicate SKU entries
- **Steps:**
  1. Try adding product with existing SKU
- **Expected:** Error "SKU already exists"

---

## 3. Inventory Module

### TC-012: Stock In
- **Description:** Admin can add stock to a product
- **Steps:**
  1. Navigate to Inventory
  2. Click "Stock In"
  3. Select product, enter quantity: 50
  4. Submit
- **Expected:** Product quantity increased by 50, transaction recorded

### TC-013: Stock Out
- **Description:** Admin can remove stock from a product
- **Steps:**
  1. Click "Stock Out"
  2. Select product, enter quantity: 10
  3. Submit
- **Expected:** Product quantity decreased by 10

### TC-014: Insufficient Stock
- **Description:** System prevents stock out exceeding available quantity
- **Steps:**
  1. Try stock out with quantity greater than available
- **Expected:** Error "Insufficient stock"

### TC-015: Transaction History
- **Description:** Transaction history is properly recorded
- **Steps:**
  1. Perform stock in/out operations
  2. View transaction table
- **Expected:** All transactions listed with correct details

---

## 4. Dashboard Module

### TC-016: Dashboard Stats
- **Description:** Dashboard displays correct summary statistics
- **Steps:**
  1. Login and view dashboard
- **Expected:** Total products, low stock count, supplier count, order count displayed

### TC-017: Charts Render
- **Description:** Analytics charts render correctly
- **Steps:**
  1. View admin dashboard
- **Expected:** Pie chart, bar chart, and area chart render with data

### TC-018: Low Stock Alerts
- **Description:** Dashboard shows low stock product alerts
- **Steps:**
  1. View dashboard
- **Expected:** Products below min stock level listed in alerts table

---

## 5. Supplier Module

### TC-019: Add Supplier
- **Description:** Admin can add a new supplier
- **Steps:**
  1. Navigate to Suppliers, click "Add Supplier"
  2. Fill in name, email, phone
  3. Submit
- **Expected:** Supplier card appears in grid

### TC-020: Edit Supplier
- **Description:** Admin can modify supplier details
- **Steps:**
  1. Click "Edit" on supplier card
  2. Update email
  3. Submit
- **Expected:** Supplier updated

### TC-021: Delete Supplier
- **Description:** Admin can delete a supplier
- **Steps:**
  1. Click "Delete" on supplier card
  2. Confirm deletion
- **Expected:** Supplier removed from grid

---

## 6. Order Module

### TC-022: Create Order
- **Description:** Admin can create a purchase order
- **Steps:**
  1. Navigate to Orders, click "New Order"
  2. Select supplier, add items with quantities
  3. Submit
- **Expected:** Order created with auto-generated order number

### TC-023: View Order Details
- **Description:** User can view full order details
- **Steps:**
  1. Click view icon on an order
- **Expected:** Order modal shows items, supplier, total, status

### TC-024: Update Order Status
- **Description:** Admin can change order status
- **Steps:**
  1. Open order details
  2. Click on a status button (e.g., "shipped")
- **Expected:** Order status updated

---

## 7. Reports Module

### TC-025: Inventory Report
- **Description:** Full inventory report with valuations
- **Steps:**
  1. Navigate to Reports
  2. View Inventory Report tab
- **Expected:** Table shows all products with prices, quantities, total values

### TC-026: Low Stock Report
- **Description:** Report of items below minimum stock
- **Steps:**
  1. Click "Low Stock Report" tab
- **Expected:** Only low stock items shown with deficit column

### TC-027: CSV Export
- **Description:** User can export report data as CSV
- **Steps:**
  1. Click "Export CSV" button
- **Expected:** CSV file downloads with correct data

---

## 8. QR Code Module

### TC-028: Generate QR Code
- **Description:** Admin can generate QR code for a product
- **Steps:**
  1. Navigate to QR Codes
  2. Select a product from the list
- **Expected:** QR code image displayed with product details

### TC-029: Download QR Code
- **Description:** QR code can be downloaded as image
- **Steps:**
  1. Generate QR code
  2. Click "Download QR Code"
- **Expected:** PNG file downloaded

### TC-030: QR Code Scanning (Staff)
- **Description:** Staff can scan QR code to view product
- **Steps:**
  1. Login as staff
  2. Navigate to QR Scanner
  3. Scan a generated QR code
- **Expected:** Product details displayed after scanning

---

## 9. Non-Functional Tests

### TC-031: Responsive Design
- **Description:** Application is responsive on mobile devices
- **Steps:**
  1. Resize browser to mobile width (375px)
- **Expected:** Sidebar collapses, tables scroll horizontally, forms stack vertically

### TC-032: JWT Token Expiry
- **Description:** Expired tokens are handled properly
- **Steps:**
  1. Wait for token to expire (or manually clear)
  2. Make an API request
- **Expected:** Redirected to login page

### TC-033: Error Handling
- **Description:** API errors show user-friendly messages
- **Steps:**
  1. Trigger various error conditions
- **Expected:** Toast notifications with clear error messages
