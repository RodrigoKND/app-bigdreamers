import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { toByteArray } from 'base64-js';
import { getSupabaseClient } from '@/services/supabase/supabase';

export interface ReportPdfData {
  companyName: string;
  investorName: string;
  reportDate: string;
  investmentAmount: number;
  interestRate: number;
  updatedCapital: number;
  updatedProfit: number;
  nextMonthCapital?: number;
  observations?: string;
}

function fmtNumber(n: number): string {
  return n.toLocaleString('es-BO', { maximumFractionDigits: 2 });
}

function fmtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

async function getLogoDataUri(): Promise<string> {
  const asset = Asset.fromModule(require('@/assets/images/logo.png'));
  await asset.downloadAsync();
  const base64 = await FileSystem.readAsStringAsync(asset.localUri || asset.uri, {
    encoding: 'base64',
  });
  return `data:image/png;base64,${base64}`;
}

const CALENDAR_ICON = `
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>`;
const CHECK_ICON = `
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`;
const CHAT_ICON = `
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>`;

export function buildReportHtml(data: ReportPdfData, logoDataUri: string): string {
  const observationsLines = (data.observations || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const observationsHtml = observationsLines.map((l) => `<li>${l}</li>`).join('');

  const nextMonthHtml =
    data.nextMonthCapital != null
      ? `<li>capital a tomar en cuenta para el siguiente mes ${fmtNumber(data.nextMonthCapital)} Bs</li>`
      : '';

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, Helvetica, Arial, sans-serif;
    background: linear-gradient(160deg, #33D9C6 0%, #17A6C4 22%, #1874C9 55%, #0B3B8C 100%);
    color: #fff;
    padding: 44px 40px 56px;
  }
  .logo-row { display: flex; align-items: center; gap: 14px; }
  .logo-row img { width: 60px; height: 60px; object-fit: contain; }
  .brand { font-size: 32px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }
  .brand-sub { font-size: 12px; letter-spacing: 5px; font-weight: 600; opacity: 0.92; margin-top: 4px; }
  .title { font-size: 42px; font-weight: 900; letter-spacing: 0.5px; margin: 30px 0 34px; text-transform: uppercase; }
  .timeline { position: relative; padding-left: 66px; }
  .timeline::before {
    content: ''; position: absolute; left: 25px; top: 4px; bottom: 4px; width: 2px;
    background: rgba(255,255,255,0.55);
  }
  .item { position: relative; margin-bottom: 32px; }
  .item:last-child { margin-bottom: 0; }
  .badge {
    position: absolute; left: -66px; top: -8px;
    width: 52px; height: 52px; border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #4FE0E8, #1D5FAE);
    border: 2px solid rgba(255,255,255,0.85);
    display: flex; align-items: center; justify-content: center;
  }
  .item p { font-size: 15px; line-height: 1.55; font-style: italic; }
  .item ul { margin: 4px 0 0 18px; font-size: 15px; font-style: italic; }
  .item li { margin-bottom: 2px; }
</style>
</head>
<body>
  <div class="logo-row">
    <img src="${logoDataUri}" />
    <div>
      <div class="brand">BigDreamers</div>
      <div class="brand-sub">INVERSIONES</div>
    </div>
  </div>

  <div class="title">Reporte Mensual</div>

  <div class="timeline">
    <div class="item">
      <div class="badge">${CALENDAR_ICON}</div>
      <p>Inversionista : ${data.investorName}<br/>Empresa : ${data.companyName}<br/>fecha : ${fmtDate(data.reportDate)}</p>
    </div>
    <div class="item">
      <div class="badge">${CHECK_ICON}</div>
      <p>Monto de Inversión&nbsp;&nbsp;: ${fmtNumber(data.investmentAmount)} Bs<br/>Interés Compuesto: ${data.interestRate}%</p>
    </div>
    <div class="item">
      <div class="badge">${CHECK_ICON}</div>
      <p>Capital actualizado&nbsp;&nbsp;: ${fmtNumber(data.updatedCapital)} Bs<br/>Ganancia actualizado&nbsp;&nbsp;: ${fmtNumber(data.updatedProfit)} Bs</p>
    </div>
    <div class="item">
      <div class="badge">${CHAT_ICON}</div>
      <p>Observaciones o informes pendientes :</p>
      <ul>${observationsHtml}${nextMonthHtml}</ul>
    </div>
  </div>
</body>
</html>`;
}

export async function generateAndUploadReportPdf(
  data: ReportPdfData,
  userId: string
): Promise<{ pdfUrl: string; localUri: string }> {
  const [{ printToFileAsync }, logoDataUri] = await Promise.all([
    import('expo-print'),
    getLogoDataUri(),
  ]);

  const html = buildReportHtml(data, logoDataUri);
  const { uri } = await printToFileAsync({ html, base64: false });

  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  const bytes = toByteArray(base64);
  const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2, 10)}.pdf`;

  const supabase = await getSupabaseClient();
  const { error: uploadError } = await supabase.storage
    .from('reports')
    .upload(fileName, bytes, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('reports').getPublicUrl(fileName);
  return { pdfUrl: urlData.publicUrl, localUri: uri };
}
