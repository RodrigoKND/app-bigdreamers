import { CommunityMember, Activity } from '@/types';
import { MOCK_COMMUNITY, MOCK_ACTIVITIES } from '@/data/mockCommunity';

// TODO: Replace with Supabase queries
// import { supabase } from '@/lib/supabase';

export async function getCommunityRanking(): Promise<CommunityMember[]> {
  // TODO: supabase.from('users').select('id, name, level, gems, avatar, rank, streak').order('gems', { ascending: false });
  return Promise.resolve(MOCK_COMMUNITY);
}

export async function getRecentActivities(limit = 10): Promise<Activity[]> {
  // TODO: supabase.from('activities').select('*').order('timestamp', { ascending: false }).limit(limit);
  return Promise.resolve(MOCK_ACTIVITIES.slice(0, limit));
}
