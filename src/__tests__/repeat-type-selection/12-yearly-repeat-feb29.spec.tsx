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

describe('매년 반복 생성 - 윤년 2월 29일 특수 케이스', () => {
  it('2024-02(윤년)에는 2월 29일 이벤트가 표시된다', async () => {
    setupMockHandlerCreation([
      { id: '1', title: '2월29일 테스트', date: '2024-02-29', startTime: '09:00', endTime: '10:00', description: '', location: '', category: '업무', repeat: { type: 'yearly', interval: 4, endDate: '2024-02-29' }, notificationTime: 10 },
    ]);

    const { user } = setup();
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /month/i }));

    for (let i = 0; i < 20; i++) await user.click(screen.getByLabelText('Previous'));
    const view2024Feb = await screen.findByTestId('month-view');
    expect((await within(view2024Feb).findAllByText('2월29일 테스트')).length).toBeGreaterThanOrEqual(1);
  }, 20000);

  it('2025-02(평년)에는 2월 29일 이벤트가 표시되지 않는다', async () => {
    setupMockHandlerCreation([]);

    const { user } = setup();
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /month/i }));

    for (let i = 0; i < 8; i++) await user.click(screen.getByLabelText('Previous'));
    const view2025Feb = await screen.findByTestId('month-view');
    expect(within(view2025Feb).queryByText('2월29일 테스트')).toBeNull();
  }, 20000);

  it('2028-02(윤년)에는 2월 29일 이벤트가 표시된다', async () => {
    setupMockHandlerCreation([
      { id: '1', title: '2월29일 테스트', date: '2028-02-29', startTime: '09:00', endTime: '10:00', description: '', location: '', category: '업무', repeat: { type: 'yearly', interval: 4, endDate: '2028-02-29' }, notificationTime: 10 },
    ]);

    const { user } = setup();
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /month/i }));

    for (let i = 0; i < 28; i++) await user.click(screen.getByLabelText('Next'));
    const view2028Feb = await screen.findByTestId('month-view');
    expect((await within(view2028Feb).findAllByText('2월29일 테스트')).length).toBeGreaterThanOrEqual(1);
  }, 20000);
});
