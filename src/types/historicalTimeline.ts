export type TimelineCategory = 'invention' | 'unrest' | 'reaction' | 'policy' | 'economic';

export interface TimelineEventQuote {
  text: string;
  author: string;
  source?: string;
  year?: string;
}

export interface HistoricalTimelineEvent {
  id: string;
  year: number;
  exactDate: string;
  title: string;
  era: 1 | 2 | 3 | 4;
  eraName: string;
  category: TimelineCategory;
  location: string;
  headline: string;
  description: string;
  keyFigures: string[];
  displacedOrAffectedSkills: string[];
  laborSkillImpact: string;
  primarySourceQuote?: TimelineEventQuote;
  significanceScore: number; // 1 to 5 for visual hierarchy
}

export interface CategoryFilterOption {
  key: TimelineCategory | 'all';
  label: string;
  iconName: string;
  color: string;
  count?: number;
}
