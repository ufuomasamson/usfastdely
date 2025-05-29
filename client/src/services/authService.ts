import { supabase } from '../config/supabase';
import CryptoJS from 'crypto-js';

export const authService = {
    // Sign in with username and password
    async signIn(username: string, password: string) {
        try {
            // Hash the password (using SHA-256)
            const hashedPassword = CryptoJS.SHA256(password).toString();

            // Check credentials against admins table
            const { data: admin, error } = await supabase
                .from('admins')
                .select('id, username')
                .eq('username', username)
                .eq('password', hashedPassword)
                .single();

            if (error) throw error;
            if (!admin) throw new Error('Invalid credentials');

            // Store admin info in localStorage
            localStorage.setItem('adminUser', JSON.stringify(admin));
            return admin;
        } catch (error) {
            throw new Error('Invalid username or password');
        }
    },

    // Sign out
    async signOut() {
        localStorage.removeItem('adminUser');
    },

    // Get current admin
    getAdmin() {
        const admin = localStorage.getItem('adminUser');
        return admin ? JSON.parse(admin) : null;
    },

    // Check if admin is authenticated
    isAuthenticated() {
        return !!this.getAdmin();
    },

    // Create a new admin (only for initial setup)
    async createAdmin(username: string, password: string) {
        try {
            // Hash the password
            const hashedPassword = CryptoJS.SHA256(password).toString();

            const { data, error } = await supabase
                .from('admins')
                .insert([
                    { username, password: hashedPassword }
                ])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error('Failed to create admin: ' + error.message);
        }
    }
}; 