import { Skeleton } from "../../src"
import { Spec, type ReviewItem } from "./Review"

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "색이 변수에 연결되지 않음 (다크에서도 밝은 회색)",
    status: "open",
    figma: "모든 변형의 채움이 변수 없는 #dbdbdb 그라디언트 (불투명 → 50%). Dark에서도 같은 밝은 회색이라 어두운 화면에서 튐.",
    code: "바탕 background/subtle, 반짝임 background/subtler — Light #e5e5e5 / #f5f5f5, Dark #404040 / #262626.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="rectangle"><Skeleton width={160} height={100} /></Spec>
            <Spec label="text"><Skeleton type="text" width={160} /></Spec>
            <Spec label="circle"><Skeleton type="circle" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "tokens", label: "토큰 사용 (현재) — Figma도 background/subtle · subtler로 연결", recommended: true },
      { id: "new", label: "skeleton 전용 색을 새로 정의" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "shimmer 모양 · 속도",
    status: "open",
    figma: "Progress 0 · 33 · 66 = 대각선 그라디언트가 이동하는 세 장면. 속도 · 반복 정의 없음.",
    code: "110° 대각선의 밝은 띠가 왼쪽 → 오른쪽으로 1.5초(3 × --gb-duration-500)마다, 일정한 속도(--gb-easing-linear)로 지나감. 화면의 모든 segment가 한 면처럼 같이 반짝임(background-attachment: fixed). 동작 줄이기 설정이면 멈춘 단색.",
    columns: [],
    options: [
      { id: "keep", label: "현재 (1.5초, 화면 전체가 한 번에)", recommended: true },
      { id: "pulse", label: "반짝임 대신 깜빡임(opacity pulse)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "크기 · 접근성",
    status: "info",
    figma: "rectangle 226 × 157 radius 2xl · text 226 × 27 radius md · circle 27 radius full.",
    code: "Figma 크기가 기본값, width · height(px 숫자나 CSS 값)로 바꿈. 너비는 부모보다 넓어지지 않음. 장식용(aria-hidden) — 로딩 영역에 aria-busy와 'Loading' 안내는 쓰는 쪽에서 (All variants의 카드 예시).",
    columns: [],
  },
]
