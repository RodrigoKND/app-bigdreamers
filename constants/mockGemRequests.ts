export interface GemRequest {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  gems: number;
  bsPrice: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}


