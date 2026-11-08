import React, { useState, useEffect } from 'react';
import { PlatformOS, VibeSphere, SongTrack, UserProfile } from './types/vibe';
import { INITIAL_SPHERES, SAMPLE_SONGS, CURRENT_USER } from './data/mockVibes';
import { fetchSpheres, fetchCurrentUser } from './services/api';
import { audioSynth } from './services/audioSynth';
import { DeviceFrame } from './components/DeviceFrame';
import { TopAppBar } from './components/TopAppBar';
import { InteractiveMap } from './components/InteractiveMap';
import { VibeFeedView } from './components/VibeFeedView';
import { ActiveFlashChatsList } from './components/ActiveFlashChatsList';
import { ProfileView } from './components/ProfileView';
import { VibeDetailDrawer } from './components/VibeDetailDrawer';
import { FlashChatDrawer } from './components/FlashChatDrawer';
import { DropSphereModal } from './components/DropSphereModal';
import { NowPlayingMiniBar } from './components/NowPlayingMiniBar';
import { BottomNavBar, TabKey } from './components/BottomNavBar';

export default function App() {
  const [platform, setPlatform] = useState<PlatformOS>('ios');
  const [activeTab, setActiveTab] = useState<TabKey>('harita');
  const [spheres, setSpheres] = useState<VibeSphere[]>([]);
  const [currentSong, setCurrentSong] = useState<SongTrack>(SAMPLE_SONGS[0]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePlayingSphereId, setActivePlayingSphereId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers state
  const [selectedSphere, setSelectedSphere] = useState<VibeSphere | null>(null);
  const [activeChatSphere, setActiveChatSphere] = useState<VibeSphere | null>(null);
  const [isDropModalOpen, setIsDropModalOpen] = useState<boolean>(false);
  const [isListeningTogether, setIsListeningTogether] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [apiSpheres, apiUser] = await Promise.all([
          fetchSpheres(),
          fetchCurrentUser(),
        ]);
        setSpheres(apiSpheres);
        setCurrentUser(apiUser);
        if (apiUser.currentSong) setCurrentSong(apiUser.currentSong);
      } catch {
        setSpheres(INITIAL_SPHERES);
        setCurrentUser(CURRENT_USER);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Periodic refresh from API + cleanup expired
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const apiSpheres = await fetchSpheres();
        setSpheres(apiSpheres);
      } catch {
        setSpheres((prev) => prev.filter((s) => s.expiresAt > Date.now()));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Audio Playback Toggle for User's own song
  const handleTogglePlayMySong = () => {
    const isNowPlaying = audioSynth.togglePreview(
      currentSong.previewSynthPreset,
      currentSong.bpm
    );
    setIsPlaying(isNowPlaying);
    setActivePlayingSphereId(null);
  };

  // Audio Playback Toggle for a specific sphere
  const handleTogglePlaySphere = (sphere: VibeSphere) => {
    if (activePlayingSphereId === sphere.id && isPlaying) {
      audioSynth.stopPreview();
      setIsPlaying(false);
      setActivePlayingSphereId(null);
    } else {
      audioSynth.startPreview(sphere.song.previewSynthPreset, sphere.song.bpm);
      setIsPlaying(true);
      setActivePlayingSphereId(sphere.id);
    }
  };

  // Handle Starting Ephemeral Flash Chat
  const handleStartFlashChat = (sphere: VibeSphere) => {
    setSelectedSphere(null);
    setActiveChatSphere(sphere);
    // Mark sphere as having active flash chat
    setSpheres((prev) =>
      prev.map((s) => (s.id === sphere.id ? { ...s, hasActiveFlashChat: true } : s))
    );
  };

  // Handle Sync Listen Together
  const handleToggleListenTogether = () => {
    if (!activeChatSphere) return;
    const nextState = !isListeningTogether;
    setIsListeningTogether(nextState);

    if (nextState) {
      audioSynth.startPreview(activeChatSphere.song.previewSynthPreset, activeChatSphere.song.bpm);
      setIsPlaying(true);
      setActivePlayingSphereId(activeChatSphere.id);
    } else {
      audioSynth.stopPreview();
      setIsPlaying(false);
      setActivePlayingSphereId(null);
    }
  };

  // Handle Dropping a New Vibe Sphere
  const handleDropSphere = (newSphere: VibeSphere) => {
    setSpheres((prev) => [newSphere, ...prev]);
    setCurrentSong(newSphere.song);
    // Automatically switch to radar map to view dropped sphere
    setActiveTab('harita');
  };

  // Count active chats
  const spheresWithChat = spheres.filter((s) => s.hasActiveFlashChat);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#090b10] text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono">Küreler yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <DeviceFrame
      platform={platform}
      onPlatformChange={setPlatform}
      currentSong={currentSong}
      isPlaying={isPlaying}
    >
      {/* Top App Bar */}
      <TopAppBar
        currentSong={currentSong}
        onOpenDropModal={() => setIsDropModalOpen(true)}
        activeSphereCount={spheres.length}
      />

      {/* Main View Area based on Active Tab */}
      <main className="relative flex-1 w-full overflow-hidden flex flex-col">
        {activeTab === 'harita' && (
          <InteractiveMap
            spheres={spheres}
            currentSong={currentSong}
            onSelectSphere={(sphere) => setSelectedSphere(sphere)}
            onDropAtLocation={() => setIsDropModalOpen(true)}
            onOpenDropModal={() => setIsDropModalOpen(true)}
            activePlayingSphereId={activePlayingSphereId}
            onTogglePlaySphere={handleTogglePlaySphere}
          />
        )}

        {activeTab === 'akis' && (
          <VibeFeedView
            spheres={spheres}
            currentSong={currentSong}
            onSelectSphere={(sphere) => setSelectedSphere(sphere)}
            onStartFlashChat={handleStartFlashChat}
            activePlayingSphereId={activePlayingSphereId}
            onTogglePlay={handleTogglePlaySphere}
          />
        )}

        {activeTab === 'sohbetler' && (
          <ActiveFlashChatsList
            spheresWithChat={spheresWithChat}
            onOpenChat={(sphere) => setActiveChatSphere(sphere)}
            onGoToRadar={() => setActiveTab('harita')}
          />
        )}

        {activeTab === 'profil' && (
          <ProfileView
            user={currentUser}
            currentSong={currentSong}
            onOpenDropModal={() => setIsDropModalOpen(true)}
          />
        )}
      </main>

      {/* Persistent Mini Player Bar */}
      <NowPlayingMiniBar
        currentSong={currentSong}
        isPlaying={isPlaying && activePlayingSphereId === null}
        onTogglePlay={handleTogglePlayMySong}
        onOpenDropModal={() => setIsDropModalOpen(true)}
      />

      {/* Bottom Nav Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeChatCount={spheresWithChat.length}
      />

      {/* Sphere Detail Sheet */}
      <VibeDetailDrawer
        sphere={selectedSphere}
        onClose={() => setSelectedSphere(null)}
        onStartFlashChat={handleStartFlashChat}
        isPlaying={isPlaying && activePlayingSphereId === selectedSphere?.id}
        onTogglePlay={handleTogglePlaySphere}
        currentSong={currentSong}
      />

      {/* Ephemeral Flash Chat Drawer */}
      {activeChatSphere && (
        <FlashChatDrawer
          sphere={activeChatSphere}
          onClose={() => {
            setActiveChatSphere(null);
            setIsListeningTogether(false);
          }}
          currentSong={currentSong}
          isListeningTogether={isListeningTogether}
          onToggleListenTogether={handleToggleListenTogether}
        />
      )}

      {/* Drop Vibe Sphere Modal */}
      <DropSphereModal
        isOpen={isDropModalOpen}
        onClose={() => setIsDropModalOpen(false)}
        onDropSphere={handleDropSphere}
        currentSong={currentSong}
      />
    </DeviceFrame>
  );
}
