import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "case-articles");
const captureDir = path.join(root, "case-assets");

const titles = [
    "AI 기반 자동 누끼 및 배경 생성",
    "상세페이지 이미지 품질 검수",
    "SKU 이미지 누락·중복 탐지",
    "경쟁 가격 변동 모니터링",
    "묶음상품 추천 로직",
    "장바구니 이탈 복구 자동화",
    "라이브커머스 질문 라우팅",
    "쿠폰 비용 최적화",
    "브랜드 검색어 클러스터링",
    "개인화 메인 진열",
    "시즌 재고 알림",
    "상품평 키워드 기반 부정 불량 탐지",
    "CS 반품 사유 분류",
    "리뷰 요약과 답글 초안",
    "경쟁사 상품 속성 수집",
    "MD 발주량 추천",
    "신상품 초도 판매 예측",
    "이미지 저작권 리스크 탐지",
    "배송 지연 사전 알림",
    "크로스셀 추천",
    "상품명 표준화",
    "오픈마켓 등록 자동화",
    "리퍼·중고 검수 라벨링",
    "VIP 구매 패턴 분석",
    "실시간 재고 예측 로직",
    "품절 대체상품 추천",
    "매장별 진열 최적화",
    "가격 민감도 실험",
    "제품 속성 자동 추출",
    "온·오프라인 재고 통합",
    "광고소재 버전 관리",
    "캠페인 성과 요약",
    "인플루언서 매칭 스코어",
    "영상 프레임 하이라이트 자동 추출",
    "숏폼 자막·챕터 자동화",
    "블로그 키워드 클러스터링",
    "랜딩페이지 A/B 실험",
    "뉴스레터 개인화",
    "CRM 세그먼트 자동 생성",
    "검색광고 입찰 조정",
    "콘텐츠 캘린더 생성",
    "브랜드 메시지 톤 검수",
    "SEO FAQ 생성",
    "고객 여정 리포트",
    "행사 리드 스캔",
    "세일즈덱 자동 생성",
    "UTM 품질관리",
    "배너 CTR 예측 로직",
    "앱푸시 발송 타이밍",
    "리타게팅 제외 룰",
    "다국어 캠페인 운영",
    "커뮤니티 VoC 분석",
    "PR 리스크 모니터링",
    "웨비나 질문 요약",
    "콘텐츠 재활용 파이프라인",
    "브랜드 세이프티 검수",
    "콜드메일 초안 생성",
    "페르소나 실험 설계",
    "다국어 상세페이지 로컬라이징",
    "광고비 이상탐지",
    "생산일보 자동화",
    "설비 이상신호 탐지",
    "안전점검 OCR",
    "작업지시 추천",
    "구매요청 승인 자동화",
    "원자재 가격 모니터링",
    "불량 픽셀 검출 시각 AI",
    "창고 피킹 경로 최적화",
    "납기 지연 예측",
    "운송사 배차 자동화",
    "입출고 차이 탐지",
    "ERP 품목 마스터 정리",
    "품질검사 리포트 자동화",
    "유지보수 티켓 분류",
    "에너지 사용량 최적화",
    "협력사 평가 자동화",
    "견적서 비교 분석",
    "보험청구 분류",
    "병원 예약 콜 요약",
    "교육 수강 리텐션 예측",
    "대출 상담 분류",
    "계약서 자동 분류 및 핵심 조항 추출",
    "채용 서류 스크리닝",
    "근태 이상 탐지",
    "회계 증빙 검수",
    "세금계산서 매칭",
    "법무 리스크 큐레이션",
    "고객상담 QA 자동화",
    "지식베이스 추천",
    "콜센터 상담 요약",
    "회원탈퇴 예측",
    "구독 결제 실패 복구",
    "내부 헬프데스크 라우팅",
    "문서 검색 에이전트",
    "프로젝트 리스크 예측",
    "데이터 권한 관리",
    "고객 상담 음성 데이터 자산화"
];

const members = {
    "isaac-kim": {
        name: "김이삭",
        role: "대표 · AX BM 설계",
        photo: "images/S4/iskim.png",
        bio: "구독형 AX 사업 모델과 고객사 우선순위 설계를 맡습니다. 반복 업무를 매출, 비용, 리스크 관점의 백로그로 바꾸는 역할에 강합니다.",
        beat: "비즈니스 모델, 구독 설계, 도입 로드맵"
    },
    "donghee-hong": {
        name: "홍동희",
        role: "CTO · 아키텍처",
        photo: "images/S4/dhhong.png",
        bio: "Unity Korea 기술 총괄과 메가존클라우드 Tech 그룹장 경험을 바탕으로 데이터 연동, 권한, 확장 가능한 백엔드 구조를 설계합니다.",
        beat: "클라우드 아키텍처, 데이터 파이프라인, 보안"
    },
    "joonkyu-park": {
        name: "박준규",
        role: "AX 총괄 · 프로세스",
        photo: "images/S4/jkpark.png",
        bio: "삼성전자 기준정보시스템 PM 경험을 기반으로 현장 프로세스를 데이터 모델과 운영 화면으로 번역합니다.",
        beat: "현장 AX, 기준정보, 제조·운영 프로세스"
    },
    "juhee-lee": {
        name: "이주희",
        role: "운영이사 · UX",
        photo: "images/S4/jhlee.png",
        bio: "프라이머 피투자 스타트업과 디자이너하이어 UX 설계 경험을 바탕으로 운영자가 실제로 쓰는 흐름을 만듭니다.",
        beat: "운영 UX, 고객 여정, 서비스 설계"
    },
    "jaehoon-jeong": {
        name: "정재훈",
        role: "선임 개발자 · 풀스택",
        photo: "images/S4/jhjeong-photo-solid.png",
        bio: "SK AX와 SI·솔루션 구축 경험을 바탕으로 CRM, ERP, 백오피스, 자동화 워크플로를 실제 서비스로 연결합니다.",
        beat: "풀스택 구현, API 연동, 자동화 배포"
    },
    "hyojung-lee": {
        name: "이효정",
        role: "팀장 · 실증 매니징",
        photo: "images/S4/hjlee-photo-solid.png",
        bio: "시장 분석과 실증 기업 발굴 경험으로 자동화 전후의 운영 지표를 추적하고 고객사 커뮤니케이션을 정리합니다.",
        beat: "실증 운영, 시장 분석, 성과 리포팅"
    }
};

const profiles = {
    commerce: {
        label: "커머스 & 리테일",
        short: "Commerce",
        industries: ["D2C 브랜드", "패션 커머스", "뷰티 리테일", "식음료 프랜차이즈", "생활용품 유통사"],
        metric: ["제작비 64% 절감", "반품률 13% 개선", "재고비 22% 개선"],
        input: ["상품 DB", "주문·재고 로그", "리뷰·CS 텍스트", "가격 변동 이력"],
        team: ["joonkyu-park", "jaehoon-jeong", "hyojung-lee"],
        tone: "상품, 재고, 주문, 리뷰가 서로 다른 화면에 흩어져 생기는 손실을 줄이는 데 초점을 맞췄습니다."
    },
    marketing: {
        label: "콘텐츠 & 마케팅",
        short: "Marketing",
        industries: ["B2B SaaS", "교육 서비스", "브랜드 마케팅팀", "앱 서비스", "콘텐츠 스튜디오"],
        metric: ["제작 시간 1/8 단축", "ROAS 2.4배 개선", "리드 응답 31% 개선"],
        input: ["광고 성과", "소재 메타데이터", "CRM 이벤트", "검색·유입 로그"],
        team: ["isaac-kim", "hyojung-lee", "juhee-lee"],
        tone: "캠페인 성과를 단순 리포트가 아니라 다음 실험을 고르는 판단 시스템으로 바꾸는 데 초점을 맞췄습니다."
    },
    operations: {
        label: "제조·물류·기타 운영",
        short: "Operations",
        industries: ["제조 공장", "물류 센터", "헬스케어 운영팀", "법무·재무팀", "고객센터"],
        metric: ["검토 시간 80% 단축", "처리 SLA 42% 개선", "오류 탐지율 2.1배 상승"],
        input: ["ERP·MES 로그", "문서·계약서", "상담 녹취", "승인·정산 기록"],
        team: ["donghee-hong", "joonkyu-park", "jaehoon-jeong"],
        tone: "현장의 승인, 검수, 예외 처리, 책임 추적을 하나의 운영 리듬으로 묶는 데 초점을 맞췄습니다."
    }
};

const subscriptionPlanProfiles = {
    "Standard Ticket": {
        deliverable: "자동화 티켓 6~10개 · 월간 처리 리포트",
        firstMonth: "작은 운영 티켓을 먼저 처리하고 반복되는 요청을 규칙으로 묶습니다.",
        approach: "기획자가 있는 팀의 백로그를 빠르게 소진하는 방식",
        next: "반복 티켓을 월간 자동화 룰과 검수 리포트로 전환",
        cta: "Standard Ticket 상담하기"
    },
    "Standard Live": {
        deliverable: "운영 자동화 8~12개 · 실시간 대응 로그",
        firstMonth: "운영팀과 실시간으로 기준을 맞추며 급한 병목부터 배포합니다.",
        approach: "매일 움직이는 영업·운영 큐에 바로 붙는 방식",
        next: "담당자 알림, 예외 큐, CRM/업무툴 기록까지 확장",
        cta: "Standard Live 상담하기"
    },
    "Product Build": {
        deliverable: "업무 화면 1~2개 · 봇/연동 1개 · 운영 리포트",
        firstMonth: "업무 진단부터 화면, 봇, 데이터 연동까지 하나의 작은 제품으로 만듭니다.",
        approach: "자동화가 실제 화면과 운영 습관으로 남게 만드는 방식",
        next: "첫 화면에서 쌓인 예외 데이터를 다음 스프린트 백로그로 연결",
        cta: "Product Build 상담하기"
    },
    "Product Build → Enterprise": {
        deliverable: "검증 화면 · 권한 설계 · 조직 확장 로드맵",
        firstMonth: "작은 검증 화면으로 시작해 권한, 감사 로그, 조직 확장 가능성을 확인합니다.",
        approach: "큰 시스템 전에 작게 검증하고 조직 단위 AX로 넓히는 방식",
        next: "부서별 권한, 데이터 표준, 운영 리포트를 같은 백오피스로 통합",
        cta: "Enterprise 확장 상담하기"
    },
    "Enterprise": {
        deliverable: "조직 AX 로드맵 · 데이터 구조 설계 · 전담 스쿼드 운영표",
        firstMonth: "현장 미팅과 데이터 구조 진단을 먼저 진행하고 부서 단위 로드맵을 잡습니다.",
        approach: "여러 부서와 권한 체계가 얽힌 운영을 전담 스쿼드로 바꾸는 방식",
        next: "온톨로지, 데이터 권한, 모델 운영 정책까지 장기 운영 체계로 확장",
        cta: "Enterprise 상담하기"
    }
};

function subscriptionFor({ number, title, category, industry }) {
    let plan = "Standard Ticket";

    if (category === "commerce") {
        if (/이미지|누끼|배경|상세페이지|오픈마켓|개인화|추천|진열|로컬라이징/.test(title)) {
            plan = "Product Build";
        } else if (/재고|발주|품절|배송|반품|CS|가격|쿠폰|리뷰|상품평|라이브커머스/.test(title)) {
            plan = "Standard Live";
        }
    }

    if (category === "marketing") {
        if (/CRM|리드|세일즈|콜드메일|웨비나|행사|앱푸시|검색광고|입찰|광고비|리타게팅/.test(title)) {
            plan = "Standard Live";
        } else if (/랜딩|다국어|콘텐츠|뉴스레터|블로그|SEO|FAQ|메시지|페르소나|캘린더/.test(title)) {
            plan = "Product Build";
        }
    }

    if (category === "operations") {
        if (/계약서|법무|권한|ERP|회계|세금계산서|병원|대출|데이터 권한|프로젝트|생산|설비|품질|공정/.test(title)) {
            plan = number % 2 === 0 ? "Enterprise" : "Product Build → Enterprise";
        } else {
            plan = number % 3 === 0 ? "Product Build" : "Standard Live";
        }
    }

    if (number % 17 === 0 && plan !== "Enterprise") {
        plan = "Product Build → Enterprise";
    }

    const profile = subscriptionPlanProfiles[plan];
    return {
        plan,
        deliverable: profile.deliverable,
        firstMonth: profile.firstMonth,
        approach: `${industry}의 ${title} 업무를 ${profile.approach}으로 정리`,
        next: profile.next,
        cta: profile.cta
    };
}

