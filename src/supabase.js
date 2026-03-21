import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fdmedmincaytlrjjuurd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbWVkbWluY2F5dGxyamp1dXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzMwNzMsImV4cCI6MjA4OTYwOTA3M30.UVLwE1545PzwMK1oI3rZ-O-RO_TmZjibatAEDwzwJNg'

export const supabase = createClient(supabaseUrl, supabaseKey)
