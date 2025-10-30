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

describe('[Story] 비반복 일정 삭제', () => {
  it('삭제 클릭 시 단일 일정이 삭제되고 성공 토스트가 노출된다 (Red)', async () => {
    const singleEvent = {
      id: 'e-1',
      title: '단일 회의',
      date: '2025-11-06',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '업무',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 10,
    };

    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({ events: [singleEvent] });
      }),
      http.delete('/api/events/:id', ({ params }) => {
        expect((params as any).id).toBe('e-1');
        return new HttpResponse(null, { status: 204 });
      })
    );

    const { user } = setup();

    const deleteButton = await screen.findByLabelText('Delete event');
    await user.click(deleteButton);

    // Red: 현재 구현에서는 리스트 반영이 즉시 되지 않으므로 실패해야 함
    expect(await screen.findByText('일정이 삭제되었습니다.')).toBeInTheDocument();

    const list = screen.getByTestId('event-list');
    expect(within(list).queryByText('단일 회의')).toBeNull();
  });
});
