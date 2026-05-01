export interface GemPackage {
  id: string;
  gems: number;
  bsPrice: number;
  label: string;
  popular: boolean;
}

export const GEM_PACKAGES: GemPackage[] = [
  { id: '1', gems: 500,  bsPrice: 50,  label: 'Inicio',  popular: false },
  { id: '2', gems: 1200, bsPrice: 110, label: 'Popular', popular: true  },
  { id: '3', gems: 2500, bsPrice: 200, label: 'Pro',     popular: false },
  { id: '4', gems: 5000, bsPrice: 350, label: 'Elite',   popular: false },
];
