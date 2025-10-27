# Story: 반복 직렬화/저장 (useEventOperations)

## 1. 배경/문제

- 관련 Epic/PRD 근거: `.cursor/spec/epics/repeat-type-selection.md`, `.cursor/spec/prd.md`
- 반복 설정을 서버 저장/수정/조회에 반영하여 재로딩 시에도 UI와 리스트에 일관되게 보여야 함.

## 2. 목표 및 기대 결과

- 시스템이 저장/수정 시 `repeat` 필드를 직렬화하여 서버로 전송하고, 조회 시 역직렬화하여 폼에 매핑할 수 있다.

## 3. 수용 기준 (Acceptance Criteria)

- [ ] `saveEvent`/`updateEvent` 요청 본문에 `repeat`가 포함된다(`endDate`는 존재할 때만 포함).
- [ ] 조회 시 응답의 `repeat` 값을 `useEventForm` 초기 상태로 정확히 매핑한다.
- [ ] 비반복(`type:'none'`)인 경우 기존 로직과의 호환성이 유지된다.
- [ ] 통합/단위 테스트로 직렬화/역직렬화 경로가 검증된다.

## 4. 작업 단계 (Task Breakdown)

1. **컴포넌트 구조 설계**

   - 저장/수정/조회 경로에서 `repeat` 필드 흐름 정의

2. **상태/데이터 흐름 정의**

   - `useEventOperations`에 직렬화/역직렬화 로직 추가

3. **API 연동 및 검증**

   - MSW/목 서버로 요청/응답 스냅샷 검증

4. **테스트 작성**

   - `__tests__/medium.useEventOperations.spec.ts` 또는 통합 테스트에 케이스 추가

5. **검수 및 리뷰 요청**

   - 페이로드/타입 호환성 리뷰, 회귀 리스크 점검

## 5. 의존성/우선순위

- 선행 Story: `반복 상태/유효성 추가 (useEventForm)`
- 후속 Story: `반복 메타 노출(리스트/주/월 뷰)`
- Epic 내 우선순위: 높음

## 6. 리스크 및 대응

- 리스크: endDate 직렬화 누락/형식 오류
- 완화 전략: 존재 시에만 포함, ISO 포맷 단위 테스트

## 7. 오픈 이슈

- [의존성 미정] 서버 스키마에 `repeat` 반영 시점 확인 필요

## 8. 참고/근거

- Epic 파일 경로: `.cursor/spec/epics/repeat-type-selection.md`
- 관련 테스트/유틸 파일: `src/hooks/useEventOperations.ts`, `src/types.ts`, `src/__mocks__/handlers.ts`
