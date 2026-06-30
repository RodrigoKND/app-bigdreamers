import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert, RefreshControl } from 'react-native';
import { Plus, Package, BookOpen, Building, Trash2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useGemRequests } from '@/hooks/gem/useGemRequests';
import { useApproveGemRequest } from '@/hooks/gem/useApproveGemRequest';
import { useRejectGemRequest } from '@/hooks/gem/useRejectGemRequest';
import { useLearningModules } from '@/hooks/learning/useLearningModules';
import { useCreateLearningModule } from '@/hooks/learning/useCreateLearningModule';
import { useDeleteLearningModule } from '@/hooks/learning/useDeleteLearningModule';
import { useCompanies } from '@/hooks/company/useCompanies';
import { useCreateCompany } from '@/hooks/company/useCreateCompany';
import { LearningModuleFormData } from '@/components/admin/courses/CourseForm';
import { Company } from '@/constants/mockCompanies';
import { uploadCompanyImage } from '@/services/supabase/storageService';
import { addLessonToLearningModule } from '@/services/supabase/learningService';
import { invalidateCache, CacheKeys } from '@/services/cache/cacheService';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import GemRequestCard from '@/components/admin/gems/GemRequestCard';
import ConfirmApproveModal from '@/components/admin/gems/ConfirmApproveModal';
import CourseForm from '@/components/admin/courses/CourseForm';
import CompanyForm from '@/components/admin/companies/CompanyForm';
import ConfirmRejectModal from '@/components/admin/gems/ConfirmRejectModal';

