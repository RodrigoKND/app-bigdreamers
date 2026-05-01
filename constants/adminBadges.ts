import { LucideIcon } from 'lucide-react-native';

export interface AdminBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // nombre del ícono de lucide
  color: string;
}

export const ADMIN_BADGES: AdminBadge[] = [
  { id: 'b01', name: 'Primer Paso',       description: 'Completó el primer módulo',         icon: 'Footprints',   color: '#CD7F32' },
  { id: 'b02', name: 'Explorador',        description: 'Completó 3 módulos',                icon: 'Compass',      color: '#C0C0C0' },
  { id: 'b03', name: 'Ahorrador',         description: 'Módulo de ahorro completado',        icon: 'PiggyBank',    color: '#FFD700' },
  { id: 'b04', name: 'Inversor Novato',   description: 'Primer módulo de inversión',         icon: 'TrendingUp',   color: '#CD7F32' },
  { id: 'b05', name: 'Inversor Pro',      description: 'Módulo avanzado de inversión',       icon: 'BarChart2',    color: '#FFD700' },
  { id: 'b06', name: 'Financiero',        description: 'Completó ruta de finanzas',          icon: 'DollarSign',   color: '#C0C0C0' },
  { id: 'b07', name: 'Empresario',        description: 'Módulo de empresa completado',       icon: 'Building2',    color: '#FFD700' },
  { id: 'b08', name: 'Constante',         description: 'Racha de 7 días',                   icon: 'Flame',        color: '#FF6B35' },
  { id: 'b09', name: 'Dedicado',          description: 'Racha de 30 días',                  icon: 'Zap',          color: '#FFD700' },
  { id: 'b10', name: 'Acumulador',        description: 'Llegó a 1000 gemas',                icon: 'Gem',          color: '#CD7F32' },
  { id: 'b11', name: 'Rico en Gemas',     description: 'Llegó a 5000 gemas',                icon: 'Gem',          color: '#FFD700' },
  { id: 'b12', name: 'Millonario',        description: 'Llegó a 10000 gemas',               icon: 'Crown',        color: '#FFD700' },
  { id: 'b13', name: 'Primer Inversión',  description: 'Realizó su primera inversión',       icon: 'CircleDollarSign', color: '#C0C0C0' },
  { id: 'b14', name: 'Diversificado',     description: 'Invirtió en 3 empresas distintas',  icon: 'Layers',       color: '#FFD700' },
  { id: 'b15', name: 'Estudioso',         description: 'Completó 10 lecciones',             icon: 'BookOpen',     color: '#CD7F32' },
  { id: 'b16', name: 'Maestro',           description: 'Completó todos los módulos',        icon: 'GraduationCap',color: '#FFD700' },
  { id: 'b17', name: 'Comunidad',         description: 'Se unió a la comunidad',            icon: 'Users',        color: '#C0C0C0' },
  { id: 'b18', name: 'Leyenda',           description: 'Logró todos los objetivos',         icon: 'Star',         color: '#FFD700' },
];