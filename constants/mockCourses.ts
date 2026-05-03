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
  category: 'Finanzas' | 'Inversión' | 'Ahorro' | 'Empresa';
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

export const MOCK_COURSES: Course[] = [
  {
    id: 'c01',
    title: 'Finanzas Personales',
    description: 'Aprende a manejar tu dinero desde cero',
    category: 'Finanzas',
    totalLessons: 26,
    published: true,
    modules: [
      { id: 'm01', title: 'Fundamentos',        description: '5 lecciones base', lessons: [], badgeId: 'b01' },
      { id: 'm02', title: 'Presupuesto',         description: '6 lecciones',      lessons: [], badgeId: 'b15' },
      { id: 'm03', title: 'Ahorro Inteligente',  description: '7 lecciones',      lessons: [], badgeId: 'b03' },
      { id: 'm04', title: 'Inversiones Básicas', description: '8 lecciones',      lessons: [], badgeId: 'b04' },
    ],
    objectives: [
      { id: 'o01', description: 'Llegar al módulo 4', triggerType: 'module', triggerValue: 'm04', badgeId: 'b04' },
      { id: 'o02', description: 'Acumular 1000 gemas', triggerType: 'gems',  triggerValue: '1000', badgeId: 'b10' },
    ],
  },
];