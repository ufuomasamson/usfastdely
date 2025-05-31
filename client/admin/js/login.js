// Initialize Supabase client
const supabaseUrl = 'https://ykqfyjpmhqjbqbxqhzxw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcWZ5anBtaHFqYnFieHFoenh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI1NzAsImV4cCI6MjAyNTM5ODU3MH0.Uh_BG7GPwGnE_5odTuGj4eXkw9iW_X9YE2_Qm-QJ7Ow';

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

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    try {
        setLoading(true);

        // Query the admin table for the username
        const { data, error } = await supabase
            .from('admin')
            .select('id, username, password')
            .eq('username', username)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw new Error('Error checking credentials');
        }

        if (!data) {
            throw new Error('Invalid username or password');
        }

        // Check if password matches
        if (data.password === password) {
            // Store admin info in session storage
            sessionStorage.setItem('adminUser', JSON.stringify({
                id: data.id,
                username: data.username,
                isLoggedIn: true
            }));
            
            // Redirect to dashboard
            window.location.href = '/admin/dashboard.html';
        } else {
            throw new Error('Invalid username or password');
        }

    } catch (error) {
        showError(error.message || 'An error occurred during login');
        setLoading(false);
    }
});

// Check if user is already logged in
window.addEventListener('load', () => {
    const adminUser = sessionStorage.getItem('adminUser');
    if (adminUser) {
        const user = JSON.parse(adminUser);
        if (user.isLoggedIn) {
            window.location.href = '/admin/dashboard.html';
        }
    }
}); 