const AdminScreen = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'gems' | 'courses' | 'companies'>('gems');

  const { requests: gemRequests, loading: gemRequestsLoading, refetch: refetchGemRequests } = useGemRequests();
  const { approve: approveGemRequest, loading: approving } = useApproveGemRequest();
  const { reject: rejectGemRequest, loading: rejecting } = useRejectGemRequest();

  const { modules, loading: modulesLoading, refetch: refetchModules } = useLearningModules();
  const { create: createLearningModule, loading: creatingModule } = useCreateLearningModule();
  const { remove: deleteModule } = useDeleteLearningModule();

  const { companies, loading: companiesLoading, refetch: refetchCompanies } = useCompanies();
  const { create: createCompany, loading: creatingCompany } = useCreateCompany();

  const [pendingApproval, setPendingApproval] = useState<any | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [pendingRejection, setPendingRejection] = useState<any | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await Promise.all([refetchGemRequests(), refetchModules(), refetchCompanies()]); }
    finally { setRefreshing(false); }
  }, [refetchGemRequests, refetchModules, refetchCompanies]);

  const bg          = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg      = isDark ? 'rgba(255,255,255,0.05)' : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const textPrimary = isDark ? Colors.text.primary      : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.6)'  : Colors.light.textMuted;

  const pendingCount = gemRequests.filter(r => r.status === 'pending').length;

  const handleApprove = (id: string) => {
    const req = gemRequests.find(r => r.id === id);
    setPendingApproval(req ?? null);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!pendingApproval || !user?.id) return;
    try {
      await approveGemRequest(pendingApproval.id, user.id);
      setShowApproveModal(false);
      setPendingApproval(null);
      refetchGemRequests();
    } catch (error) {
      console.error('Error approving gem request:', error);
      Alert.alert('Error', 'No se pudo aprobar la solicitud. Intenta nuevamente.');
    }
  };

  const handleReject = (id: string) => {
    const req = gemRequests.find(r => r.id === id);
    setPendingRejection(req ?? null);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!pendingRejection) return;
    try {
      await rejectGemRequest(pendingRejection.id);
      setShowRejectModal(false);
      setPendingRejection(null);
      refetchGemRequests();
    } catch (error) {
      console.error('Error rejecting gem request:', error);
      Alert.alert('Error', 'No se pudo rechazar la solicitud. Intenta nuevamente.');
    }
  };

  const handlePublishCourse = async (data: LearningModuleFormData) => {
    try {
      const createdModule = await createLearningModule(data);
      if (createdModule && data.lessons && data.lessons.length > 0) {
        for (const lesson of data.lessons) {
          await addLessonToLearningModule(createdModule.id, {
            title: lesson.title,
            durationMinutes: lesson.durationMinutes,
            content: lesson.content,
          });
        }
      }
      setShowCourseForm(false);
      await invalidateCache(CacheKeys.learningModules);
      refetchModules();
      Alert.alert('¡Publicado!', 'El módulo se creó correctamente.');
    } catch (error) {
      console.error('Error creating learning module:', error);
      Alert.alert('Error', 'No se pudo crear el módulo. Verifica los datos e intenta nuevamente.');
    }
  };

  const handleDeleteModule = (id: string, title: string) => {
    Alert.alert(
      'Eliminar módulo',
      `¿Seguro que quieres eliminar "${title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive', onPress: async () => {
            try {
              await deleteModule(id);
              await invalidateCache(CacheKeys.learningModules);
              refetchModules();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el módulo.');
            }
          },
        },
      ]
    );
  };

  const handlePublishCompany = async (company: Partial<Company>) => {
    try {
      let imageUrl = company.imageUrl || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = await uploadCompanyImage(imageUrl);
      }
      await createCompany({
        name: company.name || '',
        description: company.description || '',
        gems: company.gems || 0,
        imageUrl,
        level: company.level || 'bronze',
        teamMembers: company.teamMembers || [],
        published: true,
      });
      setShowCompanyForm(false);
      refetchCompanies();
      Alert.alert('¡Publicado!', 'La empresa se creó correctamente.');
    } catch (error) {
      console.error('Error creating company:', error);
      Alert.alert('Error', 'No se pudo crear la empresa. Intenta nuevamente.');
    }
  };

  if (showCourseForm) {
    return <CourseForm onPublish={handlePublishCourse} onCancel={() => setShowCourseForm(false)} />;
  }

  if (showCompanyForm) {
    return <CompanyForm onPublish={handlePublishCompany} onCancel={() => setShowCompanyForm(false)} />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }} edges={['bottom']}>
      <AdminHeader />
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? Colors.gold[400] : Colors.light.accent}
            colors={[isDark ? Colors.gold[400] : Colors.light.accent]}
          />
        }
      >
        {/* ─── Gemas ─── */}
        {activeTab === 'gems' && (
          <View>
            <View className="flex-row items-center mb-4 mt-2">
              <Text className="text-[17px] font-bold" style={{ color: textPrimary }}>
                Solicitudes de Gemas
              </Text>
              {pendingCount > 0 && (
                <View
                  className="rounded-full px-2.5 py-0.5 ml-2"
                  style={{ backgroundColor: Colors.gold[400] }}
                >
                  <Text className="text-xs font-extrabold" style={{ color: '#000' }}>
                    {pendingCount}
                  </Text>
                </View>
              )}
            </View>

            {gemRequestsLoading ? (
              <View className="items-center justify-center py-12">
                <Text style={{ color: textMuted }}>Cargando solicitudes...</Text>
              </View>
            ) : gemRequests.length === 0 ? (
              <View
                className="items-center justify-center py-12 rounded-2xl"
                style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
              >
                <Package size={40} color={textMuted} />
                <Text className="text-[15px] font-semibold text-center mt-3" style={{ color: textMuted }}>
                  No hay solicitudes pendientes
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {gemRequests.map((request) => (
                  <GemRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isDark={isDark}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ─── Cursos ─── */}
        {activeTab === 'courses' && (
          <View>
            <Pressable
              onPress={() => setShowCourseForm(true)}
              className="flex-row items-center justify-center rounded-2xl py-4 mb-5 mt-2 gap-2"
              style={{ backgroundColor: Colors.gold[400] }}
            >
              <Plus size={18} color="#000" />
              <Text className="text-[15px] font-extrabold" style={{ color: '#000' }}>
                Nuevo módulo
              </Text>
            </Pressable>

            {modulesLoading ? (
              <View className="items-center justify-center py-12">
                <Text style={{ color: textMuted }}>Cargando módulos...</Text>
              </View>
            ) : modules.length === 0 ? (
              <View
                className="items-center justify-center py-12 rounded-2xl"
                style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
              >
                <BookOpen size={40} color={textMuted} />
                <Text className="text-[15px] font-semibold text-center mt-3" style={{ color: textMuted }}>
                  No hay módulos publicados
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {modules.map((mod) => (
                  <View
                    key={mod.id}
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text
                        className="text-[15px] font-bold flex-1 mr-3"
                        style={{ color: textPrimary }}
                        numberOfLines={1}
                      >
                        {mod.title}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <View
                          className="rounded-full px-2.5 py-1"
                          style={{ backgroundColor: Colors.gold[400] }}
                        >
                          <Text className="text-[10px] font-extrabold" style={{ color: '#000' }}>
                            PUBLICADO
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => handleDeleteModule(mod.id, mod.title)}
                          className="w-8 h-8 rounded-xl items-center justify-center active:opacity-60"
                          style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.12)' : Colors.light.errorBg }}
                        >
                          <Trash2 size={15} color={Colors.error} />
                        </Pressable>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <Text className="text-xs" style={{ color: textMuted }}>
                        {mod.category}
                      </Text>
                      <View
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: textMuted }}
                      />
                      <Text className="text-xs capitalize" style={{ color: textMuted }}>
                        {mod.difficulty}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ─── Empresas ─── */}
        {activeTab === 'companies' && (
          <View>
            <Pressable
              onPress={() => setShowCompanyForm(true)}
              className="flex-row items-center justify-center rounded-2xl py-4 mb-5 mt-2 gap-2"
              style={{ backgroundColor: Colors.gold[400] }}
            >
              <Plus size={18} color="#000" />
              <Text className="text-[15px] font-extrabold" style={{ color: '#000' }}>
                Nueva empresa
              </Text>
            </Pressable>

            {companiesLoading ? (
              <View className="items-center justify-center py-12">
                <Text style={{ color: textMuted }}>Cargando empresas...</Text>
              </View>
            ) : companies.length === 0 ? (
              <View
                className="items-center justify-center py-12 rounded-2xl"
                style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
              >
                <Building size={40} color={textMuted} />
                <Text className="text-[15px] font-semibold text-center mt-3" style={{ color: textMuted }}>
                  No hay empresas publicadas
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {companies.map((company) => {
                  const levelColor =
                    company.level === 'gold'   ? Colors.levels.gold   :
                    company.level === 'silver' ? Colors.levels.silver : Colors.levels.bronze;

                  return (
                    <View
                      key={company.id}
                      className="rounded-2xl p-4"
                      style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
                    >
                      <View className="flex-row justify-between items-center mb-1">
                        <Text
                          className="text-[15px] font-bold flex-1 mr-3"
                          style={{ color: textPrimary }}
                          numberOfLines={1}
                        >
                          {company.name}
                        </Text>
                        <View
                          className="rounded-full px-2.5 py-1"
                          style={{ backgroundColor: `${levelColor}22` }}
                        >
                          <Text
                            className="text-[10px] font-extrabold uppercase"
                            style={{ color: levelColor }}
                          >
                            {company.level}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs" style={{ color: textMuted }}>
                        {company.gems.toLocaleString()} gemas
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <ConfirmApproveModal
        visible={showApproveModal}
        request={pendingApproval}
        onConfirm={confirmApprove}
        onCancel={() => setShowApproveModal(false)}
        isDark={isDark}
      />

      <ConfirmRejectModal
        visible={showRejectModal}
        request={pendingRejection}
        onConfirm={confirmReject}
        onCancel={() => setShowRejectModal(false)}
        isDark={isDark}
      />
    </SafeAreaView>
  );
};

export default AdminScreen;
