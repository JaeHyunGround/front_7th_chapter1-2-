# Story: 반복 메타 노출 (리스트/주/월 뷰)

## 1. 배경/문제

- 관련 Epic/PRD 근거: `.cursor/spec/epics/repeat-type-selection.md`, `.cursor/spec/prd.md`
- 사용자에게 반복 설정이 적용된 일정을 명확히 인지시킬 필요가 있음.

## 2. 목표 및 기대 결과

- 리스트/주/월 뷰에서 반복 메타를 "반복: <interval><단위>마다 (종료: YYYY-MM-DD)" 형식으로 노출할 수 있다.

## 3. 수용 기준 (Acceptance Criteria)

- [ ] `type:'none'`이면 메타를 노출하지 않는다.
- [ ] `daily|weekly|monthly|yearly`일 때 단위를 각각 `일/주/개월/년`으로 노출한다.
- [ ] 종료일이 없으면 괄호 구문을 생략한다.
- [ ] 예시: interval=2, type=weekly, endDate=2025-12-31 → "반복: 2주마다 (종료: 2025-12-31)"
- [ ] 예시: interval=1, type=monthly, endDate 없음 → "반복: 1개월마다"

## 4. 작업 단계 (Task Breakdown)

1. **컴포넌트 구조 설계**

   - 리스트/주/월 뷰의 아이템 렌더 영역에 메타 텍스트 슬롯 정의

2. **상태/데이터 흐름 정의**

   - 이벤트 모델의 `repeat`로부터 표시 문자열 생성 유틸 추가

3. **API 연동 및 검증**

   - 조회 데이터에 `repeat`가 포함될 때 메타가 노출되는지 확인

4. **테스트 작성**

   - 각 단위/간격/종료일 조합에 대한 스냅샷/텍스트 매칭 테스트

5. **검수 및 리뷰 요청**

   - 문구/현지화/엣지 케이스 리뷰

## 5. 의존성/우선순위

- 선행 Story: `반복 직렬화/저장 (useEventOperations)`
- 후속 Story: 없음
- Epic 내 우선순위: 보통

## 6. 리스크 및 대응

- 리스크: 단위 번역 누락/불일치, 포맷 상이
- 완화 전략: 공통 유틸로 문자열 생성, 단위 테스트 고정

## 7. 오픈 이슈

- [기능 미정] 시간/다국어 확장 필요 여부

## 8. 참고/근거

- Epic 파일 경로: `.cursor/spec/epics/repeat-type-selection.md`
- 관련 테스트/유틸 파일: `src/App.tsx`, `src/hooks/useCalendarView.ts`, `src/utils/dateUtils.ts`
