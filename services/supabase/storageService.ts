import * as FileSystem from 'expo-file-system/legacy';
import { toByteArray } from 'base64-js';
import { getSupabaseClient } from './supabase';

function getMimeType(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase().split('?')[0];
    const typeMimes = {
      'jpg':  'image/jpg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };
    
    return typeMimes[ext];
}

export async function uploadCompanyImage(localUri: string): Promise<string> {
  const supabase = await getSupabaseClient();

  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: 'base64',
  });
  const bytes = toByteArray(base64);

  const ext      = localUri.split('.').pop()?.toLowerCase().split('?')[0] || 'jpg';
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const filePath = `companies/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('companies')
    .upload(filePath, bytes, {
      contentType: getMimeType(localUri),
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('companies')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function deleteCompanyImage(publicUrl: string): Promise<void> {
  if (!publicUrl || !publicUrl.includes('/storage/v1/object/public/companies/')) return;

  const supabase = await getSupabaseClient();
  const path = publicUrl.split('/companies/')[1];
  if (!path) return;

  await supabase.storage.from('companies').remove([path]);
}

export async function uploadReceiptImage(localUri: string): Promise<string> {
  const supabase = await getSupabaseClient();

  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: 'base64',
  });
  const bytes = toByteArray(base64);

  const ext      = localUri.split('.').pop()?.toLowerCase().split('?')[0] || 'jpg';
  const fileName = `receipts/${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filePath, bytes, {
      contentType: getMimeType(localUri),
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('receipts')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
