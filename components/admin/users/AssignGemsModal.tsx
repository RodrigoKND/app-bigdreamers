import { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { Gem, Check } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { User } from '@/types';
import { Company } from '@/constants/mockCompanies';

interface AssignGemsModalProps {
  visible: boolean;
  user: User | null;
  companies: Company[];
  onConfirm: (params: { gems: number; companyId?: string; companyName?: string }) => void;
  onCancel: () => void;
  isDark: boolean;
}

const AssignGemsModal = ({ visible, user, companies, onConfirm, onCancel, isDark }: AssignGemsModalProps) => {
  const [gems, setGems] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setGems('');
      setSelectedCompanyId(null);
    }
  }, [visible]);

  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;

  const inputStyle = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
    color: textPrimary,
  };

  const gemsValue = parseInt(gems, 10);
  const canConfirm = !isNaN(gemsValue) && gemsValue > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    const company = companies.find((c) => c.id === selectedCompanyId);
    onConfirm({
      gems: gemsValue,
      companyId: company?.id,
      companyName: company?.name,
    });
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', paddingHorizontal: 24 }}>
        <View
          style={{
            backgroundColor: isDark ? Colors.navy?.[700] ?? '#1E3A5F' : '#fff',
            borderRadius: 24,
            padding: 28,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Gem size={44} color={Colors.gold[400]} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: textPrimary, textAlign: 'center' }}>
            Asignar gemas
          </Text>
          <Text style={{ marginTop: 8, fontSize: 15, fontWeight: '700', color: Colors.gold[400], textAlign: 'center' }}>
            {user?.name ?? ''}
          </Text>

          <Text style={{ marginTop: 18, fontSize: 12, fontWeight: '700', color: textMuted }}>
            CANTIDAD DE GEMAS
          </Text>
          <TextInput
            placeholder="Ej: 500"
            placeholderTextColor={textMuted}
            value={gems}
            onChangeText={(t) => setGems(t.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            className="rounded-xl border px-4 py-3.5 text-[16px] mt-2"
            style={inputStyle}
          />

          <Text style={{ marginTop: 18, fontSize: 12, fontWeight: '700', color: textMuted }}>
            EMPRESA (OPCIONAL)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2" style={{ flexGrow: 0 }}>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setSelectedCompanyId(null)}
                className="flex-row items-center px-3 py-2 rounded-full"
                style={{
                  backgroundColor: selectedCompanyId === null ? Colors.gold[400] : (isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9'),
                }}
              >
                <Text className="text-xs font-bold" style={{ color: selectedCompanyId === null ? '#000' : textMuted }}>
                  Ninguna
                </Text>
              </Pressable>
              {companies.map((c) => {
                const isSelected = selectedCompanyId === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setSelectedCompanyId(c.id)}
                    className="flex-row items-center px-3 py-2 rounded-full"
                    style={{
                      backgroundColor: isSelected ? Colors.gold[400] : (isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9'),
                    }}
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

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
            <Pressable
              onPress={onCancel}
              style={{ flex: 1, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, alignItems: 'center' }}
            >
              <Text style={{ color: textMuted }}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              disabled={!canConfirm}
              style={{
                flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center',
                flexDirection: 'row', justifyContent: 'center',
                backgroundColor: canConfirm ? Colors.gold[400] : 'rgba(255,255,255,0.08)',
                opacity: canConfirm ? 1 : 0.6,
              }}
            >
              <Check size={16} color={canConfirm ? '#000' : textMuted} />
              <Text style={{ color: canConfirm ? '#000' : textMuted, fontWeight: '800', marginLeft: 6 }}>Asignar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AssignGemsModal;
