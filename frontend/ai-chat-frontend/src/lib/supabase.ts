import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-project-url.supabase.co'; // Замените на свой
const SUPABASE_ANON_KEY = 'your-anon-key'; // Замените на свой

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 