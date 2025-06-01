-- Enable RLS on shipments table
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read shipments" ON shipments;
DROP POLICY IF EXISTS "Allow anonymous insert shipments" ON shipments;
DROP POLICY IF EXISTS "Allow anonymous update shipments" ON shipments;
DROP POLICY IF EXISTS "Allow anonymous delete shipments" ON shipments;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous read shipments" ON shipments
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous insert shipments" ON shipments
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update shipments" ON shipments
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous delete shipments" ON shipments
    FOR DELETE
    TO anon
    USING (true);

-- Grant necessary permissions to anonymous users
GRANT SELECT, INSERT, UPDATE, DELETE ON shipments TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number); 