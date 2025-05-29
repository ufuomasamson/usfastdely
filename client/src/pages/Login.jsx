import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CButton,
    CAlert,
    CSpinner
} from '@coreui/react';
import { authService } from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.signIn(username, password);
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6} lg={4}>
                        <CCard className="p-4 shadow rounded-4 border-0">
                            <CCardBody>
                                <div className="text-center mb-4">
                                    <i className="fa fa-truck text-primary mb-3" style={{fontSize: '2.5rem'}} />
                                    <h1 className="h3">Admin Login</h1>
                                    <p className="text-muted">Sign in to access the dashboard</p>
                                </div>
                                {error && <CAlert color="danger">{error}</CAlert>}
                                <CForm onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <CFormInput
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="rounded-3"
                                            autoComplete="username"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <CFormInput
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="rounded-3"
                                            autoComplete="current-password"
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <CButton
                                            type="submit"
                                            color="primary"
                                            disabled={loading}
                                            className="rounded-pill px-4 py-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <CSpinner size="sm" className="me-2" />
                                                    Signing in...
                                                </>
                                            ) : (
                                                'Sign In'
                                            )}
                                        </CButton>
                                    </div>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
};

export default Login; 