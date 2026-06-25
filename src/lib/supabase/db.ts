import { supabase } from './client';
import { DiaryEntry } from '../../types';
import { encryptText, decryptText } from './crypto';

// Local storage fallback keys
const MOCK_PROFILE_KEY = 'munggo_mock_profile';
const MOCK_DIARIES_KEY = 'munggo_mock_diaries';

/**
 * Retrieves the profile of the current user.
 * Falls back to localStorage if Supabase is unavailable or user is not logged in.
 */
export async function getProfile(): Promise<{ dogName: string; dogSize: string } | null> {
  if (!supabase) {
    return getMockProfile();
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return getMockProfile();

    const { data, error } = await supabase
      .from('profiles')
      .select('dog_name, dog_size')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      return getMockProfile();
    }

    return {
      dogName: data.dog_name,
      dogSize: data.dog_size,
    };
  } catch (e) {
    console.error('Failed to get profile from Supabase, falling back:', e);
    return getMockProfile();
  }
}

/**
 * Saves or updates the profile.
 * Saves to both localStorage (always) and Supabase (if available).
 */
export async function saveProfile(dogName: string, dogSize: string): Promise<boolean> {
  saveMockProfile(dogName, dogSize);

  if (!supabase) return true;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return true;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        dog_name: dogName,
        dog_size: dogSize,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save profile to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Failed to save profile to Supabase:', e);
    return false;
  }
}

/**
 * Retrieves all diary entries.
 * Decrypts secure database contents back to readable text.
 */
export async function getDiaries(): Promise<DiaryEntry[]> {
  if (!supabase) {
    return getMockDiaries();
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return getMockDiaries();

    const { data, error } = await supabase
      .from('diaries')
      .select('emoji, mood, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return getMockDiaries();
    }

    return data.map(d => ({
      emoji: d.emoji,
      mood: d.mood,
      text: decryptText(d.content), // Decrypt secure content
      date: formatDate(d.created_at),
    }));
  } catch (e) {
    console.error('Failed to retrieve diaries from Supabase, falling back:', e);
    return getMockDiaries();
  }
}

/**
 * Stashes a new diary entry.
 * Encrypts content client-side before sending to database.
 */
export async function saveDiary(entry: DiaryEntry): Promise<boolean> {
  saveMockDiary(entry);

  if (!supabase) return true;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return true;

    const { error } = await supabase
      .from('diaries')
      .insert({
        user_id: user.id,
        emoji: entry.emoji,
        mood: entry.mood,
        content: encryptText(entry.text), // Encrypt content
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save diary to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Failed to save diary to Supabase:', e);
    return false;
  }
}

// --- Local Storage fallback helpers ---

function getMockProfile(): { dogName: string; dogSize: string } | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(MOCK_PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

function saveMockProfile(dogName: string, dogSize: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify({ dogName, dogSize }));
}

function getMockDiaries(): DiaryEntry[] {
  if (typeof window === 'undefined') return getDefaultDiaries();
  const data = localStorage.getItem(MOCK_DIARIES_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return getDefaultDiaries();
    }
  }
  return getDefaultDiaries();
}

function saveMockDiary(entry: DiaryEntry): void {
  if (typeof window === 'undefined') return;
  const current = getMockDiaries();
  const updated = [entry, ...current];
  localStorage.setItem(MOCK_DIARIES_KEY, JSON.stringify(updated));
}

function getDefaultDiaries(): DiaryEntry[] {
  return [
    { emoji: '🤩', mood: '신남', text: '서울숲에서 신나게 뛰어놀았다!', date: '6월 22일' },
    { emoji: '😌', mood: '편안', text: '한강 산책 후 곤히 잠들었어요', date: '6월 20일' },
  ];
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  } catch {
    return '오늘';
  }
}
