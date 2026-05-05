import { Company } from '@/constants/mockCompanies';
import { getSupabaseClient } from './supabase';

export async function getCompanies(): Promise<Company[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      team_members:company_team_members(name, role)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    gems: row.gems,
    imageUrl: row.image_url,
    level: row.level,
    teamMembers: row.team_members || [],
    published: row.published,
  }));
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      team_members:company_team_members(name, role)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    gems: data.gems,
    imageUrl: data.image_url,
    level: data.level,
    teamMembers: data.team_members || [],
    published: data.published,
  };
}

export async function createCompany(company: {
  name: string;
  description: string;
  gems: number;
  imageUrl: string;
  level: 'gold' | 'silver' | 'bronze';
  teamMembers: { name: string; role: string }[];
  published?: boolean;
}): Promise<Company> {
  const supabase = await getSupabaseClient();

  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .insert({
      name: company.name,
      description: company.description,
      gems: company.gems,
      image_url: company.imageUrl,
      level: company.level,
      published: company.published ?? false,
    })
    .select()
    .single();

  if (companyError) throw companyError;

  if (company.teamMembers.length > 0) {
    const teamMembers = company.teamMembers.map((member) => ({
      company_id: companyData.id,
      name: member.name,
      role: member.role,
    }));

    const { error: teamError } = await supabase
      .from('company_team_members')
      .insert(teamMembers);

    if (teamError) throw teamError;
  }

  return {
    id: companyData.id,
    name: companyData.name,
    description: companyData.description,
    gems: companyData.gems,
    imageUrl: companyData.image_url,
    level: companyData.level,
    teamMembers: company.teamMembers,
    published: companyData.published,
  };
}

export async function updateCompany(
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    gems: number;
    imageUrl: string;
    level: 'gold' | 'silver' | 'bronze';
    published: boolean;
  }>
): Promise<void> {
  const supabase = await getSupabaseClient();

  const dbUpdates: Record<string, any> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.gems !== undefined) dbUpdates.gems = updates.gems;
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
  if (updates.level !== undefined) dbUpdates.level = updates.level;
  if (updates.published !== undefined) dbUpdates.published = updates.published;

  const { error } = await supabase
    .from('companies')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCompany(id: string): Promise<void> {
  const supabase = await getSupabaseClient();

  await supabase
    .from('company_team_members')
    .delete()
    .eq('company_id', id);

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateCompanyTeamMembers(
  companyId: string,
  teamMembers: { name: string; role: string }[]
): Promise<void> {
  const supabase = await getSupabaseClient();

  await supabase
    .from('company_team_members')
    .delete()
    .eq('company_id', companyId);

  if (teamMembers.length > 0) {
    const members = teamMembers.map((member) => ({
      company_id: companyId,
      name: member.name,
      role: member.role,
    }));

    const { error } = await supabase
      .from('company_team_members')
      .insert(members);

    if (error) throw error;
  }
}
