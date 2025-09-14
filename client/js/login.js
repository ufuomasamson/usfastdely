// Initialize Supabase client
const supabaseUrl = 'https://nambnsqatauhreahpnyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbWJuc3FhdGF1aHJlYWhwbnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MzAyNTksImV4cCI6MjA2NjUwNjI1OX0.HsHte14nkbZgcUQSJlbJOyrCHZ8l2huN98JtZ3qjyuc';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const errorAlert = document.getElementById('errorAlert');

// Helper function to show error messages
const showError = (message) => {
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
    setTimeout(() => {
        errorAlert.style.display = 'none';
    }, 5000);
};

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Store the session
        localStorage.setItem('sb-access-token', data.session.access_token);
        localStorage.setItem('sb-refresh-token', data.session.refresh_token);
        
        // Redirect to dashboard
        window.location.href = '/admin/dashboard.html';
    } catch (error) {
        showError(error.message || 'An error occurred during login');
    }
});

// Check if user is already logged in
window.addEventListener('load', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
        // User is already logged in, redirect to dashboard
        window.location.href = '/admin/dashboard.html';
    }
}); 
