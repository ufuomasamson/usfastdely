-- Enable RLS on admin table
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- Create policy for reading admin records during login
CREATE POLICY "Allow public read for login" ON admin
    FOR SELECT
    USING (
        -- Only allow reading when username and password match
        EXISTS (
            SELECT 1 FROM admin a
            WHERE a.username = current_setting('request.jwt.claims')::json->>'preferred_username'
            AND a.password = current_setting('request.jwt.claims')::json->>'password'
        )
    );

-- Create policy for anonymous login check
CREATE POLICY "Allow anonymous login check" ON admin
    FOR SELECT
    TO anon
    USING (true);

-- Grant necessary permissions to anonymous users
GRANT SELECT ON admin TO anon; 