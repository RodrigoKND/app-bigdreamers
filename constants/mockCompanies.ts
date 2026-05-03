export type CompanyLevel = 'gold' | 'silver' | 'bronze';

export interface CompanyTeamMember {
  name: string;
  role: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  gems: number;
  imageUrl: string;
  level: CompanyLevel;
  teamMembers: CompanyTeamMember[];
  published: boolean;
}

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'co01',
    name: 'TechBolivia',
    description: 'Transformando el turismo urbano con tecnología blockchain',
    gems: 125000,
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2611/2611152.png',
    level: 'gold',
    teamMembers: [
      { name: 'Juan Fernandez', role: 'CEO & Fundador' },
      { name: 'María Ponce',    role: 'CTO' },
    ],
    published: true,
  },
];