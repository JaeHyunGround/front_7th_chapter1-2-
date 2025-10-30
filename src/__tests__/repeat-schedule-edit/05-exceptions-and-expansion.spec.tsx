import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';

import { setupMockHandlerCreation } from '../../__mocks__/handlersUtils';
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

describe('[Story] 예외 처리 저장 규칙 및 확장 반영', () => {
  it('단일 수정 후 확장에서 해당 날짜는 제외되고 다른 날짜에는 시리즈가 유지된다 (Red)', async () => {
    setupMockHandlerCreation([
      {
        id: '1',
        title: '주간 회의',
        date: '2025-11-05',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'weekly', interval: 1 },
        notificationTime: 10,
      },
    ]);

    const { user } = setup();

    // 편집 진입 후 단일 수정으로 분리
    const editButton = await screen.findByLabelText('Edit event');
    await user.click(editButton);
    const titleInput = screen.getByLabelText('제목');
    await user.clear(titleInput);
    await user.type(titleInput, '외부 미팅');
    await user.click(screen.getByTestId('event-submit-button'));
    expect(await screen.findByText('해당 일정만 수정하시겠어요?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '예' }));

    // 월간 뷰에서 11월 표시 확인
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /month/i }));
    const monthView = await screen.findByTestId('month-view');

    // 기대: 11/05에는 '외부 미팅'이 표시되고, 그 외 반복 날짜에는 '주간 회의'가 여전히 표시되어야 함
    expect(within(monthView).getByText('외부 미팅')).toBeInTheDocument();
    // Red 유도: 현재 구현은 시리즈가 사라지므로 '주간 회의'가 더 이상 보이지 않아 실패해야 함
    expect(within(monthView).getByText('주간 회의')).toBeInTheDocument();
  });
});
