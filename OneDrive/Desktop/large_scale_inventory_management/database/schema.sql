-- ============================================
-- Large Scale Inventory Management System
-- Database Schema & Seed Data
-- ============================================

CREATE DATABASE IF NOT EXISTS inventory_management;
USE inventory_management;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- Suppliers Table
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- Products Table
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    sku VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 10,
    supplier_id INT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- Inventory Transactions Table
-- ============================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    type ENUM('stock_in', 'stock_out') NOT NULL,
    quantity INT NOT NULL,
    notes TEXT,
    performed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- Orders Table
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    supplier_id INT,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- Order Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- SEED DATA
-- ============================================

-- Default Admin User (password: admin123 — bcrypt hash)
INSERT INTO users (username, email, password, role, full_name) VALUES
('admin', 'admin@inventory.com', '$2a$10$Lx5o/rfKSRUhIjoOxGVk9Z/EY1ulg9X9NkjMmnn54OQiaP39', 'admin', 'System Administrator'),
('staff1', 'staff1@inventory.com', '$2a$10$Lx5o/rfKSRUhIjoOxGVk9Z/EY1ulg9X9NkjMmnn54OQiaP39', 'staff', 'John Staff');

-- Suppliers
INSERT INTO suppliers (name, email, phone, address, city) VALUES
('TechParts Inc.', 'contact@techparts.com', '+1-555-0101', '123 Industrial Blvd', 'New York'),
('Global Electronics', 'sales@globalelec.com', '+1-555-0102', '456 Commerce Ave', 'Los Angeles'),
('Prime Supplies', 'info@primesupplies.com', '+1-555-0103', '789 Market Street', 'Chicago'),
('QuickShip Materials', 'orders@quickship.com', '+1-555-0104', '321 Logistics Way', 'Houston'),
('Mega Distributors', 'support@megadist.com', '+1-555-0105', '654 Trade Center', 'Phoenix');

-- Products
INSERT INTO products (name, description, sku, category, price, quantity, min_stock_level, supplier_id) VALUES
('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 'WM-001', 'Electronics', 29.99, 150, 20, 1),
('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 'MK-002', 'Electronics', 79.99, 85, 15, 1),
('USB-C Hub', '7-in-1 USB-C hub with HDMI output', 'UC-003', 'Accessories', 45.99, 200, 25, 2),
('Monitor Stand', 'Adjustable aluminum monitor stand', 'MS-004', 'Furniture', 59.99, 60, 10, 3),
('Webcam HD', '1080p HD webcam with microphone', 'WC-005', 'Electronics', 49.99, 120, 15, 2),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 'DL-006', 'Furniture', 34.99, 90, 12, 3),
('Laptop Bag', '15.6" water-resistant laptop bag', 'LB-007', 'Accessories', 39.99, 5, 20, 4),
('Power Strip', '6-outlet surge protector power strip', 'PS-008', 'Electronics', 24.99, 8, 30, 4),
('Ethernet Cable', 'CAT6 ethernet cable 10ft', 'EC-009', 'Accessories', 12.99, 300, 50, 5),
('Mousepad XL', 'Extended gaming mousepad 900x400mm', 'MP-010', 'Accessories', 19.99, 7, 15, 5),
('Headset Pro', 'Noise-cancelling over-ear headset', 'HP-011', 'Electronics', 89.99, 45, 10, 1),
('USB Flash Drive', '64GB USB 3.0 flash drive', 'UF-012', 'Storage', 14.99, 250, 40, 2),
('External SSD', '500GB portable SSD USB-C', 'ES-013', 'Storage', 69.99, 35, 10, 2),
('HDMI Cable', 'HDMI 2.1 cable 6ft', 'HC-014', 'Accessories', 15.99, 180, 30, 5),
('Wireless Charger', 'Qi wireless charging pad 15W', 'WC-015', 'Electronics', 25.99, 95, 15, 1);

-- Inventory Transactions (seed history)
INSERT INTO inventory_transactions (product_id, type, quantity, notes, performed_by) VALUES
(1, 'stock_in', 200, 'Initial stock purchase', 1),
(1, 'stock_out', 50, 'Sold to dept A', 1),
(2, 'stock_in', 100, 'Bulk order from supplier', 1),
(2, 'stock_out', 15, 'Internal distribution', 1),
(7, 'stock_in', 25, 'Restocking', 1),
(7, 'stock_out', 20, 'Department request', 1),
(8, 'stock_in', 50, 'Warehouse restock', 1),
(8, 'stock_out', 42, 'Office distribution', 1);

-- Orders
INSERT INTO orders (order_number, supplier_id, status, total_amount, notes, created_by) VALUES
('ORD-2026-001', 1, 'delivered', 1599.80, 'Monthly electronics restock', 1),
('ORD-2026-002', 2, 'shipped', 919.80, 'USB hubs and webcams', 1),
('ORD-2026-003', 3, 'pending', 599.90, 'Office furniture order', 1),
('ORD-2026-004', 4, 'confirmed', 399.90, 'Laptop bags restock', 1);

-- Order Items
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 20, 29.99),
(1, 2, 10, 79.99),
(2, 3, 10, 45.99),
(2, 5, 10, 49.99),
(3, 4, 10, 59.99),
(4, 7, 10, 39.99);
