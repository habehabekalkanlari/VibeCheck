export type MusicService = 'spotify' | 'apple-music';

export type VibeGenre = 
  | 'indie' 
  | 'techno' 
  | 'lofi' 
  | 'rock' 
  | 'hiphop' 
  | 'rnb' 
  | 'ambient' 
  | 'pop';

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  durationSec: number;
  bpm: number;
  genre: VibeGenre;
  service: MusicService;
  vibeColor: string; // Hex or gradient
  previewSynthPreset: 'indie' | 'techno' | 'lofi' | 'rock' | 'synthwave';
}

export interface VibeSphere {
  id: string;
  user: {
    id: string;
    name: string;
    handle: string;
    isAnonymous: boolean;
    avatarUrl?: string;
  };
  song: SongTrack;
  moodTags: [string, string, string]; // exactly 3 words as requested
  note?: string;
  location: {
    name: string;
    neighborhood: string;
    city: string;
    lat: number;
    lng: number;
    distanceMeters: number;
  };
  createdAt: number; // timestamp
  expiresAt: number; // timestamp (e.g. 2 hours after creation)
  energyLevel: number; // 1 to 5
  resonanceScore?: number; // Calculated match percentage 0-100%
  activeListenersCount: number;
  hasActiveFlashChat?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSelf: boolean;
  type?: 'text' | 'lyric' | 'sync_invite' | 'reaction';
  reactionEmoji?: string;
}

export interface FlashChatRoom {
  id: string;
  sphereId: string;
  sphere: VibeSphere;
  expiresAt: number;
  messages: ChatMessage[];
  isListeningTogether: boolean;
}

export interface MoodBreakdown {
  label: string;
  percent: number;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  isAnonymousDefault: boolean;
  connectedService: MusicService;
  currentSong: SongTrack;
  stats: {
    totalSpheresDropped: number;
    flashChatsStarted: number;
    topVibeGenre: string;
    currentFrequencyScore: number;
  };
  recentMoodBreakdown: MoodBreakdown[];
}

export type PlatformOS = 'ios' | 'android' | 'responsive';
