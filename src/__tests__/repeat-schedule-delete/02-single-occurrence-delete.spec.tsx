import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { http, HttpResponse } from 'msw';

import { server } from '../../setupTests';
import App from '../../App';

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

describe('[Story] 단일 인스턴스 삭제(예) - 예외 처리', () => {
  it("'예' 선택 시 해당 인스턴스만 예외 처리되고 성공 토스트가 노출된다 (Red)", async () => {
    const mockEvent: any = {
      id: '1',
      title: '주간 회의',
      date: '2025-11-05',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '업무',
      repeat: { type: 'weekly', interval: 1, id: 'r-123' },
      notificationTime: 10,
    };

    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({ events: [mockEvent] });
      }),
      http.put('/api/recurring-events/:repeatId', async ({ params, request }) => {
        const { repeatId } = params as { repeatId: string };
        const body = (await request.json()) as any;
        // 기대: 예외 날짜가 포함되어야 함
        expect(repeatId).toBe('r-123');
        expect(body?.repeat?.exceptions).toContain('2025-11-05');
        return HttpResponse.json({}, { status: 200 });
      })
    );

    const { user } = setup();

    // 삭제 → 모달 '예' 선택
    const deleteButton = await screen.findByLabelText('Delete event');
    await user.click(deleteButton);
    expect(await screen.findByText('해당 일정만 삭제하시겠어요?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '예' }));

    // Red: 현재 구현에서는 예외 처리/토스트가 없어 실패해야 함
    expect(await screen.findByText('일정이 삭제되었습니다.')).toBeInTheDocument();

    const list = screen.getByTestId('event-list');
    expect(within(list).queryByText('주간 회의')).toBeNull();
  });
});
