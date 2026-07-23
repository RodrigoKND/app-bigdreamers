import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, Image, Modal,
  Pressable, ActivityIndicator, RefreshControl, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Shield, Sun, Moon, ChevronRight, User, BarChart2, Users, Gem, TrendingUp, Mail, MapPinOff, FileText, Download } from 'lucide-react-native';

const SUPPORT_EMAIL = 'dreamersb648@gmail.com';
const INVEST_PREVIEW = 4;
import { IMAGES } from '@/constants/images';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useUserInvestments } from '@/hooks/investment/useUserInvestments';
import { useUserReports } from '@/hooks/report/useUserReports';
import { useTheme } from '@/context/ThemeContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStatCard from '@/components/profile/ProfileStatCard';
import ProfileScreenHeader from '@/components/profile/ProfileScreenHeader';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  danger?: boolean;
  isDark: boolean;
  showChevron?: boolean;
  rawIcon?: boolean;
}

function MenuItem({ icon, label, onPress, danger, isDark, showChevron = true, rawIcon = false }: MenuItemProps) {
  const textColor = danger
    ? '#FF6B6B'
    : isDark ? '#FFFFFF' : Colors.light.textPrimary;

  const iconBg = danger
    ? 'rgba(255,107,107,0.15)'
    : isDark ? 'rgba(249, 244, 102, 0.17)' : Colors.light.accentLight;

  const iconAccent = danger
    ? '#FF6B6B'
    : isDark ? '#FFFFFF' : Colors.light.accent;

  return (
    <Pressable
      className="flex-row items-center gap-3 px-4 py-[14px] active:opacity-70"
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {rawIcon ? (
        icon
      ) : (
        <View
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, { color: iconAccent })
            : icon}
        </View>
      )}
      <Text
        className="font-sans text-[15px] flex-1"
        style={{ color: textColor }}
      >
        {label}
      </Text>
      {showChevron && !danger && (
        <ChevronRight
          size={16}
          color={isDark ? 'rgba(255,255,255,0.4)' : Colors.light.textMuted}
        />
      )}
    </Pressable>
  );
}

function SectionLabel({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <Text
      className="font-semibold text-xs px-4 pt-5 pb-2 tracking-widest"
      style={{ color: isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted }}
    >
      {label}
    </Text>
  );
}

