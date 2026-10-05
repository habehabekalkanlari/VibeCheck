import React from 'react';
import { VibeSphere } from '../types/vibe';
import { audioSynth } from '../services/audioSynth';
import { MessageCircle, Clock, Sparkles, Music, ChevronRight, Compass } from 'lucide-react';

interface ActiveFlashChatsListProps {
  spheresWithChat: VibeSphere[];
  onOpenChat: (sphere: VibeSphere) => void;
  onGoToRadar: () => void;
}

export const ActiveFlashChatsList: React.FC<ActiveFlashChatsListProps> = ({
  spheresWithChat,
  onOpenChat,
  onGoToRadar,
}) => {
  const formatRemainingTime = (expiresAt: number) => {
    const diffMin = Math.max(1, Math.round((expiresAt - Date.now()) / (1000 * 60)));
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    if (hours > 0) return `${hours}s ${mins}d kaldı`;
    return `${mins}d kaldı`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#090b10] overflow-y-auto pb-24">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-[#090b10]/90 backdrop-blur-md sticky top-0 z-20">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span>Aktif Flaş Sohbet Odaları</span>
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Bu odalar 2 saatlik frekans süresi bittiğinde otomatik olarak silinir.
        </p>
      </div>

      <div className="p-3.5 space-y-2.5">
        {spheresWithChat.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Henüz aktif flaş sohbetin yok</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Radar haritasında müzik zevkinin uyuştuğu bir küreye dokunarak anlık flaş sohbet başlatabilirsin.
              </p>
            </div>
            <button
              onClick={() => {
                audioSynth.playClickSound(520);
                onGoToRadar();
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 inline-flex items-center gap-1.5 shadow-md"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Radara Git</span>
            </button>
          </div>
        ) : (
          spheresWithChat.map((sphere) => (
            <div
              key={sphere.id}
              onClick={() => {
                audioSynth.playClickSound(560);
                onOpenChat(sphere);
              }}
              className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm flex items-center justify-between gap-3 group"
            >
              <div className="relative shrink-0">
                {sphere.user.avatarUrl ? (
                  <img
                    src={sphere.user.avatarUrl}
                    alt={sphere.user.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400">
                    ?
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {sphere.user.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{formatRemainingTime(sphere.expiresAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-300 truncate">
                  <Music className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{sphere.song.title} - {sphere.song.artist}</span>
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                  <span className="text-cyan-400 font-semibold font-mono">
                    %{sphere.resonanceScore || 94} Uyum
                  </span>
                  <span>·</span>
                  <span>{sphere.location.neighborhood}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
