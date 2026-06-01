export interface DiaryEntry {
  id: string;
  timestamp: string;
  mood: string; // emoji or key representation
  moodLevel: number; // 1-5 scale of mood/clarity
  mealRecall: string; // What did you eat today?
  socialRecall: string; // Who did you talk to and about what?
  activityRecall: string; // What did you do this morning?
  positiveRecall: string; // 3 positive things today
  generalNotes: string; // Additional free text
  memoryScore?: number; // Optional cognitive score from daily games
}

export interface DocumentationSection {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  content: {
    subtitle: string;
    paragraphs: string[];
    tips: string[];
    warnings?: string[];
  }[];
}

export interface PresetTheme {
  name: string;
  gradient1: string;
  gradient2: string;
  bgGlow: string;
  glowClass: string;
}

export type PresetKey = 'dusk' | 'forest' | 'solar' | 'cosmic';
