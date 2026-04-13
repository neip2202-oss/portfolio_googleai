/**
 * Default content data for the portfolio
 */

// --- Types ---
export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  color: string;
  content: string;
}

export interface GamePlay {
  id: string;
  name: string;
  hours: number;
}

export interface GameHistory {
  online: GamePlay[];
  mobile: GamePlay[];
  package: GamePlay[];
}

export interface ResumeData {
  name: string;
  role: string;
  email: string;
  linkedin: string;
  github: string;
  notion: string;
  dob: string;
  image: string;
  oneLineIntro: string;
  summary: string;
  selfIntroduction: { title: string; body: string }[];
  skills: { name: string; icon: string }[];
  education: { title: string; period: string; description: string; details: string[] }[];
  experience: { title: string; period: string; description: string; details: string[] }[];
  awards: { title: string; organization: string; year: string }[];
}

export interface HeroContent {
  titleLine1: string;
  titleLine2: string;
  description: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  paragraphs: string[];
}

// --- Default Data ---
export const DEFAULT_HERO: HeroContent = {
  titleLine1: "의도를 구조로 만들고",
  titleLine2: "구조를 결과로 완성하는 기획자",
  description: "사용자의 경험을 논리적으로 설계하고, 명확한 문서화를 통해 팀의 비전을 구체화합니다. 데이터와 심리학을 기반으로 한 깊이 있는 기획을 지향합니다.",
};

export const DEFAULT_ABOUT: AboutContent = {
  title: "About Me",
  subtitle: "게임의 세상을 넓을 수 있다고 믿는 게임 기획자",
  paragraphs: [
    "저는 \"재미\"를 수치와 논리로 증명하는 게임 기획자입니다.",
    "단순한 아이디어 나열이 아닌, 유기적으로 연결된 시스템과 플레이어의 감정 곡선을 고려한 설계를 지향합니다.",
  ],
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "네온 프로토콜",
    category: "시스템 디자인",
    description: "모듈형 어빌리티 트리와 동적 경제 밸런싱에 중점을 둔 사이버펑크 테마의 RPG 시스템입니다.",
    tags: ["시스템 기획", "GDD 작성", "밸런싱"],
    image: "https://picsum.photos/seed/cyberpunk/800/600",
    color: "#6366f1",
    content: "# 네온 프로토콜\n\n모듈형 어빌리티 트리와 동적 경제 밸런싱에 중점을 둔 RPG 시스템.",
  },
  {
    id: 2,
    title: "잊혀진 첨탑",
    category: "레벨 디자인",
    description: "UE5로 제작된 3D 플랫포머 레벨. 수직적 구조와 조명 가이드 설계.",
    tags: ["레벨 디자인", "UE5", "스토리텔링"],
    image: "https://picsum.photos/seed/castle/800/600",
    color: "#10b981",
    content: "# 잊혀진 첨탑\n\n수직적 구조와 환경 스토리텔링에 집중한 레벨 디자인.",
  },
  {
    id: 3,
    title: "택티컬 에코",
    category: "전투 디자인",
    description: "유닛이 마지막 행동을 반복하는 독특한 '에코' 메커니즘의 턴제 전략 게임.",
    tags: ["전투 기획", "프로토타이핑", "전략"],
    image: "https://picsum.photos/seed/strategy/800/600",
    color: "#f97316",
    content: "# 택티컬 에코\n\n에코 메커니즘을 활용한 턴제 전략 설계.",
  },
  {
    id: 4,
    title: "크로노 바운드",
    category: "시스템 디자인",
    description: "시간 역행 메커니즘을 활용한 퍼즐 액션 게임 시스템 기획.",
    tags: ["시간 역행", "퍼즐 기획", "시스템"],
    image: "https://picsum.photos/seed/time/800/600",
    color: "#3b82f6",
    content: "# 크로노 바운드\n\n시간 역행 메커니즘을 활용한 퍼즐 액션 게임.",
  },
];

export const DEFAULT_GAME_HISTORY: GameHistory = {
  online: [
    { id: 'o1', name: "League of Legends", hours: 3500 },
    { id: 'o2', name: "Lost Ark", hours: 1200 },
    { id: 'o3', name: "MapleStory", hours: 2000 },
    { id: 'o4', name: "Overwatch 2", hours: 800 },
  ],
  mobile: [
    { id: 'm1', name: "Genshin Impact", hours: 900 },
    { id: 'm2', name: "Blue Archive", hours: 500 },
    { id: 'm3', name: "Fate/Grand Order", hours: 700 },
    { id: 'm4', name: "Arknights", hours: 400 },
  ],
  package: [
    { id: 'p1', name: "Elden Ring", hours: 180 },
    { id: 'p2', name: "Zelda: BotW", hours: 300 },
    { id: 'p3', name: "Monster Hunter", hours: 600 },
    { id: 'p4', name: "Cyberpunk 2077", hours: 120 },
  ],
};

export const DEFAULT_RESUME: ResumeData = {
  name: "이솔립",
  role: "Game System Designer",
  email: "solip.dev@email.com",
  linkedin: "linkedin.com/in/solip-game",
  github: "github.com/solip-dev",
  notion: "notion.so/solip-portfolio",
  dob: "199X.XX.XX",
  image: "https://picsum.photos/seed/profile/400/400",
  oneLineIntro: "게임의 세상을 넓을 수 있다고 믿는 게임 기획자",
  summary: "\"재미\"를 수치와 논리로 증명하는 게임 기획자입니다.",
  selfIntroduction: [
    { title: "성장 과정", body: "어린 시절부터 게임은 단순한 오락 이상의 의미였습니다..." },
    { title: "핵심 역량", body: "데이터와 논리에 기반한 사고력이 강점입니다..." }
  ],
  skills: [
    { name: "Unity", icon: "🎮" },
    { name: "Unreal Engine", icon: "🚀" },
    { name: "Figma", icon: "🎨" }
  ],
  education: [
    {
      title: "게임 기획 전문가 부트캠프",
      period: "2024.01 - 2024.06",
      description: "실무 중심의 게임 기획 프로세스 전반을 이수",
      details: ["시스템 기획", "레벨 디자인", "GDD 작성"],
    },
  ],
  experience: [
    {
      title: "네온 프로토콜 (Neon Protocol)",
      period: "2024.03 - 2024.05",
      description: "사이버펑크 RPG 시스템 기획 및 프로토타이핑",
      details: ["경험치 및 스탯 성장 테이블 설계", "모듈형 스킬 트리 시스템 설계"],
    },
  ],
  awards: [
    { title: "게임기획전문가 자격증", organization: "한국콘텐츠진흥원", year: "2023" },
  ],
};
