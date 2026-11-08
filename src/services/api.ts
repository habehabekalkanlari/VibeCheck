import { VibeSphere, UserProfile, SongTrack } from '../types/vibe';

const BASE = '/api';

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function fetchSpheres(): Promise<VibeSphere[]> {
  const data = await request<{ spheres: VibeSphere[]; count: number }>('/spheres');
  return data.spheres;
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  return request<UserProfile>('/user/me');
}

export async function fetchSongs(): Promise<SongTrack[]> {
  const data = await request<{ songs: SongTrack[] }>('/songs');
  return data.songs;
}

export async function dropSphere(payload: {
  songId: string;
  moodTags: string[];
  note: string;
  locationName: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  energyLevel: number;
}): Promise<VibeSphere> {
  return request<VibeSphere>('/spheres', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
