// Initialize Supabase client
const supabaseUrl = 'https://ykqfyjpmhqjbqbxqhzxw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcWZ5anBtaHFqYnFieHFoenh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI1NzAsImV4cCI6MjAyNTM5ODU3MH0.Uh_BG7GPwGnE_5odTuGj4eXkw9iW_X9YE2_Qm-QJ7Ow';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        // Query the admin table for the username and password
        const { data, error } = await supabase
            .from('admin')
            .select('*')
            .eq('username', username)
            .single();

        if (error) throw error;

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