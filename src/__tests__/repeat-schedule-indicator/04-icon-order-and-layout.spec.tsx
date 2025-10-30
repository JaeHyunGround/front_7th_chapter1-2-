import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { vi } from 'vitest';

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

describe('[Story] 아이콘 순서 및 레이아웃', () => {
  it('아이콘 순서가 [알림][반복][타이틀]이다 (주간 뷰)', async () => {
    // now 기준 5분 뒤 시작, notificationTime 10분 → 알림 아이콘 표시 대상
    const now = new Date();
    const start = new Date(now.getTime() + 5 * 60 * 1000);
    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, '0');
    const dd = String(start.getDate()).padStart(2, '0');
    const hh = String(start.getHours()).padStart(2, '0');
    const mi = String(start.getMinutes()).padStart(2, '0');

    setupMockHandlerCreation([
      {
        id: '1',
        title: '팀 공지',
        date: `${yyyy}-${mm}-${dd}`,
        startTime: `${hh}:${mi}`,
        endTime: '23:59',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10,
      },
    ]);

    const { user } = setup();

    // 주간 뷰로 전환
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /week/i }));

    // 알림 훅의 setInterval(1초)을 진행시키기 위해 타이머 전진
    vi.useFakeTimers();
    vi.advanceTimersByTime(1200);
    vi.useRealTimers();

    const weekView = await screen.findByTestId('week-view');
    const titleEl = await within(weekView).findByText('팀 공지');
    const stackEl = titleEl.closest('[class]')!.parentElement as HTMLElement;

    const inline = within(stackEl);
    const repeatIcon = inline.getByTestId('repeat-icon');
    const notificationIcon = stackEl.querySelector(
      'svg:not([data-testid="repeat-icon"])'
    ) as SVGElement | null;
    const titleNode = inline.getByText('팀 공지');

    expect(notificationIcon).not.toBeNull();
    expect(repeatIcon).toBeInTheDocument();

    // [알림]이 [반복]보다 먼저
    expect(
      (notificationIcon as Element).compareDocumentPosition(repeatIcon) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    // [반복]이 [타이틀]보다 먼저
    expect(
      repeatIcon.compareDocumentPosition(titleNode) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('두 아이콘이 동일 크기(small)로 렌더링된다 (주간 뷰)', async () => {
    const now = new Date();
    const start = new Date(now.getTime() + 5 * 60 * 1000);
    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, '0');
    const dd = String(start.getDate()).padStart(2, '0');
    const hh = String(start.getHours()).padStart(2, '0');
    const mi = String(start.getMinutes()).padStart(2, '0');

    setupMockHandlerCreation([
      {
        id: '1',
        title: '팀 공지',
        date: `${yyyy}-${mm}-${dd}`,
        startTime: `${hh}:${mi}`,
        endTime: '23:59',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10,
      },
    ]);

    const { user } = setup();

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /week/i }));

    vi.useFakeTimers();
    vi.advanceTimersByTime(1200);
    vi.useRealTimers();

    const weekView = await screen.findByTestId('week-view');
    const titleEl = await within(weekView).findByText('팀 공지');
    const stackEl = titleEl.closest('[class]')!.parentElement as HTMLElement;

    const inline = within(stackEl);
    const repeatIcon = inline.getByTestId('repeat-icon');
    const notificationIcon = stackEl.querySelector(
      'svg:not([data-testid="repeat-icon"])'
    ) as SVGElement | null;

    expect(notificationIcon).not.toBeNull();

    // MUI SvgIcon: fontSize="small" → className에 MuiSvgIcon-fontSizeSmall 포함
    expect(repeatIcon.className).toMatch(/MuiSvgIcon-fontSizeSmall/);
    expect((notificationIcon as SVGElement).className).toMatch(/MuiSvgIcon-fontSizeSmall/);
  });

  it('아이콘 순서가 [알림][반복][타이틀]이다 (월간 뷰)', async () => {
    // 월간 뷰에서도 동일한 순서를 검증
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 9, 0, 0);
    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, '0');
    const dd = String(start.getDate()).padStart(2, '0');

    setupMockHandlerCreation([
      {
        id: '1',
        title: '팀 공지',
        date: `${yyyy}-${mm}-${dd}`,
        startTime: '09:00',
        endTime: '23:59',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10,
      },
    ]);

    const { user } = setup();

    // 월간 뷰로 전환
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /month/i }));

    // 알림 훅 타이머 진행
    vi.useFakeTimers();
    vi.advanceTimersByTime(1200);
    vi.useRealTimers();

    const monthView = await screen.findByTestId('month-view');
    const titleEl = await within(monthView).findByText('팀 공지');
    const stackEl = titleEl.closest('[class]')!.parentElement as HTMLElement;

    const inline = within(stackEl);
    const repeatIcon = inline.getByTestId('repeat-icon');
    const notificationIcon = stackEl.querySelector(
      'svg:not([data-testid="repeat-icon"])'
    ) as SVGElement | null;
    const titleNode = inline.getByText('팀 공지');

    expect(notificationIcon).not.toBeNull();
    expect(repeatIcon).toBeInTheDocument();
    expect(
      (notificationIcon as Element).compareDocumentPosition(repeatIcon) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      repeatIcon.compareDocumentPosition(titleNode) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});
