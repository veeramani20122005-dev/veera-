export type ReadingMode = 'single' | 'double' | 'webtoon' | 'guided';
export type PaperTheme = 'white' | 'vintage' | 'dark' | 'neon';

export interface SpeechBubble {
  id: string;
  speaker: string;
  roleTag?: string;
  text: string;
  style: 'speech' | 'shout' | 'whisper' | 'radio' | 'narrator' | 'thought';
  position?: { x: number; y: number }; // percentage from top-left (0-100)
}

export interface SfxSticker {
  id: string;
  text: string;
  color?: string;
  position?: { x: number; y: number };
  rotation?: number;
}

export interface StatusBanner {
  title?: string;
  alive?: string;
  kills?: string;
  killFeed?: string;
  alert?: string;
}

export interface ComicPanel {
  id: string;
  panelNumber: number;
  title: string;
  caption?: string;
  narratorNotes?: string;
  statusBanner?: StatusBanner;
  characters: string[];
  speechBubbles: SpeechBubble[];
  sfxStickers?: SfxSticker[];
  highlightColor?: string;
}

export interface ComicPage {
  id: string;
  pageNumber: number;
  title: string;
  subtitle?: string;
  imageSrc: string;
  panels: ComicPanel[];
  pageNarrative?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  coverImage: string;
  synopsis: string;
  badge?: string;
  readingTime: string;
  pages: ComicPage[];
  isCustom?: boolean;
  createdAt?: string;
}

export interface SquadMember {
  id: string;
  name: string;
  role: string;
  tag: string;
  color: string;
  accentBg: string;
  quote: string;
  description: string;
  specialty: string;
}
