/** How I Work — 일하는 방식 데이터 */
export interface WorkStyle {
  icon: string;
  title: string;
  description: string;
}

export const workStyles: WorkStyle[] = [
  {
    icon: '🔍',
    title: '문제를 정의합니다',
    description: '겉으로 드러난 요청이 아닌, 본질적인 문제를 재정의합니다.',
  },
  {
    icon: '🧩',
    title: '구조로 설계합니다',
    description:
      '협업 과정에서 문제를 구조적으로 정리하고, 팀이 이해할 수 있는 형태로 풀어냅니다.',
  },
  {
    icon: '📝',
    title: '문서로 정렬합니다',
    description: '팀이 같은 방향을 볼 수 있도록 명확하게 문서화합니다.',
  },
  {
    icon: '⚡',
    title: '빠르게 검증합니다',
    description: '프로토타입과 테스트를 통해 빠르게 판단하고 개선합니다.',
  },
  {
    icon: '🤖',
    title: 'AI로 확장합니다',
    description: 'AI를 활용해 반복 작업을 줄이고, 기획의 속도와 깊이를 높입니다.',
  },
  {
    icon: '🚀',
    title: '실행으로 완성합니다',
    description: '기획에 그치지 않고, 실제 결과까지 만들어냅니다.',
  },
];
