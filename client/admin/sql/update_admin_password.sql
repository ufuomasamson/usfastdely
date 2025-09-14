-- Update admin password to use SHA256 hash of 'admin123'
UPDATE admin 
SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
WHERE username = 'admin'; 