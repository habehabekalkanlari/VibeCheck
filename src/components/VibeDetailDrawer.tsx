import React from 'react';
import { VibeSphere, SongTrack } from '../types/vibe';
import { audioSynth } from '../services/audioSynth';
import { X, Play, Square, MessageCircle, MapPin, Clock, Radio, Sparkles, Share2, Headphones } from 'lucide-react';

interface VibeDetailDrawerProps {
  sphere: VibeSphere | null;
  onClose: () => void;
  onStartFlashChat: (sphere: VibeSphere) => void;
  isPlaying: boolean;
  onTogglePlay: (sphere: VibeSphere) => void;
  currentSong: SongTrack;
}

export const VibeDetailDrawer: React.FC<VibeDetailDrawerProps> = ({
  sphere,
  onClose,
  onStartFlashChat,
  isPlaying,
  onTogglePlay,
  currentSong,
}) => {
  if (!sphere) return null;

  const formatRemainingTime = (expiresAt: number) => {
    const diffMin = Math.max(1, Math.round((expiresAt - Date.now()) / (1000 * 60)));
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    if (hours > 0) return `${hours} sa ${mins} dk`;
    return `${mins} dakika`;
  };

  const isSelf = sphere.user.id === 'usr-self';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0c0e15] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto my-3 shrink-0 sm:hidden" />

        {/* Header bar */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-semibold text-slate-300">Sosyal Frekans Küresi</span>
          </div>
          <button
            onClick={() => {
              audioSynth.playClickSound(320);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Main Visual: Album Art + Live Visualizer */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center p-4 gap-4">
            <div
              className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10 group cursor-pointer"
              onClick={() => onTogglePlay(sphere)}
            >
              <img
                src={sphere.song.coverUrl}
                alt={sphere.song.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105' : 'group-hover:scale-105'
                }`}
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                {isPlaying ? (
                  <Square className="w-6 h-6 text-cyan-300 fill-cyan-300" />
                ) : (
                  <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                <span className="capitalize">{sphere.song.service === 'spotify' ? 'Spotify' : 'Apple Music'}</span>
                <span>·</span>
                <span className="capitalize">{sphere.song.genre}</span>
              </div>
              <h3 className="text-base font-bold text-white truncate">{sphere.song.title}</h3>
              <p className="text-xs text-slate-300 truncate">{sphere.song.artist}</p>

              {/* Mini Audio Equalizer Bar */}
              <div className="flex items-center gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => onTogglePlay(sphere)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 flex items-center gap-1.5"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{isPlaying ? 'Durdur' : 'Dinle'}</span>
                </button>
                {isPlaying && (
                  <div className="flex items-center gap-0.5 h-4">
                    <span className="w-1 bg-cyan-400 rounded-full animate-eq-1" />
                    <span className="w-1 bg-cyan-300 rounded-full animate-eq-2" />
                    <span className="w-1 bg-cyan-400 rounded-full animate-eq-3" />
                    <span className="w-1 bg-cyan-300 rounded-full animate-eq-4" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3-Word Mood Tag Display (clean unboxed text with typographic separators) */}
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 tracking-wider block mb-1">
              ANLIK RUH HALİ
            </span>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-cyan-200">
              <span>{sphere.moodTags[0]}</span>
              <span className="text-slate-600">·</span>
              <span>{sphere.moodTags[1]}</span>
              <span className="text-slate-600">·</span>
              <span>{sphere.moodTags[2]}</span>
            </div>
            {sphere.note && (
              <p className="mt-2 text-xs italic text-slate-300 border-t border-slate-800/80 pt-2">
                "{sphere.note}"
              </p>
            )}
          </div>

          {/* Resonance & Compatibility Box */}
          <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 rounded-xl border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  %{sphere.resonanceScore || 94} Frekans Uyumu
                </p>
                <p className="text-[11px] text-slate-400">
                  Müzik türü ve anlık atmosfer eşleşmesi
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-cyan-400">YÜKSEK</span>
            </div>
          </div>

          {/* Location & Ephemeral Countdown Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Konum</span>
              </div>
              <p className="font-semibold text-white truncate">{sphere.location.name}</p>
              <p className="text-[11px] text-slate-400">
                {sphere.location.distanceMeters > 1000
                  ? `${(sphere.location.distanceMeters / 1000).toFixed(1)} km uzakta`
                  : `${sphere.location.distanceMeters} m uzakta`}
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Küre Ömrü</span>
              </div>
              <p className="font-semibold text-white">
                {formatRemainingTime(sphere.expiresAt)}
              </p>
              <p className="text-[11px] text-amber-400/80">sonra haritadan silinir</p>
            </div>
          </div>

          {/* User profile info */}
          <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              {sphere.user.avatarUrl ? (
                <img
                  src={sphere.user.avatarUrl}
                  alt={sphere.user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                  ?
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-white">{sphere.user.name}</p>
                <p className="text-[10px] text-slate-400">{sphere.user.handle}</p>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {sphere.user.isAnonymous ? 'Anonim Dinleyici' : 'Doğrulanmış Profil'}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-2">
            {!isSelf && (
              <button
                onClick={() => {
                  audioSynth.playClickSound(540, 'triangle');
                  onStartFlashChat(sphere);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>FLAŞ SOHBET BAŞLAT (2 SAAT)</span>
              </button>
            )}

            <button
              onClick={() => {
                audioSynth.playClickSound(440);
                onTogglePlay(sphere);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>{isPlaying ? 'Şarkıyı Durdur' : 'Aynı Anda Dinle (Senkronize Et)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
