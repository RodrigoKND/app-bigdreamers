export type Level = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: Level;
  gems: number;
  gemsToNextLevel: number;
  joinedAt: string;
  streak: number;
  completedModules: number;
  communityRank: number;
  totalGemsEarned: number;
}

export interface CommunityMember {
  id: string;
  name: string;
  level: Level;
  gems: number;
  avatar?: string;
  rank: number;
  streak: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  gemsReward: number;
  completed: boolean;
  completedAt?: string;
  category: 'learning' | 'community' | 'streak' | 'level';
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  gemsReward: number;
  completed: boolean;
  progress: number;
  thumbnail: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Activity {
  id: string;
  memberId: string;
  memberName: string;
  type: 'milestone' | 'level_up' | 'module_completed' | 'streak';
  description: string;
  gemsEarned: number;
  timestamp: string;
}

export interface LevelConfig {
  level: Level;
  label: string;
  minGems: number;
  maxGems: number;
  color: string;
  bgColor: string;
  nextLevel?: Level;
}
