import { getSupabaseClient } from './supabase';

export interface InvestmentReport {
  id: string;
  userId: string;
  companyId: string | null;
  companyName: string;
  investorName: string;
  reportDate: string;
  investmentAmount: number;
  interestRate: number;
  updatedCapital: number;
  updatedProfit: number;
  nextMonthCapital: number | null;
  observations: string | null;
  pdfUrl: string;
  createdBy: string;
  createdAt: string;
}

function mapReport(row: any): InvestmentReport {
  return {
    id: row.id,
    userId: row.user_id,
    companyId: row.company_id,
    companyName: row.company_name,
    investorName: row.investor_name,
    reportDate: row.report_date,
    investmentAmount: row.investment_amount,
    interestRate: row.interest_rate,
    updatedCapital: row.updated_capital,
    updatedProfit: row.updated_profit,
    nextMonthCapital: row.next_month_capital,
    observations: row.observations,
    pdfUrl: row.pdf_url,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

export async function createInvestmentReport(input: {
  userId: string;
  companyId?: string;
  companyName: string;
  investorName: string;
  reportDate: string;
  investmentAmount: number;
  interestRate: number;
  updatedCapital: number;
  updatedProfit: number;
  nextMonthCapital?: number;
  observations?: string;
  pdfUrl: string;
  createdBy: string;
}): Promise<InvestmentReport> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('investment_reports')
    .insert({
      user_id: input.userId,
      company_id: input.companyId ?? null,
      company_name: input.companyName,
      investor_name: input.investorName,
      report_date: input.reportDate,
      investment_amount: input.investmentAmount,
      interest_rate: input.interestRate,
      updated_capital: input.updatedCapital,
      updated_profit: input.updatedProfit,
      next_month_capital: input.nextMonthCapital ?? null,
      observations: input.observations ?? null,
      pdf_url: input.pdfUrl,
      created_by: input.createdBy,
    })
    .select()
    .single();

  if (error) throw error;
  return mapReport(data);
}

export async function getReportsByUser(userId: string): Promise<InvestmentReport[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('investment_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapReport);
}

export async function getAllReports(): Promise<InvestmentReport[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('investment_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapReport);
}
