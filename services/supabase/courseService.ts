import { Course, CourseModule, Lesson, CourseObjective } from '@/constants/mockCourses';
import { getSupabase } from './supabase';

function mapCourseRow(row: any): Course {
  const modules: CourseModule[] = (row.modules || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    lessons: (m.lessons || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      durationMinutes: l.duration_minutes,
    })),
    badgeId: m.badge_id,
  }));

  const objectives: CourseObjective[] = (row.objectives || []).map((o: any) => ({
    id: o.id,
    description: o.description,
    triggerType: o.trigger_type,
    triggerValue: o.trigger_value,
    badgeId: o.badge_id,
  }));

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    totalLessons: row.total_lessons,
    modules,
    objectives,
    published: row.published,
  };
}

export async function getCourses(): Promise<Course[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules:course_modules(
        *,
        lessons:lessons(*)
      ),
      objectives:course_objectives(*)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapCourseRow);
}

export async function getCourseById(id: string): Promise<Course | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules:course_modules(
        *,
        lessons:lessons(*)
      ),
      objectives:course_objectives(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapCourseRow(data);
}

export async function createCourse(course: {
  title: string;
  description: string;
  category: 'Finanzas' | 'Inversion' | 'Ahorro' | 'Empresa';
  totalLessons: number;
  published?: boolean;
}): Promise<Course> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: course.title,
      description: course.description,
      category: course.category,
      total_lessons: course.totalLessons,
      published: course.published ?? false,
    })
    .select()
    .single();

  if (error) throw error;

  return mapCourseRow({
    ...data,
    modules: [],
    objectives: [],
  });
}

export async function updateCourse(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    category: 'Finanzas' | 'Inversion' | 'Ahorro' | 'Empresa';
    totalLessons: number;
    published: boolean;
  }>
): Promise<void> {
  const supabase = await getSupabase();

  const dbUpdates: Record<string, any> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.totalLessons !== undefined) dbUpdates.total_lessons = updates.totalLessons;
  if (updates.published !== undefined) dbUpdates.published = updates.published;

  const { error } = await supabase
    .from('courses')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCourse(id: string): Promise<void> {
  const supabase = await getSupabase();

  const { data: modules } = await supabase
    .from('course_modules')
    .select('id')
    .eq('course_id', id);

  if (modules && modules.length > 0) {
    const moduleIds = modules.map((m: any) => m.id);
    await supabase.from('lessons').delete().in('module_id', moduleIds);
    await supabase.from('course_modules').delete().in('id', moduleIds);
  }

  await supabase.from('course_objectives').delete().eq('course_id', id);

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function addModuleToCourse(
  courseId: string,
  module: { title: string; description: string; badgeId?: string | null }
): Promise<CourseModule> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from('course_modules')
    .insert({
      course_id: courseId,
      title: module.title,
      description: module.description,
      badge_id: module.badgeId ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    lessons: [],
    badgeId: data.badge_id,
  };
}

export async function updateModule(
  moduleId: string,
  updates: Partial<{ title: string; description: string; badgeId: string | null }>
): Promise<void> {
  const supabase = await getSupabase();

  const dbUpdates: Record<string, any> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.badgeId !== undefined) dbUpdates.badge_id = updates.badgeId;

  const { error } = await supabase
    .from('course_modules')
    .update(dbUpdates)
    .eq('id', moduleId);

  if (error) throw error;
}

export async function deleteModule(moduleId: string): Promise<void> {
  const supabase = await getSupabase();

  await supabase.from('lessons').delete().eq('module_id', moduleId);

  const { error } = await supabase
    .from('course_modules')
    .delete()
    .eq('id', moduleId);

  if (error) throw error;
}

export async function addLessonToModule(
  moduleId: string,
  lesson: { title: string; durationMinutes: number }
): Promise<Lesson> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      module_id: moduleId,
      title: lesson.title,
      duration_minutes: lesson.durationMinutes,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    durationMinutes: data.duration_minutes,
  };
}

export async function updateLesson(
  lessonId: string,
  updates: Partial<{ title: string; durationMinutes: number }>
): Promise<void> {
  const supabase = await getSupabase();

  const dbUpdates: Record<string, any> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes;

  const { error } = await supabase
    .from('lessons')
    .update(dbUpdates)
    .eq('id', lessonId);

  if (error) throw error;
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId);

  if (error) throw error;
}

export async function addObjectiveToCourse(
  courseId: string,
  objective: { description: string; triggerType: 'module' | 'gems'; triggerValue: string; badgeId: string }
): Promise<CourseObjective> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from('course_objectives')
    .insert({
      course_id: courseId,
      description: objective.description,
      trigger_type: objective.triggerType,
      trigger_value: objective.triggerValue,
      badge_id: objective.badgeId,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    description: data.description,
    triggerType: data.trigger_type,
    triggerValue: data.trigger_value,
    badgeId: data.badge_id,
  };
}

export async function updateObjective(
  objectiveId: string,
  updates: Partial<{ description: string; triggerType: 'module' | 'gems'; triggerValue: string; badgeId: string }>
): Promise<void> {
  const supabase = await getSupabase();

  const dbUpdates: Record<string, any> = {};
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.triggerType !== undefined) dbUpdates.trigger_type = updates.triggerType;
  if (updates.triggerValue !== undefined) dbUpdates.trigger_value = updates.triggerValue;
  if (updates.badgeId !== undefined) dbUpdates.badge_id = updates.badgeId;

  const { error } = await supabase
    .from('course_objectives')
    .update(dbUpdates)
    .eq('id', objectiveId);

  if (error) throw error;
}

export async function deleteObjective(objectiveId: string): Promise<void> {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from('course_objectives')
    .delete()
    .eq('id', objectiveId);

  if (error) throw error;
}
