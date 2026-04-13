import { useState, useEffect } from 'react';
import { supabaseFetch, hasContent, safeSerialize } from '../utils/supabase';

export function useContent<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [data, setData] = useState<T>(initial);

  useEffect(() => {
    supabaseFetch(`site_content?key=eq.${key}&select=value`)
      .then((rows) => {
        if (rows && rows.length > 0 && hasContent(rows[0].value)) {
          setData(rows[0].value as T);
        }
      })
      .catch(() => {});
  }, [key]);

  const update = (newData: T | ((prev: T) => T)) => {
    setData((prev) => {
      const updatedValue = typeof newData === 'function' ? (newData as Function)(prev) : newData;
      const serializable = safeSerialize(updatedValue);
      supabaseFetch('site_content', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ key, value: serializable, updated_at: new Date().toISOString() }),
      }).catch(console.error);
      return updatedValue;
    });
  };

  return [data, update];
}
