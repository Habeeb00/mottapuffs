import { supabase } from '../lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function registerUser({ full_name, email, password }) {
  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert({ full_name, email, password_hash })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function loginUser({ email, password }) {
  // Fetch user by email and compare hash client-side
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) throw error;
  const ok = await bcrypt.compare(password, data.password_hash);
  if (!ok) throw new Error('Invalid credentials');
  await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', data.id);
  return data;
} 