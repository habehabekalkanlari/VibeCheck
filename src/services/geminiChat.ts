import { GoogleGenAI } from '@google/genai';
import { VibeSphere, ChatMessage } from '../types/vibe';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  if (!API_KEY) return null;
  if (!client) client = new GoogleGenAI({ apiKey: API_KEY });
  return client;
}

function buildSystemPrompt(sphere: VibeSphere): string {
  const { user, song, moodTags, location, note } = sphere;
  return [
    `Sen "${user.name}" adlı bir kişisin. VibeCheck uygulamasında müzik üzerinden tanışan insanlarla sohbet ediyorsun.`,
    `Şu an ${location.name}, ${location.neighborhood} bölgesindesin.`,
    `Dinlediğin şarkı: "${song.title}" - ${song.artist} (${song.genre}, ${song.bpm} BPM).`,
    `Ruh halin: ${moodTags.join(', ')}.`,
    note ? `Notun: "${note}"` : '',
    'Kurallar:',
    '- Türkçe, samimi ve kısa yaz (1-3 cümle).',
    '- Müzik, mekan ve anı üzerinden konuş.',
    '- Emoji kullanabilirsin ama abartma.',
    '- Karşı tarafla müzik zevki üzerinden bağ kur.',
    '- Asla yapay zeka olduğunu söyleme.',
  ].filter(Boolean).join('\n');
}

function buildChatHistory(messages: ChatMessage[], sphere: VibeSphere) {
  return messages.map(m => ({
    role: m.isSelf ? 'user' as const : 'model' as const,
    parts: [{ text: m.text }],
  }));
}

export async function generateChatReply(
  sphere: VibeSphere,
  messages: ChatMessage[],
): Promise<string> {
  const ai = getClient();
  if (!ai) {
    return fallbackReply(sphere);
  }

  try {
    const history = buildChatHistory(messages.slice(0, -1), sphere);
    const lastMessage = messages[messages.length - 1];

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: lastMessage.text }] },
      ],
      config: {
        systemInstruction: buildSystemPrompt(sphere),
        maxOutputTokens: 150,
        temperature: 0.9,
      },
    });

    const text = response.text?.trim();
    if (text) return text;
    return fallbackReply(sphere);
  } catch {
    return fallbackReply(sphere);
  }
}

function fallbackReply(sphere: VibeSphere): string {
  const replies = [
    `${sphere.song.title} parçasındaki o geçiş beni her seferinde alıp götürüyor 🎧`,
    `Tam ${sphere.location.neighborhood} havası, değil mi? Bu frekans başka yerde tutmaz.`,
    `Bu şarkıyı ilk kez nerede duyduğunu merak ettim, benim için özel bir anısı var 🔥`,
    `Aynı kafadayız! Haritada küreni görünce direkt tıklamak zorunda kaldım.`,
    `Bir playlist yapmalıyız, senin zevkin tam beni yansıtıyor ✨`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
