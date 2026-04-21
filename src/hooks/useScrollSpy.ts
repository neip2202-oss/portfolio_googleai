import { useEffect, useRef, useState } from 'react';

/**
 * 스크롤 위치를 감지해 현재 활성 섹션 ID를 반환합니다.
 * Header 네비게이션 하이라이트에 사용됩니다.
 */
export function useScrollSpy(sectionIds: string[], offset = 120): string {
  const [active, setActive] = useState(sectionIds[0] ?? '');
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY + offset;
        let current = sectionIds[0] ?? '';

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollY) {
            current = id;
          }
        }
        setActive(current);
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return active;
}
