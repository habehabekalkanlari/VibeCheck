import React from 'react';
import { SongTrack } from '../types/vibe';
import { audioSynth } from '../services/audioSynth';
import { Play, Square, Plus, Radio, Headphones } from 'lucide-react';

interface NowPlayingMiniBarProps {
  currentSong: SongTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenDropModal: () => void;
}

export const NowPlayingMiniBar: React.FC<NowPlayingMiniBarProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onOpenDropModal,
}) => {
  return (
    <div className="w-full bg-[#0d0f16]/95 backdrop-blur-lg border-t border-slate-800/80 px-3.5 py-2 flex items-center justify-between z-30 shrink-0">
      {/* Left: Song Art + Info */}
      <div
        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
        onClick={onTogglePlay}
      >
        <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-sm bg-slate-800">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            {isPlaying ? (
              <Square className="w-3 h-3 text-cyan-300 fill-cyan-300" />
            ) : (
              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-white truncate">{currentSong.title}</p>
            {isPlaying && (
              <div className="flex items-center gap-0.5 shrink-0">
                <span className="w-0.5 bg-cyan-400 rounded-full animate-eq-1 h-2.5" />
                <span className="w-0.5 bg-cyan-400 rounded-full animate-eq-2 h-3" />
                <span className="w-0.5 bg-cyan-400 rounded-full animate-eq-3 h-2" />
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onTogglePlay}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
          title={isPlaying ? 'Durdur' : 'Dinle'}
        >
          {isPlaying ? (
            <Square className="w-3.5 h-3.5 fill-cyan-300" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-cyan-300" />
          )}
        </button>

        <button
          onClick={() => {
            audioSynth.playClickSound(580, 'triangle');
            onOpenDropModal();
          }}
          className="px-2.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Küre Bırak</span>
        </button>
      </div>
    </div>
  );
};
