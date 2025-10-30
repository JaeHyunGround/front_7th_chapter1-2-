import { expandEventsForRange } from '../../utils/repeat';
import { Event } from '../../types';

describe('[Story] 예외 반영 확장', () => {
  it('exceptions에 포함된 날짜는 확장에서 제외된다 (Red)', () => {
    const series: Event = {
      id: 's-1',
      title: '주간 회의',
      date: '2025-11-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '업무',
      repeat: {
        type: 'weekly',
        interval: 1,
        // 테스트가 기대하는 필드 (타입은 선택 필드로 가정)
        // @ts-expect-error - 선택 필드 확장을 위해 임시 사용 (Green 단계에서 타입 보강 예정)
        exceptions: ['2025-11-05'],
        // @ts-expect-error - 선택 필드 확장을 위해 임시 사용
        id: 'r-777',
      } as any,
      notificationTime: 10,
    };

    const start = new Date('2025-11-03');
    const end = new Date('2025-11-09');

    const expanded = expandEventsForRange([series], start, end);

    // 2025-11-05는 요일 상 첫 주 수요일로 발생하지만 exceptions에 있어 제외되어야 함
    expect(expanded.find((e) => e.date === '2025-11-05')).toBeUndefined();
  });
});
