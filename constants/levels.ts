import { LevelConfig } from '@/types';
import { Colors } from './colors';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 'bronze',
    label: 'Bronce',
    minGems: 0,
    maxGems: 999,
    color: Colors.levels.bronze,
    bgColor: Colors.levels.bronzeBg,
    nextLevel: 'silver',
  },
  {
    level: 'silver',
    label: 'Plata',
    minGems: 1000,
    maxGems: 4999,
    color: Colors.levels.silver,
    bgColor: Colors.levels.silverBg,
    nextLevel: 'gold',
  },
  {
    level: 'gold',
    label: 'Oro',
    minGems: 5000,
    maxGems: 14999,
    color: Colors.levels.gold,
    bgColor: Colors.levels.goldBg,
    nextLevel: 'diamond',
  },
  {
    level: 'diamond',
    label: 'Diamante',
    minGems: 15000,
    maxGems: Infinity,
    color: Colors.levels.diamond,
    bgColor: Colors.levels.diamondBg,
  },
];

export function getLevelConfig(level: string): LevelConfig {
  return LEVEL_CONFIGS.find((l) => l.level === level) ?? LEVEL_CONFIGS[0];
}

export function getLevelProgress(gems: number, level: string): number {
  const config = getLevelConfig(level);
  if (config.maxGems === Infinity) return 100;
  const range = config.maxGems - config.minGems;
  const earned = gems - config.minGems;
  return Math.min(Math.round((earned / range) * 100), 100);
}

export function getGemsToNextLevel(gems: number, level: string): number {
  const config = getLevelConfig(level);
  if (config.maxGems === Infinity) return 0;
  return config.maxGems + 1 - gems;
}
