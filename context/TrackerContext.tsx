import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { Role } from '@/constants/roles';

export type Marker = 'good' | 'evil' | 'unknown' | null;

export interface PlayerSlot {
  role: Role | null;
  marker: Marker;
  dead: boolean;
}

export interface GameState {
  playerCount: number;
  slots: Record<number, PlayerSlot>;
}

interface TrackerContextValue {
  playerCount: number;
  slots: Record<number, PlayerSlot>;
  setPlayerCount: (n: number) => void;
  updateSlot: (num: number, patch: Partial<PlayerSlot>) => void;
  resetGame: () => void;
  getSlot: (num: number) => PlayerSlot;
}

const STORAGE_KEY = 'wv_tracker_v2';

const defaultSlot = (): PlayerSlot => ({
  role: null,
  marker: null,
  dead: false,
});

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [playerCount, setPlayerCountState] = useState<number>(16);
  const [slots, setSlotsState] = useState<Record<number, PlayerSlot>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed: GameState = JSON.parse(raw);
          setPlayerCountState(parsed.playerCount || 16);
          setSlotsState(parsed.slots || {});
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((count: number, s: Record<number, PlayerSlot>) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ playerCount: count, slots: s }));
  }, []);

  const setPlayerCount = useCallback((n: number) => {
    setPlayerCountState(n);
    persist(n, slots);
  }, [slots, persist]);

  const updateSlot = useCallback((num: number, patch: Partial<PlayerSlot>) => {
    setSlotsState(prev => {
      const next = { ...prev, [num]: { ...defaultSlot(), ...prev[num], ...patch } };
      persist(playerCount, next);
      return next;
    });
  }, [playerCount, persist]);

  const resetGame = useCallback(() => {
    setSlotsState({});
    persist(playerCount, {});
  }, [playerCount, persist]);

  const getSlot = useCallback((num: number): PlayerSlot => {
    return slots[num] ?? defaultSlot();
  }, [slots]);

  if (!loaded) return null;

  return (
    <TrackerContext.Provider value={{ playerCount, slots, setPlayerCount, updateSlot, resetGame, getSlot }}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider');
  return ctx;
}
