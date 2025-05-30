import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_SERVICE_KEY
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            navigate('/admin/dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            navigate('/admin/dashboard');
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F2F2F4',
            fontFamily: "'Poppins', sans-serif"
        }}>
            <div className="login-container" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div className="login-card" style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    <div className="login-header" style={{
                        backgroundColor: '#FF4800',
                        color: '#FFFFFF',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 600 }}>FASTER Admin</h1>
                        <p style={{ margin: '0.5rem 0 0', opacity: 0.9, fontSize: '0.9rem' }}>Sign in to manage shipments</p>
                    </div>
                    <div className="login-body" style={{ padding: '2rem' }}>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="fas fa-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="fas fa-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                <i className="fas fa-sign-in-alt me-2"></i>
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 