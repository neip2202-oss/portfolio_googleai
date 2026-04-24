export const fetchGameIconFromNaver = async (gameName: string): Promise<string | null> => {
  try {
    const encodedKeyword = encodeURIComponent(gameName);
    const targetUrl = `https://apis.naver.com/nng_main/nng_main/search/${encodedKeyword}`;
    
    // Using allorigins as a reliable public CORS proxy
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    
    // Add timeout to prevent hanging on slow proxy
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout

    const response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    
    const proxyData = await response.json();
    const data = JSON.parse(proxyData.contents);
    
    const loungeList = data?.content?.lounge?.loungeList;
    if (loungeList && loungeList.length > 0) {
      // Find the best match: exact match first, then partial match
      const sanitizedGameName = gameName.toLowerCase().replace(/\s+/g, '');
      let bestMatch = loungeList.find((l: any) => l.loungeName.toLowerCase().replace(/\s+/g, '') === sanitizedGameName);
      
      if (!bestMatch) {
        bestMatch = loungeList.find((l: any) => l.loungeName.toLowerCase().replace(/\s+/g, '').includes(sanitizedGameName));
      }
      
      // We STRICTLY require a name match. If no match, do NOT use the first item.
      if (bestMatch) {
        return bestMatch.logoImageSquareUrl || bestMatch.titleImageUrl || null;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch icon for ${gameName}:`, error);
  }
  return null;
};
