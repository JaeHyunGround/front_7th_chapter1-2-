import { act, renderHook } from '@testing-library/react';
import { ChangeEvent } from 'react';

import { useEventForm } from '../../hooks/useEventForm';
import { Event, RepeatInfo, RepeatType } from '../../types';

// TDD: 기대하는 useEventForm 반환 타입 정의 (구현 전 테스트 작성을 위한 타입)
interface UseEventFormReturnWithRepeatValidation {
  title: string;
  setTitle: (title: string) => void;
  date: string;
  setDate: (date: string) => void;
  startTime: string;
  setStartTime: (startTime: string) => void;
  endTime: string;
  setEndTime: (endTime: string) => void;
  description: string;
  setDescription: (description: string) => void;
  location: string;
  setLocation: (location: string) => void;
  category: string;
  setCategory: (category: string) => void;
  isRepeating: boolean;
  setIsRepeating: (isRepeating: boolean) => void;
  repeatType: RepeatType;
  setRepeatType: (repeatType: RepeatType) => void;
  repeatInterval: number;
  setRepeatInterval: (repeatInterval: number) => void;
  repeatEndDate: string;
  setRepeatEndDate: (repeatEndDate: string) => void;
  notificationTime: number;
  setNotificationTime: (notificationTime: number) => void;
  startTimeError: string | null;
  endTimeError: string | null;
  editingEvent: Event | null;
  setEditingEvent: (event: Event | null) => void;
  handleStartTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
  editEvent: (event: Event) => void;
  // 새로 추가될 기능들
  getRepeatInfo: () => RepeatInfo;
  intervalError: string | null;
  endDateError: string | null;
}

