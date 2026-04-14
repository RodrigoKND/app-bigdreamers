import { LearningModule } from '@/types';
import { MOCK_MODULES } from '@/data/mockLessons';

// TODO: Replace with Supabase queries
// import { supabase } from '@/lib/supabase';

export async function getLearningModules(): Promise<LearningModule[]> {
  // TODO: supabase.from('modules').select('*').order('order_index');
  return Promise.resolve(MOCK_MODULES);
}

export async function updateModuleProgress(
  userId: string,
  moduleId: string,
  progress: number
): Promise<void> {
  // TODO: supabase.from('user_modules').upsert({ user_id: userId, module_id: moduleId, progress });
  console.log('updateModuleProgress', userId, moduleId, progress);
}

export async function completeModule(userId: string, moduleId: string): Promise<void> {
  // TODO: supabase.from('user_modules').upsert({ user_id: userId, module_id: moduleId, completed: true, completed_at: new Date() });
  console.log('completeModule', userId, moduleId);
}
