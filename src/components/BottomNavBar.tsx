import React from 'react';
import { Compass, Radio, MessageCircle, User } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

export type TabKey = 'harita' | 'akis' | 'sohbetler' | 'profil';

interface BottomNavBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  activeChatCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  activeChatCount,
}) => {
  const tabs = [
    {
      id: 'harita' as TabKey,
      label: 'Radar',
      icon: Compass,
    },
    {
      id: 'akis' as TabKey,
      label: 'Frekanslar',
      icon: Radio,
    },
    {
      id: 'sohbetler' as TabKey,
      label: 'Flaş Odalar',
      icon: MessageCircle,
      badge: activeChatCount > 0 ? activeChatCount : undefined,
    },
    {
      id: 'profil' as TabKey,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav className="w-full bg-[#090b10]/95 backdrop-blur-md border-t border-slate-800/80 grid grid-cols-4 items-center h-16 shrink-0 z-40 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              audioSynth.playClickSound(500, 'sine', 0.03);
              onTabChange(tab.id);
            }}
            className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative transition-all ${
              isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              {tab.badge && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 min-w-4 h-4 rounded-full bg-cyan-400 text-slate-950 font-bold text-[9px] flex items-center justify-center font-mono">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight mt-1 font-medium ${
                isActive ? 'font-bold text-cyan-300' : ''
              }`}
            >
              {tab.label}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
