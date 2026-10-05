import React, { useState } from 'react';
import { VibeSphere, SongTrack, VibeGenre } from '../types/vibe';
import { audioSynth } from '../services/audioSynth';
import {
  MapPin,
  Clock,
  Sparkles,
  Play,
  Square,
  MessageCircle,
  Headphones,
  SlidersHorizontal,
} from 'lucide-react';

interface VibeFeedViewProps {
  spheres: VibeSphere[];
  currentSong: SongTrack;
  onSelectSphere: (sphere: VibeSphere) => void;
  onStartFlashChat: (sphere: VibeSphere) => void;
  activePlayingSphereId: string | null;
  onTogglePlay: (sphere: VibeSphere) => void;
}

export const VibeFeedView: React.FC<VibeFeedViewProps> = ({
  spheres,
  currentSong,
  onSelectSphere,
  onStartFlashChat,
  activePlayingSphereId,
  onTogglePlay,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(10000); // 10km

  const genres = [
    { id: 'all', label: 'Tüm Frekanslar' },
    { id: 'indie', label: 'İndie' },
    { id: 'techno', label: 'Techno & Beat' },
    { id: 'lofi', label: 'Lo-Fi Chill' },
    { id: 'rock', label: 'Anadolu & Rock' },
    { id: 'rnb', label: 'R&B' },
  ];

  const filteredSpheres = spheres.filter((s) => {
    if (selectedGenre !== 'all' && s.song.genre !== selectedGenre) return false;
    if (s.location.distanceMeters > maxDistance) return false;
    return true;
  });

  const formatRemainingTime = (expiresAt: number) => {
    const diffMin = Math.max(1, Math.round((expiresAt - Date.now()) / (1000 * 60)));
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    if (hours > 0) return `${hours}s ${mins}d kaldı`;
    return `${mins}d kaldı (sönüyor)`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#090b10] overflow-y-auto pb-24">
      {/* Top Filter Bar */}
      <div className="sticky top-0 z-20 bg-[#090b10]/90 backdrop-blur-md border-b border-slate-800 p-3 space-y-2">
        {/* Genre Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                audioSynth.playClickSound(480, 'sine', 0.02);
                setSelectedGenre(g.id);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedGenre === g.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Distance Selector */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
          <span className="flex items-center gap-1 text-[11px]">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Mesafe Filtresi</span>
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            {[1000, 3000, 10000, 500000].map((dist) => (
              <button
                key={dist}
                onClick={() => setMaxDistance(dist)}
                className={`px-2 py-0.5 rounded ${
                  maxDistance === dist
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {dist === 1000
                  ? '1km'
                  : dist === 3000
                  ? '3km'
                  : dist === 10000
                  ? '10km'
                  : 'Tümü'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed List Items */}
      <div className="p-3.5 space-y-3">
        {filteredSpheres.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Headphones className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">Bu frekansta küre bulunamadı</p>
            <p className="text-xs text-slate-500">Mesafe filtresini genişletin veya yeni bir küre bırakın.</p>
          </div>
        ) : (
          filteredSpheres.map((sphere) => {
            const isPlayingThis = activePlayingSphereId === sphere.id;
            const isExpiringSoon = sphere.expiresAt - Date.now() < 20 * 60 * 1000;

            return (
              <div
                key={sphere.id}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-2.5"
              >
                {/* Header: User & Distance */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {sphere.user.avatarUrl ? (
                      <img
                        src={sphere.user.avatarUrl}
                        alt={sphere.user.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                        ?
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {sphere.user.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {sphere.location.neighborhood} · {sphere.location.distanceMeters > 1000
                          ? `${(sphere.location.distanceMeters / 1000).toFixed(1)}km`
                          : `${sphere.location.distanceMeters}m`}
                      </p>
                    </div>
                  </div>

                  {/* Compatibility Score */}
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-[10px] font-bold font-mono">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>%{sphere.resonanceScore || 92} Uyum</span>
                  </div>
                </div>

                {/* Song Card */}
                <div
                  className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer group"
                  onClick={() => onTogglePlay(sphere)}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow bg-slate-800">
                    <img
                      src={sphere.song.coverUrl}
                      alt={sphere.song.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {isPlayingThis ? (
                        <Square className="w-4 h-4 text-cyan-300 fill-cyan-300" />
                      ) : (
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{sphere.song.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{sphere.song.artist}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                      <span>{sphere.song.service === 'spotify' ? 'Spotify' : 'Apple Music'}</span>
                      <span>·</span>
                      <span className="capitalize">{sphere.song.genre}</span>
                      {isPlayingThis && (
                        <div className="flex items-center gap-0.5 ml-1">
                          <span className="w-1 bg-cyan-400 rounded-full animate-eq-1 h-2" />
                          <span className="w-1 bg-cyan-400 rounded-full animate-eq-2 h-3" />
                          <span className="w-1 bg-cyan-400 rounded-full animate-eq-3 h-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3-Word Mood Tag (Zero-pill discipline: unboxed text with subtle separators) */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span className="text-cyan-400 font-semibold">{sphere.moodTags[0]}</span>
                    <span className="text-slate-600">·</span>
                    <span>{sphere.moodTags[1]}</span>
                    <span className="text-slate-600">·</span>
                    <span>{sphere.moodTags[2]}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Clock
                      className={`w-3 h-3 ${
                        isExpiringSoon ? 'text-amber-400 animate-pulse' : 'text-slate-500'
                      }`}
                    />
                    <span className={isExpiringSoon ? 'text-amber-300 font-bold' : ''}>
                      {formatRemainingTime(sphere.expiresAt)}
                    </span>
                  </div>
                </div>

                {/* Note if present */}
                {sphere.note && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    "{sphere.note}"
                  </p>
                )}

                {/* Footer Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                  <button
                    onClick={() => {
                      audioSynth.playClickSound(500);
                      onSelectSphere(sphere);
                    }}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    Detay Gör
                  </button>
                  <button
                    onClick={() => {
                      audioSynth.playClickSound(550, 'triangle');
                      onStartFlashChat(sphere);
                    }}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Flaş Sohbet</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
