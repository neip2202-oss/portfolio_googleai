import { useState, useEffect } from 'react';
import { supabaseFetch, hasContent, safeSerialize } from '../utils/supabase';

/**
 * Deep merge: merges loaded data with initial defaults so that
 * any new fields added to the schema get their default values
 * even if existing Supabase data doesn't have them.
 */
function deepMerge<T>(defaults: T, loaded: any): T {
  if (defaults === null || defaults === undefined) return loaded;
  if (loaded === null || loaded === undefined) return defaults;

  // Arrays: use loaded data as-is (don't merge array items)
  if (Array.isArray(defaults)) {
    return (Array.isArray(loaded) ? loaded : defaults) as T;
  }

  // Objects: merge keys
  if (typeof defaults === 'object' && typeof loaded === 'object') {
    const result: any = { ...defaults };
    for (const key of Object.keys(loaded)) {
      if (key in result) {
        result[key] = deepMerge(result[key], loaded[key]);
      } else {
        result[key] = loaded[key];
      }
    }
    // Ensure all default keys exist in result
    for (const key of Object.keys(defaults as any)) {
      if (!(key in result) || result[key] === undefined) {
        result[key] = (defaults as any)[key];
      }
    }
    return result as T;
  }

  // Primitives: use loaded
  return loaded;
}

export function useContent<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [data, setData] = useState<T>(initial);

  useEffect(() => {
    supabaseFetch(`site_content?key=eq.${key}&select=value`)
      .then((rows) => {
        if (rows && rows.length > 0 && hasContent(rows[0].value)) {
          // Deep merge loaded data with defaults to fill missing fields
          const merged = deepMerge(initial, rows[0].value);
          setData(merged);
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
