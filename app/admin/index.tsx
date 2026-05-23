import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
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
  
  // Gem requests hooks
  const { requests: gemRequests, loading: gemRequestsLoading, refetch: refetchGemRequests } = useGemRequests();
  const { approve: approveGemRequest, loading: approving } = useApproveGemRequest();
  const { reject: rejectGemRequest, loading: rejecting } = useRejectGemRequest();
  
  // Learning modules hooks
  const { modules, loading: modulesLoading, refetch: refetchModules } = useLearningModules();
  const { create: createLearningModule, loading: creatingModule } = useCreateLearningModule();
  const { remove: deleteModule } = useDeleteLearningModule();
  
  // Companies hooks
  const { companies, loading: companiesLoading, refetch: refetchCompanies } = useCompanies();
  const { create: createCompany, loading: creatingCompany } = useCreateCompany();
  
  const [pendingApproval, setPendingApproval] = useState<any | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [pendingRejection, setPendingRejection] = useState<any | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

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
      refetchModules();
    } catch (error) {
      console.error('Error creating learning module:', error);
    }
  };

  const handleDeleteModule = (id: string, title: string) => {
    Alert.alert(
      'Eliminar módulo',
      `¿Seguro que quieres eliminar "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
          await deleteModule(id);
          await invalidateCache(CacheKeys.learningModules);
          refetchModules();
        }},
      ]
    );
  };

  const handlePublishCompany = async (company: Partial<Company>) => {
    try {
      let imageUrl = company.imageUrl || '';

      if (imageUrl && !imageUrl.startsWith('http')) {
        try {
          imageUrl = await uploadCompanyImage(imageUrl);
        } catch (uploadError) {
          console.error('Error uploading image, creating company without image:', uploadError);
          imageUrl = '';
        }
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
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  if (showCourseForm) {
    return <CourseForm onPublish={handlePublishCourse} onCancel={() => setShowCourseForm(false)} />;
  }

  if (showCompanyForm) {
    return <CompanyForm onPublish={handlePublishCompany} onCancel={() => setShowCompanyForm(false)} />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }} edges={['bottom']}>
      <AdminHeader />
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {activeTab === 'gems' && (
          <View>
            <View className="flex-row items-center mb-4">
              <Text className="text-lg font-extrabold" style={{ color: textPrimary }}>
                Solicitudes de Gemas
              </Text>
              {pendingCount > 0 && (
                <View
                  className="rounded-xl px-2 py-1 ml-2"
                  style={{ backgroundColor: Colors.gold[400] }}
                >
                  <Text className="text-xs font-extrabold" style={{ color: '#000' }}>
                    {pendingCount}
                  </Text>
                </View>
              )}
            </View>

            {gemRequestsLoading ? (
              <View className="items-center justify-center py-10">
                <Text style={{ color: textMuted }}>Cargando solicitudes...</Text>
              </View>
            ) : gemRequests.length === 0 ? (
              <View className="items-center justify-center py-10">
                <Package size={48} color={textMuted} className="mb-4" />
                <Text className="text-base text-center" style={{ color: textMuted }}>
                  No hay solicitudes de gemas pendientes
                </Text>
              </View>
            ) : (
              gemRequests.map((request) => (
                <GemRequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isDark={isDark}
                />
              ))
            )}
          </View>
        )}

        {activeTab === 'courses' && (
          <View>
            <Pressable
              onPress={() => setShowCourseForm(true)}
              className="flex-row items-center justify-center rounded-2xl py-4 mb-5"
              style={{ backgroundColor: Colors.gold[400] }}
            >
              <Plus size={20} color="#000" />
              <Text className="ml-2 text-base font-extrabold" style={{ color: '#000' }}>
                Nuevo curso
              </Text>
            </Pressable>

            {modulesLoading ? (
              <View className="items-center justify-center py-10">
                <Text style={{ color: textMuted }}>Cargando módulos...</Text>
              </View>
            ) : modules.length === 0 ? (
              <View className="items-center justify-center py-10">
                <BookOpen size={48} color={textMuted} className="mb-4" />
                <Text className="text-base text-center" style={{ color: textMuted }}>
                  No hay módulos publicados
                </Text>
              </View>
            ) : (
              modules.map((mod) => (
                <View
                  key={mod.id}
                  className="border rounded-2xl p-4 mb-3"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
                    borderColor:     isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                  }}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-base font-bold" style={{ color: textPrimary }}>{mod.title}</Text>
                    <View className="flex-row items-center gap-2">
                      <View className="rounded-xl px-2 py-1" style={{ backgroundColor: Colors.gold[400] }}>
                        <Text className="text-[10px] font-extrabold" style={{ color: '#000' }}>PUBLICADO</Text>
                      </View>
                      <Pressable onPress={() => handleDeleteModule(mod.id, mod.title)} className="active:opacity-70">
                        <Trash2 size={18} color={isDark ? 'rgba(255,255,255,0.5)' : Colors.light.textMuted} />
                      </Pressable>
                    </View>
                  </View>
                  <Text className="mb-2" style={{ color: textMuted }}>{mod.category}</Text>
                  <Text style={{ color: textMuted }}>{mod.difficulty}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'companies' && (
          <View>
            <Pressable
              onPress={() => setShowCompanyForm(true)}
              className="flex-row items-center justify-center rounded-2xl py-4 mb-5"
              style={{ backgroundColor: Colors.gold[400] }}
            >
              <Plus size={20} color="#000" />
              <Text className="ml-2 text-base font-extrabold" style={{ color: '#000' }}>
                Nueva empresa
              </Text>
            </Pressable>

            {companiesLoading ? (
              <View className="items-center justify-center py-10">
                <Text style={{ color: textMuted }}>Cargando empresas...</Text>
              </View>
            ) : companies.length === 0 ? (
              <View className="items-center justify-center py-10">
                <Building size={48} color={textMuted} className="mb-4" />
                <Text className="text-base text-center" style={{ color: textMuted }}>
                  No hay empresas publicadas
                </Text>
              </View>
            ) : (
              companies.map((company) => (
                <View
                  key={company.id}
                  className="border rounded-2xl p-4 mb-3"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
                    borderColor:     isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                  }}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-base font-bold" style={{ color: textPrimary }}>{company.name}</Text>
                    <View
                      className="rounded-xl px-2 py-1"
                      style={{
                        backgroundColor:
                          company.level === 'gold'   ? '#FFD700' :
                          company.level === 'silver' ? '#C0C0C0' : '#CD7F32',
                      }}
                    >
                      <Text className="text-[10px] font-extrabold" style={{ color: '#000' }}>
                        {company.level?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: textMuted }}>{company.gems} gemas</Text>
                </View>
              ))
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