import { Milestone } from '@/types';
import { getSupabaseClient } from '@/services/supabase/supabase';

function mapMilestone(row: any): Milestone {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    gemsReward: row.gems_reward,
    completed: row.completed ?? false,
    completedAt: row.completed_at,
    category: row.category,
  };
}

export async function getMilestones(): Promise<Milestone[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapMilestone);
}

export async function getMilestoneById(milestoneId: string): Promise<Milestone | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('id', milestoneId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapMilestone(data);
}

export async function createMilestone(milestone: {
  title: string;
  description: string;
  gemsReward: number;
  category: 'learning' | 'community' | 'streak' | 'level';
}): Promise<Milestone> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from('milestones')
    .insert({
      title: milestone.title,
      description: milestone.description,
      gems_reward: milestone.gemsReward,
      category: milestone.category,
    })
    .select()
    .single();

  if (error) throw error;
  return mapMilestone(data);
}

export async function updateMilestone(
  milestoneId: string,
  updates: Partial<{
    title: string;
    description: string;
    gemsReward: number;
    category: 'learning' | 'community' | 'streak' | 'level';
  }>
): Promise<void> {
  const supabase = await getSupabaseClient();

  const dbUpdates: Record<string, any> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.gemsReward !== undefined) dbUpdates.gems_reward = updates.gemsReward;
  if (updates.category !== undefined) dbUpdates.category = updates.category;

  const { error } = await supabase
    .from('milestones')
    .update(dbUpdates)
    .eq('id', milestoneId);

  if (error) throw error;
}

export async function deleteMilestone(milestoneId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  await supabase
    .from('user_milestones')
    .delete()
    .eq('milestone_id', milestoneId);

  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', milestoneId);

  if (error) throw error;
}

export async function getUserMilestones(userId: string): Promise<Milestone[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw error;

  const { data: userMilestones } = await supabase
    .from('user_milestones')
    .select('milestone_id, completed_at')
    .eq('user_id', userId);

  const completedMap = new Map<string, string>();
  if (userMilestones) {
    userMilestones.forEach((um: any) => {
      completedMap.set(um.milestone_id, um.completed_at);
    });
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    gemsReward: row.gems_reward,
    completed: completedMap.has(row.id),
    completedAt: completedMap.get(row.id),
    category: row.category,
  }));
}

export async function completeMilestone(userId: string, milestoneId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { data: milestone, error: milestoneError } = await supabase
    .from('milestones')
    .select('gems_reward')
    .eq('id', milestoneId)
    .single();

  if (milestoneError) throw milestoneError;

  const { error: upsertError } = await supabase
    .from('user_milestones')
    .upsert(
      {
        user_id: userId,
        milestone_id: milestoneId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,milestone_id' }
    );

  if (upsertError) throw upsertError;

  const { error: gemsError } = await supabase.rpc('add_gems_to_user', {
    p_user_id: userId,
    p_gems_to_add: milestone.gems_reward,
  });

  if (gemsError) throw gemsError;
}

export async function uncompleteMilestone(userId: string, milestoneId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { data: milestone, error: milestoneError } = await supabase
    .from('milestones')
    .select('gems_reward')
    .eq('id', milestoneId)
    .single();

  if (milestoneError) throw milestoneError;

  const { error: deleteError } = await supabase
    .from('user_milestones')
    .delete()
    .eq('user_id', userId)
    .eq('milestone_id', milestoneId);

  if (deleteError) throw deleteError;

  const { error: gemsError } = await supabase.rpc('add_gems_to_user', {
    p_user_id: userId,
    p_gems_to_add: -milestone.gems_reward,
  });

  if (gemsError) throw gemsError;
}

export async function getUserMilestoneProgress(
  userId: string
): Promise<{ milestoneId: string; completedAt: string }[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('user_milestones')
    .select('milestone_id, completed_at')
    .eq('user_id', userId);

  if (error) throw error;

  return (data || []).map((row: any) => ({
    milestoneId: row.milestone_id,
    completedAt: row.completed_at,
  }));
}

export async function getMilestonesByCategory(
  category: 'learning' | 'community' | 'streak' | 'level'
): Promise<Milestone[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('category', category)
    .order('gems_reward', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapMilestone);
}
