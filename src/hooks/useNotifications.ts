import { useEffect, useState } from 'react';

import { Event } from '../types';
import { createNotificationMessage, getUpcomingEvents } from '../utils/notificationUtils';

export const useNotifications = (events: Event[]) => {
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);
  const [notifiedEvents, setNotifiedEvents] = useState<string[]>([]);

  const checkUpcomingEvents = () => {
    const now = new Date();
    const upcomingEvents = getUpcomingEvents(events, now, notifiedEvents);

    setNotifications((prev) => [
      ...prev,
      ...upcomingEvents.map((event) => ({
        id: event.id,
        message: createNotificationMessage(event),
      })),
    ]);

    setNotifiedEvents((prev) => [...prev, ...upcomingEvents.map(({ id }) => id)]);
  };

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // 마운트/이벤트 변경 시 즉시 1회 체크하여 아이콘 표시 지연 최소화
    checkUpcomingEvents();
    const interval = setInterval(checkUpcomingEvents, 1000); // 1초마다 체크
    return () => clearInterval(interval);
  }, [events, notifiedEvents]);

  return { notifications, notifiedEvents, setNotifications, removeNotification };
};
