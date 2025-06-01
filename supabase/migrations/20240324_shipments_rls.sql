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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON shipments;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON shipments;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON shipments;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON shipments;

-- Create policies for access
CREATE POLICY "Enable read access for all users" 
ON shipments FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Enable insert access for authenticated users" 
ON shipments FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" 
ON shipments FOR UPDATE 
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users" 
ON shipments FOR DELETE 
TO anon
USING (true);

-- Grant necessary permissions
GRANT ALL ON shipments TO anon;
GRANT USAGE, SELECT ON SEQUENCE shipments_id_seq TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number); 