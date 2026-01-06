import { useEffect, useState, useRef } from 'react';
import simpleQueryClient from '../services/simpleQueryClient';

export function useApiQuery<T>(key: string, fetchFn: () => Promise<T>, options?: { staleTime?: number }) {
  const staleTime = options?.staleTime ?? 30000;
  const mounted = useRef(true);
  const [data, setData] = useState<T | undefined>(() => {
    const cached = simpleQueryClient.getCached(key);
    return cached ? cached.data as T : undefined;
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<any>(null);

  const fetchAndSet = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      if (!mounted.current) return;
      setData(res);
      simpleQueryClient.setCached(key, res);
    } catch (e) {
      if (!mounted.current) return;
      setError(e);
    } finally {
      if (!mounted.current) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    const cached = simpleQueryClient.getCached(key);
    if (cached) {
      const age = Date.now() - cached.ts;
      if (age > staleTime) {
        fetchAndSet();
      }
    } else {
      fetchAndSet();
    }

    const unsub = simpleQueryClient.onInvalidate(() => {
      // If cache cleared or key invalidated, refetch
      fetchAndSet();
    });

    return () => {
      mounted.current = false;
      unsub();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, error, refetch: fetchAndSet };
}

export default useApiQuery;