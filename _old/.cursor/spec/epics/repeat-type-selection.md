# Epic: 반복 유형 선택

## 1. 배경/문제

- 관련 PRD 섹션/근거:
  - `.cursor/spec/prd.md`의 6.1 기능 요구사항 [FR1~FR7], 3. 목표/비목표, 11. 리스크 및 대응, 12. 오픈 이슈
  - 구현 근거 파일: `src/types.ts`, `src/hooks/useEventForm.ts`, `src/hooks/useEventOperations.ts`, `src/App.tsx`, `src/utils/eventOverlap.ts`

## 2. 목표(수용 기준 포함)

- 목표: 일정 생성/수정 시 반복 유형(매일/매주/매월/매년)과 간격/종료일을 선택·저장하고, 리스트/뷰에 반복 메타를 표시한다. 특수 날짜(2/29, 31일) 규칙과 반복 겹침 정책을 준수한다.
- 수용 기준(AC):
  1. isRepeating ON 시 반복 UI(유형/간격/종료일) 노출, OFF 저장 시 `{type:'none', interval:1}` 저장
  2. 유형(daily/weekly/monthly/yearly)과 간격(정수 ≥1), 종료일(선택)이 `Event.repeat`로 직렬화되어 저장됨
  3. 리스트/주/월 뷰에서 반복 메타가 “반복: <interval><단위>마다 (종료: YYYY-MM-DD)”로 노출됨
  4. 31일 monthly: 31일 없는 달에는 생성/표시되지 않음; 2/29 yearly: 윤년이 아닌 해에는 생성/표시되지 않음
  5. 반복 인스턴스 겹침은 경고 없이 저장 진행; 단건 일정은 기존 겹침 경고 유지

## 3. 범위(포함/제외)

- 포함:
  - 폼 UI 활성화: 반복 유형/간격/종료일 입력 컴포넌트 노출 및 상태 연동
  - 저장/수정 시 `repeat` 필드 직렬화 및 서버 통신 반영
  - 리스트/뷰에서 반복 메타 정보 표시(현 텍스트 노출 유지/정교화)
  - 특수 날짜 규칙 단위 테스트(설계 수준 가능)
- 제외:
  - 반복 인스턴스 전개 및 캘린더 셀 내 실제 반복 이벤트 생성(차기)
  - 예외 편집/한 번 건너뛰기/개별 인스턴스 삭제 등 고급 기능
  - RRULE 호환 및 복잡한 규칙(예: 매월 마지막 평일)

## 4. 산출물/완료 정의(DoD)

- `App`에서 반복 UI 주석 해제 및 정상 동작
- `useEventForm` 상태와 유효성(간격 정수 ≥1, 종료일 형식) 반영
- `saveEvent` 경로로 `repeat` 직렬화되어 저장/수정 후 재로딩 시 UI와 리스트에 반영 확인
- 리스트/주/월 뷰에서 반복 메타가 기획 문구대로 노출
- 특수 날짜 규칙에 대한 테스트 케이스 초안 작성(테스트 통과 또는 문서 수준 합의)
- 문서 업데이트: `.cursor/spec/prd.md` 최신화 반영 확인

## 5. 우선순위/의존성

- 우선순위: 높음(MVP 범위)
- 의존성:
  - 타입 구조(`src/types.ts`) 유지
  - 저장/조회 훅(`useEventOperations`) 정상 동작
  - 겹침 정책: 단건의 기존 경고 유지(`utils/eventOverlap.ts`)

## 6. 리스크 및 대응

- 특수 날짜 규칙 혼동 → PRD의 AC를 테스트로 구체화하고 UI 도움말 문구 추가
- 반복 인스턴스 전개 미포함으로 인한 사용자 기대 불일치 → PRD/릴리즈 노트로 범위 명시
- 성능 저하 우려 → 본 Epic에서는 전개 제외, 차기에 최적화 검토

## 7. 참고/근거

- `.cursor/spec/prd.md`
- `src/types.ts`
- `src/hooks/useEventForm.ts`
- `src/hooks/useEventOperations.ts`
- `src/App.tsx`
- `src/utils/eventOverlap.ts`
