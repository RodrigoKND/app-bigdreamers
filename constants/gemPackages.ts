export interface GemPackage {
  id: string;
  gems: number;
  bsPrice: number;
  label: string;
  popular: boolean;
}

export const GEM_PACKAGES: GemPackage[] = [
  { id: 'a0000000-0000-0000-0000-000000000001', gems: 300,  bsPrice: 29,  label: 'Initial',  popular: false },
  { id: 'a0000000-0000-0000-0000-000000000002', gems: 800,  bsPrice: 69,  label: 'Plus',     popular: true  },
  { id: 'a0000000-0000-0000-0000-000000000003', gems: 2000, bsPrice: 139, label: 'Pro',      popular: false },
  { id: 'a0000000-0000-0000-0000-000000000004', gems: 5000, bsPrice: 299, label: 'VIP',      popular: false },
];
