export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  badgeId: string | null; // insignia al completar este módulo
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Finanzas' | 'Inversion' | 'Ahorro' | 'Empresa';
  totalLessons: number;
  modules: CourseModule[];
  objectives: CourseObjective[];
  published: boolean;
}

export interface CourseObjective {
  id: string;
  description: string;
  triggerType: 'module' | 'gems';
  triggerValue: string; // ej: 'module-4' o '1000'
  badgeId: string;
}

