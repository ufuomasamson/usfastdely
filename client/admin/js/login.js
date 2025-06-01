// Initialize Supabase client
const supabaseUrl = 'https://aiyktqttqqtexxhocoip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeWt0cXR0cXF0ZXh4aG9jb2lwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTIyMDgzNSwiZXhwIjoyMDI0Nzk2ODM1fQ.qwkKqwgCYBcv3Uz3RzqFqkjGvEqkHq-nMEzJn_Qh1V0';

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

        // First check if the user exists in admin table
        const { data: adminData, error: adminError } = await supabase
            .from('admin')
            .select('id, username')
            .eq('username', username)
            .single();

        if (adminError || !adminData) {
            throw new Error('Invalid username or password');
        }

        // Use Supabase Edge Function for secure authentication
        const { data, error } = await supabase.functions.invoke('admin-auth', {
            body: { username, password }
        });

        if (error) {
            console.error('Authentication error:', error);
            throw new Error('Authentication failed');
        }

        if (!data || !data.session) {
            throw new Error('Invalid response from server');
        }

        // Store session in localStorage for persistence
        localStorage.setItem('sb-access-token', data.session.access_token);
        localStorage.setItem('sb-refresh-token', data.session.refresh_token);
        localStorage.setItem('adminUser', JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            isLoggedIn: true
        }));
        
        // Redirect to dashboard
        window.location.href = '/admin/dashboard.html';

    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'An error occurred during login');
        setLoading(false);
    }
});

// Check if user is already logged in
window.addEventListener('load', async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session && localStorage.getItem('adminUser')) {
            window.location.href = '/admin/dashboard.html';
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
}); 