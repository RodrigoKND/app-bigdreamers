import { Milestone } from '@/types';
import { MOCK_MILESTONES } from '@/data/mockProgress';

// TODO: Replace with Supabase queries
// import { supabase } from '@/lib/supabase';

export async function getUserMilestones(userId: string): Promise<Milestone[]> {
  // TODO: supabase.from('milestones').select('*').eq('user_id', userId);
  console.log('getUserMilestones for', userId);
  return Promise.resolve(MOCK_MILESTONES);
}

export async function completeMilestone(userId: string, milestoneId: string): Promise<void> {
  // TODO: supabase.from('user_milestones').insert({ user_id: userId, milestone_id: milestoneId });
  console.log('completeMilestone', userId, milestoneId);
}
