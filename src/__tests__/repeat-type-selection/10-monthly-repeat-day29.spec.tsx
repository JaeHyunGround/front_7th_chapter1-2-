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

describe('매월 반복 생성 - 29일 특수 케이스', () => {
  it('윤년 2월(2024-02-29)에는 표시되고, 평년 2월(2025-02)은 표시되지 않음', async () => {
    setupMockHandlerCreation([
      // 윤년 2월 29일 표시
      {
        id: '1',
        title: '29일 반복 테스트',
        date: '2024-02-29',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'monthly', interval: 1, endDate: '2024-02-29' },
        notificationTime: 10,
      },
    ]);

    const { user } = setup();

    // 월간 뷰 전환
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /month/i }));

    // 2025-10에서 2024-02로 이동 (Prev 20회: 2025-10 → 2024-02)
    for (let i = 0; i < 20; i++) {
      await user.click(screen.getByLabelText('Previous'));
    }
    const monthViewLeapFeb = await screen.findByTestId('month-view');
    expect(
      (await within(monthViewLeapFeb).findAllByText('29일 반복 테스트')).length
    ).toBeGreaterThanOrEqual(1);

    // 평년 2025-02로 이동 (Next 12회: 2024-02 → 2025-02)
    for (let i = 0; i < 12; i++) {
      await user.click(screen.getByLabelText('Next'));
    }
    const monthViewNonLeapFeb = await screen.findByTestId('month-view');
    expect(within(monthViewNonLeapFeb).queryByText('29일 반복 테스트')).toBeNull();
  });
});
