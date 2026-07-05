import { LearningModule } from '@/types';
import { getSupabaseClient } from '@/services/supabase/supabase';

function mapLearningModule(row: any, totalLessons = 0): LearningModule {
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
    orderIndex: row.order_index,
    totalLessons,
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

  const rows = data || [];
  if (rows.length === 0) return [];

  const moduleIds = rows.map((r: any) => r.id);
  const { data: lessonRows } = await supabase
    .from('lessons')
    .select('module_id')
    .in('module_id', moduleIds);

  const countMap = new Map<string, number>();
  (lessonRows || []).forEach((l: any) => {
    countMap.set(l.module_id, (countMap.get(l.module_id) ?? 0) + 1);
  });

  return rows.map((row: any) => mapLearningModule(row, countMap.get(row.id) ?? 0));
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

export async function completeModule(userId: string, moduleId: string, gemsReward?: number): Promise<void> {
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

  if (gemsReward && gemsReward > 0) {
    const { error: gemsError } = await supabase.rpc('add_gems_to_user', {
      p_user_id: userId,
      p_gems_to_add: gemsReward,
    });
    if (gemsError) throw gemsError;
  }

  const { error: streakError } = await supabase.rpc('increment_streak', {
    p_user_id: userId,
  });
  if (streakError) throw streakError;

  const { error: modulesError } = await supabase.rpc('increment_completed_modules', {
    p_user_id: userId,
  });
  if (modulesError) throw modulesError;
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

// Estado detallado por módulo: cuenta las lecciones realmente hechas comparando
// el completed_at del usuario con el created_at de cada lección. Así, si se
// agregan lecciones nuevas a un módulo ya completado, deja de estar completado
// y el usuario retoma en la lección faltante (no repite las que ya hizo).
export async function getUserModulesProgressDetailed(userId: string): Promise<
  { moduleId: string; progress: number; completed: boolean; completedLessons: number; totalLessons: number }[]
> {
  const supabase = await getSupabaseClient();

  const { data: userModules, error } = await supabase
    .from('user_modules')
    .select('module_id, progress, completed, completed_at')
    .eq('user_id', userId);

  if (error) throw error;
  const rows = userModules || [];
  if (rows.length === 0) return [];

  const moduleIds = rows.map((r: any) => r.module_id);
  const { data: lessonRows } = await supabase
    .from('lessons')
    .select('module_id, created_at')
    .in('module_id', moduleIds);

  const lessonsByModule = new Map<string, string[]>();
  (lessonRows || []).forEach((l: any) => {
    const arr = lessonsByModule.get(l.module_id) ?? [];
    arr.push(l.created_at);
    lessonsByModule.set(l.module_id, arr);
  });

  return rows.map((row: any) => {
    const createdAts = lessonsByModule.get(row.module_id) ?? [];
    const totalLessons = createdAts.length;

    let completedLessons: number;
    if (row.completed_at) {
      const completedAt = new Date(row.completed_at);
      completedLessons = createdAts.filter((ca) => new Date(ca) <= completedAt).length;
    } else {
      completedLessons = Math.floor(((row.progress ?? 0) / 100) * totalLessons);
    }

    return {
      moduleId: row.module_id,
      progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      completed: totalLessons > 0 && completedLessons >= totalLessons,
      completedLessons,
      totalLessons,
    };
  });
}

export async function addLessonToLearningModule(
  learningModuleId: string,
  lesson: { title: string; durationMinutes: number; content: string }
): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('lessons')
    .insert({
      module_id: learningModuleId,
      title: lesson.title,
      duration_minutes: lesson.durationMinutes,
      content: lesson.content,
    });
  if (error) throw error;
}

export async function deleteLessonsByModuleId(moduleId: string): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('module_id', moduleId);
  if (error) throw error;
}

export async function getModuleLessons(
  moduleId: string
): Promise<{ id: string; title: string; content: string; durationMinutes: number }[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, content, duration_minutes')
    .eq('module_id', moduleId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map((l: any) => ({
    id: l.id,
    title: l.title,
    content: l.content ?? '',
    durationMinutes: l.duration_minutes,
  }));
}

export async function deleteLessonById(lessonId: string): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
  if (error) throw error;
}

export async function updateLessonById(
  lessonId: string,
  updates: { durationMinutes?: number }
): Promise<void> {
  const dbUpdates: Record<string, any> = {};
  if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes;
  if (Object.keys(dbUpdates).length === 0) return;
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('lessons').update(dbUpdates).eq('id', lessonId);
  if (error) throw error;
}

// Sincroniza las lecciones de un módulo preservando las que no cambiaron (y su
// created_at). Las que cambian de título/contenido o se agregan se insertan
// como nuevas (created_at nuevo → quedan como "faltantes" para quien ya completó);
// las quitadas se eliminan. Así editar un módulo NO obliga a rehacer todo.
export async function syncModuleLessons(
  moduleId: string,
  formLessons: { title: string; durationMinutes: number; content: string }[]
): Promise<void> {
  const existing = await getModuleLessons(moduleId);
  const keyOf = (l: { title: string; content: string }) => `${l.title} ${l.content}`;

  const existingByKey = new Map<string, { id: string; durationMinutes: number }[]>();
  existing.forEach((l) => {
    const arr = existingByKey.get(keyOf(l)) ?? [];
    arr.push({ id: l.id, durationMinutes: l.durationMinutes });
    existingByKey.set(keyOf(l), arr);
  });

  const consumedIds = new Set<string>();

  for (const fl of formLessons) {
    const bucket = existingByKey.get(keyOf(fl));
    if (bucket && bucket.length > 0) {
      const match = bucket.shift()!;
      consumedIds.add(match.id);
      if (match.durationMinutes !== fl.durationMinutes) {
        await updateLessonById(match.id, { durationMinutes: fl.durationMinutes });
      }
    } else {
      await addLessonToLearningModule(moduleId, {
        title: fl.title,
        durationMinutes: fl.durationMinutes,
        content: fl.content,
      });
    }
  }

  for (const ex of existing) {
    if (!consumedIds.has(ex.id)) {
      await deleteLessonById(ex.id);
    }
  }
}
