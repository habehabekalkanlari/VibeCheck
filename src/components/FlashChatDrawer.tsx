import React, { useState, useEffect, useRef } from 'react';
import { VibeSphere, ChatMessage, SongTrack } from '../types/vibe';
import { audioSynth } from '../services/audioSynth';
import { INITIAL_FLASH_MESSAGES } from '../data/mockVibes';
import {
  X,
  Send,
  Clock,
  Radio,
  Headphones,
  Sparkles,
  Music,
  Flame,
  Coffee,
  Heart,
  Smile,
} from 'lucide-react';

interface FlashChatDrawerProps {
  sphere: VibeSphere;
  onClose: () => void;
  currentSong: SongTrack;
  isListeningTogether: boolean;
  onToggleListenTogether: () => void;
}

export const FlashChatDrawer: React.FC<FlashChatDrawerProps> = ({
  sphere,
  onClose,
  currentSong,
  isListeningTogether,
  onToggleListenTogether,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // If it's sphere-4, provide pre-filled history, otherwise fresh greeting
    if (sphere.id === 'sphere-4') return INITIAL_FLASH_MESSAGES;
    return [
      {
        id: `m-init-${Date.now()}`,
        senderId: sphere.user.id,
        senderName: sphere.user.name,
        text: `Selam! Haritada ${sphere.song.title} dinlediğini ve "${sphere.moodTags.join(', ')}" frekansında olduğunu gördüm 🎧`,
        timestamp: Date.now() - 30000,
        isSelf: false,
        type: 'text',
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    audioSynth.playClickSound(640, 'sine', 0.04);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'usr-self',
      senderName: 'Kaan Demir',
      text,
      timestamp: Date.now(),
      isSelf: true,
      type: 'text',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Simulate smart interactive reply after 1.8 seconds
    setIsOtherTyping(true);
    setTimeout(() => {
      setIsOtherTyping(false);
      audioSynth.playClickSound(520, 'triangle', 0.06);

      const dynamicResponses = [
        `Kesinlikle katılıyorum! Özellikle o bridge kısmındaki davul geçişi tam Kadıköy gecesine uyuyor.`,
        `Şu an kulaklığımda aynı parça çalıyor, senkron modu açıkken aynı anda dinlemek çok garip ama harika bir his!`,
        `Bu parçayı geçen sene canlı dinlemiştim, konser alanı tam bir frekans patlamasıydı 🔥`,
        `Haritada senin küreni görünce direkt tıkladım, müzik zevki uyuşan birine denk gelmek çok nadir oluyor.`,
        `Bir sonraki parçaya ne geçelim? Arctic Monkeys mi Jakuzi mi devam edelim? 🎧`,
      ];
      const randomReply =
        dynamicResponses[Math.floor(Math.random() * dynamicResponses.length)];

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: sphere.user.id,
        senderName: sphere.user.name,
        text: randomReply,
        timestamp: Date.now(),
        isSelf: false,
        type: 'text',
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1800);
  };

  const handleQuickReaction = (emoji: string) => {
    handleSendMessage(`${emoji} (Frekans tepkisi)`);
  };

  const formatMessageTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-[92vh] sm:h-[780px] bg-[#0c0e15] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Countdown Ephemeral Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Flaş Sohbet · 1s 48d sonra tamamen silinecek</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Gizli & Geçici</span>
        </div>

        {/* Room Header */}
        <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              {sphere.user.avatarUrl ? (
                <img
                  src={sphere.user.avatarUrl}
                  alt={sphere.user.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400">
                  ?
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0c0e15] rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">{sphere.user.name}</h3>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/60 font-mono">
                  %{sphere.resonanceScore || 94}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Music className="w-3 h-3 text-cyan-400" />
                <span className="truncate max-w-[150px]">{sphere.song.title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sync Listen button */}
            <button
              onClick={onToggleListenTogether}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isListeningTogether
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title="Aynı Anda Dinle"
            >
              <Headphones className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isListeningTogether ? 'Senkronize' : 'Birlikte Dinle'}
              </span>
            </button>

            <button
              onClick={() => {
                audioSynth.playClickSound(300);
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Audio Sync Floating Indicator */}
        {isListeningTogether && (
          <div className="px-4 py-1.5 bg-cyan-950/60 border-b border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Aynı anda dinliyorsunuz: {sphere.song.title}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="w-1 bg-cyan-400 rounded-full animate-eq-1 h-3" />
              <span className="w-1 bg-cyan-400 rounded-full animate-eq-2 h-4" />
              <span className="w-1 bg-cyan-400 rounded-full animate-eq-3 h-2" />
            </div>
          </div>
        )}

        {/* Message Thread Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {/* Ephemeral Notice */}
          <div className="text-center py-2">
            <p className="text-[11px] text-slate-500">
              Bu oda konuma dayalı anlık frekans üzerinden açıldı. 2 saat dolduğunda pinle beraber yok olacaktır.
            </p>
          </div>

          {messages.map((msg) => {
            const isSelf = msg.isSelf;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    isSelf
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/80 shadow-sm'
                  } ${msg.type === 'lyric' ? 'italic border-l-2 border-amber-400 bg-amber-950/30' : ''}`}
                >
                  {msg.type === 'lyric' && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mb-1 not-italic">
                      <Music className="w-3 h-3" />
                      <span>Şarkı Sözü Paylaşımı</span>
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                  {formatMessageTime(msg.timestamp)}
                </span>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isOtherTyping && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 w-fit px-3 py-2 rounded-2xl border border-slate-800">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] ml-1">{sphere.user.name} yazıyor...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reaction Pill Shortcuts */}
        <div className="px-4 py-1.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] text-slate-500 shrink-0">Hızlı Frekans:</span>
          {['🎧 Harika parça', '🔥 Aynı kafadayız', '☕ Kahve eşliği', '✨ Tam Moda havası'].map(
            (tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(tag)}
                className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Bir mesaj veya şarkı sözü yaz..."
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-10 h-10 rounded-xl bg-cyan-500 disabled:opacity-40 text-slate-950 flex items-center justify-center font-bold active:scale-95 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
