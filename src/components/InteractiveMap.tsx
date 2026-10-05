import React, { useState } from 'react';
import { VibeSphere, SongTrack } from '../types/vibe';
import { MapPin, Navigation, Compass, Plus, Clock, Volume2, Sparkles, Flame, Eye, Music } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

interface InteractiveMapProps {
  spheres: VibeSphere[];
  currentSong: SongTrack;
  onSelectSphere: (sphere: VibeSphere) => void;
  onDropAtLocation: (loc: { name: string; lat: number; lng: number }) => void;
  onOpenDropModal: () => void;
  activePlayingSphereId: string | null;
  onTogglePlaySphere: (sphere: VibeSphere) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spheres,
  currentSong,
  onSelectSphere,
  onDropAtLocation,
  onOpenDropModal,
  activePlayingSphereId,
  onTogglePlaySphere,
}) => {
  // Center location view: defaults to Kadıköy
  const [selectedCity, setSelectedCity] = useState<'istanbul-kadikoy' | 'istanbul-besiktas' | 'ankara-odtu' | 'izmir-kordon'>('istanbul-kadikoy');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredSphere, setHoveredSphere] = useState<VibeSphere | null>(null);

  // Quick hotspots
  const hotspots = [
    { id: 'istanbul-kadikoy', label: 'Kadıköy Moda' },
    { id: 'istanbul-besiktas', label: 'Beşiktaş' },
    { id: 'ankara-odtu', label: 'ODTÜ Ankara' },
    { id: 'izmir-kordon', label: 'İzmir Kordon' },
  ];

  // Map coordinate offsets based on chosen city focus
  const getSphereOffset = (sphere: VibeSphere) => {
    // Relative positioning calculations on custom aesthetic dark vector grid
    if (selectedCity === 'ankara-odtu') {
      if (sphere.location.city === 'Ankara') return { x: 50, y: 46 };
      return { x: 180, y: -90 }; // off-screen
    }
    if (selectedCity === 'izmir-kordon') {
      if (sphere.location.city === 'İzmir') return { x: 50, y: 50 };
      return { x: -160, y: 190 };
    }
    if (selectedCity === 'istanbul-besiktas') {
      if (sphere.id === 'sphere-3') return { x: 48, y: 42 };
      if (sphere.id === 'sphere-4') return { x: 54, y: 68 };
      if (sphere.id === 'sphere-1') return { x: 70, y: 88 };
      return { x: 30, y: 35 };
    }
    // Kadikoy center (default)
    if (sphere.id === 'sphere-1') return { x: 48, y: 52 };
    if (sphere.id === 'sphere-2') return { x: 62, y: 38 };
    if (sphere.id === 'sphere-4') return { x: 28, y: 22 };
    if (sphere.id === 'sphere-3') return { x: 36, y: 12 };
    if (sphere.location.city === 'İstanbul') return { x: 55, y: 65 };
    return { x: 88, y: 18 };
  };

  const formatRemainingTime = (expiresAt: number) => {
    const diffMin = Math.max(1, Math.round((expiresAt - Date.now()) / (1000 * 60)));
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    if (hours > 0) return `${hours}s ${mins}d`;
    return `${mins}d`;
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#07090e] overflow-hidden">
      {/* Top Location / Hotspot Quick Switcher */}
      <div className="absolute top-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 max-w-[80%]">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => {
                audioSynth.playClickSound(520, 'sine', 0.03);
                setSelectedCity(spot.id as any);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all shadow-sm ${
                selectedCity === spot.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 backdrop-blur-md'
              }`}
            >
              {spot.label}
            </button>
          ))}
        </div>

        {/* Live Radar Compass Indicator */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full text-[11px] font-mono text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>RADAR</span>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden cursor-crosshair select-none"
        style={{
          transform: `scale(${zoomLevel})`,
          transition: 'transform 0.25s ease-out',
        }}
        onClick={(e) => {
          // If clicked directly on map backdrop
          if (e.target === e.currentTarget) {
            audioSynth.playClickSound(300, 'sine');
          }
        }}
      >
        {/* Vector Grid & Map Topography */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="rgba(56, 189, 248, 0.08)"
                strokeWidth="1"
              />
              <circle cx="24" cy="24" r="1" fill="rgba(56, 189, 248, 0.2)" />
            </pattern>
            {/* Water gradient / Coastline vibe */}
            <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#081b29" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#05101a" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Sea / Coast Contour simulation */}
          {selectedCity.startsWith('istanbul') && (
            <path
              d="M 0 180 Q 120 220 200 160 T 360 280 L 400 600 L 0 600 Z"
              fill="url(#seaGrad)"
              stroke="rgba(14, 165, 233, 0.25)"
              strokeWidth="1.5"
            />
          )}

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Concentric Radar Rings */}
          <circle cx="50%" cy="50%" r="80" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="160" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeDasharray="6 6" />
          <circle cx="50%" cy="50%" r="240" fill="none" stroke="rgba(56, 189, 248, 0.05)" />
        </svg>

        {/* Live Radar Sweep Line */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[380px] h-[380px] rounded-full border border-cyan-500/10 relative animate-spin [animation-duration:8s]">
            <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-cyan-400 origin-left" />
          </div>
        </div>

        {/* My Current Location Marker */}
        <div
          className="absolute z-20 flex flex-col items-center pointer-events-auto cursor-pointer group"
          style={{ top: '56%', left: '50%', transform: 'translate(-50%, -50%)' }}
          onClick={() => {
            audioSynth.playClickSound(600);
          }}
        >
          {/* Animated Wave Pulsing */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 rounded-full bg-cyan-500/20 animate-ping"></span>
            <span className="absolute w-7 h-7 rounded-full bg-cyan-400/30"></span>
            <div className="relative w-5 h-5 rounded-full bg-cyan-400 border-2 border-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.8)] flex items-center justify-center text-slate-950">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 shadow-md">
            Sen Buradasın
          </div>
        </div>

        {/* Vibe Spheres Placed on the Radar */}
        {spheres.map((sphere) => {
          const coords = getSphereOffset(sphere);
          const isPlayingThis = activePlayingSphereId === sphere.id;
          const isExpiringSoon = (sphere.expiresAt - Date.now()) < 20 * 60 * 1000;

          return (
            <div
              key={sphere.id}
              className="absolute z-20 transition-all duration-300"
              style={{
                top: `${coords.y}%`,
                left: `${coords.x}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredSphere(sphere)}
              onMouseLeave={() => setHoveredSphere(null)}
            >
              {/* Outer Acoustic Resonance Waves */}
              <div className="relative flex items-center justify-center">
                {/* Ping wave */}
                <div
                  className={`absolute rounded-full pointer-events-none transition-all ${
                    isPlayingThis ? 'w-24 h-24 border-2 border-cyan-400 animate-ping' : 'w-16 h-16 border border-white/10'
                  }`}
                  style={{
                    borderColor: sphere.song.vibeColor,
                    opacity: isExpiringSoon ? 0.3 : 0.7,
                  }}
                />

                {/* Main Interactive Sphere Orb */}
                <button
                  onClick={() => {
                    audioSynth.playClickSound(480, 'sine', 0.05);
                    onSelectSphere(sphere);
                  }}
                  className={`group relative rounded-full p-1 transition-transform active:scale-95 cursor-pointer shadow-xl ${
                    isPlayingThis ? 'ring-4 ring-cyan-400 scale-110' : 'hover:scale-105'
                  }`}
                  style={{
                    background: `radial-gradient(circle, ${sphere.song.vibeColor}44 0%, #090b10 80%)`,
                  }}
                  aria-label={`${sphere.song.title} - ${sphere.song.artist}`}
                >
                  {/* Sphere Vinyl / Album Art Thumbnail */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 shadow-lg bg-slate-800">
                    <img
                      src={sphere.song.coverUrl}
                      alt={sphere.song.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isPlayingThis ? 'rotate-[360deg] duration-[8000ms] [transition-timing-function:linear] infinite' : ''
                      }`}
                    />

                    {/* Equalizer overlay when playing */}
                    {isPlayingThis ? (
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center gap-0.5">
                        <span className="w-1 bg-cyan-300 rounded-full animate-eq-1" />
                        <span className="w-1 bg-cyan-300 rounded-full animate-eq-2" />
                        <span className="w-1 bg-cyan-300 rounded-full animate-eq-3" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <Music className="w-4 h-4 text-white drop-shadow-md opacity-80 group-hover:opacity-100" />
                      </div>
                    )}
                  </div>

                  {/* Expiration badge */}
                  <div className="absolute -bottom-2 -right-1 bg-slate-900/95 border border-slate-700 px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Clock className={`w-2.5 h-2.5 ${isExpiringSoon ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                    <span className={`text-[9px] font-mono font-medium ${isExpiringSoon ? 'text-amber-300 font-bold' : 'text-slate-300'}`}>
                      {formatRemainingTime(sphere.expiresAt)}
                    </span>
                  </div>

                  {/* Top Match Tag (%88 Frekans) */}
                  {sphere.resonanceScore && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight whitespace-nowrap shadow-lg flex items-center gap-0.5"
                      style={{
                        backgroundColor: `${sphere.song.vibeColor}`,
                        color: '#020617',
                      }}
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>%{sphere.resonanceScore}</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Quiet unboxed 3-word tags below sphere */}
              <div className="mt-2 text-center pointer-events-none">
                <p className="text-[11px] font-semibold text-white drop-shadow-md truncate max-w-[130px] mx-auto">
                  {sphere.song.title}
                </p>
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-300 drop-shadow">
                  <span>{sphere.moodTags[0]}</span>
                  <span className="text-slate-500">·</span>
                  <span>{sphere.moodTags[1]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Controls on Bottom of Map */}
      <div className="absolute bottom-20 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Recenter & Zoom controls */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={() => {
              audioSynth.playClickSound(400);
              setZoomLevel((z) => Math.min(1.4, z + 0.15));
            }}
            className="w-10 h-10 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md text-white flex items-center justify-center shadow-lg active:scale-95 hover:bg-slate-800 text-lg font-bold"
            aria-label="Yakınlaştır"
          >
            +
          </button>
          <button
            onClick={() => {
              audioSynth.playClickSound(360);
              setZoomLevel((z) => Math.max(0.85, z - 0.15));
            }}
            className="w-10 h-10 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md text-white flex items-center justify-center shadow-lg active:scale-95 hover:bg-slate-800 text-lg font-bold"
            aria-label="Uzaklaştır"
          >
            -
          </button>
        </div>

        {/* Central Floating "Küre Bırak" (Drop Vibe Sphere) Primary CTA */}
        <button
          onClick={() => {
            audioSynth.playClickSound(580, 'triangle');
            onOpenDropModal();
          }}
          className="pointer-events-auto px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs tracking-wide flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>KÜRE BIRAK</span>
        </button>
      </div>
    </div>
  );
};
