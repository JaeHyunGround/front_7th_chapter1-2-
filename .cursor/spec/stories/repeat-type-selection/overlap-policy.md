# Story: 겹침 정책 정비 (단건 경고 유지, 반복 경고 없음)

## 1. 배경/문제

- 관련 Epic/PRD 근거: `.cursor/spec/epics/repeat-type-selection.md`, `.cursor/spec/prd.md`
- 반복 인스턴스 겹침은 경고 없이 저장하고, 단건 일정의 기존 겹침 경고는 유지해야 한다.

## 2. 목표 및 기대 결과

- 시스템이 저장 시 이벤트 유형에 따라 겹침 경고 동작을 구분할 수 있다.

## 3. 수용 기준 (Acceptance Criteria)

- [ ] `repeat.type === 'none'`인 단건 일정은 기존 겹침 경고 로직을 그대로 따른다.
- [ ] `repeat.type !== 'none'`인 반복 일정 저장 시에는 겹침 경고를 표시하지 않는다.
- [ ] 관련 유틸(`utils/eventOverlap.ts`) 또는 저장 훅에서 조건 분기를 테스트로 검증한다.

## 4. 작업 단계 (Task Breakdown)

1. **컴포넌트 구조 설계**

   - 저장 경로에서 겹침 경고 트리거 지점 식별

2. **상태/데이터 흐름 정의**

   - `useEventOperations` 저장 플로우에 `repeat.type` 기반 분기 명세

3. **API 연동 및 검증**

   - 해당 없음(클라이언트 상태/유틸 기반)

4. **테스트 작성**

   - 단건: 겹침 시 경고 유지 테스트
   - 반복: 동일 시간대라도 경고 미표시 테스트

5. **검수 및 리뷰 요청**

   - 정책 문구/테스트 커버리지 확인

## 5. 의존성/우선순위

- 선행 Story: `반복 직렬화/저장 (useEventOperations)`
- 후속 Story: 없음
- Epic 내 우선순위: 높음

## 6. 리스크 및 대응

- 리스크: 반복 전개 기능 미포함으로 경고 영향 범위 혼동
- 완화 전략: 정책 설명을 문서화하고 저장 시 분기만 적용

## 7. 오픈 이슈

- [기타] 팀 합의된 UX 문구(경고/비경고 사유) 필요 여부

## 8. 참고/근거

- Epic 파일 경로: `.cursor/spec/epics/repeat-type-selection.md`
- 관련 테스트/유틸 파일: `src/utils/eventOverlap.ts`, `src/hooks/useEventOperations.ts`, `src/__tests__/unit/easy.eventOverlap.spec.ts`
