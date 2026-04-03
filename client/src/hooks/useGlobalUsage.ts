import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'cyp_global_uses';
export const FREE_USE_LIMIT = 3;

function getStoredCount(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

export function useGlobalUsage() {
  const { isPro } = useAuth();
  const [count, setCount] = useState<number>(getStoredCount);

  const usesRemaining = isPro ? Infinity : Math.max(0, FREE_USE_LIMIT - count);
  const canUse = isPro || count < FREE_USE_LIMIT;

  const recordUse = useCallback(() => {
    if (isPro) return;
    const newCount = getStoredCount() + 1;
    try {
      localStorage.setItem(STORAGE_KEY, String(newCount));
    } catch {}
    setCount(newCount);
  }, [isPro]);

  return { canUse, usesRemaining, count, recordUse, FREE_USE_LIMIT };
}
