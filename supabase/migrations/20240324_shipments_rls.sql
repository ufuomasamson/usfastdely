-- Create shipments table if it doesn't exist
CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    tracking_number TEXT UNIQUE DEFAULT 'TR-' || FLOOR(RANDOM() * 1000000)::TEXT,
    sender_name TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    current_country TEXT NOT NULL,
    current_state TEXT NOT NULL,
    status TEXT NOT NULL,
    condition TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on shipments table
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON shipments;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON shipments;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON shipments;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON shipments;

-- Create a single policy for all operations
CREATE POLICY "Enable all access for all users" 
ON shipments 
FOR ALL 
TO anon
USING (true)
WITH CHECK (true);

-- Grant full access to anonymous users
GRANT ALL PRIVILEGES ON TABLE shipments TO anon;
GRANT ALL PRIVILEGES ON SEQUENCE shipments_id_seq TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number); 