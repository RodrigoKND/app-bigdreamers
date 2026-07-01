import ModuleDetail from '@/components/learn/ModuleDetail';
import { useLocalSearchParams } from 'expo-router';

export default function ModuleRoute() {
  const { id } = useLocalSearchParams();

  return <ModuleDetail moduleId={id?.toString() ?? ''} />;
}
