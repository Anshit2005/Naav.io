-- Fuel EU Maritime Database Schema

CREATE TABLE IF NOT EXISTS routes (
  id VARCHAR(255) PRIMARY KEY,
  route_id VARCHAR(255) NOT NULL UNIQUE,
  vessel_type VARCHAR(100) NOT NULL,
  fuel_type VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  ghg_intensity DECIMAL(10, 4) NOT NULL,
  fuel_consumption DECIMAL(10, 2) NOT NULL,
  distance DECIMAL(10, 2) NOT NULL,
  total_emissions DECIMAL(10, 2) NOT NULL,
  is_baseline BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ship_compliance (
  id VARCHAR(255) PRIMARY KEY,
  ship_id VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  cb_gco2eq DECIMAL(15, 2) NOT NULL,
  target_intensity DECIMAL(10, 4) NOT NULL,
  actual_intensity DECIMAL(10, 4) NOT NULL,
  energy_in_scope DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ship_id, year)
);

CREATE TABLE IF NOT EXISTS bank_entries (
  id VARCHAR(255) PRIMARY KEY,
  ship_id VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq DECIMAL(15, 2) NOT NULL,
  applied_amount_gco2eq DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pools (
  id VARCHAR(255) PRIMARY KEY,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pool_members (
  id VARCHAR(255) PRIMARY KEY,
  pool_id VARCHAR(255) NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  ship_id VARCHAR(255) NOT NULL,
  cb_before DECIMAL(15, 2) NOT NULL,
  cb_after DECIMAL(15, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_routes_year ON routes(year);
CREATE INDEX IF NOT EXISTS idx_routes_baseline ON routes(is_baseline);
CREATE INDEX IF NOT EXISTS idx_compliance_ship_year ON ship_compliance(ship_id, year);
CREATE INDEX IF NOT EXISTS idx_banking_ship_year ON bank_entries(ship_id, year);
CREATE INDEX IF NOT EXISTS idx_pools_year ON pools(year);

