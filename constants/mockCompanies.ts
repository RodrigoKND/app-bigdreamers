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

