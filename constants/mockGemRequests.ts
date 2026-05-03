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

export const MOCK_GEM_REQUESTS: GemRequest[] = [
  {
    id: 'req-001',
    userId: 'user-01',
    userName: 'Carlos Mamani',
    packageId: '2',
    gems: 1200,
    bsPrice: 110,
    status: 'pending',
    date: '2025-05-01',
  },
  {
    id: 'req-002',
    userId: 'user-02',
    userName: 'Ana Flores',
    packageId: '1',
    gems: 500,
    bsPrice: 50,
    status: 'pending',
    date: '2025-05-01',
  },
  {
    id: 'req-003',
    userId: 'user-03',
    userName: 'Roberto Quispe',
    packageId: '3',
    gems: 2500,
    bsPrice: 200,
    status: 'approved',
    date: '2025-04-30',
  },
];
