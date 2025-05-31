-- Create admin table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Insert a test admin user (username: admin, password: admin123)
INSERT INTO admin (username, password)
VALUES ('admin', 'admin123')
ON CONFLICT (username) 
DO UPDATE SET password = 'admin123'; 