export default function ProfileScreen() {
  const { user: authUser, logout } = useAuth();
  const { user: dbUser, loading, refetch } = useCurrentUser(authUser?.id ?? null);
  const { investments, refetch: refetchInvestments } = useUserInvestments(authUser?.id ?? null);
  const user = dbUser ?? authUser ?? null;
  const { reports, refetch: refetchReports } = useUserReports(user?.id);
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(!user);
  const [refreshing,  setRefreshing]  = useState(false);
  const [showAllInvestments, setShowAllInvestments] = useState(false);
  const [removedCompanyVisible, setRemovedCompanyVisible] = useState(false);

  const handleInvestmentPress = useCallback((companyId: string | null) => {
    if (companyId) {
      router.push(`/company/${companyId}`);
    } else {
      // La empresa fue eliminada (company_id quedó en null por la FK).
      setRemovedCompanyVisible(true);
    }
  }, [router]);

  // Agrupamos las inversiones por empresa (suma de gemas + cantidad de veces).
  const investmentsByCompany = useMemo(() => {
    const map = new Map<string, { companyId: string | null; companyName: string; gems: number; count: number }>();
    for (const inv of investments) {
      const key = inv.companyId ?? inv.companyName;
      const cur = map.get(key) ?? { companyId: inv.companyId, companyName: inv.companyName, gems: 0, count: 0 };
      cur.gems += inv.gems;
      cur.count += 1;
      map.set(key, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.gems - a.gems);
  }, [investments]);
  const totalInvested = useMemo(() => investments.reduce((s, i) => s + i.gems, 0), [investments]);

  useEffect(() => {
    if (user) setInitialLoad(false);
  }, [user]);

  // Refresca al volver de otra pantalla (ej: edit-profile).
  // El ref evita el double-fetch en el mount inicial,
  // ya que useCurrentUser ya hace su propio fetch al montar.
  const hasMounted = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }
      refetch();
      refetchInvestments();
      refetchReports();
    }, [refetch, refetchInvestments, refetchReports])
  );

  // IMPORTANTE: todos los hooks deben ir ANTES de cualquier return temprano.
  // Si onRefresh (useCallback) queda debajo del return de loading, en el primer
  // render no se ejecuta y luego sí → "Rendered more hooks than during the
  // previous render" → crash nativo al abrir Perfil.
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await Promise.all([refetch(), refetchInvestments(), refetchReports()]); } finally { setRefreshing(false); }
  }, [refetch, refetchInvestments, refetchReports]);

  if (initialLoad || !user) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}
      >
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  const screenBg   = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg     = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const divider    = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const iconColor  = isDark ? Colors.gold[400] : Colors.light.accent;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: screenBg }} edges={['top']}>

      <ProfileScreenHeader onEdit={() => router.push('/edit-profile' as any)} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? Colors.gold[400] : Colors.light.accent}
            colors={[isDark ? Colors.gold[400] : Colors.light.accent]}
          />
        }
      >
        {/* Avatar + nombre + badge */}
        <ProfileHeader user={user} isDark={isDark} />

        {/* Stats */}
        <ProfileStatCard
          isDark={isDark}
          className="mt-2"
          stats={[
            { label: 'GEMAS',   value: user.gems.toLocaleString(),         accent: Colors.gold[500] },
            { label: 'MÓDULOS', value: String(user.completedModules),     accent: isDark ? '#FFFFFF' : Colors.light.textPrimary },
            { label: 'RACHA',   value: String(user.streak),               accent: Colors.warning },
          ]}
        />

        {/* MIS INVERSIONES */}
        <SectionLabel label="MIS INVERSIONES" isDark={isDark} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
        >
          {investmentsByCompany.length === 0 ? (
            <View className="px-4 py-5 items-center gap-1">
              <TrendingUp size={22} color={isDark ? 'rgba(255,255,255,0.4)' : Colors.light.textMuted} />
              <Text className="text-[13px] text-center" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : Colors.light.textMuted }}>
                Aún no invertiste en ninguna empresa
              </Text>
            </View>
          ) : (
            <>
              {/* Total invertido */}
              <View className="flex-row items-center justify-between px-4 py-[14px]">
                <Text className="font-sans text-[15px]" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>
                  Total invertido
                </Text>
                <View className="flex-row items-center gap-1">
                  <Gem size={15} color={Colors.gold[500]} />
                  <Text className="font-bold text-[15px]" style={{ color: Colors.gold[500] }}>
                    {totalInvested.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View className="h-px mx-4" style={{ backgroundColor: divider }} />

              {/* Por empresa (capado con "Ver todas" para no crecer infinito) */}
              {(showAllInvestments ? investmentsByCompany : investmentsByCompany.slice(0, INVEST_PREVIEW)).map((inv, i) => (
                <View key={(inv.companyId ?? inv.companyName) + i}>
                  {i > 0 && <View className="h-px mx-4" style={{ backgroundColor: divider }} />}
                  <Pressable
                    onPress={() => handleInvestmentPress(inv.companyId)}
                    className="flex-row items-center gap-3 px-4 py-[13px] active:opacity-70"
                    accessibilityRole="button"
                    accessibilityLabel={`Ver empresa ${inv.companyName}`}
                  >
                    <View
                      className="w-9 h-9 rounded-xl items-center justify-center"
                      style={{ backgroundColor: isDark ? 'rgba(249, 244, 102, 0.17)' : Colors.light.accentLight }}
                    >
                      <TrendingUp size={16} color={iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-sans text-[15px]" numberOfLines={1} style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>
                        {inv.companyName}
                      </Text>
                      {inv.count > 1 && (
                        <Text className="text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : Colors.light.textMuted }}>
                          {inv.count} inversiones
                        </Text>
                      )}
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Gem size={13} color={Colors.gold[500]} />
                      <Text className="font-bold text-[14px]" style={{ color: Colors.gold[500] }}>
                        {inv.gems.toLocaleString()}
                      </Text>
                    </View>
                    <ChevronRight size={15} color={isDark ? 'rgba(255,255,255,0.4)' : Colors.light.textMuted} />
                  </Pressable>
                </View>
              ))}

              {/* Toggle Ver todas / Ver menos */}
              {investmentsByCompany.length > INVEST_PREVIEW && (
                <>
                  <View className="h-px mx-4" style={{ backgroundColor: divider }} />
                  <Pressable
                    onPress={() => setShowAllInvestments((v) => !v)}
                    className="items-center py-[13px] active:opacity-70"
                    accessibilityRole="button"
                  >
                    <Text className="font-semibold text-[13px]" style={{ color: iconColor }}>
                      {showAllInvestments ? 'Ver menos' : `Ver todas (${investmentsByCompany.length})`}
                    </Text>
                  </Pressable>
                </>
              )}
            </>
          )}
        </View>

        {/* MIS REPORTES */}
        <SectionLabel label="MIS REPORTES" isDark={isDark} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
        >
          {reports.length === 0 ? (
            <View className="px-4 py-5 items-center gap-1">
              <FileText size={22} color={isDark ? 'rgba(255,255,255,0.4)' : Colors.light.textMuted} />
              <Text className="text-[13px] text-center" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : Colors.light.textMuted }}>
                Aún no tienes reportes generados
              </Text>
            </View>
          ) : (
            reports.map((report, i) => (
              <View key={report.id}>
                {i > 0 && <View className="h-px mx-4" style={{ backgroundColor: divider }} />}
                <Pressable
                  onPress={() => Linking.openURL(report.pdfUrl)}
                  className="flex-row items-center gap-3 px-4 py-[13px] active:opacity-70"
                  accessibilityRole="button"
                  accessibilityLabel={`Descargar reporte de ${report.companyName}`}
                >
                  <View
                    className="w-9 h-9 rounded-xl items-center justify-center"
                    style={{ backgroundColor: isDark ? 'rgba(249, 244, 102, 0.17)' : Colors.light.accentLight }}
                  >
                    <FileText size={16} color={iconColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans text-[15px]" numberOfLines={1} style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>
                      {report.companyName}
                    </Text>
                    <Text className="text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : Colors.light.textMuted }}>
                      {report.reportDate}
                    </Text>
                  </View>
                  <Download size={16} color={Colors.gold[500]} />
                </Pressable>
              </View>
            ))
          )}
        </View>

        {/* MI CUENTA */}
        <SectionLabel label="MI CUENTA" isDark={isDark} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
        >
          {user.role === 'admin' && (
            <>
              <MenuItem
                isDark={isDark}
                icon={<Shield size={16} color={iconColor} />}
                label="Panel de Administrador"
                onPress={() => router.push('/admin')}
              />
              <View className="h-px mx-4" style={{ backgroundColor: divider }} />
            </>
          )}
          <MenuItem
            isDark={isDark}
            icon={<User size={16} color={iconColor} />}
            label="Información personal"
            onPress={() => router.push('/personal-info' as any)}
          />
        </View>

        {/* PREFERENCIAS */}
        <SectionLabel label="PREFERENCIAS" isDark={isDark} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
        >
          {/* Community */}
          <MenuItem
            isDark={isDark}
            icon={<Users size={16} color={iconColor} />}
            label="Comunidad"
            onPress={() => router.push('/(tabs)/community')}
          />
          <View className="h-px mx-4" style={{ backgroundColor: divider }} />
          {/* Progreso */}
          <MenuItem
            isDark={isDark}
            icon={<BarChart2 size={16} color={iconColor} />}
            label="Mi Progreso"
            onPress={() => router.push('/(tabs)/progress')}
          />
          <View className="h-px mx-4" style={{ backgroundColor: divider }} />

          {/* Tema */}
          <Pressable
            className="flex-row items-center gap-3 px-4 py-[14px] active:opacity-70"
            onPress={toggleTheme}
            accessible
            accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            accessibilityRole="button"
          >
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{ backgroundColor: isDark ? 'rgba(255,215,64,0.12)' : Colors.light.accentLight }}
            >
              {isDark
                ? <Sun size={16} color={Colors.gold[400]} />
                : <Moon size={16} color={Colors.light.accent} />
              }
            </View>
            <Text
              className="font-sans text-[15px] flex-1"
              style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}
            >
              Tema
            </Text>
            <Text
              className="text-[13px]"
              style={{ color: isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted }}
            >
              {isDark ? 'Oscuro' : 'Claro'}
            </Text>
          </Pressable>
        </View>

        {/* ACERCA DE */}
        <SectionLabel label="ACERCA DE" isDark={isDark} />
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
        >
          <MenuItem
            isDark={isDark}
            rawIcon
            icon={
              <View
                className="w-9 h-9 rounded-full items-center justify-center overflow-hidden"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <Image
                  source={IMAGES.BUHO}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </View>
            }
            label="Conocer más sobre BigDreamerss"
            onPress={() => Linking.openURL('https://bigdreamerss.com/')}
          />
        </View>

        {/* CERRAR SESIÓN */}
        <View className="mx-4 mt-3 mb-2">
          <Pressable
            className="flex-row items-center gap-3 px-4 py-[15px] rounded-2xl active:opacity-70"
            onPress={handleLogout}  
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.errorBg,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,107,107,0.20)' : 'rgba(220,38,38,0.12)',
            }}
            accessible
            accessibilityLabel="Cerrar sesión"
            accessibilityRole="button"
          >
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{ backgroundColor: isDark ? 'rgba(255,107,107,0.12)' : 'rgba(220,38,38,0.1)' }}
            >
              <LogOut size={16} color="#FF6B6B" />
            </View>
            <Text
              className="font-semibold text-[15px] flex-1"
              style={{ color: '#FF6B6B' }}
            >
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal: empresa eliminada */}
      <Modal
        transparent
        animationType="fade"
        visible={removedCompanyVisible}
        onRequestClose={() => setRemovedCompanyVisible(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onPress={() => setRemovedCompanyVisible(false)}
        >
          <Pressable
            className="w-full rounded-3xl p-6 items-center"
            style={{ backgroundColor: isDark ? Colors.navy[700] : '#FFFFFF' }}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: isDark ? 'rgba(255,107,107,0.15)' : Colors.light.errorBg }}
            >
              <MapPinOff size={30} color="#FF6B6B" />
            </View>
            <Text
              className="text-lg font-extrabold text-center"
              style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}
            >
              Empresa sacada del mapa
            </Text>
            <Text
              className="text-sm text-center mt-2 leading-5"
              style={{ color: isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textMuted }}
            >
              Esta empresa fue removida. Contáctate con el centro de soporte de BigDreamerss.
            </Text>

            <Pressable
              onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
              className="flex-row items-center gap-2 mt-4 px-4 py-2.5 rounded-xl active:opacity-70"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.accentLight }}
            >
              <Mail size={15} color={isDark ? Colors.gold[400] : Colors.light.accent} />
              <Text className="font-semibold text-[13px]" style={{ color: isDark ? Colors.gold[400] : Colors.light.accent }}>
                {SUPPORT_EMAIL}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setRemovedCompanyVisible(false)}
              className="mt-4 px-6 py-2.5 rounded-xl active:opacity-70"
              style={{ backgroundColor: isDark ? Colors.gold[400] : Colors.light.accent }}
            >
              <Text className="font-bold text-[14px]" style={{ color: isDark ? '#000' : '#fff' }}>
                Entendido
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}