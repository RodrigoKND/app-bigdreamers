import { User } from '@/types';
import { getSupabaseClient} from '@/services/supabase/supabase';
import { createInvestment } from '@/services/supabase/investmentService';
import { createNotification } from '@/services/supabase/notificationDbService';
import { sendGemsAssignedNotification } from '@/services/notifications/notificationService';

function mapUserRow(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    level: row.level,
    gems: row.gems,
    gemsToNextLevel: row.gems_to_next_level,
    joinedAt: row.joined_at,
    modules: row.modules,
    ranking: row.ranking,
    streak: row.streak,
    completedModules: row.completed_modules,
    communityRank: row.community_rank,
    totalGemsEarned: row.total_gems_earned,
    role: row.role,
    pushToken: row.push_token,
  };
}

export async function getCurrentUser(userId: string): Promise<User> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return mapUserRow(data);
}

export async function getAllUsers(): Promise<User[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapUserRow);
}

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapUserRow(data);
}

export async function createUser(user: {
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'user';
  id: string;
}): Promise<User> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? null,
      level: 'bronze',
      gems: 0,
      gems_to_next_level: 500,
      streak: 0,
      completed_modules: 0,
      community_rank: 0,
      total_gems_earned: 0,
      role: user.role ?? 'user',
    })
    .select()
    .single();

  if (error) throw error;
  return mapUserRow(data);
}

export async function updateUser(
  userId: string,
  updates: Partial<{
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'user';
  }>
): Promise<void> {
  const supabase = await getSupabaseClient();

  const dbUpdates: Record<string, any> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
  if (updates.role !== undefined) dbUpdates.role = updates.role;

  const { error } = await supabase
    .from('users')
    .update(dbUpdates)
    .eq('id', userId);

  if (error) throw error;
}

export async function updateUserGems(userId: string, gems: number): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('users')
    .update({ gems })
    .eq('id', userId);

  if (error) throw error;
}

export async function addGemsToUser(userId: string, gemsToAdd: number): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase.rpc('add_gems_to_user', {
    p_user_id: userId,
    p_gems_to_add: gemsToAdd,
  });

  if (error) throw error;
}

export async function assignGemsToUser(input: {
  userId: string;
  gems: number;
  companyId?: string;
  companyName?: string;
}): Promise<void> {
  await addGemsToUser(input.userId, input.gems);

  if (input.companyId && input.companyName) {
    try {
      await createInvestment({
        userId: input.userId,
        companyId: input.companyId,
        companyName: input.companyName,
        gems: input.gems,
      });
    } catch (e) {
      console.error('[assignGemsToUser] No se pudo registrar la inversión:', e);
    }
  }

  const title = '💎 ¡Gemas asignadas!';
  const body = input.companyName
    ? `El administrador te asignó ${input.gems} gemas para tu inversión en ${input.companyName}.`
    : `El administrador te asignó ${input.gems} gemas. Ya están disponibles en tu cuenta.`;

  try {
    await createNotification({
      userId: input.userId,
      type: 'gems_assigned',
      title,
      body,
      data: { gems: input.gems, companyName: input.companyName ?? null },
    });
  } catch (e) {
    console.error('[assignGemsToUser] No se pudo crear la notificación:', e);
  }

  try {
    const user = await getUserById(input.userId);
    if (user?.pushToken) {
      await sendGemsAssignedNotification(user.pushToken, input.gems, input.companyName);
    }
  } catch (e) {
    console.error('[assignGemsToUser] No se pudo enviar el push:', e);
  }
}

export async function updateUserLevel(userId: string, level: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('users')
    .update({ level })
    .eq('id', userId);

  if (error) throw error;
}

export async function incrementStreak(userId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase.rpc('increment_streak', {
    p_user_id: userId,
  });

  if (error) throw error;
}

export async function resetStreak(userId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('users')
    .update({ streak: 0 })
    .eq('id', userId);

  if (error) throw error;
}

export async function incrementCompletedModules(userId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase.rpc('increment_completed_modules', {
    p_user_id: userId,
  });

  if (error) throw error;
}

export async function deleteUser(userId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}
