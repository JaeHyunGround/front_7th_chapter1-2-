# Story: 반복 설정 UI 노출 (App)

## 1. 배경/문제

- 관련 Epic/PRD 근거: `.cursor/spec/epics/repeat-type-selection.md`, `.cursor/spec/prd.md`
- 사용자가 일정 생성/수정 시 반복 설정(유형/간격/종료일)을 손쉽게 입력할 수 있어야 함.

## 2. 목표 및 기대 결과

- 사용자가 isRepeating을 ON/OFF하고, 반복 유형/간격/종료일을 UI에서 입력할 수 있다.
- OFF로 저장하면 반복 상태가 숨겨지고 `{type:'none', interval:1}`로 저장된다.

## 3. 수용 기준 (Acceptance Criteria)

- [ ] isRepeating 토글 ON 시 `type`, `interval`, `endDate` 입력 컴포넌트가 노출된다.
- [ ] isRepeating OFF 시 반복 섹션이 숨겨지고 저장 시 `{type:'none', interval:1}`가 적용된다.
- [ ] `type` 옵션: daily/weekly/monthly/yearly 제공, 기본값 daily
- [ ] `interval` 기본값 1, 숫자만 입력 가능, 1 미만 금지
- [ ] `endDate`는 선택 입력이며 올바른 날짜 포맷만 허용한다.
- [ ] 라벨/설명/에러 메시지가 접근성 규칙(연결된 label, 키보드 탐색) 충족

## 4. 작업 단계 (Task Breakdown)

1. **컴포넌트 구조 설계**

   - `App.tsx` 폼 내 반복 설정 영역 UI 컴포넌트 트리 설계

2. **상태/데이터 흐름 정의**

   - `useEventForm`의 `repeat` 상태와 양방향 바인딩
   - 토글 OFF 시 상태 리셋 동작 연결

3. **API 연동 및 검증**

   - 저장 버튼 클릭 시 현재 `repeat` 값이 후속 연동로직에 전달되는지 확인(목킹)

4. **테스트 작성**

   - 렌더/상호작용 테스트: 토글에 따른 노출/숨김, 입력/검증 메시지

5. **검수 및 리뷰 요청**

   - UI/UX 검토 및 접근성 체크

## 5. 의존성/우선순위

- 선행 Story: `반복 상태/유효성 추가 (useEventForm)`
- 후속 Story: `반복 직렬화/저장(useEventOperations)`
- Epic 내 우선순위: 높음

## 6. 리스크 및 대응

- 리스크: 유효성 메시지 표준화 누락, 접근성 불충족
- 완화 전략: 공통 에러 컴포넌트/label-for/aria-속성 준수

## 7. 오픈 이슈

- [기능 미정] 날짜 입력 위젯(네이티브/라이브러리) 선택

## 8. 참고/근거

- Epic 파일 경로: `.cursor/spec/epics/repeat-type-selection.md`
- 관련 테스트/유틸 파일: `src/App.tsx`, `src/hooks/useEventForm.ts`
