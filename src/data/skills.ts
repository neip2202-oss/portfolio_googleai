/** Skills & Strengths — 핵심 역량 데이터 */
export interface Strength {
  title: string;
  description: string;
  icon: string;
}

export const strengths: Strength[] = [
  {
    icon: '🎯',
    title: '시스템 기획',
    description: '경제 시스템, 성장 구조, 전투 밸런싱 등 게임의 핵심 루프를 설계합니다.',
  },
  {
    icon: '📐',
    title: '레벨 디자인',
    description: '공간 구성과 난이도 곡선을 통해 플레이어 경험을 설계합니다.',
  },
  {
    icon: '📄',
    title: 'GDD 작성',
    description: '팀 전체가 같은 방향을 볼 수 있는 명확한 기획 문서를 작성합니다.',
  },
  {
    icon: '📊',
    title: '데이터 기반 밸런싱',
    description: '수치와 테스트 데이터를 기반으로 게임 밸런스를 조정합니다.',
  },
];

export interface Skill {
  name: string;
  category: 'tool' | 'engine' | 'skill';
}

export const skills: Skill[] = [
  { name: 'Unity', category: 'engine' },
  { name: 'Unreal Engine', category: 'engine' },
  { name: 'Figma', category: 'tool' },
  { name: 'Notion', category: 'tool' },
  { name: 'Google Sheets', category: 'tool' },
  { name: 'Photoshop', category: 'tool' },
  { name: 'C#', category: 'skill' },
  { name: 'Lua', category: 'skill' },
];
