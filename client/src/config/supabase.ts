/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

// Create a Supabase client with the service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true
    }
})

// Regular client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Shipment types
export interface Shipment {
    id: number
    tracking_number: string
    sender_name: string
    receiver_name: string
    origin: string
    destination: string
    current_country: string
    current_state: string
    status: 'Processing' | 'In Transit' | 'Delivered' | 'Delayed' | 'On Hold'
    condition: 'Good' | 'Damaged' | 'Lost'
    created_at?: string
    updated_at?: string
}

// Shipment service functions
export const shipmentService = {
    // Create a new shipment
    async createShipment(shipmentData: Omit<Shipment, 'id' | 'tracking_number' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabaseAdmin
            .from('shipments')
            .insert([shipmentData])
            .select()
            .single()
        
        if (error) throw error
        return data
    },

    // Get shipment by tracking number
    async getShipmentByTracking(trackingNumber: string) {
        const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('tracking_number', trackingNumber)
            .single()
        
        if (error) throw error
        return data
    },

    // Get all shipments (for admin)
    async getAllShipments() {
        const { data, error } = await supabaseAdmin
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    },

    // Update shipment
    async updateShipment(id: number, updateData: Partial<Shipment>) {
        const { data, error } = await supabaseAdmin
            .from('shipments')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()
        
        if (error) throw error
        return data
    },

    // Delete shipment
    async deleteShipment(id: number) {
        const { error } = await supabaseAdmin
            .from('shipments')
            .delete()
            .eq('id', id)
        
        if (error) throw error
        return true
    }
} 