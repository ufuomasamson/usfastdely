import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Admin auth function started')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Get request body
    const { username, password, action } = await req.json()

    // Handle connection test
    if (action === 'test') {
      try {
        const { data, error } = await supabaseClient
          .from('admin')
          .select('id')
          .limit(1)
        
        if (error) throw error

        return new Response(
          JSON.stringify({ status: 'ok', message: 'Connection successful' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        )
      } catch (error) {
        console.error('Connection test error:', error)
        return new Response(
          JSON.stringify({ error: 'Connection test failed' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        )
      }
    }

    // Validate input for login
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'Username and password are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Hash password (using same method as client)
    const hashedPassword = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(password)
    )
    const hashedPasswordHex = Array.from(new Uint8Array(hashedPassword))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Query admin table
    const { data: admin, error: queryError } = await supabaseClient
      .from('admin')
      .select('id, username')
      .eq('username', username)
      .eq('password', hashedPasswordHex)
      .single()

    if (queryError) {
      console.error('Database query error:', queryError)
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      )
    }

    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      )
    }

    // Create session token
    const { data: session, error: sessionError } = await supabaseClient.auth.admin.createSession({
      user_id: admin.id,
      properties: {
        username: admin.username,
        role: 'admin'
      }
    })

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Authentication successful',
        session,
        user: {
          id: admin.id,
          username: admin.username
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
}) 