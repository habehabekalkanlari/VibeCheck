import React, { useState } from 'react';
import { UserProfile, SongTrack, MoodBreakdown } from '../types/vibe';
import { audioSynth } from '../services/audioSynth';
import {
  Sparkles,
  Radio,
  Clock,
  Music,
  Headphones,
  CheckCircle2,
  Shield,
  BarChart2,
  Zap,
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  currentSong: SongTrack;
  onOpenDropModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentSong,
  onOpenDropModal,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'connections'>('analytics');
  const [spotifyLinked, setSpotifyLinked] = useState(true);
  const [appleLinked, setAppleLinked] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-[#090b10] overflow-y-auto pb-24">
      {/* Profile Header */}
      <div className="p-5 border-b border-slate-800 text-center relative bg-gradient-to-b from-slate-900/60 to-transparent">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80"
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          />
          <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900 rounded-full border border-slate-700">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <h2 className="text-base font-bold text-white tracking-tight">{user.name}</h2>
        <p className="text-xs text-slate-400 font-mono">{user.handle}</p>

        {/* Currently Listening Badge */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Şu an dinliyor:</span>
          <span className="font-semibold text-white truncate max-w-[140px]">
            {currentSong.title}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3 flex items-center gap-1">
        <button
          onClick={() => {
            audioSynth.playClickSound(500);
            setActiveTab('analytics');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Frekans Analizi
        </button>
        <button
          onClick={() => {
            audioSynth.playClickSound(500);
            setActiveTab('connections');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'connections'
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Müzik Entegrasyonları
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <div className="p-5 space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
              <span className="text-xl font-bold font-mono text-cyan-400">
                {user.stats.totalSpheresDropped}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">Bırakılan Küre</p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
              <span className="text-xl font-bold font-mono text-indigo-400">
                {user.stats.flashChatsStarted}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">Flaş Sohbet</p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
              <span className="text-xl font-bold font-mono text-emerald-400">
                %{user.stats.currentFrequencyScore}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">Frekans Skoru</p>
            </div>
          </div>

          {/* "Hangi Kafadasın?" Mood Breakdown */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Bu Hafta Hangi Kafadasın?</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Son 7 Gün</span>
            </div>

            {/* Visual Bar Breakdown */}
            <div className="h-3 w-full rounded-full bg-slate-950 overflow-hidden flex">
              {user.recentMoodBreakdown.map((item: MoodBreakdown, idx: number) => (
                <div
                  key={idx}
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  className="h-full"
                />
              ))}
            </div>

            {/* Legend items */}
            <div className="space-y-1.5 pt-1">
              {user.recentMoodBreakdown.map((item: MoodBreakdown, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300">{item.label}</span>
                  </div>
                  <span className="font-mono font-bold text-white">%{item.percent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA to drop a sphere */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Frekansını Paylaş</p>
              <p className="text-[11px] text-slate-400">
                Çevrendeki insanlarla müzikal küreni buluştur.
              </p>
            </div>
            <button
              onClick={() => {
                audioSynth.playClickSound(600);
                onOpenDropModal();
              }}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md transition-colors"
            >
              Küre Bırak
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 space-y-3">
          {/* Spotify Connection */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                Sp
              </div>
              <div>
                <p className="text-xs font-bold text-white">Spotify Entegrasyonu</p>
                <p className="text-[11px] text-slate-400">
                  {spotifyLinked ? 'Bağlı · Anlık çalan algılanıyor' : 'Bağlı değil'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                audioSynth.playClickSound(450);
                setSpotifyLinked(!spotifyLinked);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                spotifyLinked
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {spotifyLinked ? 'Bağlandı' : 'Bağla'}
            </button>
          </div>

          {/* Apple Music Connection */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                
              </div>
              <div>
                <p className="text-xs font-bold text-white">Apple Music Entegrasyonu</p>
                <p className="text-[11px] text-slate-400">
                  {appleLinked ? 'Bağlı · Müzik kütüphanesi aktif' : 'Bağlı değil'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                audioSynth.playClickSound(450);
                setAppleLinked(!appleLinked);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                appleLinked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {appleLinked ? 'Bağlandı' : 'Bağla'}
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            <p className="font-semibold text-white mb-1">Nasıl Çalışır?</p>
            Kulaklığında bir şarkı başladığında VibeCheck müzik API'sı üzerinden parçayı otomatik algılar ve haritada bırakacağın küreye eklemeni sağlar. Hiçbir hesap şifresi saklanmaz.
          </div>
        </div>
      )}
    </div>
  );
};
