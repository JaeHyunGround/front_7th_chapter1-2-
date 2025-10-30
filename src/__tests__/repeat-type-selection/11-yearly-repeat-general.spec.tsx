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

describe('매년 반복 생성 - 일반 케이스', () => {
  it('간격 1로 매년 1월 15일: 해당 연도 1월에 표시됨', async () => {
    setupMockHandlerCreation([
      {
        id: '1',
        title: '매년 1월15일 테스트',
        date: '2025-01-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'yearly', interval: 1, endDate: '2025-01-15' },
        notificationTime: 10,
      },
    ]);

    const { user } = setup();

    // 월간 뷰로 전환 후 2025-01로 이동 (현재 2025-10 기준 Prev 9회)
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /month/i }));
    for (let i = 0; i < 9; i++) await user.click(screen.getByLabelText('Previous'));

    const monthViewJan = await screen.findByTestId('month-view');
    expect(
      (await within(monthViewJan).findAllByText('매년 1월15일 테스트')).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('간격 2로 매년 1월 15일: 2025/2027에서 각각 표시됨', async () => {
    setupMockHandlerCreation([
      {
        id: '1',
        title: '2년마다 1월15일',
        date: '2025-01-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'yearly', interval: 2, endDate: '2025-01-15' },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '2년마다 1월15일',
        date: '2027-01-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'yearly', interval: 2, endDate: '2027-01-15' },
        notificationTime: 10,
      },
    ]);

    const { user } = setup();

    // 2025-01 확인
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /month/i }));
    for (let i = 0; i < 9; i++) await user.click(screen.getByLabelText('Previous'));
    const monthView2025Jan = await screen.findByTestId('month-view');
    expect(
      (await within(monthView2025Jan).findAllByText('2년마다 1월15일')).length
    ).toBeGreaterThanOrEqual(1);

    // 2027-01로 이동 (Next 24회)
    for (let i = 0; i < 24; i++) await user.click(screen.getByLabelText('Next'));
    const monthView2027Jan = await screen.findByTestId('month-view');
    expect(
      (await within(monthView2027Jan).findAllByText('2년마다 1월15일')).length
    ).toBeGreaterThanOrEqual(1);
  });
});
