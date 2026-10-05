import React, { ReactNode } from 'react';
import { PlatformOS, SongTrack } from '../types/vibe';
import { Wifi, BatteryMedium, Signal, Sparkles } from 'lucide-react';

interface DeviceFrameProps {
  platform: PlatformOS;
  onPlatformChange: (os: PlatformOS) => void;
  currentSong: SongTrack;
  isPlaying: boolean;
  children: ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  platform,
  onPlatformChange,
  currentSong,
  isPlaying,
  children,
}) => {
  // If user chose responsive fullscreen without phone bezel
  if (platform === 'responsive') {
    return (
      <div className="relative min-h-screen w-full bg-[#07080c] flex flex-col items-center">
        {/* Top OS Switcher Pill */}
        <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-800 shadow-xl">
          <button
            onClick={() => onPlatformChange('ios')}
            className="px-2.5 py-1 text-xs font-medium rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="iPhone Görünümü"
          >
            iOS
          </button>
          <button
            onClick={() => onPlatformChange('android')}
            className="px-2.5 py-1 text-xs font-medium rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Android Görünümü"
          >
            Android
          </button>
          <button
            onClick={() => onPlatformChange('responsive')}
            className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
          >
            Tam Ekran
          </button>
        </div>

        <div className="w-full max-w-md min-h-screen relative flex flex-col bg-[#090b10] border-x border-slate-800/60 shadow-2xl">
          {children}
        </div>
      </div>
    );
  }

  const isIos = platform === 'ios';

  return (
    <div className="min-h-screen w-full bg-[#050608] flex flex-col items-center justify-center p-2 sm:p-6 lg:p-8 select-none">
      {/* Top Device OS Switcher */}
      <header className="mb-4 flex items-center justify-between w-full max-w-sm px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-medium tracking-wide text-slate-400">
            {isIos ? 'iPhone 16 Pro (iOS)' : 'Pixel 9 Pro (Android)'}
          </span>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-800">
          <button
            onClick={() => onPlatformChange('ios')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              isIos
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            iOS
          </button>
          <button
            onClick={() => onPlatformChange('android')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              !isIos
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Android
          </button>
          <button
            onClick={() => onPlatformChange('responsive')}
            className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-300"
            title="Mobil Çerçevesiz"
          >
            Tam Ekran
          </button>
        </div>
      </header>

      {/* Realistic Mobile Device Mockup */}
      <div
        className={`relative w-full max-w-[400px] h-[852px] bg-[#090b10] rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[10px] ${
          isIos ? 'border-[#262833]' : 'border-[#1f2229]'
        } ring-1 ring-white/10 overflow-hidden flex flex-col`}
      >
        {/* iOS Dynamic Island OR Android Punch Hole */}
        {isIos ? (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-32 h-7 bg-black rounded-full flex items-center justify-between px-2.5 shadow-lg border border-white/5 transition-all hover:w-56 group cursor-pointer">
            {/* Dynamic island left: album art or camera */}
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div
                className="w-4 h-4 rounded-full bg-cover bg-center shrink-0 border border-white/20"
                style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
              />
              <span className="text-[10px] text-slate-300 font-medium truncate max-w-[50px] group-hover:max-w-[120px] transition-all">
                {currentSong.title}
              </span>
            </div>

            {/* Dynamic island right: sound visualizer */}
            <div className="flex items-center gap-0.5 shrink-0">
              <span
                className={`w-0.5 bg-cyan-400 rounded-full ${
                  isPlaying ? 'animate-eq-1 h-3' : 'h-1.5'
                }`}
              />
              <span
                className={`w-0.5 bg-cyan-300 rounded-full ${
                  isPlaying ? 'animate-eq-2 h-2.5' : 'h-1'
                }`}
              />
              <span
                className={`w-0.5 bg-cyan-400 rounded-full ${
                  isPlaying ? 'animate-eq-3 h-3.5' : 'h-2'
                }`}
              />
            </div>
          </div>
        ) : (
          /* Android Punch hole camera */
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-50 w-4 h-4 bg-black rounded-full ring-2 ring-slate-800/80" />
        )}

        {/* Top Native Status Bar */}
        <div className="relative z-40 h-11 px-7 pt-2 flex items-center justify-between text-xs font-semibold text-slate-300 tracking-tight shrink-0">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Phone Inner Display Viewport */}
        <div className="relative flex-1 w-full flex flex-col overflow-hidden">
          {children}
        </div>

        {/* Bottom OS Navigation Indicator */}
        {isIos ? (
          <div className="relative z-40 h-6 w-full flex items-center justify-center shrink-0 bg-transparent pointer-events-none">
            <div className="w-32 h-1 bg-slate-300/40 rounded-full" />
          </div>
        ) : (
          <div className="relative z-40 h-6 w-full flex items-center justify-center shrink-0 bg-transparent pointer-events-none">
            <div className="w-20 h-1 bg-slate-400/30 rounded-full" />
          </div>
        )}
      </div>

      <div className="mt-3 text-center text-xs text-slate-500">
        VibeCheck PWA &bull; iOS & Android Uyumlu Sosyal Frekans
      </div>
    </div>
  );
};
