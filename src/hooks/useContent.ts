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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleAdminCheck = (e: any) => setIsAdmin(e.detail);
    window.addEventListener('admin-status-change', handleAdminCheck);
    window.dispatchEvent(new CustomEvent('request-admin-status'));
    return () => window.removeEventListener('admin-status-change', handleAdminCheck);
  }, []);

  useEffect(() => {
    const storageKey = (companyId && companyId !== 'default') ? `${key}_${companyId}` : key;

    // 1. SWR: Load from local cache immediately to prevent blank screens
    const cached = localStorage.getItem(`cache_${storageKey}`);
    let localUpdatedAt: string | null = null;
    let fallbackVal = initial;

    if (cached) {
       try {
          const parsed = JSON.parse(cached);
          fallbackVal = parsed.value;
          localUpdatedAt = parsed.updated_at;
          // 일반 유저인 경우 즉시 캐시 렌더링 (관리자는 서버 데이터만 신뢰)
          if (!isAdmin) {
             setData(fallbackVal);
             if (localUpdatedAt) {
                 setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('sync-status', { detail: { syncedAt: localUpdatedAt } }));
                 }, 50);
              }
          }
       } catch (e) {
          console.error('Cache parse error', e);
       }
    }

    const loadData = async () => {
      try {
        // 2. Freshness Check (Fetch only updated_at)
        const checkRows = await supabaseFetch(`site_content?key=eq.${storageKey}&select=updated_at`);
        
        // 500 Error, CORS, or Timeout handling
        if (!checkRows) {
           throw new Error("Network/Server Unreachable");
        }

        // 3. Skip heavy download if local cache is fresh (관리자는 무조건 패스하여 실시간 로드)
        if (!isAdmin && checkRows.length > 0) {
           const serverUpdatedAt = checkRows[0].updated_at;
           if (localUpdatedAt && serverUpdatedAt && new Date(localUpdatedAt) >= new Date(serverUpdatedAt)) {
              window.dispatchEvent(new CustomEvent('app-network-status', { detail: { isOffline: false } }));
              window.dispatchEvent(new CustomEvent('sync-status', { detail: { syncedAt: serverUpdatedAt } }));
              return; // Cache is perfectly fresh
           }
        }

        // 4. Fetch Full Data (Server has newer data or no cache exists)
        const defaultRows = await supabaseFetch(`site_content?key=eq.${key}&select=value,updated_at`);
        let defaultVal = initial;
        let finalUpdatedAt = new Date().toISOString();

        if (defaultRows && defaultRows.length > 0 && hasContent(defaultRows[0].value)) {
          defaultVal = deepMerge(initial, defaultRows[0].value);
          finalUpdatedAt = defaultRows[0].updated_at || finalUpdatedAt;
        }

        let finalVal = defaultVal;

        if (companyId && companyId !== 'default') {
          const customRows = await supabaseFetch(`site_content?key=eq.${storageKey}&select=value,updated_at`);
          if (customRows && customRows.length > 0 && hasContent(customRows[0].value)) {
            finalVal = deepMerge(defaultVal, customRows[0].value);
            finalUpdatedAt = customRows[0].updated_at || finalUpdatedAt;
          }
        }

        // 5. Update State
        setData(finalVal);
        window.dispatchEvent(new CustomEvent('app-network-status', { detail: { isOffline: false } }));
        window.dispatchEvent(new CustomEvent('sync-status', { detail: { syncedAt: finalUpdatedAt } }));
        
        // 6. Refresh Local Cache (Safely handled in case of 5MB Quota Exceeded)
        try {
          localStorage.setItem(`cache_${storageKey}`, JSON.stringify({ value: finalVal, updated_at: finalUpdatedAt }));
        } catch (storageErr) {
          console.warn(`[Local Cache Warning] Could not save ${storageKey} to localStorage due to size limits (QuotaExceededError).`, storageErr);
        }

      } catch (error) {
        console.error(`Error loading content for ${key}:`, error);
        window.dispatchEvent(new CustomEvent('app-network-status', { detail: { isOffline: true } }));
        if (localUpdatedAt) {
           window.dispatchEvent(new CustomEvent('sync-status', { detail: { syncedAt: localUpdatedAt } }));
        }
        
        if (isAdmin) {
           // 관리자는 서버 불안정 시 작업 금지 경고를 받지만, 최소한의 뷰를 위해 캐시는 표시함
           window.dispatchEvent(new CustomEvent('show-toast', { detail: '서버 불안정: 데이터 저장이 실패할 수 있습니다.' }));
           if (cached) setData(fallbackVal);
           else setData(initial);
        } else {
           if (cached) {
              window.dispatchEvent(new CustomEvent('show-toast', { detail: '네트워크 환경이 불안정하여 임시 저장된 데이터를 표시합니다.' }));
              setData(fallbackVal);
           } else {
              setData(initial); // Fallback to hardcoded initial if even cache is missing
           }
        }
      }
    };

    loadData();
  }, [key, companyId, isAdmin]);

  const update = (newData: T | ((prev: T) => T)) => {
    setData((prev) => {
      const updatedValue = typeof newData === 'function' ? (newData as Function)(prev) : newData;
      const serializable = safeSerialize(updatedValue);
      const storageKey = (companyId && companyId !== 'default') ? `${key}_${companyId}` : key;
      const now = new Date().toISOString();
      
      // 1. Send to Server First (데이터 무결성 확보)
      supabaseFetch('site_content', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ key: storageKey, value: serializable, updated_at: now }),
      })
      .then((res) => {
        if (!res) throw new Error('Server returned an invalid response or null.');
        // 2. 서버 통신에 100% 성공했을 때만 로컬 캐시 및 푸터 시간 갱신 (쓰기 로직 분리)
        try {
            localStorage.setItem(`cache_${storageKey}`, JSON.stringify({ value: updatedValue, updated_at: now }));
        } catch(e) {
            console.warn(`[Local Cache Warning] Could not update ${storageKey} cache on save.`, e);
        }
        window.dispatchEvent(new CustomEvent('sync-status', { detail: { syncedAt: now } }));
      })
      .catch((err) => {
        console.error('Server save failed, not updating local cache:', err);
        window.dispatchEvent(new CustomEvent('show-toast', { detail: '서버 통신 실패: 로컬 캐시 갱신이 중단되었습니다.' }));
      });
      
      // 화면(UI) 상단에만 즉각적인 상태 반영 (Optimistic UI)
      return updatedValue;
    });
  };

  return [data, update];
}
