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

export function useContent<T>(key: string, initial: T, companyId: string = 'default'): [T, (v: T | ((prev: T) => T)) => void] {
  const [data, setData] = useState<T>(initial);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch Default Data
        const defaultRows = await supabaseFetch(`site_content?key=eq.${key}&select=value`);
        let defaultVal = initial;
        if (defaultRows && defaultRows.length > 0 && hasContent(defaultRows[0].value)) {
          defaultVal = deepMerge(initial, defaultRows[0].value);
        }

        // 2. If companyId is provided and not 'default', fetch and merge Custom Data
        if (companyId && companyId !== 'default') {
          const customRows = await supabaseFetch(`site_content?key=eq.${key}_${companyId}&select=value`);
          if (customRows && customRows.length > 0 && hasContent(customRows[0].value)) {
            // Inheritance: Custom data overrides Default data
            const merged = deepMerge(defaultVal, customRows[0].value);
            setData(merged);
          } else {
            // Fallback to Default if no custom data exists for this company
            setData(defaultVal);
          }
        } else {
          setData(defaultVal);
        }
      } catch (error) {
        console.error(`Error loading content for ${key}:`, error);
      }
    };

    loadData();
  }, [key, companyId]);

  const update = (newData: T | ((prev: T) => T)) => {
    setData((prev) => {
      const updatedValue = typeof newData === 'function' ? (newData as Function)(prev) : newData;
      const serializable = safeSerialize(updatedValue);
      
      // Save to company-specific key if not default
      const storageKey = (companyId && companyId !== 'default') ? `${key}_${companyId}` : key;
      
      supabaseFetch('site_content', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ key: storageKey, value: serializable, updated_at: new Date().toISOString() }),
      }).catch(console.error);
      
      return updatedValue;
    });
  };

  return [data, update];
}
