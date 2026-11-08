import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VibeSphere, SongTrack } from '../types/vibe';
import { Plus, Clock, Sparkles, Music } from 'lucide-react';
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

const HOTSPOTS = [
  { id: 'istanbul-kadikoy', label: 'Kadıköy Moda', lat: 40.9865, lng: 29.027, zoom: 15 },
  { id: 'istanbul-besiktas', label: 'Beşiktaş', lat: 41.042, lng: 29.004, zoom: 15 },
  { id: 'ankara-odtu', label: 'ODTÜ Ankara', lat: 39.891, lng: 32.784, zoom: 15 },
  { id: 'izmir-kordon', label: 'İzmir Kordon', lat: 38.435, lng: 27.141, zoom: 15 },
];

function FlyToCity({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [lat, lng, zoom, map]);
  return null;
}

function formatRemainingTime(expiresAt: number) {
  const diffMin = Math.max(1, Math.round((expiresAt - Date.now()) / (1000 * 60)));
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  if (hours > 0) return `${hours}s ${mins}d`;
  return `${mins}d`;
}

function createSphereIcon(sphere: VibeSphere, isPlaying: boolean, isExpiring: boolean) {
  const ringClass = isPlaying ? 'ring-4 ring-cyan-400 scale-110' : '';
  const pingClass = isPlaying ? 'w-16 h-16 border-2 border-cyan-400 animate-ping' : 'w-10 h-10 border border-white/10';
  const clockClass = isExpiring ? 'text-amber-400 animate-pulse' : 'text-slate-400';
  const timeClass = isExpiring ? 'text-amber-300 font-bold' : 'text-slate-300';

  const html = `
    <div class="flex flex-col items-center" style="position:relative;">
      <div class="relative flex items-center justify-center">
        <div class="absolute rounded-full pointer-events-none ${pingClass}" style="border-color:${sphere.song.vibeColor};opacity:${isExpiring ? 0.3 : 0.7};"></div>
        <div class="relative rounded-full p-1 shadow-xl ${ringClass}" style="background:radial-gradient(circle, ${sphere.song.vibeColor}44 0%, #090b10 80%);">
          <div class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 shadow-lg bg-slate-800">
            <img src="${sphere.song.coverUrl}" alt="${sphere.song.title}" referrerpolicy="no-referrer" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-80"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
          </div>
          ${sphere.resonanceScore ? `<div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight whitespace-nowrap shadow-lg flex items-center gap-0.5" style="background-color:${sphere.song.vibeColor};color:#020617;">✨ %${sphere.resonanceScore}</div>` : ''}
          <div class="absolute -bottom-2 -right-1 bg-slate-900/95 border border-slate-700 px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <span class="text-[9px] font-mono font-medium ${timeClass}">${formatRemainingTime(sphere.expiresAt)}</span>
          </div>
        </div>
      </div>
      <div class="mt-2 text-center pointer-events-none">
        <p class="text-[11px] font-semibold text-white drop-shadow-md truncate max-w-[130px] mx-auto">${sphere.song.title}</p>
        <div class="flex items-center justify-center gap-1 text-[10px] text-slate-300 drop-shadow">
          <span>${sphere.moodTags[0]}</span>
          <span class="text-slate-500">·</span>
          <span>${sphere.moodTags[1]}</span>
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'vibe-sphere-marker',
    iconSize: [120, 90],
    iconAnchor: [60, 45],
  });
}

const myLocationIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <span class="absolute w-12 h-12 rounded-full bg-cyan-500/20 animate-ping"></span>
      <span class="absolute w-7 h-7 rounded-full bg-cyan-400/30"></span>
      <div class="relative w-5 h-5 rounded-full bg-cyan-400 border-2 border-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.8)] flex items-center justify-center">
        <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
      </div>
    </div>
    <div class="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 shadow-md text-center whitespace-nowrap">
      Sen Buradasın
    </div>
  `,
  className: 'my-location-marker',
  iconSize: [80, 50],
  iconAnchor: [40, 25],
});

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spheres,
  onSelectSphere,
  onOpenDropModal,
  activePlayingSphereId,
}) => {
  const [selectedCity, setSelectedCity] = useState(HOTSPOTS[0]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#07090e] overflow-hidden">
      {/* Hotspot Switcher */}
      <div className="absolute top-2 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 max-w-[80%]">
          {HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              onClick={() => {
                audioSynth.playClickSound(520, 'sine', 0.03);
                setSelectedCity(spot);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all shadow-sm ${
                selectedCity.id === spot.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 backdrop-blur-md'
              }`}
            >
              {spot.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full text-[11px] font-mono text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>LIVE</span>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[selectedCity.lat, selectedCity.lng]}
        zoom={selectedCity.zoom}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-0"
        style={{ background: '#07090e' }}
      >
        <FlyToCity lat={selectedCity.lat} lng={selectedCity.lng} zoom={selectedCity.zoom} />
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />

        {/* My Location */}
        <Marker position={[selectedCity.lat, selectedCity.lng]} icon={myLocationIcon} />

        {/* Vibe Spheres */}
        {spheres.map((sphere) => {
          const isPlaying = activePlayingSphereId === sphere.id;
          const isExpiring = (sphere.expiresAt - Date.now()) < 20 * 60 * 1000;
          return (
            <Marker
              key={sphere.id}
              position={[sphere.location.lat, sphere.location.lng]}
              icon={createSphereIcon(sphere, isPlaying, isExpiring)}
              eventHandlers={{
                click: () => {
                  audioSynth.playClickSound(480, 'sine', 0.05);
                  onSelectSphere(sphere);
                },
              }}
            />
          );
        })}
      </MapContainer>

      {/* Floating Drop Button */}
      <div className="absolute bottom-20 left-3 right-3 z-[1000] flex items-center justify-center pointer-events-none">
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
