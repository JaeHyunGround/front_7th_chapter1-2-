import { ChangeEvent, useMemo, useState } from 'react';

import { Event, RepeatInfo, RepeatType } from '../types';
import { getTimeErrorMessage } from '../utils/timeValidation';

type TimeErrorRecord = Record<'startTimeError' | 'endTimeError', string | null>;

export const useEventForm = (initialEvent?: Event) => {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [date, setDate] = useState(initialEvent?.date || '');
  const [startTime, setStartTime] = useState(initialEvent?.startTime || '');
  const [endTime, setEndTime] = useState(initialEvent?.endTime || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [location, setLocation] = useState(initialEvent?.location || '');
  const [category, setCategory] = useState(initialEvent?.category || '업무');
  const [isRepeating, setIsRepeating] = useState(initialEvent?.repeat.type !== 'none');
  const [repeatType, setRepeatType] = useState<RepeatType>(initialEvent?.repeat.type || 'none');
  const [repeatInterval, setRepeatInterval] = useState(initialEvent?.repeat.interval || 1);
  const [repeatEndDate, setRepeatEndDate] = useState(initialEvent?.repeat.endDate || '');
  const [notificationTime, setNotificationTime] = useState(initialEvent?.notificationTime || 10);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [{ startTimeError, endTimeError }, setTimeError] = useState<TimeErrorRecord>({
    startTimeError: null,
    endTimeError: null,
  });

  // interval 유효성 검증
  const intervalError = useMemo(() => {
    if (!isRepeating) return null;

    if (repeatInterval < 1) {
      return '반복 간격은 1 이상이어야 합니다.';
    }

    if (!Number.isInteger(repeatInterval)) {
      return '반복 간격은 정수여야 합니다.';
    }

    return null;
  }, [isRepeating, repeatInterval]);

  // endDate 유효성 검증
  const endDateError = useMemo(() => {
    if (!isRepeating) return null;
    if (repeatEndDate === '') return null;

    // YYYY-MM-DD 포맷 검증
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(repeatEndDate)) {
      return '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)';
    }

    // 유효한 날짜인지 검증
    const date = new Date(repeatEndDate);
    const [year, month, day] = repeatEndDate.split('-').map(Number);

    if (
      isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      return '유효하지 않은 날짜입니다.';
    }

    return null;
  }, [isRepeating, repeatEndDate]);

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    setTimeError(getTimeErrorMessage(newStartTime, endTime));
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    setTimeError(getTimeErrorMessage(startTime, newEndTime));
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setLocation('');
    setCategory('업무');
    setIsRepeating(false);
    setRepeatType('none');
    setRepeatInterval(1);
    setRepeatEndDate('');
    setNotificationTime(10);
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setDescription(event.description);
    setLocation(event.location);
    setCategory(event.category);
    setIsRepeating(event.repeat.type !== 'none');
    setRepeatType(event.repeat.type);
    setRepeatInterval(event.repeat.interval);
    setRepeatEndDate(event.repeat.endDate || '');
    setNotificationTime(event.notificationTime);
  };

  const getRepeatInfo = (): RepeatInfo => {
    if (!isRepeating) {
      return {
        type: 'none',
        interval: 1,
        endDate: undefined,
      };
    }

    return {
      type: repeatType,
      interval: repeatInterval,
      endDate: repeatEndDate || undefined,
    };
  };

  return {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
    getRepeatInfo,
    intervalError,
    endDateError,
  };
};
