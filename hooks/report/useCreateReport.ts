import { useState, useCallback } from 'react';
import { generateAndUploadReportPdf, ReportPdfData } from '@/services/pdf/reportPdfService';
import { createInvestmentReport } from '@/services/supabase/reportService';
import { createNotification } from '@/services/supabase/notificationDbService';
import { sendReportGeneratedNotification } from '@/services/notifications/notificationService';
import { getUserById } from '@/services/supabase/userService';
import { invalidateCache, CacheKeys } from '@/services/cache/cacheService';

export function useCreateReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (params: ReportPdfData & {
    userId: string;
    companyId?: string;
    createdBy: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const { pdfUrl, localUri } = await generateAndUploadReportPdf(params, params.userId);

      const report = await createInvestmentReport({
        userId: params.userId,
        companyId: params.companyId,
        companyName: params.companyName,
        investorName: params.investorName,
        reportDate: params.reportDate,
        investmentAmount: params.investmentAmount,
        interestRate: params.interestRate,
        updatedCapital: params.updatedCapital,
        updatedProfit: params.updatedProfit,
        nextMonthCapital: params.nextMonthCapital,
        observations: params.observations,
        pdfUrl,
        createdBy: params.createdBy,
      });

      try {
        await createNotification({
          userId: params.userId,
          type: 'report_generated',
          title: '📄 Nuevo reporte disponible',
          body: `Se generó tu reporte mensual de inversión en ${params.companyName}. Ya puedes descargarlo.`,
          data: { pdfUrl, companyName: params.companyName },
        });
      } catch (e) {
        console.error('[useCreateReport] No se pudo crear la notificación:', e);
      }

      try {
        const user = await getUserById(params.userId);
        if (user?.pushToken) {
          await sendReportGeneratedNotification(user.pushToken, params.companyName);
        }
      } catch (e) {
        console.error('[useCreateReport] No se pudo enviar el push:', e);
      }

      await invalidateCache(CacheKeys.allReports);
      await invalidateCache(CacheKeys.userReports(params.userId));
      await invalidateCache(CacheKeys.userNotifications(params.userId));

      return { ...report, localUri };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}