function pad(number) {
    return String(number).padStart(3, "0");
}

function caseByNumber(number) {
    const title = titles[number - 1];
    const category = number <= 30 ? "commerce" : number <= 60 ? "marketing" : "operations";
    const profile = profiles[category];
    const industry = profile.industries[(number - 1) % profile.industries.length];
    const utility = profile.metric[(number - 1) % profile.metric.length];
    const subscription = subscriptionFor({ number, title, category, industry });
    const id = `case-${pad(number)}`;
    const bruteId = String(number).padStart(2, "0");
    return {
        id,
        number,
        title,
        category,
        categoryLabel: profile.label,
        categoryShort: profile.short,
        industry,
        utility,
        subscription,
        input: profile.input,
        team: profile.team,
        problem: `${industry}에서 반복적으로 발생하는 ${title} 업무를 ${subscription.plan} 플랜으로 시작해 운영 데이터, 담당자 큐, 다음 백로그까지 연결한 사례입니다.`,
        thumbImage: `images/generated/bruteforce-ui/case-capture-${bruteId}.png`,
        dataImage: `images/generated/bruteforce-ui/case-capture-${bruteId}-data.png`,
        logicImage: `images/generated/bruteforce-ui/case-capture-${bruteId}-logic.png`,
        queueImage: `images/generated/bruteforce-ui/case-capture-${bruteId}-queue.png`,
        roiImage: `images/generated/bruteforce-ui/case-capture-${bruteId}-roi.png`,
        dataUi: `case-assets/article-visuals/${id}-data.html`,
        logicUi: `case-assets/article-visuals/${id}-logic.html`,
        queueUi: `case-assets/article-visuals/${id}-queue.html`,
        roiUi: `case-assets/article-visuals/${id}-roi.html`,
        bruteUi: `case-assets/bruteforce-ui/case-ui-${bruteId}.html`,
        date: `2026.05.${String((number % 18) + 3).padStart(2, "0")}`,
        readTime: `${Math.max(8, Math.min(14, 7 + (number % 8)))}분 읽기`
    };
}

const cases = Array.from({ length: titles.length }, (_, index) => caseByNumber(index + 1));

function scenarioFor(item) {
    const title = item.title;
    const titleTokens = title.replace(/[·()]/g, " ").split(/\s+/).filter(Boolean).slice(0, 4);
    const seeded = item.number;
    const fallback = {
        service: `${titleTokens[0] || item.categoryShort} Ops Console`,
        headline: title,
        entity: item.category === "commerce" ? "상품·주문" : item.category === "marketing" ? "캠페인·고객" : "업무·문서",
        modules: ["수집", "분류", "검수", "자동 실행", "리포트"],
        rows: [`${item.industry} 요청 #${seeded}A`, `${titleTokens.join(" ")} 예외 #${seeded}B`, `운영 큐 #${seeded}C`],
        signals: ["반복 빈도", "오류 손실", "권한 예외", "재사용성"],
        actions: ["자동 처리", "담당자 검수", "승인 요청"],
        rule: `${titleTokens.join("_").toLowerCase()}_score`,
        insight: item.utility
    };

    const patterns = [
        {
            test: /상품평|리뷰|부정|불량/,
            service: "Review Defect Sentinel",
            entity: "상품평·SKU",
            modules: ["리뷰 수집", "키워드 클러스터", "불량 의심", "반품 연결", "MD 알림"],
            rows: ["SKU-AC21 냄새·변색 18건", "SKU-BT09 파손·누락 11건", "SKU-CP77 작동불량 7건"],
            signals: ["부정 키워드 급증", "동일 SKU 반복", "반품 사유 매칭", "사진 증거 유무"],
            actions: ["불량 의심 티켓", "입고 로트 확인", "상품페이지 경고"],
            rule: "defect_keyword_score",
            insight: "부정 불량 자동 탐지"
        },
        {
            test: /누끼|배경|이미지|프레임|비주얼|소재/,
            service: "Creative Asset Studio",
            entity: "이미지·영상 에셋",
            modules: ["원본 업로드", "마스킹", "생성 큐", "품질 검수", "배포"],
            rows: ["hero_pack_04 배경 12종", "thumbnail_set_09 누락 2건", "shorts_frame_17 하이라이트"],
            signals: ["해상도", "피사체 경계", "브랜드 톤", "저작권 위험"],
            actions: ["재생성", "검수 요청", "광고 에셋 배포"],
            rule: "asset_quality_score",
            insight: "제작비 절감"
        },
        {
            test: /재고|발주|품절|입출고|창고|피킹|납기|배차|물류/,
            service: "Inventory Flow Control",
            entity: "재고·물류 이벤트",
            modules: ["재고 동기화", "수요 예측", "위험 SKU", "피킹 경로", "발주 제안"],
            rows: ["A-102 과재고 위험", "B-441 품절 예상 38h", "센터-03 피킹 경로 재계산"],
            signals: ["4주 이동평균", "리드타임", "안전재고", "배송 지연률"],
            actions: ["발주량 추천", "대체상품 노출", "배차 재조정"],
            rule: "stock_risk_index",
            insight: "재고비 개선"
        },
        {
            test: /가격|쿠폰|입찰|광고비|ROAS|CTR|배너|광고|캠페인|리타게팅/,
            service: "Marketing Decision Desk",
            entity: "광고·캠페인",
            modules: ["성과 수집", "소재 분석", "입찰 조정", "예산 알림", "실험 리포트"],
            rows: ["banner_A CTR 하락", "keyword_32 CPC 급등", "segment_vip ROAS 개선"],
            signals: ["CTR 예측", "CPC 변동", "전환 지연", "예산 소진률"],
            actions: ["입찰 하향", "소재 교체", "예산 재배분"],
            rule: "campaign_roi_score",
            insight: "ROAS 개선"
        },
        {
            test: /CRM|리드|세일즈|견적|콜드메일|웨비나|행사/,
            service: "Sales Pipeline Copilot",
            entity: "리드·견적",
            modules: ["문의 수집", "리드 점수", "견적 초안", "팔로업", "영업 로그"],
            rows: ["lead-482 예산 적합", "quote-117 납기 긴급", "webinar-q32 구매 신호"],
            signals: ["예산 적합도", "납기 긴급도", "업종 적합도", "이전 상호작용"],
            actions: ["담당자 배정", "견적 초안 생성", "팔로업 예약"],
            rule: "lead_priority_score",
            insight: "리드 응답 개선"
        },
        {
            test: /계약서|법무|조항|문서|증빙|세금계산서|회계|정산|보험청구|대출/,
            service: "Document Risk Parser",
            entity: "문서·증빙",
            modules: ["문서 업로드", "조항 추출", "리스크 태깅", "승인 큐", "감사 로그"],
            rows: ["계약-2026-041 해지 조항", "증빙-771 금액 불일치", "청구-339 서류 누락"],
            signals: ["핵심 조항", "금액 매칭", "권한 예외", "민감정보"],
            actions: ["검토자 지정", "조항 요약", "반려 사유 작성"],
            rule: "document_risk_score",
            insight: "검토 시간 단축"
        },
        {
            test: /상담|콜센터|음성|STT|고객|CX|지식베이스|헬프데스크/,
            service: "CX Voice Intelligence",
            entity: "상담·VoC",
            modules: ["STT 수집", "개인정보 마스킹", "문의 분류", "QA 점수", "CRM 기록"],
            rows: ["call-812 환불 요청", "chat-204 배송 지연", "voice-551 불만 고위험"],
            signals: ["감정 점수", "문의 유형", "금칙어", "재문의 가능성"],
            actions: ["요약 저장", "상담 QA", "지식베이스 추천"],
            rule: "cx_resolution_score",
            insight: "CX 점수 개선"
        },
        {
            test: /생산|설비|안전|작업지시|품질|불량 픽셀|유지보수|에너지|협력사|원자재/,
            service: "Factory Ops Monitor",
            entity: "공정·설비",
            modules: ["MES 수집", "이상 신호", "작업 지시", "품질 리포트", "정비 티켓"],
            rows: ["line-04 진동 이상", "lot-221 검사 보류", "meter-09 사용량 급증"],
            signals: ["센서 편차", "불량률", "작업자 확인", "정비 이력"],
            actions: ["라인 알림", "검사 보류", "정비 티켓 생성"],
            rule: "process_anomaly_score",
            insight: "불량률 관리"
        },
        {
            test: /채용|근태|교육|수강|회원탈퇴|구독|프로젝트|권한/,
            service: "People & Ops Automation",
            entity: "사용자·조직 운영",
            modules: ["프로필 수집", "위험 점수", "권한 검토", "자동 알림", "운영 리포트"],
            rows: ["user-182 이탈 위험", "applicant-077 검토 필요", "project-44 일정 위험"],
            signals: ["활동 빈도", "권한 변화", "응답 지연", "리텐션"],
            actions: ["알림 발송", "권한 조정", "담당자 배정"],
            rule: "ops_risk_score",
            insight: "운영 SLA 개선"
        }
    ];

    const matched = patterns.find((pattern) => pattern.test.test(title));
    const scenario = { ...fallback, ...(matched || {}) };
    return {
        ...scenario,
        service: matched ? scenario.service : fallback.service,
        headline: title,
        rows: scenario.rows.map((row, index) => `${row} · #${pad(item.number)}-${index + 1}`),
        modules: scenario.modules.slice(0, 5),
        signals: scenario.signals.slice(0, 4),
        actions: scenario.actions.slice(0, 3),
        seeded
    };
}

