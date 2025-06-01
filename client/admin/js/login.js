// Initialize Supabase client
const supabaseUrl = 'https://aiyktqttqqtexxhocoip.supabase.co';
// Use anon key for public operations
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeWt0cXR0cXF0ZXh4aG9jb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkyMjA4MzUsImV4cCI6MjAyNDc5NjgzNX0.qwkKqwgCYBcv3Uz3RzqFqkjGvEqkHq-nMEzJn_Qh1V0';

// Create Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const errorAlert = document.getElementById('errorAlert');
const submitButton = document.getElementById('submitButton');

// Helper function to show error messages
const showError = (message) => {
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
    setTimeout(() => {
        errorAlert.style.display = 'none';
    }, 5000);
};

// Helper function to set loading state
const setLoading = (isLoading) => {
    if (isLoading) {
        submitButton.innerHTML = '<span class="spinner-border" role="status"></span>Signing in...';
        submitButton.disabled = true;
    } else {
        submitButton.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Sign In';
        submitButton.disabled = false;
    }
};

// Function to hash password using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    try {
        setLoading(true);
        console.log('Attempting login with:', { username });

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Query the admin table directly with RLS policy
        const { data: admin, error } = await supabase
            .from('admin')
            .select('id, username')
            .eq('username', username)
            .eq('password', hashedPassword)
            .maybeSingle();

        if (error) {
            console.error('Database error:', error);
            if (error.code === 'PGRST301') {
                throw new Error('Database connection error. Please try again.');
            }
            throw new Error('Authentication failed');
        }

        if (!admin) {
            throw new Error('Invalid username or password');
        }

        // Store admin info in localStorage
        localStorage.setItem('adminUser', JSON.stringify({
            id: admin.id,
            username: admin.username,
            isLoggedIn: true
        }));
        
        // Redirect to dashboard
        window.location.href = '/admin/dashboard.html';

    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'An error occurred during login');
    } finally {
        setLoading(false);
    }
});

// Check if user is already logged in
window.addEventListener('load', async () => {
    try {
        const adminUser = localStorage.getItem('adminUser');
        if (adminUser) {
            const user = JSON.parse(adminUser);
            if (user.isLoggedIn) {
                window.location.href = '/admin/dashboard.html';
            }
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
}); 