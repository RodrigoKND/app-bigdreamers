import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { MOCK_GEM_REQUESTS } from '@/constants/mockGemRequests';
import { MOCK_COURSES } from '@/constants/mockCourses';
import { MOCK_COMPANIES } from '@/constants/mockCompanies';
import { GemRequest } from '@/constants/mockGemRequests';
import { Course } from '@/constants/mockCourses';
import { Company } from '@/constants/mockCompanies';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import GemRequestCard from '@/components/admin/gems/GemRequestCard';
import ConfirmApproveModal from '@/components/admin/gems/ConfirmApproveModal';
import CourseForm from '@/components/admin/courses/CourseForm';
import CompanyForm from '@/components/admin/companies/CompanyForm';

const AdminScreen = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'gems' | 'courses' | 'companies'>('gems');
  const [gemRequests, setGemRequests] = useState<GemRequest[]>(MOCK_GEM_REQUESTS);
  const [pendingApproval, setPendingApproval] = useState<GemRequest | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [courses, setCourses] = useState<Partial<Course>[]>(MOCK_COURSES);
  const [companies, setCompanies] = useState<Partial<Company>[]>(MOCK_COMPANIES);

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const pendingCount = gemRequests.filter(r => r.status === 'pending').length;

  const handleApprove = (id: string) => {
    const req = gemRequests.find(r => r.id === id);
    setPendingApproval(req ?? null);
    setShowApproveModal(true);
  };

  const confirmApprove = () => {
    setGemRequests(prev =>
      prev.map(r => r.id === pendingApproval?.id ? { ...r, status: 'approved' } : r)
    );
    setShowApproveModal(false);
    setPendingApproval(null);
  };

  const handleReject = (id: string) => {
    setGemRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r)
    );
  };

  const handlePublishCourse = (course: Partial<Course>) => {
    setCourses(prev => [...prev, { ...course, id: `c${Date.now()}`, published: true }]);
    setShowCourseForm(false);
  };

  const handlePublishCompany = (company: Partial<Company>) => {
    setCompanies(prev => [...prev, { ...company, id: `co${Date.now()}`, published: true }]);
    setShowCompanyForm(false);
  };

  if (showCourseForm) {
    return <CourseForm isDark={isDark} onPublish={handlePublishCourse} onCancel={() => setShowCourseForm(false)} />;
  }

  if (showCompanyForm) {
    return <CompanyForm isDark={isDark} onPublish={handlePublishCompany} onCancel={() => setShowCompanyForm(false)} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}>
      <AdminHeader isDark={isDark} />
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

            {courses.map((course) => (
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
            ))}
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

            {companies.map((company) => (
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
            ))}
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
    </SafeAreaView>
  );
};

export default AdminScreen;