describe('useEventForm - 반복 상태/유효성 추가', () => {
  describe('AC1: repeat 상태 구조 확인', () => {
    it('초기 repeat 상태에 type, interval, endDate가 존재해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      expect(result.current).toHaveProperty('repeatType');
      expect(result.current).toHaveProperty('repeatInterval');
      expect(result.current).toHaveProperty('repeatEndDate');
    });

    it('초기 repeat 상태는 type=none, interval=1, endDate=""이어야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      expect(result.current.repeatType).toBe('none');
      expect(result.current.repeatInterval).toBe(1);
      expect(result.current.repeatEndDate).toBe('');
    });
  });

  describe('AC2: isRepeating = false일 때 정규화', () => {
    it('isRepeating = false일 때 getRepeatInfo()는 { type: "none", interval: 1, endDate: undefined }를 반환해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(false);
        result.current.setRepeatType('weekly');
        result.current.setRepeatInterval(3);
        result.current.setRepeatEndDate('2025-12-31');
      });

      // getRepeatInfo 메서드가 필요함 (구현 필요)
      expect(result.current).toHaveProperty('getRepeatInfo');
      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      const repeatInfo = hookResult.getRepeatInfo();

      expect(repeatInfo).toEqual({
        type: 'none',
        interval: 1,
        endDate: undefined,
      });
    });

    it('isRepeating = true일 때 getRepeatInfo()는 실제 설정값을 반환해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatType('weekly');
        result.current.setRepeatInterval(2);
        result.current.setRepeatEndDate('2025-12-31');
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      const repeatInfo = hookResult.getRepeatInfo();

      expect(repeatInfo).toEqual({
        type: 'weekly',
        interval: 2,
        endDate: '2025-12-31',
      });
    });
  });

  describe('AC3: interval 유효성 검증', () => {
    it('interval이 1 미만일 때 intervalError를 노출해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatInterval(0);
      });

      // intervalError 상태가 필요함 (구현 필요)
      expect(result.current).toHaveProperty('intervalError');
      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.intervalError).toBeTruthy();
    });

    it('interval이 소수일 때 intervalError를 노출해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatInterval(1.5);
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.intervalError).toBeTruthy();
    });

    it('interval이 음수일 때 intervalError를 노출해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatInterval(-2);
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.intervalError).toBeTruthy();
    });

    it('interval이 1 이상의 정수일 때 intervalError는 null이어야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatInterval(5);
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.intervalError).toBeNull();
    });

    it('isRepeating = false일 때는 interval 검증을 하지 않아야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(false);
        result.current.setRepeatInterval(0);
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.intervalError).toBeNull();
    });
  });

  describe('AC4: endDate 유효성 검증', () => {
    it('endDate가 빈 문자열일 때 endDateError는 null이어야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatEndDate('');
      });

      // endDateError 상태가 필요함 (구현 필요)
      expect(result.current).toHaveProperty('endDateError');
      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.endDateError).toBeNull();
    });

    it('endDate가 올바른 YYYY-MM-DD 포맷일 때 endDateError는 null이어야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatEndDate('2025-12-31');
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.endDateError).toBeNull();
    });

    it('endDate가 잘못된 포맷일 때 endDateError를 노출해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatEndDate('2025/12/31');
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.endDateError).toBeTruthy();
    });

    it('endDate가 유효하지 않은 날짜일 때 endDateError를 노출해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatEndDate('2025-13-40');
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.endDateError).toBeTruthy();
    });

    it('isRepeating = false일 때는 endDate 검증을 하지 않아야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(false);
        result.current.setRepeatEndDate('invalid-date');
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      expect(hookResult.endDateError).toBeNull();
    });
  });

  describe('AC5: 기존 이벤트 편집 시 repeat 매핑', () => {
    it('반복 없는 이벤트 편집 시 repeat 상태가 올바르게 매핑되어야 한다', () => {
      const mockEvent: Event = {
        id: '1',
        title: '테스트 이벤트',
        date: '2025-10-27',
        startTime: '10:00',
        endTime: '11:00',
        description: '설명',
        location: '장소',
        category: '업무',
        repeat: {
          type: 'none',
          interval: 1,
        },
        notificationTime: 10,
      };

      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.editEvent(mockEvent);
      });

      expect(result.current.isRepeating).toBe(false);
      expect(result.current.repeatType).toBe('none');
      expect(result.current.repeatInterval).toBe(1);
      expect(result.current.repeatEndDate).toBe('');
    });

    it('반복 있는 이벤트 편집 시 repeat 상태가 올바르게 매핑되어야 한다', () => {
      const mockEvent: Event = {
        id: '2',
        title: '반복 이벤트',
        date: '2025-10-27',
        startTime: '10:00',
        endTime: '11:00',
        description: '설명',
        location: '장소',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 2,
          endDate: '2025-12-31',
        },
        notificationTime: 10,
      };

      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.editEvent(mockEvent);
      });

      expect(result.current.isRepeating).toBe(true);
      expect(result.current.repeatType).toBe('weekly');
      expect(result.current.repeatInterval).toBe(2);
      expect(result.current.repeatEndDate).toBe('2025-12-31');
    });

    it('endDate가 없는 반복 이벤트 편집 시 빈 문자열로 매핑되어야 한다', () => {
      const mockEvent: Event = {
        id: '3',
        title: '반복 이벤트',
        date: '2025-10-27',
        startTime: '10:00',
        endTime: '11:00',
        description: '설명',
        location: '장소',
        category: '업무',
        repeat: {
          type: 'daily',
          interval: 1,
        },
        notificationTime: 10,
      };

      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.editEvent(mockEvent);
      });

      expect(result.current.isRepeating).toBe(true);
      expect(result.current.repeatType).toBe('daily');
      expect(result.current.repeatInterval).toBe(1);
      expect(result.current.repeatEndDate).toBe('');
    });
  });

  describe('AC6: 타입 정의 일치', () => {
    it('RepeatType은 none, daily, weekly, monthly, yearly 중 하나여야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      const validTypes: RepeatType[] = ['none', 'daily', 'weekly', 'monthly', 'yearly'];

      validTypes.forEach((type) => {
        act(() => {
          result.current.setRepeatType(type);
        });

        expect(result.current.repeatType).toBe(type);
      });
    });

    it('getRepeatInfo()의 반환 타입은 RepeatInfo와 일치해야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatType('monthly');
        result.current.setRepeatInterval(3);
        result.current.setRepeatEndDate('2025-12-31');
      });

      const hookResult = result.current as unknown as UseEventFormReturnWithRepeatValidation;
      const repeatInfo = hookResult.getRepeatInfo();

      // RepeatInfo 타입 구조 확인
      expect(repeatInfo).toHaveProperty('type');
      expect(repeatInfo).toHaveProperty('interval');
      expect(typeof repeatInfo.type).toBe('string');
      expect(typeof repeatInfo.interval).toBe('number');

      // endDate는 선택적이므로 undefined 또는 string
      if (repeatInfo.endDate !== undefined) {
        expect(typeof repeatInfo.endDate).toBe('string');
      }
    });
  });

  describe('추가: resetForm 동작 확인', () => {
    it('resetForm 호출 시 repeat 상태가 초기값으로 리셋되어야 한다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
        result.current.setRepeatType('weekly');
        result.current.setRepeatInterval(5);
        result.current.setRepeatEndDate('2025-12-31');
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.isRepeating).toBe(false);
      expect(result.current.repeatType).toBe('none');
      expect(result.current.repeatInterval).toBe(1);
      expect(result.current.repeatEndDate).toBe('');
    });
  });
});