function esc(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function teamLabel(id) {
    const member = members[id];
    return `${member.name} · ${member.role.split("·")[0].trim()}`;
}

function articleCopy(item) {
    const sourceList = item.input.join(", ");
    const profile = profiles[item.category];
    const teamNames = item.team.map(teamLabel).join(", ");
    const subscription = item.subscription;
    const blocks = [
        `<section class="subscription-path" aria-label="AX 구독 접근 요약">
            <div><span>PLAN</span><strong>${esc(subscription.plan)}</strong><p>${esc(subscription.approach)}</p></div>
            <div><span>FIRST MONTH</span><strong>${esc(subscription.deliverable)}</strong><p>${esc(subscription.firstMonth)}</p></div>
            <div><span>NEXT BACKLOG</span><strong>다음 달에 바꿔가는 것</strong><p>${esc(subscription.next)}</p></div>
        </section>`,
        `<h2>1. 문제 정의: ${item.industry}의 병목은 어디에서 시작됐나</h2>`,
        `<p>${item.title} 프로젝트는 단순히 AI 기능 하나를 붙이는 일이 아니었습니다. ${item.industry}의 운영팀은 이미 여러 도구를 쓰고 있었지만, 의사결정은 여전히 엑셀, 메신저, 수기 확인에 기대고 있었습니다. 픽셀앤로직은 이 사례를 ${subscription.plan} 플랜 범위로 시작했습니다. 첫 달 산출물은 다음과 같이 정했습니다. ${subscription.deliverable}.</p>`,
        `<p>초기 인터뷰에서는 담당자의 불만을 기능 요청으로 바로 바꾸지 않았습니다. 요청을 반복 시간, 발생 빈도, 오류가 만들 수 있는 손실, 그리고 자동화 후 재사용 가능성으로 나누었습니다. ${item.title}의 경우 핵심 병목은 데이터 입력 자체보다 입력 이후 검증과 승인에 있었습니다. 그래서 첫 접근은 ${subscription.approach}하는 것이었습니다. 다음 달 백로그도 함께 정했습니다. ${subscription.next}. 이 항목을 기준으로 후속 개선이 이어지도록 설계했습니다.</p>`,
        `<figure class="article-visual">
            <img src="../${item.dataImage}" alt="${esc(item.title)} 데이터 연결 화면 캡처">
        </figure>`,
        `<h2>2. 데이터 연결: 흩어진 시스템을 하나의 판단 단위로 묶기</h2>`,
        `<p>이 사례에서 우선 연결한 원천 데이터는 다음 네 가지였습니다. ${sourceList}. 중요한 것은 모든 데이터를 한 번에 끌어오는 것이 아니라, 의사결정에 필요한 최소 단위를 먼저 정의하는 일이었습니다. 예를 들어 고객, 주문, 상품, 문서, 상담, 승인 이력은 서로 다른 시스템에 존재하지만 현장에서는 하나의 업무로 소비됩니다. 픽셀앤로직은 각 데이터에 공통 키를 부여하고, 시간 단위와 상태값을 맞춘 뒤, 누락이나 중복을 먼저 검사하는 정규화 레이어를 만들었습니다.</p>`,
        `<div class="logic-map">
            <div class="logic-node"><span>INPUT</span><strong>${item.input[0]}</strong></div>
            <div class="logic-node"><span>NORMALIZE</span><strong>업무 키와 시간 단위 정렬</strong></div>
            <div class="logic-node"><span>LOGIC</span><strong>우선순위와 이상치 계산</strong></div>
            <div class="logic-node"><span>OUTPUT</span><strong>대시보드, 알림, 승인 큐</strong></div>
        </div>`,
        `<p>연결 구조는 API가 있는 곳과 없는 곳을 구분해 설계했습니다. API가 안정적인 시스템은 주기적 동기화로 처리하고, 파일 업로드나 메일 첨부처럼 비정형적인 입력은 파서와 검수 큐를 분리했습니다. AI가 만든 결과를 곧바로 업무 시스템에 밀어 넣으면 빠르지만 위험하고, 모든 건을 사람이 다시 검수하면 자동화 효과가 사라집니다. 그래서 신뢰도가 높은 건은 자동 반영하고, 애매한 건만 사람에게 넘기는 하이브리드 구조를 잡았습니다.</p>`,
        `<h2>3. 판단 로직: 감으로 정하던 우선순위를 수식으로 바꾸기</h2>`,
        `<div class="formula-box"><code>Automation Score = (반복시간 × 실행빈도 × 오류손실 × 재사용성) / 구현복잡도<br>Risk Gate = 데이터누락률 + 권한예외 + 민감정보위험<br>실행 우선순위 = Automation Score - Risk Gate</code></div>`,
        `<figure class="article-visual">
            <img src="../${item.logicImage}" alt="${esc(item.title)} 판단 로직 화면 캡처">
        </figure>`,
        `<p>${item.title}에서 가장 먼저 만든 것은 멋진 화면이 아니라 우선순위 계산식이었습니다. 반복 시간이 길어도 한 달에 한 번만 일어나는 업무는 뒤로 밀릴 수 있습니다. 반대로 한 번의 오류가 정산, 고객 경험, 법무 검토에 영향을 주는 업무는 짧은 반복이라도 먼저 처리해야 합니다. 이 수식은 고객사와 함께 백로그 회의에서 사용됐고, “왜 이번 달에 이 기능을 먼저 만드는가”를 팀 전체가 납득하게 만들었습니다.</p>`,
        `<p>정량화는 완벽한 예측을 의미하지 않습니다. 오히려 불확실성을 드러내는 도구입니다. 구현복잡도는 연동 난이도, 권한 정책, 기존 데이터 품질, 현장 교육 비용을 합산해 추정했습니다. 오류손실은 금전 손실뿐 아니라 고객 응답 지연, 담당자 재작업, 보고 신뢰도 하락까지 포함했습니다. 이처럼 수식을 만들면 논의가 취향이 아니라 가정의 검증으로 이동합니다.</p>`,
        `<h2>4. 구현 순서: 한 번에 크게 만들지 않고 운영 리듬에 붙이기</h2>`,
        `<figure class="article-visual">
            <img src="../${item.queueImage}" alt="${esc(item.title)} 운영 큐 화면 캡처">
        </figure>`,
        `<p>첫 번째 스프린트에서는 데이터 연결과 검증 화면을 만들었습니다. 이 단계의 목표는 자동화율을 높이는 것이 아니라 “현재 데이터가 믿을 만한가”를 확인하는 것이었습니다. ${subscription.plan} 플랜에서 중요한 것은 첫 달부터 모든 것을 완성하는 것이 아니라, 산출물을 실제로 확인 가능한 형태로 남기는 일입니다. 이 경우 산출물 목록은 ${subscription.deliverable}입니다. 두 번째 스프린트에서는 승인, 알림, 예외 처리 큐를 추가했습니다. 세 번째 스프린트에서는 운영자가 수정한 결과가 다시 학습 데이터와 룰 개선으로 돌아오도록 피드백 루프를 붙였습니다.</p>`,
        `<p>또한 담당자 권한을 세분화했습니다. 조회만 가능한 사용자, 승인 가능한 사용자, 룰을 수정할 수 있는 사용자, 관리자 권한을 가진 사용자를 분리했습니다. ${item.industry}처럼 여러 부서가 같은 데이터를 보는 환경에서는 권한 설계가 자동화의 품질을 좌우합니다. 권한이 과도하면 사고가 나고, 권한이 부족하면 다시 메신저 승인으로 돌아갑니다. 그래서 화면보다 먼저 권한 테이블과 감사 로그를 설계했습니다.</p>`,
        `<h2>5. 결과 지표: 효용은 시간을 줄인 것만으로 판단하지 않는다</h2>`,
        `<div class="metric-grid">
            <div class="metric"><strong>${item.utility}</strong><span>핵심 효용 지표</span></div>
            <div class="metric"><strong>14일</strong><span>첫 운영 배포까지 걸린 시간</span></div>
            <div class="metric"><strong>3단계</strong><span>입력, 검증, 승인 흐름 분리</span></div>
        </div>`,
        `<figure class="article-visual">
            <img src="../${item.roiImage}" alt="${esc(item.title)} ROI 리포트 화면 캡처">
        </figure>`,
        `<p>도입 후 가장 먼저 확인한 지표는 처리 시간, 오류 탐지율, 담당자 재작업률이었습니다. 하지만 픽셀앤로직은 여기에 하나를 더 봅니다. 자동화 이후 팀이 더 빠르게 의사결정하는가입니다. 이 사례의 효과는 핵심 지표(${item.utility})에서 확인할 수 있지만, 실제 가치는 다음 달 백로그가 분명해졌다는 점에 있었습니다. 다음 단계는 “${subscription.next}”입니다. 이전에는 문제를 발견하는 데 시간이 들었고, 이제는 발견된 문제 중 무엇을 먼저 고칠지 논의할 수 있게 됐습니다.</p>`,
        `<p>${profile.tone} 고객사 내부에서는 자동화 화면이 단순한 대시보드가 아니라 운영 회의의 기준점으로 쓰이기 시작했습니다. 담당자는 단순 취합에서 벗어나 예외를 보고, 이상치를 확인하고, 다음 액션을 결정하는 역할로 이동했습니다.</p>`,
        `<h2>6. 운영 거버넌스: AI가 틀렸을 때를 먼저 설계하기</h2>`,
        `<p>AI 또는 자동화 로직이 항상 맞는다는 전제로 설계하면 현장 도입은 오래가지 않습니다. 픽셀앤로직은 각 결과에 신뢰도와 근거 데이터를 함께 표시했습니다. 자동 처리된 항목, 검수 대기 항목, 반려된 항목을 분리하고, 담당자가 수정한 값은 이후 룰 개선의 후보로 남겼습니다. 이렇게 하면 운영자는 결과를 맹신하지 않으면서도 반복 검수에 모든 시간을 쓰지 않게 됩니다.</p>`,
        `<p>또한 장애 상황을 위한 수동 우회 경로를 남겼습니다. 연동 실패, API 제한, 문서 형식 변경, 권한 오류가 발생했을 때 업무가 멈추지 않도록 임시 업로드와 재처리 큐를 두었습니다. 좋은 자동화는 평소에 빨라야 하지만, 문제가 생겼을 때 복구가 쉬워야 합니다. 이 기준이 있어야 월간 구독 모델에서 매달 기능을 쌓아도 운영 안정성이 유지됩니다.</p>`,
        `<h2>7. 담당 스쿼드와 다음 확장</h2>`,
        `<p>담당 스쿼드는 다음 역할로 구성했습니다. ${teamNames}. 사업 모델과 우선순위, 데이터 아키텍처, 풀스택 구현, 운영 UX를 분리해 보았기 때문에 각 의사결정이 한 사람의 감에 묶이지 않았습니다. 다음 단계에서는 이 자동화 흐름을 다른 팀 또는 다른 지점으로 확장하고, 예외 처리 데이터를 기반으로 예측 로직을 고도화할 수 있습니다.</p>`,
        `<p>이 사례는 거대한 AI 전환 프로젝트가 아니라 ${subscription.plan} 플랜으로 작게 시작한 AX 운영 개선입니다. 그러나 작은 업무라도 데이터 연결, 판단 수식, 권한, 검수, 리포트까지 갖추면 조직의 일하는 방식이 바뀝니다. 픽셀앤로직이 AX 구독에서 반복적으로 강조하는 것은 바로 이 지점입니다. 상상이 아니라 로직으로 시작하고, 한 번의 구축이 아니라 매달 개선되는 시스템으로 남기는 것. ${item.title} 업무에 그 원칙을 적용한 기록입니다.</p>`,
        `<div class="article-cta">
            <span>${esc(subscription.plan)}</span>
            <strong>${esc(subscription.cta)}</strong>
            <p>첫 달 산출물은 ${esc(subscription.deliverable)}입니다. 이후 다음 흐름으로 이어갑니다. ${esc(subscription.next)}.</p>
            <a href="../index.html#contact">데모 미팅 신청 남기기</a>
        </div>`
    ];

    let textOnly = blocks.join("").replace(/<[^>]+>/g, "");
    while (textOnly.length < 3300) {
        const extra = `<p>추가 운영 메모로는 ${item.title}의 성과를 한 달 단위로 다시 검증해야 한다는 점이 있습니다. 첫 배포 직후의 절감 효과가 유지되는지, 담당자가 우회 업무를 만들고 있지는 않은지, 예외 큐가 과도하게 쌓이지 않는지 확인해야 합니다. 이 확인 과정까지 포함되어야 자동화는 단발성 기능이 아니라 조직의 운영 자산이 됩니다.</p>`;
        blocks.push(extra);
        textOnly += extra.replace(/<[^>]+>/g, "");
    }
    return { html: blocks.join(""), length: textOnly.length };
}

function authorCards(item, prefix = "../") {
    return item.team.map((id) => {
        const member = members[id];
        return `<a class="author-card" href="../team.html#${id}">
            <img src="${prefix}${member.photo}" alt="${esc(member.name)} 프로필">
            <span>
                <strong>${member.name}</strong>
                <em>${member.role}</em>
                <small>${member.bio}</small>
            </span>
        </a>`;
    }).join("");
}

function articlePage(item) {
    const body = articleCopy(item);
    const related = cases
        .filter((caseItem) => caseItem.category === item.category && caseItem.id !== item.id)
        .slice(0, 3);
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(item.title)} | 픽셀앤로직 AX 사례 블로그</title>
<meta name="description" content="${esc(item.problem)} ${esc(item.subscription.plan)} 플랜으로 접근한 방식과 첫 달 산출물, 다음 백로그를 다룬 픽셀앤로직 AX 사례 아티클입니다.">
${articleStyle()}
</head>
<body>
<div class="site">
    <header class="nav">
        <div class="nav-inner">
            <a class="logo" href="../index.html#top" aria-label="픽셀앤로직 홈"><img src="../images/pixelnlogic-logo.svg" alt="픽셀앤로직 로고"></a>
            <nav class="nav-links" aria-label="주요 메뉴">
                <a href="../index.html#subscription">구독 플랜</a>
                <a class="active" href="../cases.html">사례 블로그</a>
                <a href="../team.html">팀</a>
                <a class="nav-cta" href="../index.html#contact">데모 미팅 신청</a>
            </nav>
        </div>
    </header>

    <main>
        <article class="post">
            <section class="post-hero">
                <div class="post-kicker"><a href="../cases.html">AX Case Library</a><span>/</span><span>#${pad(item.number)} ${item.categoryShort}</span></div>
                <h1>${esc(item.title)}</h1>
                <p class="dek">${esc(item.problem)} 실제 프로젝트 리뷰처럼 어떤 플랜으로 시작했고, 첫 달에 무엇을 남겼고, 다음 달에는 무엇을 바꿔가는지까지 풀었습니다.</p>
                <div class="post-meta">
                    <span>${item.date}</span>
                    <span>${item.readTime}</span>
                    <span>${esc(item.subscription.plan)}</span>
                    <span>본문 ${body.length.toLocaleString()}자</span>
                    <span>${item.utility}</span>
                    <a class="prototype-link" href="../${item.bruteUi}">캡처 UI 원본 보기</a>
                </div>
                <div class="author-strip" aria-label="상단 작성자 카드">
                    ${authorCards(item)}
                </div>
            </section>

            <figure class="post-cover">
                <img src="../${item.thumbImage}" alt="${esc(item.title)} 썸네일">
            </figure>

            <section class="post-layout">
                <aside class="post-aside">
                    <div class="toc-card">
                        <strong>Article Index</strong>
                        <a href="#problem">문제 정의</a>
                        <a href="#logic">판단 로직</a>
                        <a href="#result">결과 지표</a>
                        <a href="#authors">담당 팀</a>
                    </div>
                    <div class="toc-card">
                        <strong>추천 플랜 · ${esc(item.subscription.plan)}</strong>
                        <p>첫 달 산출물은 ${esc(item.subscription.deliverable)}입니다. 이후 다음 흐름으로 이어갑니다. ${esc(item.subscription.next)}.</p>
                        <a class="btn" href="../index.html#contact">${esc(item.subscription.cta)}</a>
                    </div>
                </aside>
                <div class="post-content" id="problem">
                    ${body.html.replace("<h2>3.", "<h2 id=\"logic\">3.").replace("<h2>5.", "<h2 id=\"result\">5.")}
                </div>
            </section>

            <section class="author-bottom" id="authors" aria-label="하단 작성자 카드">
                <div>
                    <p class="label">Written and built by</p>
                    <h2>이 사례를 설계한 픽셀앤로직 팀</h2>
                    <p>아티클의 작성자는 한 명의 필자가 아니라, 사업 우선순위와 데이터 구조, 운영 UX, 실제 구현을 함께 본 스쿼드입니다.</p>
                </div>
                <div class="author-grid">${authorCards(item)}</div>
            </section>

            <section class="related">
                <p class="label">Related Articles</p>
                <h2>같은 카테고리의 다음 사례</h2>
                <div class="related-grid">
                    ${related.map((caseItem) => `<a href="${caseItem.id}.html">
                        <img src="../${caseItem.thumbImage}" alt="${esc(caseItem.title)} 썸네일">
                        <span>#${pad(caseItem.number)} · ${caseItem.categoryShort}</span>
                        <strong>${esc(caseItem.title)}</strong>
                    </a>`).join("")}
                </div>
            </section>
        </article>
    </main>

    <div class="floating-contact" aria-label="빠른 문의">
        <a class="floating-phone" href="tel:01080006959">010-8000-6959</a>
        <a class="floating-kakao" href="http://pf.kakao.com/_Znuan/chat" target="_blank" rel="noopener noreferrer" aria-label="카카오 문의">TALK</a>
    </div>
</div>
</body>
</html>
`;
}

function articleStyle() {
    return `<style>
:root { color-scheme: dark; --bg:#08080b; --panel:#111318; --line:rgba(255,255,255,.11); --text:#e8e9eb; --muted:#aeb5c1; --green:#5ecfaa; --green-soft:rgba(94,207,170,.14); }
* { box-sizing:border-box; }
html { scroll-behavior:smooth; }
[id] { scroll-margin-top:82px; }
body { margin:0; background:var(--bg); color:var(--text); font-family:Inter,"Wanted Sans Variable","Wanted Sans",ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; letter-spacing:0; }
a { color:inherit; text-decoration:none; }
img { max-width:100%; display:block; }
h1,h2,h3,p { word-break:keep-all; }
.site { min-height:100vh; overflow-x:clip; background:radial-gradient(circle at 14% 4%, rgba(94,207,170,.22), transparent 32%), #08080b; }
.nav { position:sticky; top:0; z-index:30; border-bottom:1px solid var(--line); background:rgba(8,8,11,.82); backdrop-filter:blur(18px); }
.nav-inner { width:min(1180px,100%); height:58px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; padding:0 20px; }
.logo img { width:116px; }
.nav-links { display:flex; align-items:center; gap:4px; }
.nav-links a { min-height:34px; display:inline-flex; align-items:center; border-radius:7px; color:rgba(255,255,255,.68); padding:0 12px; font-size:14px; font-weight:700; }
.nav-links a:hover,.nav-links a.active { color:#fff; background:rgba(255,255,255,.06); }
.nav-cta { margin-left:10px; background:#e6e6e6!important; color:#0a0a0a!important; }
.post { width:min(1120px,100%); margin:0 auto; padding:86px 20px 120px; }
.post-hero { max-width:930px; }
.post-kicker { display:flex; flex-wrap:wrap; gap:10px; color:var(--green); font-size:12px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
h1 { margin:18px 0 0; color:#fff; font-size:clamp(42px,7vw,76px); line-height:1.13; font-weight:900; }
.dek { max-width:780px; margin:24px 0 0; color:var(--muted); font-size:18px; line-height:1.9; }
.post-meta { display:flex; flex-wrap:wrap; gap:8px; margin-top:24px; }
.post-meta span,.label { color:#d7fff1; }
.post-meta span,.prototype-link { min-height:30px; display:inline-flex; align-items:center; border:1px solid rgba(94,207,170,.22); border-radius:999px; background:var(--green-soft); padding:0 11px; font-size:12px; font-weight:900; }
.prototype-link { background:#e6e6e6; color:#0a0a0a; border-color:#e6e6e6; }
.author-strip,.author-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.author-strip { margin-top:28px; }
.author-card { min-height:126px; display:grid; grid-template-columns:56px 1fr; gap:13px; align-items:start; border:1px solid var(--line); border-radius:12px; background:rgba(255,255,255,.045); padding:13px; }
.author-card img { width:56px; height:56px; border-radius:10px; object-fit:cover; background:#151920; }
.author-card strong,.author-card em,.author-card small { display:block; }
.author-card strong { color:#fff; font-size:15px; }
.author-card em { margin-top:4px; color:#d7fff1; font-style:normal; font-size:12px; font-weight:800; }
.author-card small { margin-top:7px; color:#9da6b4; font-size:12px; line-height:1.5; }
.post-cover { margin:42px 0 0; border:1px solid var(--line); border-radius:16px; overflow:hidden; background:rgba(255,255,255,.035); }
.post-cover img { width:100%; aspect-ratio:16/9; object-fit:cover; }
.post-layout { display:grid; grid-template-columns:260px minmax(0,1fr); gap:42px; margin-top:46px; align-items:start; }
.post-aside { position:sticky; top:82px; display:grid; gap:12px; }
.toc-card { border:1px solid var(--line); border-radius:12px; background:rgba(255,255,255,.045); padding:16px; }
.toc-card strong { display:block; color:#fff; font-size:14px; margin-bottom:10px; }
.toc-card a { display:block; color:#c5cbd5; font-size:13px; padding:8px 0; }
.toc-card p { margin:0; color:#a7afbd; font-size:13px; line-height:1.65; }
.btn { display:inline-flex!important; align-items:center; justify-content:center; width:100%; min-height:38px; border-radius:7px; margin-top:12px; color:#0a0a0a!important; background:#e6e6e6; font-size:13px; font-weight:900; }
.post-content { min-width:0; max-width:760px; }
.post-content h2 { margin:44px 0 14px; color:#fff; font-size:27px; line-height:1.42; }
.post-content h2:first-child { margin-top:0; }
.post-content p,.post-content li { color:#c8ced8; font-size:16px; line-height:2.02; }
.post-content p { margin:0 0 17px; }
.subscription-path { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:0 0 34px; }
.subscription-path div,.article-cta { border:1px solid var(--line); border-radius:13px; background:rgba(255,255,255,.045); padding:16px; }
.subscription-path span,.article-cta span { display:block; color:var(--green); font-size:11px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
.subscription-path strong,.article-cta strong { display:block; margin-top:9px; color:#fff; font-size:16px; line-height:1.45; }
.subscription-path p,.article-cta p { margin:8px 0 0; color:#aeb5c1; font-size:13px; line-height:1.65; }
.article-cta { margin:34px 0 0; background:linear-gradient(135deg, rgba(94,207,170,.13), rgba(255,255,255,.04)); border-color:rgba(94,207,170,.26); }
.article-cta strong { font-size:24px; }
.article-cta a { display:inline-flex; align-items:center; justify-content:center; min-height:40px; border-radius:8px; margin-top:16px; background:#e6e6e6; color:#0a0a0a; padding:0 16px; font-size:13px; font-weight:900; }
.article-visual { margin:28px 0 34px; border:1px solid var(--line); border-radius:14px; overflow:hidden; background:rgba(255,255,255,.035); }
.article-visual img { width:100%; height:auto; object-fit:contain; background:#08080b; }
.logic-map,.metric-grid { display:grid; gap:10px; margin:20px 0 26px; }
.logic-map { grid-template-columns:repeat(4,1fr); }
.logic-node,.metric,.formula-box { border:1px solid var(--line); border-radius:10px; background:rgba(255,255,255,.045); padding:16px; }
.logic-node span { color:var(--green); font-size:11px; font-weight:900; letter-spacing:.06em; }
.logic-node strong { display:block; margin-top:10px; color:#fff; font-size:14px; line-height:1.5; }
.formula-box { margin:20px 0 26px; background:rgba(94,207,170,.08); border-color:rgba(94,207,170,.25); }
.formula-box code { color:#d7fff1; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; font-size:14px; line-height:1.8; white-space:normal; }
.metric-grid { grid-template-columns:repeat(3,1fr); }
.metric strong { display:block; color:#fff; font-size:24px; }
.metric span { display:block; margin-top:7px; color:#aeb5c1; font-size:13px; line-height:1.55; }
.author-bottom,.related { margin-top:64px; border-top:1px solid var(--line); padding-top:34px; }
.author-bottom { display:grid; grid-template-columns:minmax(0,.7fr) minmax(0,1fr); gap:28px; align-items:start; }
.label { margin:0; font-size:12px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
.author-bottom h2,.related h2 { margin:8px 0 0; color:#fff; font-size:30px; line-height:1.35; }
.author-bottom p:not(.label) { color:#aeb5c1; line-height:1.8; }
.related-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:20px; }
.related-grid a { display:grid; gap:10px; border:1px solid var(--line); border-radius:12px; background:rgba(255,255,255,.04); overflow:hidden; padding-bottom:14px; }
.related-grid img { width:100%; aspect-ratio:16/9; object-fit:cover; }
.related-grid span,.related-grid strong { margin-inline:14px; }
.related-grid span { color:#d7fff1; font-size:11px; font-weight:900; text-transform:uppercase; }
.related-grid strong { color:#fff; font-size:16px; line-height:1.45; }
.floating-contact { position:fixed; right:24px; bottom:24px; z-index:40; display:grid; gap:8px; justify-items:end; }
.floating-phone { display:inline-flex; align-items:center; justify-content:center; min-height:38px; border-radius:999px; background:#e6e6e6; color:#0a0a0a; box-shadow:0 16px 34px rgba(0,0,0,.22); padding:0 14px; font-size:12px; font-weight:900; }
.floating-kakao { display:grid; place-items:center; width:56px; height:56px; border-radius:50%; background:#fee500; color:#392020; box-shadow:0 16px 34px rgba(0,0,0,.28); font-size:12px; font-weight:900; }
@media (max-width: 920px) {
    .nav-links { gap:0; }
    .nav-links a:not(.nav-cta) { display:none; }
    .post-layout,.author-bottom { grid-template-columns:1fr; }
    .post-aside { position:static; order:2; }
    .author-strip,.author-grid,.related-grid,.logic-map,.metric-grid,.subscription-path { grid-template-columns:1fr; }
}
body { background:#ffffff; color:#222326; }
.site { background:#ffffff; }
.nav { background:rgba(255,255,255,.86); border-bottom:1px solid #eceef4; }
.nav-links a { color:#6f737b; }
.nav-links a:hover,.nav-links a.active { color:#1f2024; background:#f4f5f8; }
.post-kicker,.post-meta span,.label { color:#5562d6; }
h1,.post-content h2,.author-bottom h2,.related h2,.author-card strong,.related-grid strong,.toc-card strong { color:#222326; }
.dek,.post-content p,.post-content li,.author-bottom p:not(.label),.toc-card p { color:#5f6673; }
.post-meta span { background:#f1f4ff; border-color:#dfe5ff; color:#5562d6; }
.prototype-link { background:#222326; border-color:#222326; color:#fff; }
.author-card,.post-cover,.article-visual,.toc-card,.logic-node,.metric,.formula-box,.related-grid a,.subscription-path div,.article-cta { background:#ffffff; border-color:#e9ebf0; box-shadow:0 18px 52px rgba(40,45,70,.07); }
.author-card em,.logic-node span,.formula-box code { color:#5562d6; }
.subscription-path span,.article-cta span { color:#5562d6; }
.subscription-path strong,.article-cta strong { color:#222326; }
.subscription-path p,.article-cta p { color:#6f737b; }
.author-card small,.metric span,.related-grid span,.toc-card a { color:#7a818d; }
.metric strong { color:#222326; }
.formula-box { background:#f6f7ff; }
.floating-phone,.floating-kakao { box-shadow:0 18px 50px rgba(40,45,70,.18); }
</style>`;
}

function capturePage() {
    const data = cases.map((item) => ({
        id: item.id,
        number: item.number,
        title: item.title,
        category: item.category,
        categoryLabel: item.categoryLabel,
        categoryShort: item.categoryShort,
        industry: item.industry,
        utility: item.utility,
        subscription: item.subscription,
        input: item.input,
        scenario: scenarioFor(item),
        team: item.team.map((id) => ({ name: members[id].name, role: members[id].role }))
    }));

    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=599, initial-scale=1">
<title>Pixel & Logic Case Capture Board</title>
<style>
* { box-sizing:border-box; }
html, body { margin:0; width:599px; min-height:360px; overflow:hidden; background:#08080b; color:#fff; font-family:Inter,"Wanted Sans Variable","Wanted Sans",system-ui,sans-serif; letter-spacing:0; }
.frame { position:relative; width:599px; overflow:hidden; background:#08080b; }
.frame::before { content:""; position:absolute; inset:0; background:linear-gradient(135deg, rgba(94,207,170,.24), transparent 34%), radial-gradient(circle at 85% 15%, rgba(255,236,112,.18), transparent 30%), radial-gradient(circle at 10% 90%, rgba(108,141,255,.16), transparent 32%); }
.frame::after { content:""; position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px); background-size:30px 30px; mask-image:linear-gradient(135deg, #000 0%, transparent 72%); }
.inner { position:relative; z-index:1; padding:28px; }
.top { display:flex; align-items:center; justify-content:space-between; color:#d7fff1; font-size:11px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
.brand { color:#fff; font-size:16px; font-weight:800; letter-spacing:-.02em; text-transform:none; }
h1 { width:388px; margin:28px 0 0; color:#fff; font-size:36px; line-height:1.13; letter-spacing:0; word-break:keep-all; }
.sub { width:356px; margin:13px 0 0; color:#c4cad4; font-size:14px; line-height:1.55; word-break:keep-all; }
.chips { display:flex; flex-wrap:wrap; gap:7px; margin-top:17px; max-width:390px; }
.chip { min-height:25px; display:inline-flex; align-items:center; border:1px solid rgba(94,207,170,.28); border-radius:999px; background:rgba(94,207,170,.1); color:#d7fff1; padding:0 10px; font-size:10px; font-weight:900; }
.dashboard { position:absolute; right:28px; bottom:26px; width:190px; border:1px solid rgba(255,255,255,.12); border-radius:14px; background:rgba(17,19,24,.88); box-shadow:0 22px 54px rgba(0,0,0,.34); padding:14px; }
.dash-head { display:flex; justify-content:space-between; color:#8f98a8; font-size:9px; font-weight:800; }
.big { margin-top:9px; color:#fff; font-size:34px; font-weight:900; }
.bars { display:grid; gap:6px; margin-top:12px; }
.bar { height:8px; border-radius:99px; background:rgba(255,255,255,.08); overflow:hidden; }
.bar i { display:block; height:100%; border-radius:inherit; background:#5ecfaa; }
.thumb { height:337px; }
.mid { height:360px; }
.mid .inner { padding:24px 26px; }
.mid h1 { width:100%; margin:12px 0 0; font-size:26px; }
.logic-board { display:grid; grid-template-columns:1fr .94fr; gap:12px; margin-top:14px; }
.flow, .table, .chart, .note { border:1px solid rgba(255,255,255,.12); border-radius:12px; background:rgba(17,19,24,.86); padding:10px; }
.flow { display:grid; gap:6px; }
.step { display:grid; grid-template-columns:70px 1fr; gap:7px; align-items:center; min-height:38px; border:1px solid rgba(255,255,255,.09); border-radius:9px; background:rgba(255,255,255,.045); padding:6px 8px; }
.step b { color:#5ecfaa; font-size:9px; letter-spacing:.06em; }
.step span { color:#fff; font-size:12px; font-weight:850; line-height:1.35; word-break:keep-all; }
.right-stack { display:grid; gap:7px; }
.table-row { display:grid; grid-template-columns:1fr 50px; gap:7px; padding:5px 0; border-bottom:1px solid rgba(255,255,255,.08); color:#cdd3dd; font-size:10px; }
.table-row:last-child { border-bottom:0; }
.table-row strong { color:#fff; text-align:right; }
.chart-lines { display:grid; gap:6px; margin-top:7px; }
.chart-line { display:grid; grid-template-columns:42px 1fr 30px; gap:7px; align-items:center; color:#b7bfcd; font-size:9px; }
.track { height:8px; border-radius:99px; background:rgba(255,255,255,.08); overflow:hidden; }
.track i { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,#5ecfaa,#f7e76b); }
.note { color:#d7fff1; font-size:10px; line-height:1.45; font-weight:800; word-break:keep-all; }
.app-shell { height:360px; }
.app-shell .inner { padding:18px; }
.service-thumb { height:337px; }
.service-thumb .inner { padding:16px; }
.window { position:relative; z-index:1; height:324px; display:grid; grid-template-columns:126px 1fr; overflow:hidden; border:1px solid rgba(255,255,255,.14); border-radius:16px; background:rgba(10,12,17,.92); box-shadow:0 24px 70px rgba(0,0,0,.34); }
.service-thumb .window { height:305px; }
.sidebar { border-right:1px solid rgba(255,255,255,.08); padding:15px 12px; background:rgba(255,255,255,.035); }
.app-logo { color:#fff; font-size:13px; font-weight:900; letter-spacing:-.02em; }
.nav-item { min-height:27px; display:flex; align-items:center; border-radius:7px; margin-top:8px; color:#8f98a8; padding:0 8px; font-size:9px; font-weight:800; }
.nav-item.active { color:#d7fff1; background:rgba(94,207,170,.13); }
.main-pane { min-width:0; padding:15px; }
.pane-top { display:flex; justify-content:space-between; align-items:start; gap:12px; }
.pane-top h2 { margin:0; color:#fff; font-size:22px; line-height:1.2; word-break:keep-all; }
.pane-top p { margin:5px 0 0; color:#9ca5b3; font-size:10px; line-height:1.5; word-break:keep-all; }
.status-pill { flex:0 0 auto; min-height:25px; display:inline-flex; align-items:center; border:1px solid rgba(94,207,170,.25); border-radius:999px; background:rgba(94,207,170,.1); color:#d7fff1; padding:0 9px; font-size:9px; font-weight:900; }
.grid-two { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:13px; }
.panel { border:1px solid rgba(255,255,255,.1); border-radius:12px; background:rgba(255,255,255,.045); padding:11px; }
.panel h3 { margin:0 0 9px; color:#fff; font-size:12px; }
.source-row,.schema-row,.queue-row,.rule-row,.roi-row { display:grid; align-items:center; gap:7px; border-bottom:1px solid rgba(255,255,255,.07); color:#c6ced9; font-size:9px; padding:7px 0; }
.source-row:last-child,.schema-row:last-child,.queue-row:last-child,.rule-row:last-child,.roi-row:last-child { border-bottom:0; }
.source-row { grid-template-columns:1fr 45px; }
.schema-row { grid-template-columns:72px 1fr 38px; }
.queue-row { grid-template-columns:54px 1fr 42px; }
.rule-row { grid-template-columns:80px 1fr 38px; }
.roi-row { grid-template-columns:1fr 58px; }
.source-row strong,.schema-row strong,.queue-row strong,.rule-row strong,.roi-row strong { color:#fff; font-size:10px; }
.mini-code { display:block; margin-top:8px; border:1px solid rgba(94,207,170,.22); border-radius:9px; background:rgba(94,207,170,.08); color:#d7fff1; padding:10px; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:9px; line-height:1.55; white-space:normal; }
.kanban { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:13px; }
.lane { min-height:184px; border:1px solid rgba(255,255,255,.1); border-radius:12px; background:rgba(255,255,255,.04); padding:9px; }
.lane b { display:block; color:#d7fff1; font-size:10px; margin-bottom:8px; }
.ticket { border:1px solid rgba(255,255,255,.09); border-radius:9px; background:rgba(8,8,11,.55); color:#d6dce5; padding:8px; font-size:9px; line-height:1.45; margin-top:7px; word-break:keep-all; }
.wide-chart { height:78px; display:flex; align-items:end; gap:8px; margin-top:12px; }
.col { flex:1; border-radius:8px 8px 3px 3px; background:linear-gradient(180deg,#f7e76b,#5ecfaa); opacity:.9; }
.matrix { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:12px; }
.matrix-card { min-height:74px; border:1px solid rgba(255,255,255,.1); border-radius:10px; background:rgba(255,255,255,.045); padding:9px; }
.matrix-card span { display:block; color:#8f98a8; font-size:9px; }
.matrix-card strong { display:block; margin-top:8px; color:#fff; font-size:18px; }
.frame { background:#f7f8ff; }
.frame::before { background:linear-gradient(135deg, rgba(197,225,255,.82), transparent 44%), radial-gradient(circle at 86% 18%, rgba(196,229,176,.72), transparent 28%), radial-gradient(circle at 12% 88%, rgba(222,217,255,.82), transparent 34%); }
.frame::after { background-image:linear-gradient(rgba(96,119,168,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(96,119,168,.12) 1px, transparent 1px); }
.window { border-color:rgba(215,221,236,.9); background:rgba(255,255,255,.86); box-shadow:0 24px 72px rgba(78,91,130,.16); }
.sidebar { border-right:1px solid #edf0f7; background:rgba(255,255,255,.7); }
.app-logo,.pane-top h2,.panel h3,.matrix-card strong,.source-row strong,.schema-row strong,.queue-row strong,.rule-row strong,.roi-row strong,.table-row strong,.step span { color:#23252b; }
.pane-top p,.source-row,.schema-row,.queue-row,.rule-row,.roi-row,.table-row,.ticket { color:#5f6673; }
.nav-item { color:#7c8492; }
.nav-item.active { color:#315bdc; background:#eef3ff; }
.status-pill { border-color:#dbe3ff; background:#f1f5ff; color:#315bdc; }
.panel,.lane,.matrix-card,.logic-node,.formula-box,.flow,.table,.chart,.note { border-color:#e7ebf3; background:rgba(255,255,255,.82); }
.ticket { border-color:#e9edf5; background:#ffffff; box-shadow:0 8px 22px rgba(64,73,110,.06); }
.mini-code { border-color:#dfe7ff; background:#f5f8ff; color:#3346a8; }
.lane b,.step b,.note { color:#315bdc; }
.col,.track i,.bar i { background:linear-gradient(180deg,#ff7b3d,#75a7ff); }
.product-screen { height:360px; padding:16px; }
.product-card { position:relative; z-index:1; height:328px; display:grid; grid-template-columns:150px 1fr; overflow:hidden; border:1px solid #dfe5f2; border-radius:22px; background:rgba(255,255,255,.9); box-shadow:0 22px 70px rgba(84,96,130,.16); }
.product-side { padding:18px 14px; border-right:1px solid #eef1f7; background:rgba(247,249,255,.82); }
.product-name { color:#222326; font-size:14px; line-height:1.12; font-weight:950; letter-spacing:-.04em; }
.product-menu { display:grid; gap:8px; margin-top:18px; }
.product-menu span { min-height:28px; display:flex; align-items:center; border-radius:9px; color:#7b8290; padding:0 9px; font-size:9px; font-weight:900; }
.product-menu span.on { color:#315bdc; background:#eef3ff; }
.product-main { min-width:0; padding:18px; }
.product-head { display:flex; justify-content:space-between; gap:14px; align-items:start; }
.product-head h2 { margin:0; color:#222326; font-size:23px; line-height:1.18; letter-spacing:-.035em; word-break:keep-all; }
.product-head p { margin:6px 0 0; color:#697180; font-size:10px; line-height:1.5; word-break:keep-all; }
.product-pill { flex:0 0 auto; min-height:27px; display:inline-flex; align-items:center; border-radius:999px; background:#25262b; color:#fff; padding:0 10px; font-size:9px; font-weight:900; }
.product-grid { display:grid; grid-template-columns:1.02fr .98fr; gap:12px; margin-top:14px; }
.white-panel { border:1px solid #e7ebf4; border-radius:15px; background:#fff; padding:12px; box-shadow:0 8px 28px rgba(81,91,120,.06); }
.white-panel h3 { margin:0 0 10px; color:#222326; font-size:12px; }
.metric-row { display:grid; grid-template-columns:1fr auto; gap:8px; align-items:center; border-bottom:1px solid #edf0f5; padding:7px 0; color:#687080; font-size:9px; }
.metric-row:last-child { border-bottom:0; }
.metric-row strong { color:#222326; font-size:10px; }
.forecast-bars,.line-chart,.heat-cells,.route-map,.thumb-grid,.wave-bars,.flow-nodes { height:132px; display:flex; align-items:end; gap:8px; }
.forecast-bars i { flex:1; min-height:20px; border-radius:10px 10px 4px 4px; background:linear-gradient(180deg,#7aa7ff,#cfe0ff); }
.forecast-bars i.hot { background:linear-gradient(180deg,#ff7b3d,#ffd2bd); }
.line-chart { align-items:center; position:relative; background:linear-gradient(#edf1f8 1px,transparent 1px); background-size:100% 28px; }
.line-chart svg { width:100%; height:120px; overflow:visible; }
.heat-cells { display:grid; grid-template-columns:repeat(6,1fr); align-items:stretch; }
.heat-cells i { border-radius:8px; background:#e7f0ff; }
.heat-cells i:nth-child(3n) { background:#ffcdb7; }
.heat-cells i:nth-child(4n) { background:#c6f1d6; }
.route-map { position:relative; align-items:center; justify-content:center; border-radius:13px; background:#f3f7ff; }
.route-map span { position:absolute; width:48px; height:28px; display:grid; place-items:center; border-radius:999px; background:#fff; color:#315bdc; font-size:9px; font-weight:900; box-shadow:0 8px 20px rgba(76,91,140,.12); }
.route-map span:nth-child(1){left:16px;top:22px}.route-map span:nth-child(2){left:98px;top:70px}.route-map span:nth-child(3){right:18px;top:32px}.route-map span:nth-child(4){right:74px;bottom:20px}
.thumb-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; align-items:stretch; }
.thumb-grid i { border-radius:12px; background:linear-gradient(135deg,#eef3ff,#fff4ec); border:1px solid #e8ecf6; }
.wave-bars { align-items:center; }
.wave-bars i { flex:1; border-radius:999px; background:#7aa7ff; }
.doc-preview { height:132px; border-radius:13px; background:linear-gradient(180deg,#fff,#f5f7fb); border:1px solid #e7ebf4; padding:14px; }
.doc-preview b,.doc-preview i { display:block; height:8px; border-radius:99px; background:#dbe2ee; margin-bottom:9px; }
.doc-preview b { width:70%; background:#222326; }
.flow-nodes { align-items:center; justify-content:space-between; }
.flow-nodes span { width:68px; min-height:50px; display:grid; place-items:center; text-align:center; border-radius:14px; background:#f3f6ff; color:#315bdc; font-size:9px; font-weight:900; padding:8px; }
.kanban-mini { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:14px; }
.kanban-mini div { min-height:94px; border:1px solid #e7ebf4; border-radius:14px; background:#fff; padding:10px; color:#697180; font-size:9px; line-height:1.45; }
.kanban-mini b { display:block; color:#222326; margin-bottom:8px; font-size:10px; }
</style>
</head>
<body>
<main id="root"></main>
<script>
const cases = ${JSON.stringify(data)};
const params = new URLSearchParams(location.search);
const id = params.get("case") || "case-001";
const variant = params.get("variant") || "thumb";
const item = cases.find((caseItem) => caseItem.id === id) || cases[0];
const scenario = item.scenario;
const widths = [58 + (item.number % 29), 44 + (item.number % 41), 62 + (item.number % 23), 38 + (item.number % 36)];
function productSpec() {
    const title = item.title;
    const specs = [
        [/상품평|리뷰|부정|불량/, "Review Defect Sentinel", "reviews", ["리뷰 수집","키워드 클러스터","불량 의심","반품 연결","MD 알림"], ["SKU-AC21 냄새·변색", "입고 로트 확인", "반품 사유 매칭"], "불량 의심 티켓"],
        [/초도 판매|판매 예측|수요|재고 예측|발주량|품절|재고/, "Launch Demand Forecaster", "forecast", ["상품 후보","수요 예측","초도 물량","채널 배분","발주 알림"], ["런칭 D-14 예상 판매량", "채널별 초도 물량", "안전재고 시뮬레이션"], "초도 물량 추천"],
        [/누끼|배경|이미지|상세페이지|비주얼|소재|프레임|영상|숏폼|자막/, "Creative Production Studio", "gallery", ["원본 업로드","생성 큐","품질 점검","버전 비교","배포"], ["배경 후보 12종", "프레임 하이라이트", "품질 검수 결과"], "에셋 자동 생성"],
        [/가격|쿠폰|입찰|광고비|ROAS|CTR|배너|광고|캠페인|리타게팅/, "Campaign Performance Lab", "chart", ["성과 수집","예산 배분","소재 실험","입찰 조정","리포트"], ["CTR 예측", "CPC 급등 구간", "예산 재배분"], "입찰 자동 조정"],
        [/CRM|리드|세일즈|견적|콜드메일|웨비나|행사/, "Sales Pipeline Copilot", "pipeline", ["문의 수집","리드 점수","견적 초안","팔로업","영업 로그"], ["고가 리드", "견적 SLA", "팔로업 예약"], "담당자 배정"],
        [/계약서|법무|조항|문서|증빙|세금계산서|회계|정산|보험청구|대출/, "Document Risk Parser", "document", ["문서 업로드","조항 추출","리스크 태깅","승인 큐","감사 로그"], ["핵심 조항 추출", "금액 불일치", "서류 누락"], "검토자 지정"],
        [/상담|콜센터|음성|STT|고객|CX|지식베이스|헬프데스크|VoC/, "CX Voice Intelligence", "wave", ["STT 수집","마스킹","문의 분류","QA 점수","CRM 기록"], ["상담 요약", "감정 점수", "재문의 가능성"], "상담 QA"],
        [/창고|피킹|납기|배차|배송|물류|입출고/, "Logistics Route Optimizer", "route", ["주문 수집","경로 계산","배차 큐","지연 예측","배송 알림"], ["피킹 동선", "납기 위험", "배차 후보"], "경로 재계산"],
        [/생산|설비|안전|작업지시|품질|유지보수|에너지|협력사|원자재|공정/, "Factory Ops Monitor", "heatmap", ["MES 수집","이상 신호","작업 지시","품질 리포트","정비 티켓"], ["라인 이상", "검사 보류", "정비 이력"], "라인 알림"],
        [/채용|근태|교육|수강|회원탈퇴|구독|프로젝트|권한/, "People Ops Automation", "matrix", ["프로필 수집","위험 점수","권한 검토","자동 알림","운영 리포트"], ["이탈 위험", "권한 변화", "일정 위험"], "담당자 배정"],
        [/검색어|키워드|SEO|FAQ|브랜드 메시지|페르소나|고객 여정|커뮤니티|PR/, "Insight Cluster Board", "network", ["데이터 수집","클러스터링","인사이트","콘텐츠 큐","리포트"], ["키워드 군집", "페르소나 가설", "리스크 신호"], "인사이트 발행"]
    ];
    const found = specs.find(([test]) => test.test(title));
    const [, name, mode, nav, rows, action] = found || [null, scenario.service, item.number % 2 ? "chart" : "matrix", scenario.modules, scenario.rows, scenario.actions[0]];
    return { name, mode, nav, rows, action };
}
const product = productSpec();
function visual(mode) {
    if (mode === "forecast") return '<div class="forecast-bars">' + widths.concat([74, 88]).map((w, i) => '<i class="' + (i === 4 ? 'hot' : '') + '" style="height:' + (34 + w) + 'px"></i>').join("") + '</div>';
    if (mode === "gallery") return '<div class="thumb-grid">' + Array.from({length:9}, (_, i) => '<i style="background:linear-gradient(' + (120 + i * 18) + 'deg,#eef3ff,#fff4ec ' + (40 + i) + '%,#e9fff5)"></i>').join("") + '</div>';
    if (mode === "route") return '<div class="route-map"><span>센터</span><span>존 A</span><span>존 B</span><span>완료</span><svg width="230" height="118" viewBox="0 0 230 118"><path d="M38 38 C82 20, 86 82, 126 72 S171 23,196 47 S160 102,126 94" fill="none" stroke="#8fb1ff" stroke-width="4" stroke-dasharray="8 6"/></svg></div>';
    if (mode === "wave") return '<div class="wave-bars">' + Array.from({length:28}, (_, i) => '<i style="height:' + (18 + Math.abs(Math.sin((i + item.number) / 2)) * 88) + 'px"></i>').join("") + '</div>';
    if (mode === "document") return '<div class="doc-preview"><b></b>' + Array.from({length:8}, (_, i) => '<i style="width:' + (88 - i * 6) + '%"></i>').join("") + '</div>';
    if (mode === "heatmap") return '<div class="heat-cells">' + Array.from({length:24}, (_, i) => '<i style="opacity:' + (0.55 + ((i + item.number) % 6) / 10) + '"></i>').join("") + '</div>';
    if (mode === "network") return '<div class="flow-nodes"><span>수집</span><span>군집</span><span>판단</span><span>발행</span></div>';
    if (mode === "pipeline") return '<div class="flow-nodes"><span>Lead</span><span>Score</span><span>Quote</span><span>Follow</span></div>';
    if (mode === "reviews") return '<div class="white-panel"><h3>리뷰 탐지 큐</h3>' + product.rows.map((row, i) => '<div class="metric-row"><span>' + row + '</span><strong>' + (86 - i * 7) + '%</strong></div>').join("") + '</div>';
    return '<div class="line-chart"><svg viewBox="0 0 260 120"><polyline points="4,86 50,62 96,72 142,38 190,54 244,20" fill="none" stroke="#75a7ff" stroke-width="6" stroke-linecap="round"/><polyline points="4,105 50,92 96,84 142,78 190,47 244,35" fill="none" stroke="#ff7b3d" stroke-width="5" stroke-linecap="round"/></svg></div>';
}
function renderProductScreen(activeVariant) {
    const titleByVariant = {
        thumb: item.title,
        data: product.rows[0] + " 데이터 수집",
        logic: item.title + " 판단 로직",
        queue: item.title + " 운영 큐",
        roi: item.title + " 성과 리포트"
    };
    const subByVariant = {
        thumb: item.industry + " 팀이 실제로 사용할 수 있는 " + product.name + " 프론트 화면입니다.",
        data: product.rows.join(", ") + "를 연결하고 정규화하는 입력 화면입니다.",
        logic: scenario.signals.join(", ") + " 기준으로 자동 처리와 검수 대상을 나눕니다.",
        queue: product.action + ", 담당자 검수, 승인 대기 상태를 분리합니다.",
        roi: item.utility + "를 처리 시간, 정확도, 재사용성으로 다시 계산합니다."
    };
    const activeIndex = activeVariant === "data" ? 0 : activeVariant === "logic" ? 2 : activeVariant === "queue" ? 3 : activeVariant === "roi" ? 4 : 1;
    const menu = product.nav.map((nav, i) => '<span class="' + (i === activeIndex ? 'on' : '') + '">' + nav + '</span>').join("");
    const rows = product.rows.map((row, i) => '<div class="metric-row"><span>' + row + '</span><strong>' + (activeVariant === "roi" ? (28 + i * 17) + '%' : (91 - i * 8) + '%') + '</strong></div>').join("");
    return '<section class="frame product-screen"><div class="product-card"><aside class="product-side"><div class="product-name">' + product.name + '</div><div class="product-menu">' + menu + '</div></aside><div class="product-main"><div class="product-head"><div><h2>' + (titleByVariant[activeVariant] || item.title) + '</h2><p>' + (subByVariant[activeVariant] || subByVariant.thumb) + '</p></div><span class="product-pill">#' + String(item.number).padStart(3, "0") + '</span></div><div class="product-grid"><div class="white-panel"><h3>' + (activeVariant === "roi" ? "Impact Graph" : "Product View") + '</h3>' + visual(product.mode) + '</div><div class="white-panel"><h3>' + (activeVariant === "logic" ? "Rule Signals" : "Live Items") + '</h3>' + rows + '<div class="metric-row"><span>' + product.action + '</span><strong>' + item.utility.replace(/\\s.+$/, "") + '</strong></div></div></div><div class="kanban-mini"><div><b>Auto</b>' + product.rows[0] + '</div><div><b>Review</b>' + scenario.signals[1] + '</div><div><b>Action</b>' + product.action + '</div></div></div></div></section>';
}
function thumb() {
    return \`<section class="frame service-thumb">
        <div class="inner">
            <div class="window">
                <aside class="sidebar">
                    <div class="app-logo">\${scenario.service}</div>
                    \${scenario.modules.map((module, index) => \`<div class="nav-item \${index === 1 ? "active" : ""}">\${module}</div>\`).join("")}
                </aside>
                <div class="main-pane">
                    <div class="pane-top">
                        <div><h2>\${scenario.headline}</h2><p>\${scenario.entity}를 실시간으로 감지하고 담당자가 바로 처리할 수 있게 만든 전용 자동화 서비스 화면입니다.</p></div>
                        <span class="status-pill">CASE #\${String(item.number).padStart(3, "0")}</span>
                    </div>
                    <div class="matrix">
                        <div class="matrix-card"><span>감지 대상</span><strong>\${scenario.seeded * 3 + 41}</strong></div>
                        <div class="matrix-card"><span>자동 처리</span><strong>\${78 + item.number % 17}%</strong></div>
                        <div class="matrix-card"><span>예외 큐</span><strong>\${4 + item.number % 9}</strong></div>
                        <div class="matrix-card"><span>효용</span><strong>\${item.utility.replace(/\\s.+$/, "")}</strong></div>
                    </div>
                    <div class="grid-two">
                        <div class="panel">
                            <h3>Live Detection</h3>
                            \${scenario.rows.map((row, index) => \`<div class="queue-row"><strong>\${scenario.actions[index % scenario.actions.length]}</strong><span>\${row}</span><span>\${86 - index * 6}%</span></div>\`).join("")}
                        </div>
                        <div class="panel">
                            <h3>Signals</h3>
                            \${scenario.signals.map((signal, index) => \`<div class="source-row"><strong>\${signal}</strong><span>\${widths[index]} pts</span></div>\`).join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>\`;
}
function mid() {
    return \`<section class="frame mid">
        <div class="inner">
            <div class="top"><span>\${item.categoryLabel}</span><span class="brand">pixel\\logic</span></div>
            <h1>\${item.title} · Logic Map</h1>
            <div class="logic-board">
                <div class="flow">
                    <div class="step"><b>INPUT</b><span>\${item.input[0]}</span></div>
                    <div class="step"><b>NORMALIZE</b><span>업무 키, 시간 단위, 상태값 정렬</span></div>
                    <div class="step"><b>LOGIC</b><span>우선순위, 이상치, 신뢰도 계산</span></div>
                    <div class="step"><b>ACTION</b><span>대시보드, 알림, 승인 큐로 배포</span></div>
                </div>
                <div class="right-stack">
                    <div class="table">
                        <div class="table-row"><span>반복 시간 절감</span><strong>\${28 + (item.number % 46)}h</strong></div>
                        <div class="table-row"><span>예외 큐 정확도</span><strong>\${84 + (item.number % 12)}%</strong></div>
                        <div class="table-row"><span>첫 배포 리드타임</span><strong>14d</strong></div>
                    </div>
                    <div class="chart">
                        <div class="dash-head"><span>ROI Factors</span><span>\${item.utility}</span></div>
                        <div class="chart-lines">
                            <div class="chart-line"><span>빈도</span><div class="track"><i style="width:\${widths[0]}%"></i></div><strong>\${widths[0]}</strong></div>
                            <div class="chart-line"><span>손실</span><div class="track"><i style="width:\${widths[1]}%"></i></div><strong>\${widths[1]}</strong></div>
                            <div class="chart-line"><span>재사용</span><div class="track"><i style="width:\${widths[2]}%"></i></div><strong>\${widths[2]}</strong></div>
                        </div>
                    </div>
                    <div class="note">Automation Score = (반복시간 × 실행빈도 × 오류손실 × 재사용성) / 구현복잡도</div>
                </div>
            </div>
        </div>
    </section>\`;
}
function dataView() {
    const latency = 6 + (item.number % 18);
    return \`<section class="frame app-shell">
        <div class="inner">
            <div class="window">
                <aside class="sidebar">
                    <div class="app-logo">\${scenario.service}</div>
                    <div class="nav-item active">\${scenario.modules[0]}</div>
                    <div class="nav-item">\${scenario.modules[1]}</div>
                    <div class="nav-item">\${scenario.modules[2]}</div>
                    <div class="nav-item">Sync Log</div>
                    <div class="nav-item">Owners</div>
                </aside>
                <div class="main-pane">
                    <div class="pane-top">
                        <div><h2>\${scenario.entity} 데이터 인입</h2><p>\${item.title} 서비스가 실제로 감지해야 하는 데이터 소스와 검증 규칙을 한 화면으로 정리했습니다.</p></div>
                        <span class="status-pill">SYNC \${latency}m</span>
                    </div>
                    <div class="grid-two">
                        <div class="panel">
                            <h3>서비스 입력 채널</h3>
                            \${item.input.map((source, index) => \`<div class="source-row"><strong>\${source}</strong><span>\${96 - index * 7}% OK</span></div>\`).join("")}
                        </div>
                        <div class="panel">
                            <h3>정규화 스키마</h3>
                            <div class="schema-row"><strong>work_key</strong><span>\${scenario.rule}_\${item.number}</span><span>필수</span></div>
                            <div class="schema-row"><strong>event_time</strong><span>UTC+09 처리 기준</span><span>필수</span></div>
                            <div class="schema-row"><strong>risk_flag</strong><span>누락·중복·권한 예외</span><span>계산</span></div>
                            <div class="schema-row"><strong>owner</strong><span>자동화 담당 큐</span><span>선택</span></div>
                        </div>
                    </div>
                    <code class="mini-code">if missing_rate &gt; \${2 + (item.number % 5)}% then route_to = "\${scenario.actions[1]}"; else normalize("\${scenario.entity}")</code>
                </div>
            </div>
        </div>
    </section>\`;
}
function logicView() {
    const score = 78 + (item.number % 17);
    const risk = 12 + (item.number % 19);
    return \`<section class="frame app-shell">
        <div class="inner">
            <div class="window">
                <aside class="sidebar">
                    <div class="app-logo">\${scenario.service}</div>
                    <div class="nav-item">Dataset</div>
                    <div class="nav-item active">\${scenario.modules[2]}</div>
                    <div class="nav-item">Score Test</div>
                    <div class="nav-item">Deploy</div>
                    <div class="nav-item">Audit</div>
                </aside>
                <div class="main-pane">
                    <div class="pane-top">
                        <div><h2>\${item.title} 판단 룰</h2><p>자동 처리와 검수 큐를 나누는 기준을 수식과 조건 블록으로 분리했습니다.</p></div>
                        <span class="status-pill">SCORE \${score}</span>
                    </div>
                    <div class="grid-two">
                        <div class="panel">
                            <h3>Rule Conditions</h3>
                            \${scenario.signals.map((signal, index) => \`<div class="rule-row"><strong>\${signal}</strong><span>\${scenario.rows[index % scenario.rows.length]}</span><span>\${index === 2 ? "-" : "+"}0.\${28 - index * 3}</span></div>\`).join("")}
                        </div>
                        <div class="panel">
                            <h3>Scoring Formula</h3>
                            <code class="mini-code">\${scenario.rule} = (\${score} × signal_weight) / complexity<br>Risk Gate = missing + permission + pii<br>Deploy "\${scenario.actions[0]}" when score - risk &gt; \${55 + (item.number % 10)}</code>
                        </div>
                    </div>
                    <div class="wide-chart">\${widths.map((width) => \`<i class="col" style="height:\${34 + width / 2}px"></i>\`).join("")}</div>
                </div>
            </div>
        </div>
    </section>\`;
}
function queueView() {
    return \`<section class="frame app-shell">
        <div class="inner">
            <div class="window">
                <aside class="sidebar">
                    <div class="app-logo">\${scenario.service}</div>
                    <div class="nav-item active">\${scenario.modules[3]}</div>
                    <div class="nav-item">Approvals</div>
                    <div class="nav-item">\${scenario.modules[4]}</div>
                    <div class="nav-item">Fallback</div>
                    <div class="nav-item">Logs</div>
                </aside>
                <div class="main-pane">
                    <div class="pane-top">
                        <div><h2>\${item.title} 운영 큐</h2><p>자동 처리, 사람 검수, 승인 대기 상태를 나누어 현장이 멈추지 않도록 설계했습니다.</p></div>
                        <span class="status-pill">\${item.utility}</span>
                    </div>
                    <div class="kanban">
                        <div class="lane"><b>\${scenario.actions[0]}</b><div class="ticket">\${scenario.rows[0]}</div><div class="ticket">신뢰도 \${86 + item.number % 11}% · 즉시 반영</div></div>
                        <div class="lane"><b>\${scenario.actions[1]}</b><div class="ticket">\${scenario.rows[1]}</div><div class="ticket">\${scenario.signals[1]} 확인 필요</div></div>
                        <div class="lane"><b>\${scenario.actions[2]}</b><div class="ticket">\${scenario.rows[2]}</div><div class="ticket">SLA \${14 + item.number % 20}분</div></div>
                    </div>
                </div>
            </div>
        </div>
    </section>\`;
}
function roiView() {
    const before = 42 + (item.number % 39);
    const after = Math.max(8, before - (18 + item.number % 17));
    return \`<section class="frame app-shell">
        <div class="inner">
            <div class="window">
                <aside class="sidebar">
                    <div class="app-logo">\${scenario.service}</div>
                    <div class="nav-item">Baseline</div>
                    <div class="nav-item active">Impact</div>
                    <div class="nav-item">Cost</div>
                    <div class="nav-item">Rollout</div>
                    <div class="nav-item">Next Sprint</div>
                </aside>
                <div class="main-pane">
                    <div class="pane-top">
                        <div><h2>\${item.title} 성과 리포트</h2><p>도입 전후의 처리 시간, 오류 비용, 재사용성을 같은 기준으로 비교했습니다.</p></div>
                        <span class="status-pill">\${item.utility}</span>
                    </div>
                    <div class="matrix">
                        <div class="matrix-card"><span>Before</span><strong>\${before}h</strong></div>
                        <div class="matrix-card"><span>After</span><strong>\${after}h</strong></div>
                        <div class="matrix-card"><span>Accuracy</span><strong>\${88 + item.number % 10}%</strong></div>
                        <div class="matrix-card"><span>Reuse</span><strong>\${3 + item.number % 6}팀</strong></div>
                    </div>
                    <div class="grid-two">
                        <div class="panel">
                            <h3>Before / After</h3>
                            <div class="roi-row"><span>월 반복 시간</span><strong>\${before}h → \${after}h</strong></div>
                            <div class="roi-row"><span>예외 탐지</span><strong>\${1 + item.number % 4}.x</strong></div>
                            <div class="roi-row"><span>첫 배포</span><strong>14일</strong></div>
                        </div>
                        <div class="panel">
                            <h3>Next Backlog</h3>
                            <code class="mini-code">next_sprint = rank([exception_queue, owner_training, api_retry])<br>target = "\${item.industry}"<br>review_cycle = monthly</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>\`;
}
const renderers = { thumb, mid, data: dataView, logic: logicView, queue: queueView, roi: roiView };
document.getElementById("root").innerHTML = renderProductScreen(variant);
</script>
</body>
</html>`;
}

function cardMarkup(item, size = "standard") {
    return `<a class="blog-card ${size}" href="case-articles/${item.id}.html">
        <div class="thumb-wrap"><img src="${item.thumbImage}" alt="${esc(item.title)} 서비스 화면"></div>
        <h3>${esc(item.title)}</h3>
        <p>${item.date.replaceAll(".", " ")} · ${item.readTime} · ${item.subscription.plan}</p>
    </a>`;
}

function blogIndexPage() {
    const commerce = cases.filter((item) => item.category === "commerce");
    const marketing = cases.filter((item) => item.category === "marketing");
    const operations = cases.filter((item) => item.category === "operations");
    const featured = [cases[11], cases[24], cases[47]];
    const sections = [
        ["Agent for Commerce", commerce],
        ["Agent for Brand", marketing],
        ["Agent for Operations", operations]
    ];

    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pixel & Logic Blog | 97 AX 자동화 사례</title>
<meta name="description" content="픽셀앤로직 AX 구독 도입을 위한 97개 자동화 설계와 사례를 다알파 블로그 같은 카드형 블로그로 탐색합니다.">
<style>
* { box-sizing:border-box; }
html { scroll-behavior:smooth; }
section[id] { scroll-margin-top:96px; }
body { margin:0; background:#fff; color:#242529; font-family:Inter,"Wanted Sans Variable","Wanted Sans",ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; letter-spacing:0; }
a { color:inherit; text-decoration:none; }
img { display:block; max-width:100%; }
h1,h2,h3,p { word-break:keep-all; }
.nav { position:sticky; top:0; z-index:20; height:74px; display:flex; align-items:center; border-bottom:1px solid #eceef4; background:rgba(255,255,255,.88); backdrop-filter:blur(18px); }
.nav-inner { width:min(1920px,100%); margin:0 auto; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; padding:0 36px; }
.brand { color:#242529; font-size:25px; font-weight:900; letter-spacing:-.04em; }
.center-nav { display:flex; gap:58px; color:#6f737b; font-size:20px; font-weight:800; }
.center-nav a.active,.center-nav a:hover { color:#242529; }
.right-nav { justify-self:end; display:flex; align-items:center; gap:20px; }
.lang { color:#2a2b30; font-size:20px; font-weight:700; }
.contact { min-height:54px; display:inline-flex; align-items:center; justify-content:center; border-radius:9px; background:#242529; color:#fff; padding:0 26px; font-size:19px; font-weight:900; }
.hero { padding:94px 36px 74px; background:linear-gradient(180deg,#f7f8ff 0%,#fff 82%); }
.hero-inner { width:min(1840px,100%); margin:0 auto; }
.eyebrow { margin:0; color:#7a7f8a; font-size:22px; font-weight:900; }
h1 { width:min(1180px,100%); margin:22px 0 0; font-size:clamp(46px,5vw,82px); line-height:1.15; letter-spacing:-.035em; font-weight:900; }
.lead { width:min(820px,100%); margin:26px 0 0; color:#6f737b; font-size:22px; line-height:1.75; }
.tabs { display:flex; flex-wrap:wrap; gap:12px; margin-top:38px; }
.tabs a { min-height:44px; display:inline-flex; align-items:center; border:1px solid #e4e7ee; border-radius:999px; background:#fff; color:#4c515c; padding:0 20px; font-size:15px; font-weight:900; }
.section { width:min(1840px,100%); margin:0 auto; padding:56px 36px 74px; }
.section-head { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-bottom:30px; }
h2 { margin:0; font-size:42px; line-height:1.2; letter-spacing:-.035em; }
.more { min-height:58px; display:inline-flex; align-items:center; border:1px solid #e2e5ec; border-radius:11px; color:#242529; padding:0 22px; font-size:18px; font-weight:900; }
.grid { display:grid; grid-template-columns:repeat(3,1fr); gap:30px; }
.blog-card { display:block; }
.thumb-wrap { overflow:hidden; border-radius:22px; background:#f0f2f7; }
.blog-card img { width:100%; aspect-ratio:1.58/1; object-fit:cover; transition:transform .28s ease; }
.blog-card:hover img { transform:scale(1.025); }
.blog-card h3 { margin:28px 0 0; color:#242529; font-size:30px; line-height:1.38; letter-spacing:-.035em; font-weight:900; }
.blog-card p { margin:20px 0 0; color:#777b84; font-size:20px; font-weight:700; }
.blog-card.feature .thumb-wrap { border-radius:24px; }
.blog-card.feature h3 { font-size:32px; }
.library-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:28px; }
.library-grid .blog-card h3 { font-size:22px; margin-top:18px; }
.library-grid .blog-card p { font-size:16px; margin-top:12px; }
.footer { margin-top:70px; border-top:1px solid #eceef4; padding:46px 36px 80px; color:#777b84; }
.footer-inner { width:min(1840px,100%); margin:0 auto; display:flex; justify-content:space-between; gap:24px; font-size:14px; }
@media (max-width: 1100px) {
    .nav-inner { grid-template-columns:1fr auto; }
    .center-nav { display:none; }
    .grid,.library-grid { grid-template-columns:repeat(2,1fr); }
}
@media (max-width: 720px) {
    .nav-inner,.hero,.section,.footer { padding-left:20px; padding-right:20px; }
    .contact,.lang { display:none; }
    .grid,.library-grid { grid-template-columns:1fr; }
    h1 { font-size:44px; }
    h2 { font-size:34px; }
    .blog-card h3 { font-size:26px; }
}
</style>
</head>
<body>
<header class="nav">
    <div class="nav-inner">
        <a class="brand" href="index.html#top">pixel\\logic</a>
        <nav class="center-nav" aria-label="주요 메뉴">
            <a href="index.html#top">Home</a>
            <a class="active" href="cases.html">Blog</a>
            <a href="team.html">Team</a>
        </nav>
        <div class="right-nav"><span class="lang">KOR⌄</span><a class="contact" href="index.html#contact">데모 미팅 신청</a></div>
    </div>
</header>
<main>
    <section class="hero">
        <div class="hero-inner">
            <p class="eyebrow">Blog</p>
            <h1>AX 구독 도입을 위한 자동화 설계와 실제 서비스 화면을 공유합니다.</h1>
            <p class="lead">97개의 글은 단순 목록이 아니라, 각 자동화 Agent가 실제 서비스라면 어떤 화면과 판단 로직으로 운영될지 보여주는 블로그형 사례입니다.</p>
            <div class="tabs">
                <a href="#all">ALL</a>
                <a href="#commerce">Agent for Commerce</a>
                <a href="#brand">Agent for Brand</a>
                <a href="#operations">Agent for Operations</a>
            </div>
        </div>
    </section>
    <section class="section" id="all">
        <div class="section-head"><h2>ALL</h2><a class="more" href="#operations">더 보기 ›</a></div>
        <div class="grid">${featured.map((item) => cardMarkup(item, "feature")).join("")}</div>
    </section>
    ${sections.map(([title, items], index) => `<section class="section" id="${index === 0 ? "commerce" : index === 1 ? "brand" : "operations"}">
        <div class="section-head"><h2>${title}</h2><a class="more" href="#all">위로 가기 ›</a></div>
        <div class="library-grid">${items.map((item) => cardMarkup(item)).join("")}</div>
    </section>`).join("")}
</main>
<footer class="footer"><div class="footer-inner"><strong>pixel\\logic</strong><span>데모 미팅 010-8000-6959 · 97 AX Automation Articles</span></div></footer>
</body>
</html>`;
}

async function main() {
    await mkdir(articleDir, { recursive: true });
    await mkdir(captureDir, { recursive: true });

    await writeFile(path.join(captureDir, "capture-board.html"), capturePage(), "utf8");
    await writeFile(path.join(root, "cases.html"), blogIndexPage(), "utf8");

    for (const item of cases) {
        await writeFile(path.join(articleDir, `${item.id}.html`), articlePage(item), "utf8");
    }

    await writeFile(
        path.join(captureDir, "case-manifest.json"),
        JSON.stringify(cases.map((item) => ({
            id: item.id,
            title: item.title,
            thumb: item.thumbImage,
            data: item.dataImage,
            logic: item.logicImage,
            queue: item.queueImage,
            roi: item.roiImage,
            subscription: item.subscription,
            dataUi: item.dataUi,
            logicUi: item.logicUi,
            queueUi: item.queueUi,
            roiUi: item.roiUi
        })), null, 2),
        "utf8"
    );

    console.log(`Generated ${cases.length} article pages and capture board.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
