import { CommunityMember, Activity } from '@/types';
import { getSupabaseClient } from './supabase';

function mapCommunityMember(row: any): CommunityMember {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    gems: row.gems,
    avatar: row.avatar,
    rank: row.community_rank,
    streak: row.streak,
  };
}

function mapActivity(row: any): Activity {
  return {
    id: row.id,
    memberId: row.member_id,
    memberName: row.member_name,
    type: row.type,
    description: row.description,
    gemsEarned: row.gems_earned,
    timestamp: row.timestamp,
  };
}

export async function getCommunityRanking(limit = 50): Promise<CommunityMember[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, name, level, gems, avatar, community_rank, streak')
    .order('gems', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(mapCommunityMember);
}

export async function getCommunityMemberById(userId: string): Promise<CommunityMember | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, name, level, gems, avatar, community_rank, streak')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapCommunityMember(data);
}

export async function getRecentActivities(limit = 10): Promise<Activity[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(mapActivity);
}

export async function createActivity(activity: {
  memberId: string;
  memberName: string;
  type: 'milestone' | 'level_up' | 'module_completed' | 'streak';
  description: string;
  gemsEarned: number;
}): Promise<Activity> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from('activities')
    .insert({
      member_id: activity.memberId,
      member_name: activity.memberName,
      type: activity.type,
      description: activity.description,
      gems_earned: activity.gemsEarned,
    })
    .select()
    .single();

  if (error) throw error;
  return mapActivity(data);
}

export async function getUserActivities(userId: string, limit = 20): Promise<Activity[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('member_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(mapActivity);
}

export async function getActivityById(activityId: string): Promise<Activity | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapActivity(data);
}

export async function deleteActivity(activityId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', activityId);

  if (error) throw error;
}

export async function getRankingByPeriod(
  period: 'weekly' | 'monthly' | 'all',
  limit = 10
): Promise<CommunityMember[]> {
  const supabase = await getSupabaseClient();

  let query = supabase
    .from('users')
    .select('id, name, level, gems, avatar, community_rank, streak')
    .order('gems', { ascending: false })
    .limit(limit);

  if (period === 'weekly') {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    query = query.gte('updated_at', oneWeekAgo.toISOString());
  } else if (period === 'monthly') {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    query = query.gte('updated_at', oneMonthAgo.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map(mapCommunityMember);
}
