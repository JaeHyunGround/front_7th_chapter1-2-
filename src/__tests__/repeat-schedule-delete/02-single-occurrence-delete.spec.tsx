import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { SnackbarProvider } from 'notistack';

import App from '../../App';
import { server } from '../../setupTests';
import { Event } from '../../types';

const theme = createTheme();

const setup = () => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

type PutRecurringBody = {
  repeat?: {
    exceptions?: string[];
  };
};

describe('[Story] 단일 인스턴스 삭제(예) - 예외 처리', () => {
  it("'예' 선택 시 기존 exceptions에 선택 날짜가 병합되어 전송되고, 성공 토스트 및 리스트 반영 (Red)", async () => {
    const mockEvent: Event = {
      id: '1',
      title: '주간 회의',
      date: '2025-11-05',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '업무',
      repeat: { type: 'weekly', interval: 1, id: 'r-123', exceptions: ['2025-11-12'] },
      notificationTime: 10,
    };

    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({ events: [mockEvent] });
      }),
      http.put('/api/recurring-events/:repeatId', async ({ params, request }) => {
        const { repeatId } = params as Record<string, string>;
        const body = (await request.json()) as PutRecurringBody;

        expect(repeatId).toBe('r-123');
        // Red 조건: 기존 '2025-11-12'와 신규 '2025-11-05'가 모두 포함되어야 함(중복 없이)
        const exceptions = body.repeat?.exceptions ?? [];
        expect(exceptions).toEqual(expect.arrayContaining(['2025-11-12', '2025-11-05']));
        expect(new Set(exceptions).size).toBe(exceptions.length);

        return HttpResponse.json({}, { status: 200 });
      })
    );

    const { user } = setup();

    // 삭제 → 모달 '예' 선택
    const deleteButton = await screen.findByLabelText('Delete event');
    await user.click(deleteButton);
    expect(await screen.findByText('해당 일정만 삭제하시겠어요?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '예' }));

    // 이후 기대: 성공 토스트, 리스트에서 제목 미노출
    expect(await screen.findByText('일정이 삭제되었습니다.')).toBeInTheDocument();
    const list = screen.getByTestId('event-list');
    expect(within(list).queryByText('주간 회의')).toBeNull();
  });
});
