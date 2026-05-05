import { LearningModule } from '@/types';
import { getSupabaseClient } from '@/services/supabase/supabase';

function mapLearningModule(row: any): LearningModule {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    duration: row.duration,
    gemsReward: row.gems_reward,
    completed: row.completed ?? false,
    progress: row.progress ?? 0,
    thumbnail: row.thumbnail,
    difficulty: row.difficulty,
  };
}

export async function getLearningModules(filters?: {
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}): Promise<LearningModule[]> {
  const supabase = await getSupabaseClient();
  let query = supabase
    .from('learning_modules')
    .select('*')
    .order('order_index', { ascending: true });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map(mapLearningModule);
}

export async function getLearningModuleById(moduleId: string): Promise<LearningModule | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('learning_modules')
    .select('*')
    .eq('id', moduleId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapLearningModule(data);
}

export async function createModule(module: {
  title: string;
  description: string;
  category: string;
  duration: string;
  gemsReward: number;
  thumbnail: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  orderIndex?: number;
}): Promise<LearningModule> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from('learning_modules')
    .insert({
      title: module.title,
      description: module.description,
      category: module.category,
      duration: module.duration,
      gems_reward: module.gemsReward,
      thumbnail: module.thumbnail,
      difficulty: module.difficulty,
      order_index: module.orderIndex ?? 0,
    })
    .select()
    .single();

  if (error) throw error;
  return mapLearningModule(data);
}

export async function updateModule(
  moduleId: string,
  updates: Partial<{
    title: string;
    description: string;
    category: string;
    duration: string;
    gemsReward: number;
    thumbnail: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    orderIndex: number;
  }>
): Promise<void> {
  const supabase = await getSupabaseClient();

  const dbUpdates: Record<string, any> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
  if (updates.gemsReward !== undefined) dbUpdates.gems_reward = updates.gemsReward;
  if (updates.thumbnail !== undefined) dbUpdates.thumbnail = updates.thumbnail;
  if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
  if (updates.orderIndex !== undefined) dbUpdates.order_index = updates.orderIndex;

  const { error } = await supabase
    .from('learning_modules')
    .update(dbUpdates)
    .eq('id', moduleId);

  if (error) throw error;
}

export async function deleteModule(moduleId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  await supabase
    .from('user_modules')
    .delete()
    .eq('module_id', moduleId);

  const { error } = await supabase
    .from('learning_modules')
    .delete()
    .eq('id', moduleId);

  if (error) throw error;
}

export async function getUserModuleProgress(
  userId: string,
  moduleId: string
): Promise<{ progress: number; completed: boolean; completedAt?: string } | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('user_modules')
    .select('progress, completed, completed_at')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    progress: data.progress,
    completed: data.completed,
    completedAt: data.completed_at,
  };
}

export async function updateUserModuleProgress(
  userId: string,
  moduleId: string,
  progress: number
): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('user_modules')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        progress,
        completed: progress >= 100,
        completed_at: progress >= 100 ? new Date().toISOString() : null,
      },
      { onConflict: 'user_id,module_id' }
    );

  if (error) throw error;
}

export async function completeModule(userId: string, moduleId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('user_modules')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        progress: 100,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id' }
    );

  if (error) throw error;
}

export async function getUserCompletedModules(userId: string): Promise<string[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('user_modules')
    .select('module_id')
    .eq('user_id', userId)
    .eq('completed', true);

  if (error) throw error;
  return (data || []).map((row: any) => row.module_id);
}

export async function getUserModulesProgress(userId: string): Promise<
  { moduleId: string; progress: number; completed: boolean; completedAt?: string }[]
> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('user_modules')
    .select('module_id, progress, completed, completed_at')
    .eq('user_id', userId);

  if (error) throw error;

  return (data || []).map((row: any) => ({
    moduleId: row.module_id,
    progress: row.progress,
    completed: row.completed,
    completedAt: row.completed_at,
  }));
}
