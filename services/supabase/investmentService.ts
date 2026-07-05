import { getSupabaseClient } from './supabase';

export interface Investment {
  id: string;
  companyId: string | null;
  companyName: string;
  gems: number;
  createdAt: string;
}

function mapInvestment(row: any): Investment {
  return {
    id: row.id,
    companyId: row.company_id,
    companyName: row.company_name,
    gems: row.gems,
    createdAt: row.created_at,
  };
}

export async function createInvestment(input: {
  userId: string;
  companyId: string;
  companyName: string;
  gems: number;
}): Promise<void> {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('investments').insert({
    user_id: input.userId,
    company_id: input.companyId,
    company_name: input.companyName,
    gems: input.gems,
  });
  if (error) throw error;
}

export async function getUserInvestments(userId: string): Promise<Investment[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapInvestment);
}
