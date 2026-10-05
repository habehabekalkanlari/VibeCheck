import React, { useState } from 'react';
import { SongTrack, VibeSphere, MusicService } from '../types/vibe';
import { SAMPLE_SONGS } from '../data/mockVibes';
import { audioSynth } from '../services/audioSynth';
import { X, Sparkles, MapPin, Music, Radio, Shield, User, Clock, Check } from 'lucide-react';

interface DropSphereModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDropSphere: (newSphere: VibeSphere) => void;
  currentSong: SongTrack;
}

const PRESET_TAG_COMBOS = [
  ['melankolik', 'yağmur', 'kahve'],
  ['enerjik', 'techno', 'gece'],
  ['lofi', 'finaller', 'odak'],
  ['nostalji', 'rüzgar', 'anadolu'],
  ['dans', 'bas', 'neon'],
  ['huzur', 'deniz', 'kulaklık'],
];

export const DropSphereModal: React.FC<DropSphereModalProps> = ({
  isOpen,
  onClose,
  onDropSphere,
  currentSong,
}) => {
  const [selectedSong, setSelectedSong] = useState<SongTrack>(currentSong);
  const [tag1, setTag1] = useState('melankolik');
  const [tag2, setTag2] = useState('rüzgar');
  const [tag3, setTag3] = useState('anadolu');
  const [note, setNote] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [durationHours, setDurationHours] = useState(2);
  const [locationName, setLocationName] = useState('Moda Sahili, Kadıköy');
  const [connectedService, setConnectedService] = useState<MusicService>('spotify');
  const [showSongPicker, setShowSongPicker] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioSynth.playDropSphereChime();

    const now = Date.now();
    const newSphere: VibeSphere = {
      id: `sphere-${Date.now()}`,
      user: {
        id: isAnonymous ? `u-anon-${Date.now()}` : 'usr-self',
        name: isAnonymous ? 'Gizemli Dinleyici' : 'Kaan Demir',
        handle: isAnonymous ? '@anon_frekans' : '@kaan_vibes',
        isAnonymous,
        avatarUrl: isAnonymous ? undefined : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      },
      song: selectedSong,
      moodTags: [
        tag1.trim() || 'vibe',
        tag2.trim() || 'şehir',
        tag3.trim() || 'frekans',
      ],
      note: note.trim() || undefined,
      location: {
        name: locationName,
        neighborhood: 'Kadıköy',
        city: 'İstanbul',
        lat: 40.9845 + (Math.random() - 0.5) * 0.005,
        lng: 29.0280 + (Math.random() - 0.5) * 0.005,
        distanceMeters: 50,
      },
      createdAt: now,
      expiresAt: now + durationHours * 60 * 60 * 1000,
      energyLevel: 4,
      resonanceScore: 97,
      activeListenersCount: 1,
      hasActiveFlashChat: false,
    };

    onDropSphere(newSphere);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0d0f16] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto my-3 shrink-0 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h2 className="text-base font-bold text-white tracking-tight">Küre Bırak</h2>
          </div>
          <button
            onClick={() => {
              audioSynth.playClickSound(300);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Active Music Integration Card */}
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Çalan Parça</span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setConnectedService('spotify')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                    connectedService === 'spotify'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400'
                  }`}
                >
                  Spotify
                </button>
                <button
                  type="button"
                  onClick={() => setConnectedService('apple-music')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                    connectedService === 'apple-music'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'text-slate-400'
                  }`}
                >
                  Apple Music
                </button>
              </div>
            </div>

            {/* Song Preview Card */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl bg-slate-800 bg-cover bg-center shrink-0 border border-white/10 shadow-md relative group cursor-pointer"
                style={{ backgroundImage: `url(${selectedSong.coverUrl})` }}
                onClick={() => {
                  audioSynth.togglePreview(selectedSong.previewSynthPreset, selectedSong.bpm);
                }}
              >
                <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Music className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{selectedSong.title}</p>
                <p className="text-xs text-slate-400 truncate">{selectedSong.artist}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-cyan-400">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Kulaklığından algılandı</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSongPicker(!showSongPicker)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                Değiştir
              </button>
            </div>

            {/* Song Picker Dropdown */}
            {showSongPicker && (
              <div className="pt-2 border-t border-slate-800 space-y-1.5 max-h-40 overflow-y-auto">
                {SAMPLE_SONGS.map((song) => (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => {
                      setSelectedSong(song);
                      setShowSongPicker(false);
                      audioSynth.playClickSound(450);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      selectedSong.id === song.id
                        ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{song.title} - {song.artist}</span>
                    {selectedSong.id === song.id && <Check className="w-3.5 h-3.5 shrink-0 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3-Word Mood Tag Inputs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>3 Kelimelik Ruh Hali Etiketi</span>
              <span className="text-[11px] text-slate-500">Tam 3 kelime</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={tag1}
                onChange={(e) => setTag1(e.target.value)}
                placeholder="1. Kelime"
                maxLength={14}
                className="w-full px-2.5 py-2 text-xs font-medium rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                value={tag2}
                onChange={(e) => setTag2(e.target.value)}
                placeholder="2. Kelime"
                maxLength={14}
                className="w-full px-2.5 py-2 text-xs font-medium rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                value={tag3}
                onChange={(e) => setTag3(e.target.value)}
                placeholder="3. Kelime"
                maxLength={14}
                className="w-full px-2.5 py-2 text-xs font-medium rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quick preset suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-slate-500 shrink-0">Öneriler:</span>
              {PRESET_TAG_COMBOS.map((combo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTag1(combo[0]);
                    setTag2(combo[1]);
                    setTag3(combo[2]);
                    audioSynth.playClickSound(500);
                  }}
                  className="px-2 py-1 text-[10px] font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
                >
                  {combo.join(' · ')}
                </button>
              ))}
            </div>
          </div>

          {/* Short Atmosphere Note */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Anlık Düşünce (İsteğe bağlı)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Moda sahilinde gün batımı ve kahve..."
              maxLength={80}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Location Setting */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Küre Bırakılacak Konum</span>
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Expiration Timer Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Geçerlilik Süresi</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Süre bitince otomatik silinir</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((hr) => (
                <button
                  key={hr}
                  type="button"
                  onClick={() => setDurationHours(hr)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    durationHours === hr
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {hr} Saat {hr === 2 ? '(Standart)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Anonymous Privacy Toggle */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                {isAnonymous ? <Shield className="w-4 h-4 text-cyan-400" /> : <User className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {isAnonymous ? 'Anonim Frekans' : 'Profilimle Paylaş'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isAnonymous ? 'Kullanıcı adın gizlenir, sadece müzik ve modun görünür' : 'Profil adın ve avatarın gösterilir'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                audioSynth.playClickSound(400);
                setIsAnonymous(!isAnonymous);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isAnonymous ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isAnonymous ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all"
            >
              KÜREYİ HARİTAYA BIRAK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
