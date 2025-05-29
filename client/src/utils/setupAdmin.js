import { authService } from '../services/authService';

// Function to create the initial admin account
export async function setupInitialAdmin() {
    try {
        // You can change these credentials
        const adminUsername = 'admin';
        const adminPassword = 'admin123';

        const admin = await authService.createAdmin(adminUsername, adminPassword);
        console.log('Admin account created successfully:', admin);
        return admin;
    } catch (error) {
        console.error('Failed to create admin account:', error.message);
        throw error;
    }
} 