import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Check, Search } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { Company } from '@/constants/mockCompanies';
import { User } from '@/types';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

interface ReportFormValues {
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
}

interface ReportFormProps {
  companies: Company[];
  users: User[];
  onSubmit: (values: ReportFormValues) => void;
  onCancel: () => void;
  submitting: boolean;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const ReportForm = ({ companies, users, onSubmit, onCancel, submitting }: ReportFormProps) => {
  const { isDark } = useTheme();

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [investorName, setInvestorName] = useState('');
  const [reportDate, setReportDate] = useState(todayIso());
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [updatedCapital, setUpdatedCapital] = useState('');
  const [updatedProfit, setUpdatedProfit] = useState('');
  const [nextMonthCapital, setNextMonthCapital] = useState('');
  const [observations, setObservations] = useState('');

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const inputStyle = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
    borderColor: isDark ? 'rgba(255,255,255,0)' : '#E2E8F0',
    color: textPrimary,
  };

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users.slice(0, 8);
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [users, userQuery]);

  const selectUser = (u: User) => {
    setSelectedUser(u);
    setUserQuery(u.name);
    if (!investorName.trim()) setInvestorName(u.name);
  };

  const selectedCompany = companies.find((c) => c.id === companyId) ?? null;

  const toNumber = (v: string) => {
    const n = parseFloat(v.replace(',', '.'));
    return isNaN(n) ? undefined : n;
  };

  const investmentAmountNum = toNumber(investmentAmount);
  const interestRateNum = toNumber(interestRate);
  const updatedCapitalNum = toNumber(updatedCapital);
  const updatedProfitNum = toNumber(updatedProfit);
  const nextMonthCapitalNum = nextMonthCapital.trim() ? toNumber(nextMonthCapital) : undefined;

  const canSubmit =
    !!selectedUser &&
    !!selectedCompany &&
    investorName.trim().length > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(reportDate) &&
    investmentAmountNum !== undefined &&
    interestRateNum !== undefined &&
    updatedCapitalNum !== undefined &&
    updatedProfitNum !== undefined;

  const handleSubmit = () => {
    if (!canSubmit || !selectedUser || !selectedCompany) return;

    onSubmit({
      userId: selectedUser.id,
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      investorName: investorName.trim(),
      reportDate,
      investmentAmount: investmentAmountNum!,
      interestRate: interestRateNum!,
      updatedCapital: updatedCapitalNum!,
      updatedProfit: updatedProfitNum!,
      nextMonthCapital: nextMonthCapitalNum,
      observations: observations.trim() || undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mb-6 pt-2">
          <ButtonBackScreen />
          <Text
            className="flex-1 text-center text-2xl font-bold mr-8"
            style={{ color: isDark ? '#FFFFFF' : Colors.text.primary }}
          >
            Nuevo Reporte
          </Text>
        </View>
        <View className="w-8 h-[3px] rounded-sm mb-5 -mt-3" style={{ backgroundColor: Colors.gold[400] }} />

        <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>EMPRESA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 18 }}>
          <View className="flex-row gap-2">
            {companies.map((c) => {
              const isSelected = companyId === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCompanyId(c.id)}
                  className="flex-row items-center px-3 py-2 rounded-full"
                  style={{ backgroundColor: isSelected ? Colors.gold[400] : (isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9') }}
                >
                  {isSelected && <Check size={12} color="#000" style={{ marginRight: 4 }} />}
                  <Text className="text-xs font-bold" style={{ color: isSelected ? '#000' : textMuted }} numberOfLines={1}>
                    {c.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>INVERSIONISTA (BUSCAR USUARIO)</Text>
        <View className="flex-row items-center rounded-xl border px-3 mb-2" style={inputStyle}>
          <Search size={16} color={textMuted} />
          <TextInput
            placeholder="Buscar por nombre o correo"
            placeholderTextColor={textMuted}
            value={userQuery}
            onChangeText={(t) => { setUserQuery(t); setSelectedUser(null); }}
            className="flex-1 py-3.5 px-2 text-[15px]"
            style={{ color: textPrimary }}
          />
        </View>
        {!selectedUser && userQuery.trim().length > 0 && (
          <View className="rounded-xl border mb-4 overflow-hidden" style={{ borderColor: inputStyle.borderColor }}>
            {filteredUsers.length === 0 ? (
              <Text className="px-4 py-3 text-sm" style={{ color: textMuted }}>Sin resultados</Text>
            ) : filteredUsers.map((u) => (
              <Pressable
                key={u.id}
                onPress={() => selectUser(u)}
                className="px-4 py-3 border-b"
                style={{ borderColor: inputStyle.borderColor }}
              >
                <Text style={{ color: textPrimary, fontWeight: '600' }}>{u.name}</Text>
                <Text style={{ color: textMuted, fontSize: 12 }}>{u.email}</Text>
              </Pressable>
            ))}
          </View>
        )}
        {selectedUser && (
          <View className="flex-row items-center mb-4">
            <Check size={14} color="#4ADE80" />
            <Text style={{ color: '#4ADE80', marginLeft: 6, fontSize: 13, fontWeight: '600' }}>
              Usuario seleccionado: {selectedUser.name}
            </Text>
          </View>
        )}

        <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>NOMBRE DEL INVERSIONISTA (para el PDF)</Text>
        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor={textMuted}
          value={investorName}
          onChangeText={setInvestorName}
          className="rounded-xl border px-4 py-3.5 text-[15px] mb-4"
          style={inputStyle}
        />

        <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>FECHA (AAAA-MM-DD)</Text>
        <TextInput
          placeholder={todayIso()}
          placeholderTextColor={textMuted}
          value={reportDate}
          onChangeText={setReportDate}
          className="rounded-xl border px-4 py-3.5 text-[15px] mb-4"
          style={inputStyle}
        />

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>MONTO DE INVERSIÓN (Bs)</Text>
            <TextInput
              placeholder="14000"
              placeholderTextColor={textMuted}
              value={investmentAmount}
              onChangeText={setInvestmentAmount}
              keyboardType="decimal-pad"
              className="rounded-xl border px-4 py-3.5 text-[15px]"
              style={inputStyle}
            />
          </View>
          <View className="flex-1">
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>INTERÉS COMPUESTO (%)</Text>
            <TextInput
              placeholder="2.5"
              placeholderTextColor={textMuted}
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="decimal-pad"
              className="rounded-xl border px-4 py-3.5 text-[15px]"
              style={inputStyle}
            />
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>CAPITAL ACTUALIZADO (Bs)</Text>
            <TextInput
              placeholder="17921"
              placeholderTextColor={textMuted}
              value={updatedCapital}
              onChangeText={setUpdatedCapital}
              keyboardType="decimal-pad"
              className="rounded-xl border px-4 py-3.5 text-[15px]"
              style={inputStyle}
            />
          </View>
          <View className="flex-1">
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>GANANCIA ACTUALIZADA (Bs)</Text>
            <TextInput
              placeholder="448"
              placeholderTextColor={textMuted}
              value={updatedProfit}
              onChangeText={setUpdatedProfit}
              keyboardType="decimal-pad"
              className="rounded-xl border px-4 py-3.5 text-[15px]"
              style={inputStyle}
            />
          </View>
        </View>

        <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>CAPITAL PARA EL SIGUIENTE MES (Bs, opcional)</Text>
        <TextInput
          placeholder="18369"
          placeholderTextColor={textMuted}
          value={nextMonthCapital}
          onChangeText={setNextMonthCapital}
          keyboardType="decimal-pad"
          className="rounded-xl border px-4 py-3.5 text-[15px] mb-4"
          style={inputStyle}
        />

        <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8 }}>OBSERVACIONES (una por línea, opcional)</Text>
        <TextInput
          placeholder={'formato interés compuesto\ncapital a tomar en cuenta...'}
          placeholderTextColor={textMuted}
          value={observations}
          onChangeText={setObservations}
          multiline
          numberOfLines={4}
          className="rounded-xl border px-4 py-3.5 text-[15px] mb-6"
          style={[inputStyle, { textAlignVertical: 'top', minHeight: 100 }]}
        />

        <View className="flex-row gap-3">
          <Pressable
            onPress={onCancel}
            className="flex-1 rounded-2xl py-4 items-center border"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }}
          >
            <Text style={{ color: textMuted, fontWeight: '700' }}>Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit || submitting}
            className="flex-1 rounded-2xl py-4 items-center"
            style={{ backgroundColor: Colors.gold[400], opacity: canSubmit && !submitting ? 1 : 0.5 }}
          >
            <Text style={{ color: '#000', fontWeight: '800' }}>
              {submitting ? 'Generando...' : 'Generar PDF'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ReportForm;
export type { ReportFormValues };
