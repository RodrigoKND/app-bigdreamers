export type CompanyLevel = 'gold' | 'silver' | 'bronze' | 'diamond';

export interface CompanyTeamMember {
  name: string;
  role: string;
  contact?: string;
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

