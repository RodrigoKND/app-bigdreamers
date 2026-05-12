import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Plus, Package, BookOpen, Building } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useGemRequests } from '@/hooks/gem/useGemRequests';
import { useApproveGemRequest } from '@/hooks/gem/useApproveGemRequest';
import { useRejectGemRequest } from '@/hooks/gem/useRejectGemRequest';
import { useCourses } from '@/hooks/course/useCourses';
import { useCreateCourse } from '@/hooks/course/useCreateCourse';
import { useCompanies } from '@/hooks/company/useCompanies';
import { useCreateCompany } from '@/hooks/company/useCreateCompany';
import { Course } from '@/constants/mockCourses';
import { Company } from '@/constants/mockCompanies';
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
  
  // Courses hooks
  const { courses, loading: coursesLoading, refetch: refetchCourses } = useCourses();
  const { create: createCourse, loading: creatingCourse } = useCreateCourse();
  
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

  const handlePublishCourse = async (course: Partial<Course>) => {
    try {
      await createCourse({
        title: course.title || '',
        description: course.description || '',
        category: (course.category as 'Finanzas' | 'Inversion' | 'Ahorro' | 'Empresa') || 'Finanzas',
        totalLessons: course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0,
        published: true,
      });
      setShowCourseForm(false);
      refetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handlePublishCompany = async (company: Partial<Company>) => {
    try {
      await createCompany({
        name: company.name || '',
        description: company.description || '',
        gems: company.gems || 0,
        imageUrl: company.imageUrl || '',
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
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}edges={['bottom']}>
      <AdminHeader />
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {activeTab === 'gems' && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
                Solicitudes de Gemas
              </Text>
              {pendingCount > 0 && (
                <View
                  style={{
                    backgroundColor: Colors.gold[400],
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#000' }}>
                    {pendingCount}
                  </Text>
                </View>
              )}
            </View>

            {gemRequestsLoading ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                <Text style={{ color: textMuted }}>Cargando solicitudes...</Text>
              </View>
            ) : gemRequests.length === 0 ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                <Package size={48} color={textMuted} style={{ marginBottom: 16 }} />
                <Text style={{ color: textMuted, fontSize: 16, textAlign: 'center' }}>
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
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.gold[400],
                borderRadius: 16,
                paddingVertical: 16,
                marginBottom: 20,
              }}
            >
              <Plus size={20} color="#000" />
              <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '800', color: '#000' }}>
                Nuevo curso
              </Text>
            </Pressable>

            {coursesLoading ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                <Text style={{ color: textMuted }}>Cargando cursos...</Text>
              </View>
            ) : courses.length === 0 ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                <BookOpen size={48} color={textMuted} style={{ marginBottom: 16 }} />
                <Text style={{ color: textMuted, fontSize: 16, textAlign: 'center' }}>
                  No hay cursos publicados
                </Text>
              </View>
            ) : (
              courses.map((course) => (
                <View
                  key={course.id}
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                    borderWidth: 1,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: textPrimary }}>{course.title}</Text>
                    <View
                      style={{
                        backgroundColor: Colors.gold[400],
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#000' }}>PUBLICADO</Text>
                    </View>
                  </View>
                  <Text style={{ color: textMuted, marginBottom: 8 }}>{course.category}</Text>
                  <Text style={{ color: textMuted }}>{course.modules?.length || 0} módulos</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'companies' && (
          <View>
            <Pressable
              onPress={() => setShowCompanyForm(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.gold[400],
                borderRadius: 16,
                paddingVertical: 16,
                marginBottom: 20,
              }}
            >
              <Plus size={20} color="#000" />
              <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '800', color: '#000' }}>
                Nueva empresa
              </Text>
            </Pressable>

            {companiesLoading ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                <Text style={{ color: textMuted }}>Cargando empresas...</Text>
              </View>
            ) : companies.length === 0 ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                <Building size={48} color={textMuted} style={{ marginBottom: 16 }} />
                <Text style={{ color: textMuted, fontSize: 16, textAlign: 'center' }}>
                  No hay empresas publicadas
                </Text>
              </View>
            ) : (
              companies.map((company) => (
                <View
                  key={company.id}
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                    borderWidth: 1,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: textPrimary }}>{company.name}</Text>
                    <View
                      style={{
                        backgroundColor:
                          company.level === 'gold' ? '#FFD700' :
                          company.level === 'silver' ? '#C0C0C0' : '#CD7F32',
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#000' }}>
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