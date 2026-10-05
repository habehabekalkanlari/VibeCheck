import React from 'react';
import { Radio, Headphones, Sparkles, Plus, Share2 } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { SongTrack } from '../types/vibe';

interface TopAppBarProps {
  currentSong: SongTrack;
  onOpenDropModal: () => void;
  activeSphereCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentSong,
  onOpenDropModal,
  activeSphereCount,
}) => {
  return (
    <header className="h-14 px-4 bg-[#090b10]/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        <span className="text-base font-extrabold tracking-tight text-white font-display">
          VibeCheck
        </span>
      </div>

      {/* Zone 2: Quiet unboxed status info */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="text-cyan-400 font-mono font-semibold">{activeSphereCount}</span>
        <span>Küre Yayında</span>
      </div>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            audioSynth.playClickSound(580, 'triangle');
            onOpenDropModal();
          }}
          className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-all flex items-center gap-1 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Küre Bırak</span>
        </button>
      </div>
    </header>
  );
};
