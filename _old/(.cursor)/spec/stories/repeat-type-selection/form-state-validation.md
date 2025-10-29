# Story: 반복 상태/유효성 추가 (useEventForm)

## 1. 배경/문제

- 관련 Epic/PRD 근거: `.cursor/spec/epics/repeat-type-selection.md`, `.cursor/spec/prd.md`
- 반복 일정 설정을 위해 `repeat` 상태(유형/간격/종료일)와 유효성(간격 정수 ≥1, 종료일 포맷)이 필요함.

## 2. 목표 및 기대 결과

- 시스템이 이벤트 폼에서 반복 설정 상태를 관리/검증할 수 있다.
- isRepeating이 OFF인 경우 저장 시 `{ type: 'none', interval: 1 }`로 일관되게 저장된다.

## 3. 수용 기준 (Acceptance Criteria)

- [ ] `useEventForm`에 `repeat` 상태가 추가/확장된다: `type(daily|weekly|monthly|yearly|none)`, `interval(>=1 정수)`, `endDate(YYYY-MM-DD | undefined)`
- [ ] isRepeating = false 저장 시 `repeat = { type: 'none', interval: 1, endDate: undefined }`
- [ ] isRepeating = true일 때 `interval`은 1 이상의 정수만 허용하고, 유효하지 않으면 에러를 노출한다.
- [ ] `endDate`는 선택값이며 ISO 날짜 문자열(YYYY-MM-DD)만 허용한다. 유효하지 않으면 에러를 노출한다.
- [ ] 기존 이벤트를 편집할 때 `repeat`가 폼 초기값에 올바르게 매핑된다.
- [ ] 타입 정의(`src/types.ts`)는 `Event.repeat` 구조와 일치한다.

## 4. 작업 단계 (Task Breakdown)

1. **컴포넌트 구조 설계**

   - 폼 상태 내 `repeat` 구조 및 isRepeating 플래그 설계

2. **상태/데이터 흐름 정의**

   - `useEventForm`에 `repeat` 필드 및 밸리데이터 추가
   - 초기값 및 편집 시 값 매핑 로직 구성

3. **API 연동 및 검증**

   - 저장 경로에 전달되는 값이 스키마와 일치하는지 형상 정의(후속 Story에서 실제 연동)

4. **테스트 작성**

   - `interval` 정수 검증, `endDate` 포맷 검증 단위 테스트
   - OFF 저장 시 `{type:'none', interval:1}`로 직렬화되는지 검증

5. **검수 및 리뷰 요청**

   - 타입/상태/밸리데이션 동작 확인 및 리뷰

## 5. 의존성/우선순위

- 선행 Story: 없음
- 후속 Story: `반복 설정 UI 노출(App)`, `반복 직렬화/저장(useEventOperations)`
- Epic 내 우선순위: 높음

## 6. 리스크 및 대응

- 리스크: 날짜 포맷/타임존 파싱 혼동
- 완화 전략: ISO(YYYY-MM-DD) 고정 사용, 유틸 검증 추가

## 7. 오픈 이슈

- [기능 미정] 날짜 입력 위젯 구체 사양(달력, 직접 입력) 확정 필요

## 8. 참고/근거

- Epic 파일 경로: `.cursor/spec/epics/repeat-type-selection.md`
- 관련 테스트/유틸 파일: `src/types.ts`, `src/hooks/useEventForm.ts`, `src/utils/timeValidation.ts`
