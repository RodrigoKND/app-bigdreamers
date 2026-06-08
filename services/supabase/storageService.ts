import { getSupabaseClient } from './supabase';

function getMimeType(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'png':  return 'image/png';
    case 'gif':  return 'image/gif';
    case 'webp': return 'image/webp';
    default:     return 'image/jpeg';
  }
}

async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error(`No se pudo cargar el archivo: ${response.status}`);
  return response.blob();
}

export async function uploadCompanyImage(localUri: string): Promise<string> {
  const supabase = await getSupabaseClient();
  const blob = await uriToBlob(localUri);

  const ext      = localUri.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const filePath = `companies/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('companies')
    .upload(filePath, blob, {
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
