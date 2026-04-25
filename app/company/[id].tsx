import CompanyDetail from '@/components/CompanyDetail/CompanyDetail';
import { useLocalSearchParams } from 'expo-router';

export default function CompanyRoute() {
  const { id } = useLocalSearchParams();

  return <CompanyDetail companyId={id.toString()} />;
}