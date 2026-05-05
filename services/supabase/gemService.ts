import { GemPackage } from '@/constants/gemPackages';
import { GemRequest } from '@/constants/mockGemRequests';
import { getSupabaseClient } from '@/services/supabase/supabase';

export async function getGemPackages(): Promise<GemPackage[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('gem_packages')
    .select('*')
    .order('gems', { ascending: true });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    gems: row.gems,
    bsPrice: row.bs_price,
    label: row.label,
    popular: row.popular,
  }));
}

export async function getGemPackageById(id: string): Promise<GemPackage | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('gem_packages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    id: data.id,
    gems: data.gems,
    bsPrice: data.bs_price,
    label: data.label,
    popular: data.popular,
  };
}

export async function createGemPackage(pkg: {
  gems: number;
  bsPrice: number;
  label: string;
  popular?: boolean;
}): Promise<GemPackage> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from('gem_packages')
    .insert({
      gems: pkg.gems,
      bs_price: pkg.bsPrice,
      label: pkg.label,
      popular: pkg.popular ?? false,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    gems: data.gems,
    bsPrice: data.bs_price,
    label: data.label,
    popular: data.popular,
  };
}

export async function updateGemPackage(
  id: string,
  updates: Partial<{ gems: number; bsPrice: number; label: string; popular: boolean }>
): Promise<void> {
  const supabase = await getSupabaseClient();

  const dbUpdates: Record<string, any> = {};
  if (updates.gems !== undefined) dbUpdates.gems = updates.gems;
  if (updates.bsPrice !== undefined) dbUpdates.bs_price = updates.bsPrice;
  if (updates.label !== undefined) dbUpdates.label = updates.label;
  if (updates.popular !== undefined) dbUpdates.popular = updates.popular;

  const { error } = await supabase
    .from('gem_packages')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteGemPackage(id: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('gem_packages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createGemRequest(request: {
  userId: string;
  packageId: string;
  gems: number;
  bsPrice: number;
}): Promise<GemRequest> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from('gem_requests')
    .insert({
      user_id: request.userId,
      package_id: request.packageId,
      gems: request.gems,
      bs_price: request.bsPrice,
      status: 'pending',
    })
    .select(`
      *,
      user:users(name)
    `)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    userName: data.user?.name || '',
    packageId: data.package_id,
    gems: data.gems,
    bsPrice: data.bs_price,
    status: data.status,
    date: data.created_at?.split('T')[0] || '',
  };
}

export async function getGemRequests(filters?: {
  status?: 'pending' | 'approved' | 'rejected';
  userId?: string;
}): Promise<GemRequest[]> {
  const supabase = await getSupabaseClient();
  let query = supabase
    .from('gem_requests')
    .select(`
      *,
      user:users(name)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user?.name || '',
    packageId: row.package_id,
    gems: row.gems,
    bsPrice: row.bs_price,
    status: row.status,
    date: row.created_at?.split('T')[0] || '',
  }));
}

export async function getGemRequestById(id: string): Promise<GemRequest | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('gem_requests')
    .select(`
      *,
      user:users(name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    userName: data.user?.name || '',
    packageId: data.package_id,
    gems: data.gems,
    bsPrice: data.bs_price,
    status: data.status,
    date: data.created_at?.split('T')[0] || '',
  };
}

export async function approveGemRequest(id: string, adminId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { data: request, error: fetchError } = await supabase
    .from('gem_requests')
    .select('user_id, gems')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  const { error: updateError } = await supabase.rpc('approve_gem_request', {
    p_request_id: id,
    p_user_id: request.user_id,
    p_gems: request.gems,
    p_admin_id: adminId,
  });

  if (updateError) throw updateError;
}

export async function rejectGemRequest(id: string, reason?: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('gem_requests')
    .update({
      status: 'rejected',
      rejection_reason: reason ?? null,
    })
    .eq('id', id);

  if (error) throw error;
}

export async function getUserGemHistory(userId: string): Promise<GemRequest[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('gem_requests')
    .select(`
      *,
      user:users(name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user?.name || '',
    packageId: row.package_id,
    gems: row.gems,
    bsPrice: row.bs_price,
    status: row.status,
    date: row.created_at?.split('T')[0] || '',
  }));
}
