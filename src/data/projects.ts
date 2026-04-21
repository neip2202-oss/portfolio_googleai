/** Projects — 프로젝트 쇼케이스 데이터 */
export interface Project {
  id: string;
  title: string;
  genre: string;
  roles: string[];
  description: string;
  image: string;
  links: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    id: 'super-bumpers',
    title: 'Super Bumpers',
    genre: '캐주얼 액션 레이싱',
    roles: ['PD', 'PM', '차량(성장) 기획', '인게임 규칙', 'UI/UX', 'QA'],
    description:
      '속도=공격이라는 단순한 규칙 위에, 차량과 성장을 더해 계속 플레이하게 만드는 구조를 고민했습니다. 구글 스토어와 스팀 출시의 전 과정을 경험했습니다.',
    image: 'https://picsum.photos/seed/bumpers/800/500',
    links: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.lattechicken.firebaseTest' },
      { label: 'Steam', url: 'https://store.steampowered.com/app/4549900/Super_Bumpers/' },
    ],
  },
  {
    id: 'rtd-maplestory',
    title: 'R.T.D (Random Tile Defense)',
    genre: '로그라이크 타워 디펜스',
    roles: ['PM', '퀘스트 기획', '아이템 기획', '사운드 기획', '맵 제작'],
    description:
      '메이플스토리 월드에서 제작한 로그라이크 타워 디펜스 게임. 랜덤 타일 배치와 전략적 유닛 운용.',
    image: 'https://picsum.photos/seed/rtd/800/500',
    links: [
      { label: 'MapleStory World', url: 'https://maplestoryworlds.nexon.com/ko/play/cf38fa71d1704db5be200f67fc094b7b/' },
    ],
  },
  {
    id: 'rtd2',
    title: 'R.T.D 2',
    genre: '로그라이크 타워 디펜스',
    roles: ['PD', 'PM', '타일/맵 기획', '스테이지/웨이브 기획', '몬스터 기획'],
    description:
      '전작의 시스템을 발전시켜 더 깊은 전략성과 스테이지 변주를 추가한 후속작.',
    image: 'https://picsum.photos/seed/rtd2/800/500',
    links: [],
  },
];
