-- Enable RLS on admin table
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read for login" ON admin;
DROP POLICY IF EXISTS "Allow anonymous login check" ON admin;

-- Create policy for anonymous login check
CREATE POLICY "Allow anonymous login check" ON admin
    FOR SELECT
    TO anon
    USING (true);

-- Grant necessary permissions to anonymous users
GRANT SELECT ON admin TO anon;

-- Ensure indexes exist for efficient querying
CREATE INDEX IF NOT EXISTS idx_admin_username ON admin(username);
CREATE INDEX IF NOT EXISTS idx_admin_password ON admin(password); 
