import { User } from '@/types';
import { MOCK_USER } from '@/data/mockUser';

// TODO: Replace with Supabase queries
// import { supabase } from '@/lib/supabase';

export async function getCurrentUser(): Promise<User> {
  // TODO: return supabase.from('users').select('*').eq('id', userId).single();
  return Promise.resolve(MOCK_USER);
}

export async function updateUserGems(userId: string, gems: number): Promise<void> {
  // TODO: supabase.from('users').update({ gems }).eq('id', userId);
  console.log('updateUserGems', userId, gems);
}

export async function updateUserLevel(userId: string, level: string): Promise<void> {
  // TODO: supabase.from('users').update({ level }).eq('id', userId);
  console.log('updateUserLevel', userId, level);
}
