-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table (if not exists)
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id)
);

-- Create user_roles junction table (if not exists)
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);

-- Insert default roles
INSERT INTO roles (code, name, description, is_system) 
VALUES 
  ('admin', 'Administrator', 'Full access to all system features', TRUE),
  ('manager', 'Manager', 'Can manage shipments and view reports', TRUE),
  ('user', 'User', 'Basic access to shipment tracking', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (code, name, description, resource, action) 
VALUES
  -- Shipment permissions
  ('shipments:view', 'View Shipments', 'Can view shipment details', 'shipments', 'view'),
  ('shipments:create', 'Create Shipments', 'Can create new shipments', 'shipments', 'create'),
  ('shipments:update', 'Update Shipments', 'Can update existing shipments', 'shipments', 'update'),
  ('shipments:delete', 'Delete Shipments', 'Can delete shipments', 'shipments', 'delete'),
  ('shipments:approve', 'Approve Shipments', 'Can approve shipment requests', 'shipments', 'approve'),
  
  -- User permissions
  ('users:view', 'View Users', 'Can view user details', 'users', 'view'),
  ('users:create', 'Create Users', 'Can create new users', 'users', 'create'),
  ('users:update', 'Update Users', 'Can update existing users', 'users', 'update'),
  ('users:delete', 'Delete Users', 'Can delete users', 'users', 'delete'),
  ('users:manage_roles', 'Manage User Roles', 'Can assign roles to users', 'users', 'manage_roles'),
  
  -- Report permissions
  ('reports:view', 'View Reports', 'Can view reports', 'reports', 'view'),
  ('reports:create', 'Create Reports', 'Can create new reports', 'reports', 'create'),
  ('reports:export', 'Export Reports', 'Can export reports', 'reports', 'export'),
  
  -- Document permissions
  ('documents:view', 'View Documents', 'Can view documents', 'documents', 'view'),
  ('documents:upload', 'Upload Documents', 'Can upload new documents', 'documents', 'upload'),
  ('documents:download', 'Download Documents', 'Can download documents', 'documents', 'download'),
  ('documents:delete', 'Delete Documents', 'Can delete documents', 'documents', 'delete'),
  
  -- Settings permissions
  ('settings:view', 'View Settings', 'Can view system settings', 'settings', 'view'),
  ('settings:update', 'Update Settings', 'Can update system settings', 'settings', 'update'),
  
  -- Dashboard permissions
  ('dashboard:view', 'View Dashboard', 'Can view dashboard', 'dashboard', 'view'),
  ('dashboard:admin', 'View Admin Dashboard', 'Can view admin dashboard', 'dashboard', 'admin')
ON CONFLICT (code) DO NOTHING;

-- Assign permissions to roles
-- Admin role - all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE code = 'admin'),
  id
FROM permissions
ON CONFLICT DO NOTHING;

-- Manager role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE code = 'manager'),
  id
FROM permissions
WHERE code IN (
  'shipments:view', 'shipments:create', 'shipments:update', 'shipments:approve',
  'users:view',
  'reports:view', 'reports:create', 'reports:export',
  'documents:view', 'documents:upload', 'documents:download',
  'dashboard:view'
)
ON CONFLICT DO NOTHING;

-- User role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE code = 'user'),
  id
FROM permissions
WHERE code IN (
  'shipments:view',
  'documents:view', 'documents:upload', 'documents:download',
  'dashboard:view'
)
ON CONFLICT DO NOTHING;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update timestamps
CREATE TRIGGER update_permissions_timestamp
BEFORE UPDATE ON permissions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_roles_timestamp
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
