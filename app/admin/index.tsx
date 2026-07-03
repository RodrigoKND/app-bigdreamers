import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert, RefreshControl } from 'react-native';
import { Plus, Package, BookOpen, Building, Trash2, Pencil } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useGemRequests } from '@/hooks/gem/useGemRequests';
import { useApproveGemRequest } from '@/hooks/gem/useApproveGemRequest';
import { useRejectGemRequest } from '@/hooks/gem/useRejectGemRequest';
import { useLearningModules } from '@/hooks/learning/useLearningModules';
import { useCreateLearningModule } from '@/hooks/learning/useCreateLearningModule';
import { useUpdateLearningModule } from '@/hooks/learning/useUpdateLearningModule';
import { useDeleteLearningModule } from '@/hooks/learning/useDeleteLearningModule';
import { useCompanies } from '@/hooks/company/useCompanies';
import { useCreateCompany } from '@/hooks/company/useCreateCompany';
import { useUpdateCompany } from '@/hooks/company/useUpdateCompany';
import { useUpdateCompanyTeamMembers } from '@/hooks/company/useUpdateCompanyTeamMembers';
import { useDeleteCompany } from '@/hooks/company/useDeleteCompany';
import { LearningModuleFormData } from '@/components/admin/courses/CourseForm';
import { Company } from '@/constants/mockCompanies';
import { uploadCompanyImage } from '@/services/supabase/storageService';
import { addLessonToLearningModule, deleteLessonsByModuleId } from '@/services/supabase/learningService';
import { sendGemRequestNotification } from '@/services/notifications/notificationService';
import { getSupabaseClient } from '@/services/supabase/supabase';
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
  const { update: updateLearningModule } = useUpdateLearningModule();
  const { remove: deleteModule } = useDeleteLearningModule();

  const { companies, loading: companiesLoading, refetch: refetchCompanies } = useCompanies();
  const { create: createCompany, loading: creatingCompany } = useCreateCompany();
  const { update: updateCompany } = useUpdateCompany();
  const { updateTeamMembers } = useUpdateCompanyTeamMembers();
  const { remove: deleteCompany, loading: deletingCompany } = useDeleteCompany();

  const [pendingApproval, setPendingApproval] = useState<any | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingModule, setEditingModule] = useState<{ id: string; data: LearningModuleFormData; lessons: { title: string; durationMinutes: number; content: string }[] } | null>(null);
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
      const supabase = await getSupabaseClient();
      const { data: userData } = await supabase
        .from('users')
        .select('push_token')
        .eq('id', pendingApproval.userId)
        .single();
      if (userData?.push_token) {
        sendGemRequestNotification(userData.push_token, 'approved', pendingApproval.gems);
      }
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

  const confirmReject = async (reason?: string) => {
    if (!pendingRejection) return;
    try {
      await rejectGemRequest(pendingRejection.id, reason);
      const supabase = await getSupabaseClient();
      const { data: userData } = await supabase
        .from('users')
        .select('push_token')
        .eq('id', pendingRejection.userId)
        .single();
      if (userData?.push_token) {
        sendGemRequestNotification(userData.push_token, 'rejected', pendingRejection.gems, reason);
      }
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
      setEditingModule(null);
      await invalidateCache(CacheKeys.learningModules);
      refetchModules();
      Alert.alert('¡Publicado!', 'El módulo se creó correctamente.');
    } catch (error) {
      console.error('Error creating learning module:', error);
      Alert.alert('Error', 'No se pudo crear el módulo. Verifica los datos e intenta nuevamente.');
    }
  };

  const handleUpdateCourse = async (id: string, data: LearningModuleFormData) => {
    try {
      await updateLearningModule(id, {
        title: data.title,
        description: data.description,
        category: data.category,
        duration: data.duration,
        gemsReward: data.gemsReward,
        thumbnail: data.thumbnail,
        difficulty: data.difficulty,
        orderIndex: data.orderIndex,
      });
      if (data.lessons && data.lessons.length > 0) {
        await deleteLessonsByModuleId(id);
        for (const lesson of data.lessons) {
          await addLessonToLearningModule(id, {
            title: lesson.title,
            durationMinutes: lesson.durationMinutes,
            content: lesson.content,
          });
        }
      }
      setShowCourseForm(false);
      setEditingModule(null);
      await invalidateCache(CacheKeys.learningModules);
      refetchModules();
      Alert.alert('¡Actualizado!', 'El módulo se actualizó correctamente.');
    } catch (error) {
      console.error('Error updating learning module:', error);
      Alert.alert('Error', 'No se pudo actualizar el módulo. Verifica los datos e intenta nuevamente.');
    }
  };

  const handleEditModule = async (mod: any) => {
    try {
      const supabase = (await import('@/services/supabase/supabase')).getSupabaseClient;
      const client = await supabase();
      const { data: lessons } = await client
        .from('lessons')
        .select('title, duration_minutes, content')
        .eq('module_id', mod.id)
        .order('created_at', { ascending: true });

      const lessonData = (lessons || []).map((l: any) => ({
        title: l.title,
        durationMinutes: l.duration_minutes,
        content: l.content ?? '',
      }));

      setEditingModule({
        id: mod.id,
        data: {
          title: mod.title || '',
          description: mod.description || '',
          category: mod.category || '',
          duration: mod.duration || '',
          gemsReward: mod.gemsReward || 0,
          thumbnail: mod.thumbnail || '',
          difficulty: mod.difficulty || 'beginner',
          orderIndex: mod.orderIndex,
        },
        lessons: lessonData,
      });
      setShowCourseForm(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las lecciones del módulo.');
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

  const handleDeleteCompany = (id: string, name: string) => {
    Alert.alert(
      'Eliminar empresa',
      `¿Seguro que quieres eliminar "${name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive', onPress: async () => {
            try {
              await deleteCompany(id);
              await invalidateCache(CacheKeys.companies);
              refetchCompanies();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la empresa.');
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
        try {
          imageUrl = await uploadCompanyImage(imageUrl);
        } catch (storageError: any) {
          const msg = storageError?.message || String(storageError);
          Alert.alert('Error de imagen', `No se pudo subir la imagen:\n\n${msg}`);
          return;
        }
      }
      await createCompany({
        name: company.name || '',
        description: company.description || '',
        gems: company.gems || 0,
        imageUrl: imageUrl.startsWith('http') ? imageUrl : '',
        level: company.level || 'bronze',
        teamMembers: (company.teamMembers || []).map(m => ({
          name: m.name,
          role: m.role,
          contact: m.contact,
        })),
        published: true,
      });
      setShowCompanyForm(false);
      setEditingCompany(null);
      refetchCompanies();
      Alert.alert('¡Publicado!', 'La empresa se creó correctamente.');
    } catch (error: any) {
      const msg = error?.message || String(error);
      Alert.alert('Error', `No se pudo crear la empresa:\n\n${msg}`);
    }
  };

  const handleUpdateCompany = async (id: string, company: Partial<Company>) => {
    try {
      let imageUrl = company.imageUrl || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        try {
          imageUrl = await uploadCompanyImage(imageUrl);
        } catch (storageError: any) {
          const msg = storageError?.message || String(storageError);
          Alert.alert('Error de imagen', `No se pudo subir la imagen:\n\n${msg}`);
          return;
        }
      }
      await updateCompany(id, {
        name: company.name,
        description: company.description,
        gems: company.gems,
        imageUrl: imageUrl.startsWith('http') ? imageUrl : company.imageUrl,
        level: company.level,
      });
      if (company.teamMembers && company.teamMembers.length > 0) {
        await updateTeamMembers(
          id,
          company.teamMembers.map(m => ({ name: m.name, role: m.role, contact: m.contact }))
        );
      }
      setShowCompanyForm(false);
      setEditingCompany(null);
      refetchCompanies();
      Alert.alert('¡Actualizado!', 'La empresa se actualizó correctamente.');
    } catch (error: any) {
      const msg = error?.message || String(error);
      Alert.alert('Error', `No se pudo actualizar la empresa:\n\n${msg}`);
    }
  };

  if (showCourseForm) {
    return (
      <CourseForm
        onPublish={handlePublishCourse}
        onUpdate={handleUpdateCourse}
        onCancel={() => { setShowCourseForm(false); setEditingModule(null); }}
        initialData={editingModule ? { ...editingModule.data, id: editingModule.id } : null}
        initialLessons={editingModule?.lessons}
      />
    );
  }

  if (showCompanyForm) {
    return (
      <CompanyForm
        onPublish={handlePublishCompany}
        onUpdate={handleUpdateCompany}
        onCancel={() => { setShowCompanyForm(false); setEditingCompany(null); }}
        initialData={editingCompany}
      />
    );
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
              onPress={() => { setEditingModule(null); setShowCourseForm(true); }}
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
                            onPress={() => handleEditModule(mod)}
                            className="w-8 h-8 rounded-xl items-center justify-center active:opacity-60"
                            style={{ backgroundColor: isDark ? 'rgba(255,215,64,0.12)' : Colors.light.goldLight }}
                          >
                            <Pencil size={15} color={Colors.gold[500]} />
                          </Pressable>
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
              onPress={() => { setEditingCompany(null); setShowCompanyForm(true); }}
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
                        <View className="flex-row items-center gap-2">
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
                          <Pressable
                            onPress={() => { setEditingCompany(company); setShowCompanyForm(true); }}
                            className="w-8 h-8 rounded-xl items-center justify-center active:opacity-60"
                            style={{ backgroundColor: isDark ? 'rgba(255,215,64,0.12)' : Colors.light.goldLight }}
                          >
                            <Pencil size={15} color={Colors.gold[500]} />
                          </Pressable>
                          <Pressable
                            onPress={() => handleDeleteCompany(company.id, company.name)}
                            className="w-8 h-8 rounded-xl items-center justify-center active:opacity-60"
                            style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.12)' : Colors.light.errorBg }}
                          >
                            <Trash2 size={15} color={Colors.error} />
                          </Pressable>
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
