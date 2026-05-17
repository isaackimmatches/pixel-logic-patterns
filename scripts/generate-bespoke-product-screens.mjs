import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, "case-assets/case-manifest.json"), "utf8"));
const productDir = path.join(root, "case-assets/products");
const legacyDir = path.join(root, "case-assets/product-screens");

const shots = [
    { key: "thumb", label: "Main product", height: 337 },
    { key: "data", label: "Data setup", height: 360 },
    { key: "logic", label: "Logic builder", height: 360 },
    { key: "queue", label: "Operation flow", height: 360 },
    { key: "roi", label: "Impact report", height: 360 }
];

const productNames = [
    "SceneCut Commerce", "DetailGuard Lens", "SKU Twin Finder", "PricePulse Radar", "Bundle Logic Lab",
    "CartReturn Orchestrator", "LiveQ Router", "Coupon Margin Studio", "Search Cluster Atlas", "Personal Shelf OS",
    "Season Stock Beacon", "Review Defect Sentinel", "Return Reason Switchboard", "Review Reply Studio", "Competitor Attribute Harvester",
    "MD Order Planner", "Launch Demand Forecaster", "Copyright Risk Lens", "Delivery Delay Messenger", "Cross-sell Graph",
    "Catalog Naming Workbench", "OpenMarket Publisher", "Refurb Label Inspector", "VIP Pattern Telescope", "Inventory Forecast Console",
    "Substitute SKU Recommender", "Store Display Optimizer", "Price Sensitivity Lab", "Attribute Extraction Bench", "OmniStock Unifier",
    "Creative Version Vault", "Campaign Brief Digest", "Influencer Match Room", "Highlight Frame Cutter", "Shortform Caption Engine",
    "Blog Keyword Constellation", "Landing Experiment Room", "Newsletter Personalizer", "CRM Segment Factory", "Bid Control Tower",
    "Content Calendar Maker", "Tone Compliance Reader", "SEO FAQ Foundry", "Journey Report Studio", "Event Lead Scanner",
    "Sales Deck Builder", "UTM Quality Gate", "Banner CTR Predictor", "Push Timing Console", "Retargeting Exclusion Desk",
    "Global Campaign Operator", "Community VoC Radar", "PR Risk Watch", "Webinar Question Briefing", "Content Reuse Pipeline",
    "Brand Safety Inspector", "Coldmail Draft Desk", "Persona Experiment Lab", "Localization Page Studio", "Ad Spend Anomaly Lab",
    "Production Daily Writer", "Equipment Signal Monitor", "Safety OCR Inspector", "Work Order Recommender", "Purchase Approval Agent",
    "Commodity Price Monitor", "Pixel Defect Vision", "Picking Route Planner", "Delivery Promise Forecaster", "Carrier Dispatch Board",
    "Stock Gap Detector", "ERP Master Cleaner", "Quality Report Composer", "Maintenance Ticket Sorter", "Energy Optimization Room",
    "Vendor Evaluation Hub", "Quote Compare Workspace", "Insurance Claim Sorter", "Hospital Call Brief", "Learning Retention Predictor",
    "Loan Consult Classifier", "Contract Clause Extractor", "Recruiting Screening Desk", "Attendance Anomaly Desk", "Receipt Audit Lens",
    "Tax Invoice Matcher", "Legal Risk Curator", "Customer QA Automation", "Knowledge Base Recommender", "Call Summary Console",
    "Churn Prediction Desk", "Payment Recovery Agent", "Internal Helpdesk Router", "Document Search Agent", "Project Risk Forecaster",
    "Data Permission Control", "Voice Asset Intelligence"
];

const companySeeds = [
    "Mora Retail", "Aster Goods", "Namu Brands", "Vela Supply", "Orbit Commerce", "Lento Foods", "Folio Health",
    "Kite Education", "Wells Finance", "Nova Factory", "Brisk Logistics", "Coda Legal", "Muse Content", "Prism Beauty",
    "Anchor B2B", "Layer Studio", "Tempo Ops"
];

const palettes = [
    ["#f4f7ff", "#ffffff", "#23304d", "#4f7cff", "#ff7b3d"],
    ["#f6fbf2", "#ffffff", "#233022", "#63b35d", "#315bdc"],
    ["#fff7ef", "#ffffff", "#30251f", "#ff7b3d", "#7b61ff"],
    ["#f7f4ff", "#ffffff", "#292237", "#7b61ff", "#20b486"],
    ["#f1fbf8", "#ffffff", "#19342d", "#20b486", "#f6aa32"],
    ["#f7f8fb", "#ffffff", "#222326", "#111111", "#75a7ff"],
    ["#f2f7ff", "#ffffff", "#16243a", "#2f6dff", "#ff5b8a"],
    ["#fff4f6", "#ffffff", "#342127", "#ff5b8a", "#24a476"],
    ["#f5f5ef", "#ffffff", "#2d2b24", "#9a7b37", "#4978ff"],
    ["#eef8ff", "#ffffff", "#19303c", "#16a5cf", "#ff8a3d"]
];

function esc(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function caseNumber(id) {
    return Number(id.replace("case-", ""));
}

function pick(list, seed, offset = 0) {
    return list[(seed + offset) % list.length];
}

function hasBatchim(value) {
    const chars = Array.from(String(value).trim());
    const last = chars.at(-1);
    if (!last) return false;
    const code = last.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 !== 0;
    return /[013678lmnr]$/i.test(last);
}

function josa(value, withBatchim, withoutBatchim) {
    return `${value}${hasBatchim(value) ? withBatchim : withoutBatchim}`;
}

function words(title) {
    return title
        .replace(/[()·]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

function classify(item) {
    const n = caseNumber(item.id);
    const title = item.title;
    const token = words(title);
    const domain = n <= 30 ? "commerce" : n <= 60 ? "brand" : "ops";
    const exact = {
        "상품평 키워드 기반 부정 불량 탐지": {
            user: "품질/MD 운영팀",
            object: "리뷰 키워드와 SKU 로트",
            sources: ["상품평 원문", "반품 사유", "SKU 로트", "고객 사진"],
            signals: ["부정 키워드 급증", "동일 로트 반복", "반품 사유 일치", "사진 증거"],
            actions: ["불량 의심 티켓", "입고 로트 확인", "판매 페이지 경고"],
            scene: "review"
        },
        "상품명 표준화": {
            user: "카탈로그 운영팀",
            object: "상품명 토큰과 속성 사전",
            sources: ["상품명 원문", "브랜드 사전", "카테고리 속성", "금칙어 룰"],
            signals: ["브랜드 위치", "용량/색상 토큰", "중복 접미사", "표준 속성 누락"],
            actions: ["표준명 제안", "중복명 병합", "오픈마켓명 생성"],
            scene: "taxonomy"
        },
        "웨비나 질문 요약": {
            user: "B2B 마케팅팀",
            object: "실시간 Q&A와 구매 신호",
            sources: ["웨비나 채팅", "참석자 CRM", "세션 타임라인", "후속 미팅 기록"],
            signals: ["가격 질문", "보안 질문", "도입 일정", "결재권자 여부"],
            actions: ["토픽 요약", "핫 리드 표시", "후속 메일 초안"],
            scene: "webinar"
        },
        "신상품 초도 판매 예측": {
            user: "런칭/MD팀",
            object: "신상품 수요 곡선",
            sources: ["사전 검색량", "예약 알림", "유사 SKU 판매", "채널 재고"],
            signals: ["초기 기울기", "채널 편차", "안전재고", "마케팅 노출"],
            actions: ["초도 물량 추천", "채널 배분", "D-3 재계산"],
            scene: "forecast"
        },
        "실시간 재고 예측 로직": {
            user: "SCM 운영팀",
            object: "SKU별 재고 리스크",
            sources: ["주문 로그", "입고 예정", "리드타임", "프로모션 캘린더"],
            signals: ["품절 예상시점", "과재고 지수", "대체 SKU", "안전재고 편차"],
            actions: ["발주량 추천", "대체상품 노출", "입고 우선순위 변경"],
            scene: "inventory"
        },
        "견적서 비교 분석": {
            user: "구매/재무팀",
            object: "공급사 견적 조건",
            sources: ["견적 PDF", "품목 마스터", "납기 조건", "환율/운임"],
            signals: ["단가 차이", "납기 위험", "부가비용 누락", "결제조건"],
            actions: ["견적 비교표 생성", "리스크 표시", "승인 요청"],
            scene: "quote"
        },
        "불량 픽셀 검출 시각 AI": {
            user: "품질 검사팀",
            object: "패널 이미지와 결함 좌표",
            sources: ["검사 이미지", "라인 ID", "조도 로그", "검수 판정"],
            signals: ["데드픽셀", "클러스터 결함", "광량 편차", "재검 이력"],
            actions: ["결함 좌표 표시", "라인 정지 알림", "샘플 재검"],
            scene: "vision"
        },
        "고객 상담 음성 데이터 자산화": {
            user: "CX 데이터팀",
            object: "상담 음성과 지식 자산",
            sources: ["통화 녹취", "상담 메모", "CRM 티켓", "동의 로그"],
            signals: ["감정 변화", "문의 유형", "민감정보", "해결 여부"],
            actions: ["STT 자산화", "QA 점수", "지식베이스 후보"],
            scene: "voice"
        }
    };
    const patternSpecs = [
        [/누끼|배경|이미지|상세페이지|소재|비주얼/, ["브랜드 제작팀", "상품 이미지와 광고 에셋", ["원본 이미지", "상품 속성", "브랜드 가이드", "광고 채널"], ["마스크 경계", "해상도", "톤 일치", "저작권 위험"], ["배경 생성", "검수 요청", "소재 배포"], "creative"]],
        [/가격|쿠폰|입찰|광고비|ROAS|CTR|배너|캠페인|리타게팅/, ["퍼포먼스 마케팅팀", "캠페인 성과와 예산", ["광고 성과", "소재 메타", "전환 로그", "예산 소진"], ["CTR 예측", "CPC 급등", "전환 지연", "빈도 피로"], ["입찰 조정", "소재 교체", "예산 재배분"], "campaign"]],
        [/배송|창고|피킹|납기|배차|물류|입출고/, ["물류 운영팀", "주문과 이동 경로", ["주문 큐", "창고 위치", "운송 SLA", "기사 배차"], ["피킹 거리", "납기 위험", "차량 적재율", "센터 혼잡"], ["경로 재계산", "배차 후보", "지연 알림"], "logistics"]],
        [/계약서|법무|조항|문서|증빙|세금계산서|회계|정산|보험청구|대출/, ["관리/리스크팀", "문서와 조항", ["PDF 문서", "계약 템플릿", "승인 이력", "금액 원장"], ["핵심 조항", "금액 불일치", "권한 예외", "민감정보"], ["조항 추출", "검토자 지정", "반려 사유 작성"], "document"]],
        [/상담|콜센터|음성|STT|고객|CX|지식베이스|헬프데스크|VoC/, ["고객경험팀", "상담과 고객 의도", ["상담 녹취", "채팅 로그", "고객 프로필", "처리 결과"], ["감정 점수", "문의 유형", "재문의 가능성", "금칙어"], ["상담 요약", "QA 평가", "지식 추천"], "voice"]],
        [/생산|설비|안전|작업지시|품질|유지보수|에너지|협력사|원자재|공정/, ["공장 운영팀", "공정과 설비 신호", ["MES 로그", "센서 값", "작업지시", "검사 결과"], ["센서 편차", "불량률", "정비 이력", "라인 병목"], ["라인 알림", "작업 재배정", "정비 티켓"], "factory"]],
        [/CRM|리드|세일즈|견적|콜드메일|웨비나|행사/, ["세일즈/마케팅팀", "리드와 대화 맥락", ["문의 폼", "CRM 이벤트", "메일 응답", "미팅 기록"], ["예산 적합도", "도입 시급성", "직무 적합도", "재접촉 가능성"], ["담당자 배정", "초안 생성", "팔로업 예약"], "sales"]],
        [/채용|근태|교육|수강|회원탈퇴|구독|프로젝트|권한/, ["조직 운영팀", "사용자와 조직 리스크", ["프로필", "활동 로그", "권한 변경", "결제/일정"], ["이탈 위험", "권한 변화", "응답 지연", "리텐션"], ["담당자 알림", "권한 조정", "회복 플로우"], "people"]],
        [/검색어|키워드|SEO|FAQ|브랜드 메시지|페르소나|고객 여정|커뮤니티|PR|뉴스레터|블로그/, ["콘텐츠 전략팀", "키워드와 고객 맥락", ["검색어", "콘텐츠 성과", "커뮤니티 언급", "유입 로그"], ["토픽 군집", "톤 불일치", "의도 변화", "리스크 신호"], ["인사이트 발행", "초안 생성", "우선순위 지정"], "insight"]]
    ];
    const matched = exact[title];
    const fallbackMatch = patternSpecs.find(([regex]) => regex.test(title));
    const source = matched || (fallbackMatch ? {
        user: fallbackMatch[1][0],
        object: fallbackMatch[1][1],
        sources: fallbackMatch[1][2],
        signals: fallbackMatch[1][3],
        actions: fallbackMatch[1][4],
        scene: fallbackMatch[1][5]
    } : {
        user: domain === "commerce" ? "커머스 운영팀" : domain === "brand" ? "브랜드 운영팀" : "업무 운영팀",
        object: `${token.slice(0, 2).join(" ")} 업무 데이터`,
        sources: ["업무 요청", "운영 로그", "담당자 메모", "승인 이력"],
        signals: ["반복 빈도", "오류 비용", "권한 예외", "재사용성"],
        actions: ["자동 처리", "검수 큐", "승인 요청"],
        scene: "ops"
    });
    const productName = productNames[n - 1] || `${token[0] || "AX"} Logic Console`;
    return {
        n,
        id: item.id,
        title,
        productName,
        company: pick(companySeeds, n, token.length),
        domain,
        ...source,
        metric: `${68 + (n % 24)}%`,
        money: `${12 + (n % 38)}h`,
        caseCode: `AX-${String(n).padStart(3, "0")}`,
        tokens: token
    };
}

function bars(spec, count = 6) {
    return Array.from({ length: count }, (_, index) => {
        const height = 36 + ((spec.n * (index + 3)) % 88);
        return `<i style="height:${height}px"></i>`;
    }).join("");
}

function rows(items, spec, metricPrefix = "") {
    return items.map((item, index) => `<div class="row"><span>${esc(item)}</span><strong>${metricPrefix}${88 - index * 7}%</strong></div>`).join("");
}

function chips(items) {
    return items.map((item) => `<span class="chip">${esc(item)}</span>`).join("");
}

function miniCards(spec, labels = spec.actions) {
    return `<div class="mini-cards">${labels.map((label, index) => `<div><small>${esc(label)}</small><b>${esc(spec.signals[index % spec.signals.length])}</b></div>`).join("")}</div>`;
}

function visual(spec, kind) {
    const scene = spec.scene;
    if (scene === "review") {
        return `<div class="review-lab"><div class="bubble hot">냄새</div><div class="bubble">변색</div><div class="bubble warn">파손</div><div class="bubble">누락</div><div class="review-feed">${rows(spec.sources, spec)}</div></div>`;
    }
    if (scene === "taxonomy") {
        return `<div class="name-parser"><p>Before</p><strong>브랜드 특가 NEW ${esc(spec.tokens.slice(0, 3).join(" "))}</strong><p>After</p><strong class="ok">브랜드 / 카테고리 / 용량 / 색상 / 모델</strong><div class="token-line">${chips(spec.signals)}</div></div>`;
    }
    if (scene === "webinar") {
        return `<div class="webinar-board"><div class="stage">LIVE Q&A</div><div class="questions">${spec.signals.map((signal, index) => `<span>${esc(signal)}<b>${16 + spec.n + index}</b></span>`).join("")}</div></div>`;
    }
    if (scene === "forecast" || scene === "inventory") {
        return `<div class="forecast-chart"><div class="axis"></div>${bars(spec, 7)}<svg viewBox="0 0 260 90"><path d="M6 72 C42 48, 80 65, 110 38 S176 24, 244 12" fill="none" stroke="var(--accent2)" stroke-width="5" stroke-linecap="round"/></svg></div>`;
    }
    if (scene === "creative") {
        return `<div class="asset-studio">${Array.from({ length: 9 }, (_, index) => `<i style="--r:${120 + index * 24}deg"></i>`).join("")}<span class="wand">AI Render Queue</span></div>`;
    }
    if (scene === "campaign" || scene === "insight") {
        return `<div class="campaign-lab"><svg viewBox="0 0 280 130"><polyline points="8,94 54,72 98,82 142,42 190,55 244,18" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round"/><polyline points="8,116 54,104 98,86 142,78 190,44 244,36" fill="none" stroke="var(--accent2)" stroke-width="5" stroke-linecap="round"/></svg><div>${chips(spec.signals)}</div></div>`;
    }
    if (scene === "logistics") {
        return `<div class="route-map"><span>센터</span><span>존 A</span><span>존 B</span><span>출고</span><svg viewBox="0 0 280 140"><path d="M34 40 C90 14, 94 106, 145 92 S199 22,238 58 S196 126,142 118" fill="none" stroke="var(--accent)" stroke-width="6" stroke-dasharray="9 8"/></svg></div>`;
    }
    if (scene === "document" || scene === "quote") {
        return `<div class="doc-desk"><div class="paper"><b></b>${Array.from({ length: 8 }, (_, index) => `<i style="width:${92 - index * 7}%"></i>`).join("")}</div><div class="marks">${spec.signals.map((signal) => `<span>${esc(signal)}</span>`).join("")}</div></div>`;
    }
    if (scene === "voice") {
        return `<div class="voice-wave">${Array.from({ length: 34 }, (_, index) => `<i style="height:${16 + Math.abs(Math.sin((index + spec.n) / 2)) * 94}px"></i>`).join("")}<div class="transcript">${rows(spec.signals, spec)}</div></div>`;
    }
    if (scene === "factory" || scene === "vision") {
        return `<div class="vision-grid">${Array.from({ length: 48 }, (_, index) => `<i class="${(index + spec.n) % 11 === 0 ? "bad" : ""}" style="opacity:${0.45 + ((index + spec.n) % 8) / 10}"></i>`).join("")}</div>`;
    }
    if (scene === "sales") {
        return `<div class="pipeline-flow">${["Lead", "Fit", "Quote", "Follow"].map((label, index) => `<span><b>${label}</b><em>${spec.signals[index]}</em></span>`).join("")}</div>`;
    }
    if (scene === "people") {
        return `<div class="people-matrix">${Array.from({ length: 16 }, (_, index) => `<span><b>${index + 1}</b><em>${pick(spec.signals, spec.n, index)}</em></span>`).join("")}</div>`;
    }
    return `<div class="ops-console">${bars(spec, 5)}<div>${rows(spec.actions, spec)}</div></div>`;
}

function layoutCommand(spec, shot) {
    return `<div class="layout command">
        <aside><b>${esc(spec.productName)}</b>${spec.actions.concat(spec.signals.slice(0, 2)).map((item, index) => `<span class="${index === shot ? "on" : ""}">${esc(item)}</span>`).join("")}</aside>
        <main><header><div><small>${esc(spec.company)} / ${esc(spec.caseCode)}</small><h2>${esc(shotTitle(spec, shot))}</h2></div><em>${spec.metric}</em></header><section class="two"><div class="panel">${visual(spec, shot)}</div><div class="panel"><h3>Live Items</h3>${rows(spec.signals, spec)}</div></section>${miniCards(spec)}</main>
    </div>`;
}

function layoutMobile(spec, shot) {
    return `<div class="layout mobile">
        <div class="phone hero-phone"><small>${esc(spec.productName)}</small><h2>${esc(shotTitle(spec, shot))}</h2>${chips(spec.actions)}<strong>${spec.metric}</strong></div>
        <div class="phone feed-phone"><h3>${esc(spec.object)}</h3>${rows(spec.sources, spec)}</div>
        <div class="phone action-phone"><h3>Next Action</h3>${spec.actions.map((action, index) => `<button>${esc(action)}<span>${index + 1}</span></button>`).join("")}</div>
    </div>`;
}

function layoutDocument(spec, shot) {
    return `<div class="layout document">
        <header><small>${esc(spec.user)}</small><h2>${esc(shotTitle(spec, shot))}</h2><span>${esc(spec.productName)}</span></header>
        <section><div class="paper-large"><b>${esc(spec.object)}</b>${Array.from({ length: 10 }, (_, index) => `<i style="width:${94 - index * 5}%"></i>`).join("")}</div><aside>${spec.signals.map((signal, index) => `<div><strong>0${index + 1}</strong><span>${esc(signal)}</span><em>${88 - index * 8}%</em></div>`).join("")}</aside></section>
    </div>`;
}

function layoutMap(spec, shot) {
    return `<div class="layout map">
        <div class="map-canvas">${spec.sources.map((source, index) => `<span style="--x:${12 + ((spec.n * (index + 2)) % 70)}%;--y:${18 + ((spec.n * (index + 5)) % 56)}%">${esc(source)}</span>`).join("")}<svg viewBox="0 0 520 250"><path d="M42 162 C112 34, 190 224, 260 102 S410 42,482 176" fill="none" stroke="var(--accent)" stroke-width="5" stroke-dasharray="10 9"/></svg></div>
        <div class="map-card"><small>${esc(spec.company)}</small><h2>${esc(shotTitle(spec, shot))}</h2>${miniCards(spec, spec.signals)}</div>
    </div>`;
}

function layoutSheet(spec, shot) {
    return `<div class="layout sheet">
        <header><h2>${esc(shotTitle(spec, shot))}</h2><span>${esc(spec.metric)} 자동 처리</span></header>
        <div class="sheet-grid">${["source", "signal", "owner", "decision"].map((head) => `<b>${head}</b>`).join("")}${Array.from({ length: 5 }, (_, row) => spec.sources.map((source, col) => `<span>${esc(col === 0 ? source : col === 1 ? spec.signals[row % spec.signals.length] : col === 2 ? spec.user : spec.actions[row % spec.actions.length])}</span>`).join("")).join("")}</div>
    </div>`;
}

function layoutMedia(spec, shot) {
    return `<div class="layout media">
        <div class="canvas">${visual(spec, shot)}</div>
        <aside><small>${esc(spec.productName)}</small><h2>${esc(shotTitle(spec, shot))}</h2>${spec.sources.map((source, index) => `<label><span>${esc(source)}</span><i style="width:${54 + ((spec.n + index * 9) % 40)}%"></i></label>`).join("")}</aside>
        <footer>${Array.from({ length: 8 }, (_, index) => `<span style="height:${20 + ((spec.n + index * 7) % 46)}px"></span>`).join("")}</footer>
    </div>`;
}

function layoutKanban(spec, shot) {
    return `<div class="layout kanban">
        <header><small>${esc(spec.company)}</small><h2>${esc(shotTitle(spec, shot))}</h2></header>
        <section>${["Auto", "Review", "Approve"].map((lane, index) => `<div><b>${lane}</b>${spec.signals.map((signal, i) => `<p>${esc(i === index ? spec.actions[index] : signal)}<em>${86 - i * 6}%</em></p>`).join("")}</div>`).join("")}</section>
    </div>`;
}

function layoutTimeline(spec, shot) {
    return `<div class="layout timeline">
        <div><small>${esc(spec.productName)}</small><h2>${esc(shotTitle(spec, shot))}</h2><p>${esc(josa(spec.object, "을", "를"))} 시간 순서대로 정렬해 실행 가능한 운영 리듬으로 바꿉니다.</p></div>
        <ol>${spec.actions.concat(spec.signals).slice(0, 6).map((item, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${esc(item)}</span><em>${index % 2 ? "검수" : "자동"}</em></li>`).join("")}</ol>
    </div>`;
}

function layoutChat(spec, shot) {
    return `<div class="layout chat">
        <aside><h2>${esc(spec.productName)}</h2><p>${esc(spec.user)}용 대화형 운영 화면</p>${chips(spec.signals)}</aside>
        <section>${spec.sources.concat(spec.actions).slice(0, 5).map((item, index) => `<p class="${index % 2 ? "agent" : "user"}"><b>${index % 2 ? "Agent" : "Ops"}</b>${esc(item)}</p>`).join("")}</section>
    </div>`;
}

function layoutGraph(spec, shot) {
    return `<div class="layout graph">
        <header><h2>${esc(shotTitle(spec, shot))}</h2><span>${esc(spec.caseCode)}</span></header>
        <section><div class="graph-space">${spec.sources.concat(spec.signals).slice(0, 8).map((item, index) => `<i style="--x:${8 + ((spec.n * (index + 4)) % 76)}%;--y:${12 + ((spec.n * (index + 9)) % 62)}%">${esc(item)}</i>`).join("")}<svg viewBox="0 0 520 220"><path d="M46 172 C114 82, 174 42, 260 116 S408 190,482 54" fill="none" stroke="var(--accent2)" stroke-width="4"/></svg></div><aside>${rows(spec.actions, spec)}</aside></section>
    </div>`;
}

function layoutCalendar(spec, shot) {
    return `<div class="layout calendar">
        <aside><small>${esc(spec.company)}</small><h2>${esc(shotTitle(spec, shot))}</h2>${miniCards(spec, spec.actions)}</aside>
        <section>${Array.from({ length: 28 }, (_, index) => `<span class="${(index + spec.n) % 6 === 0 ? "hot" : ""}">${index + 1}</span>`).join("")}</section>
    </div>`;
}

function layoutScanner(spec, shot) {
    return `<div class="layout scanner">
        <div class="scan-window"><div></div><span></span><b>${esc(spec.object)}</b></div>
        <aside><h2>${esc(shotTitle(spec, shot))}</h2>${spec.signals.map((signal, index) => `<p><strong>${esc(signal)}</strong><em>${91 - index * 7}%</em></p>`).join("")}</aside>
    </div>`;
}

function layoutWarehouse(spec, shot) {
    return `<div class="layout warehouse">
        <header><h2>${esc(shotTitle(spec, shot))}</h2><span>${esc(spec.productName)}</span></header>
        <section><div class="aisles">${Array.from({ length: 36 }, (_, index) => `<i class="${(index + spec.n) % 7 === 0 ? "active" : ""}"></i>`).join("")}</div><aside>${rows(spec.sources, spec)}</aside></section>
    </div>`;
}

function layoutFinance(spec, shot) {
    return `<div class="layout finance">
        <aside><small>${esc(spec.user)}</small><h2>${esc(shotTitle(spec, shot))}</h2><strong>${spec.money}</strong></aside>
        <section>${["금액", "조건", "권한", "증빙", "승인"].map((head, index) => `<div><span>${head}</span><b>${esc(spec.signals[index % spec.signals.length])}</b><em>${72 + ((spec.n + index) % 20)} pts</em></div>`).join("")}</section>
    </div>`;
}

function layoutSearch(spec, shot) {
    return `<div class="layout search">
        <div class="searchbar">${esc(spec.title)}<span>⌘K</span></div>
        <section><aside>${spec.sources.map((source) => `<button>${esc(source)}</button>`).join("")}</aside><main><h2>${esc(shotTitle(spec, shot))}</h2>${spec.signals.map((signal, index) => `<article><b>${esc(signal)}</b><p>${esc(spec.actions[index % spec.actions.length])}</p></article>`).join("")}</main></section>
    </div>`;
}

function layoutExperiment(spec, shot) {
    return `<div class="layout experiment">
        <header><small>${esc(spec.company)}</small><h2>${esc(shotTitle(spec, shot))}</h2></header>
        <section>${["A", "B", "C"].map((variant, index) => `<div><strong>Variant ${variant}</strong><div class="mock">${visual(spec, shot)}</div><em>${78 + ((spec.n + index) % 18)}%</em></div>`).join("")}</section>
    </div>`;
}

function layoutAlert(spec, shot) {
    return `<div class="layout alert">
        <aside><b>${esc(spec.metric)}</b><span>${esc(spec.actions[0])}</span></aside>
        <main><h2>${esc(shotTitle(spec, shot))}</h2>${spec.signals.concat(spec.sources).slice(0, 7).map((item, index) => `<div class="${index < 2 ? "critical" : ""}"><strong>${esc(item)}</strong><span>${index < 2 ? "즉시 확인" : "대기"}</span></div>`).join("")}</main>
    </div>`;
}

function layoutPersona(spec, shot) {
    return `<div class="layout persona">
        <header><h2>${esc(shotTitle(spec, shot))}</h2><span>${esc(spec.productName)}</span></header>
        <section>${spec.signals.map((signal, index) => `<article><div>${String.fromCharCode(65 + index)}</div><b>${esc(signal)}</b><p>${esc(spec.actions[index % spec.actions.length])}</p><em>${82 - index * 6}% fit</em></article>`).join("")}</section>
    </div>`;
}

const layouts = [
    layoutCommand, layoutMobile, layoutDocument, layoutMap, layoutSheet, layoutMedia, layoutKanban, layoutTimeline,
    layoutChat, layoutGraph, layoutCalendar, layoutScanner, layoutWarehouse, layoutFinance, layoutSearch, layoutExperiment,
    layoutAlert, layoutPersona
];

const sceneLayouts = {
    review: [layoutCommand, layoutSheet, layoutAlert, layoutKanban, layoutFinance],
    taxonomy: [layoutSearch, layoutSheet, layoutTimeline, layoutCommand, layoutScanner],
    webinar: [layoutCommand, layoutChat, layoutPersona, layoutKanban, layoutTimeline],
    forecast: [layoutCommand, layoutSheet, layoutGraph, layoutExperiment, layoutFinance],
    inventory: [layoutWarehouse, layoutSheet, layoutGraph, layoutKanban, layoutFinance],
    creative: [layoutMedia, layoutExperiment, layoutGraph, layoutKanban, layoutCommand],
    campaign: [layoutExperiment, layoutSheet, layoutGraph, layoutKanban, layoutFinance],
    insight: [layoutSearch, layoutGraph, layoutCalendar, layoutPersona, layoutTimeline],
    logistics: [layoutMap, layoutWarehouse, layoutGraph, layoutKanban, layoutFinance],
    document: [layoutDocument, layoutSheet, layoutScanner, layoutKanban, layoutFinance],
    quote: [layoutFinance, layoutDocument, layoutSheet, layoutKanban, layoutGraph],
    voice: [layoutChat, layoutSheet, layoutGraph, layoutKanban, layoutFinance],
    factory: [layoutWarehouse, layoutSheet, layoutAlert, layoutKanban, layoutGraph],
    vision: [layoutScanner, layoutMedia, layoutAlert, layoutKanban, layoutGraph],
    sales: [layoutCommand, layoutChat, layoutGraph, layoutKanban, layoutTimeline],
    people: [layoutPersona, layoutSheet, layoutCalendar, layoutKanban, layoutAlert],
    ops: [layoutCommand, layoutSheet, layoutGraph, layoutKanban, layoutFinance]
};

function shotTitle(spec, shotIndex) {
    const titles = [
        `${spec.title} 제품 홈`,
        `${spec.object} 데이터 연결`,
        `${spec.title} 판단 수식`,
        `${spec.actions[shotIndex % spec.actions.length]} 운영 화면`,
        `${spec.title} ROI 리포트`
    ];
    return titles[shotIndex] || spec.title;
}

function renderShot(spec, shot, shotIndex) {
    const layoutSet = sceneLayouts[spec.scene] || layouts;
    const layout = layoutSet[shotIndex % layoutSet.length];
    const isThumb = shot.key === "thumb";
    return `<section class="shot ${shot.key}" data-shot="${shot.key}" aria-label="${esc(shot.label)}">
        <div class="shot-top">
            <span>${esc(spec.company)}</span>
            <b>${esc(spec.productName)}</b>
            <em>${esc(shot.label)}</em>
        </div>
        ${layout(spec, shotIndex)}
        ${isThumb ? `<div class="claim">${esc(josa(spec.user, "이", "가"))} ${esc(josa(spec.object, "을", "를"))} 직접 처리하는 실제 제품 프론트처럼 설계했습니다.</div>` : ""}
    </section>`;
}

function pageStyle(spec, palette) {
    const [bg, card, ink, accent, accent2] = palette;
    const radius = 12 + (spec.n % 11);
    return `<style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#fff;color:${ink};font-family:Inter,"Wanted Sans Variable","Wanted Sans",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:0}a{color:inherit;text-decoration:none}button{font:inherit}
:root{--bg:${bg};--card:${card};--ink:${ink};--accent:${accent};--accent2:${accent2};--muted:#6c7480;--line:#e4e8f0;--radius:${radius}px}
.product-page{width:min(1120px,100%);margin:0 auto;padding:32px 20px 80px}.page-nav{height:54px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);margin-bottom:34px}.page-nav b{font-size:18px;letter-spacing:-.02em}.page-nav span{font-size:13px;color:var(--muted);font-weight:800}.page-intro{display:grid;grid-template-columns:1fr 280px;gap:24px;margin-bottom:28px}.page-intro h1{margin:0;font-size:48px;line-height:1.08;letter-spacing:-.04em}.page-intro p{margin:14px 0 0;color:var(--muted);font-size:17px;line-height:1.75;word-break:keep-all}.page-intro aside{border:1px solid var(--line);border-radius:16px;background:var(--bg);padding:18px}.page-intro aside span{display:block;color:var(--muted);font-size:12px}.page-intro aside b{display:block;margin-top:5px;font-size:22px}.shot-list{display:grid;gap:22px}.shot{position:relative;width:599px;height:360px;overflow:hidden;border:1px solid var(--line);border-radius:22px;background:radial-gradient(circle at 14% 8%,rgba(255,255,255,.95),transparent 34%),linear-gradient(135deg,var(--bg),#fff);box-shadow:0 24px 70px rgba(55,67,96,.14);padding:14px;margin-inline:auto;color:var(--ink)}.shot.thumb{height:337px}.shot::after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(80,96,130,.075) 1px,transparent 1px),linear-gradient(90deg,rgba(80,96,130,.075) 1px,transparent 1px);background-size:${26 + (spec.n % 8)}px ${26 + (spec.n % 8)}px;mask-image:linear-gradient(135deg,#000 0%,transparent 72%);pointer-events:none}.shot>*{position:relative;z-index:1}.shot-top{height:26px;display:flex;align-items:center;gap:8px;color:var(--muted);font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.shot-top b{margin-right:auto;color:var(--ink);font-size:11px;letter-spacing:-.02em;text-transform:none}.shot-top em{font-style:normal;color:var(--accent)}
.layout{height:calc(100% - 26px)}.layout h2{margin:0;color:var(--ink);font-size:20px;line-height:1.16;letter-spacing:-.035em;word-break:keep-all}.layout h3{margin:0 0 8px;font-size:11px}.layout small{display:block;color:var(--accent);font-size:9px;font-weight:950;text-transform:uppercase;letter-spacing:.06em}.layout p{margin:0;color:var(--muted);font-size:10px;line-height:1.45;word-break:keep-all}.panel,.layout aside,.phone,.paper-large,.map-card,.sheet-grid,.canvas,.lane,.graph-space,.scan-window,.finance section div,.searchbar,.search article,.persona article{border:1px solid var(--line);background:rgba(255,255,255,.82);box-shadow:0 10px 32px rgba(54,68,98,.07);border-radius:var(--radius)}
.two{display:grid;grid-template-columns:1.15fr .85fr;gap:10px;margin-top:10px}.panel{padding:10px;min-height:132px}.row{display:grid;grid-template-columns:1fr auto;gap:8px;border-bottom:1px solid #edf0f5;padding:7px 0;color:var(--muted);font-size:9px}.row:last-child{border-bottom:0}.row strong{color:var(--accent);font-size:9px}.chip{display:inline-flex;align-items:center;min-height:22px;border-radius:999px;background:color-mix(in srgb,var(--accent) 10%,#fff);color:var(--accent);padding:0 8px;font-size:8px;font-weight:950}.mini-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:9px}.mini-cards div{min-height:52px;border:1px solid var(--line);border-radius:12px;background:#fff;padding:8px}.mini-cards small{color:var(--muted);font-size:8px}.mini-cards b{display:block;margin-top:4px;font-size:10px;line-height:1.25}
.command{display:grid;grid-template-columns:126px 1fr;gap:12px}.command aside{padding:13px;background:rgba(255,255,255,.62)}.command aside b{display:block;font-size:13px;line-height:1.1;margin-bottom:12px}.command aside span{display:flex;align-items:center;min-height:25px;border-radius:8px;padding:0 8px;color:var(--muted);font-size:8px;font-weight:900}.command aside span.on{background:var(--bg);color:var(--accent)}.command header{display:flex;justify-content:space-between;gap:10px;align-items:start}.command header em{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:var(--ink);color:#fff;font-size:14px;font-style:normal;font-weight:950}
.mobile{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;align-items:center}.phone{height:244px;padding:14px;background:#fff}.phone h2{font-size:18px}.hero-phone{background:linear-gradient(180deg,var(--ink),#3f4656);color:#fff}.hero-phone h2,.hero-phone small{color:#fff}.hero-phone strong{display:block;margin-top:20px;font-size:34px}.feed-phone .row{grid-template-columns:1fr auto}.action-phone button{width:100%;min-height:36px;margin-top:9px;border:0;border-radius:10px;background:var(--bg);color:var(--ink);font-size:10px;font-weight:900;text-align:left;padding:0 10px}.action-phone button span{float:right;color:var(--accent)}
.document header,.warehouse header,.experiment header,.persona header{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:10px}.document section{display:grid;grid-template-columns:1.15fr .85fr;gap:12px}.paper-large{height:220px;padding:16px}.paper-large b{display:block;margin-bottom:14px}.paper-large i{display:block;height:8px;border-radius:99px;background:#dfe5ef;margin-bottom:9px}.document aside{display:grid;gap:7px;border:0;box-shadow:none;background:transparent}.document aside div{border:1px solid var(--line);border-radius:12px;background:#fff;padding:9px}.document aside strong{color:var(--accent);font-size:9px}.document aside span{display:block;margin-top:4px;font-size:10px;font-weight:900}.document aside em{display:block;margin-top:4px;color:var(--muted);font-size:9px;font-style:normal}
.map{display:grid;grid-template-columns:1fr 190px;gap:12px}.map-canvas{position:relative;border:1px dashed color-mix(in srgb,var(--accent) 55%,#fff);border-radius:18px;background:rgba(255,255,255,.55)}.map-canvas span{position:absolute;left:var(--x);top:var(--y);display:grid;place-items:center;min-width:56px;height:28px;border-radius:999px;background:#fff;color:var(--accent);box-shadow:0 8px 24px rgba(63,78,112,.12);font-size:8px;font-weight:950}.map-canvas svg{position:absolute;inset:34px;width:450px;height:220px}.map-card{padding:14px}.map-card h2{font-size:19px}
.sheet header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.sheet header span{background:var(--ink);color:#fff;border-radius:999px;padding:7px 10px;font-size:9px;font-weight:900}.sheet-grid{display:grid;grid-template-columns:1.05fr 1.15fr .9fr 1fr;overflow:hidden}.sheet-grid b,.sheet-grid span{min-height:32px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:8px;font-size:9px}.sheet-grid b{background:var(--bg);color:var(--accent);text-transform:uppercase}.sheet-grid span{color:var(--muted)}
.media{display:grid;grid-template-columns:1fr 178px;grid-template-rows:1fr 58px;gap:10px}.media .canvas{padding:10px;overflow:hidden}.media aside{padding:12px}.media aside h2{font-size:18px}.media label{display:block;margin-top:11px;color:var(--muted);font-size:9px;font-weight:900}.media label i{display:block;height:7px;border-radius:99px;background:var(--accent);margin-top:5px}.media footer{grid-column:1/3;display:flex;align-items:end;gap:7px;border-radius:14px;background:#fff;border:1px solid var(--line);padding:8px}.media footer span{flex:1;border-radius:8px 8px 3px 3px;background:linear-gradient(180deg,var(--accent2),var(--accent))}
.kanban header{display:flex;justify-content:space-between;margin-bottom:10px}.kanban section{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.kanban section div{min-height:218px;border:1px solid var(--line);border-radius:15px;background:rgba(255,255,255,.74);padding:10px}.kanban b{font-size:11px;color:var(--accent)}.kanban p{position:relative;margin-top:8px;border-radius:10px;background:#fff;border:1px solid #edf0f5;padding:8px;min-height:43px}.kanban em{position:absolute;right:8px;bottom:7px;color:var(--accent2);font-size:8px;font-style:normal;font-weight:950}
.timeline{display:grid;grid-template-columns:190px 1fr;gap:16px;align-items:center}.timeline h2{font-size:22px}.timeline ol{position:relative;list-style:none;margin:0;padding:0;display:grid;gap:8px}.timeline li{display:grid;grid-template-columns:35px 1fr 38px;gap:7px;align-items:center;border:1px solid var(--line);border-radius:999px;background:#fff;padding:6px 8px}.timeline li b{color:var(--accent);font-size:10px}.timeline li span{font-size:10px;font-weight:900}.timeline li em{font-size:8px;color:var(--muted);font-style:normal;text-align:right}
.chat{display:grid;grid-template-columns:188px 1fr;gap:12px}.chat aside{padding:14px}.chat section{display:grid;gap:7px;align-content:start}.chat p{max-width:254px;border:1px solid var(--line);border-radius:14px;background:#fff;padding:8px}.chat p.agent{justify-self:end;background:var(--ink);color:#fff}.chat p b{display:block;color:var(--accent);font-size:8px;margin-bottom:3px}.chat p.agent b{color:var(--accent2)}
.graph header{display:flex;justify-content:space-between;margin-bottom:10px}.graph section{display:grid;grid-template-columns:1fr 158px;gap:10px}.graph-space{position:relative;height:218px;background:rgba(255,255,255,.62)}.graph-space i{position:absolute;left:var(--x);top:var(--y);border-radius:999px;background:#fff;border:1px solid var(--line);padding:6px 8px;color:var(--ink);font-size:8px;font-style:normal;font-weight:900}.graph-space svg{position:absolute;inset:12px;width:480px;height:198px}.graph aside{padding:10px}
.calendar{display:grid;grid-template-columns:190px 1fr;gap:12px}.calendar aside{padding:13px}.calendar section{display:grid;grid-template-columns:repeat(7,1fr);gap:7px}.calendar section span{display:grid;place-items:center;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--muted);font-size:10px;font-weight:900}.calendar section span.hot{background:var(--ink);color:#fff;border-color:var(--ink)}
.scanner{display:grid;grid-template-columns:1fr 190px;gap:12px}.scan-window{position:relative;overflow:hidden;background:#10131a}.scan-window div{position:absolute;inset:20px;border:1px solid rgba(255,255,255,.2);border-radius:16px;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent)}.scan-window span{position:absolute;left:0;right:0;top:48%;height:3px;background:var(--accent2);box-shadow:0 0 18px var(--accent2)}.scan-window b{position:absolute;left:20px;bottom:20px;color:#fff}.scanner aside{padding:13px}.scanner aside p{display:grid;grid-template-columns:1fr auto;gap:8px;border-bottom:1px solid var(--line);padding:9px 0}.scanner aside em{color:var(--accent);font-style:normal;font-weight:950}
.warehouse header span,.persona header span{font-size:10px;color:var(--accent);font-weight:950}.warehouse section{display:grid;grid-template-columns:1fr 172px;gap:12px}.aisles{display:grid;grid-template-columns:repeat(9,1fr);gap:7px;border:1px solid var(--line);border-radius:16px;background:#fff;padding:12px}.aisles i{border-radius:7px;background:#e8edf5}.aisles i.active{background:var(--accent)}.warehouse aside{padding:10px}
.finance{display:grid;grid-template-columns:168px 1fr;gap:12px}.finance aside{display:flex;flex-direction:column;justify-content:space-between;padding:14px;background:var(--ink);color:#fff}.finance aside h2{color:#fff}.finance aside strong{font-size:38px}.finance section{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.finance section div{padding:11px}.finance section span{font-size:9px;color:var(--muted);font-weight:900}.finance section b{display:block;margin-top:7px;font-size:12px}.finance section em{display:block;margin-top:9px;color:var(--accent);font-style:normal;font-size:10px;font-weight:950}
.search{display:grid;grid-template-rows:42px 1fr;gap:12px}.searchbar{display:flex;align-items:center;justify-content:space-between;padding:0 16px;color:var(--muted);font-size:13px;font-weight:900}.searchbar span{border-radius:7px;background:var(--bg);color:var(--accent);padding:5px 7px;font-size:9px}.search section{display:grid;grid-template-columns:150px 1fr;gap:12px}.search aside{display:grid;gap:8px;border:0;background:transparent;box-shadow:none}.search button{border:1px solid var(--line);border-radius:10px;background:#fff;min-height:34px;text-align:left;padding:0 10px;color:var(--muted);font-size:9px;font-weight:900}.search main{display:grid;gap:8px}.search article{padding:10px}.search article b{font-size:11px}.search article p{margin-top:4px}
.experiment header{align-items:center}.experiment section{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.experiment section>div{border:1px solid var(--line);border-radius:15px;background:#fff;padding:9px}.experiment strong{font-size:11px}.experiment .mock{height:134px;overflow:hidden;transform:scale(.7);transform-origin:top left;width:142%;margin-top:8px}.experiment em{display:block;margin-top:6px;color:var(--accent);font-style:normal;font-weight:950}
.alert{display:grid;grid-template-columns:160px 1fr;gap:12px}.alert aside{display:grid;place-items:center;text-align:center;background:linear-gradient(180deg,var(--accent),var(--accent2));color:#fff}.alert aside b{font-size:42px}.alert aside span{font-size:10px;font-weight:900}.alert main{display:grid;gap:8px}.alert main h2{margin-bottom:4px}.alert main div{display:grid;grid-template-columns:1fr 58px;gap:8px;border:1px solid var(--line);border-radius:11px;background:#fff;padding:8px}.alert main div.critical{border-color:color-mix(in srgb,var(--accent2) 45%,#fff);background:color-mix(in srgb,var(--accent2) 10%,#fff)}.alert main strong{font-size:10px}.alert main span{font-size:8px;color:var(--muted);font-weight:950;text-align:right}
.persona section{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.persona article{padding:10px;min-height:204px}.persona article div{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:var(--bg);color:var(--accent);font-weight:950}.persona article b{display:block;margin-top:13px;font-size:12px}.persona article em{display:block;margin-top:12px;color:var(--accent2);font-style:normal;font-weight:950;font-size:10px}
.review-lab,.forecast-chart,.asset-studio,.campaign-lab,.route-map,.doc-desk,.voice-wave,.vision-grid,.pipeline-flow,.people-matrix,.ops-console,.name-parser,.webinar-board{height:132px;overflow:hidden}.bubble{display:inline-grid;place-items:center;width:58px;height:58px;margin:4px;border-radius:50%;background:var(--bg);color:var(--accent);font-size:10px;font-weight:950}.bubble.hot{width:76px;height:76px;background:var(--accent);color:#fff}.bubble.warn{background:var(--accent2);color:#fff}.review-feed{margin-top:5px}.name-parser p{margin:0;color:var(--muted);font-size:8px}.name-parser strong{display:block;border:1px solid var(--line);border-radius:9px;background:#fff;padding:8px;margin:4px 0;font-size:10px}.name-parser .ok{color:var(--accent)}.token-line{display:flex;gap:5px;flex-wrap:wrap}.webinar-board{display:grid;grid-template-columns:90px 1fr;gap:8px}.stage{display:grid;place-items:center;border-radius:16px;background:var(--ink);color:#fff;font-weight:950}.questions{display:grid;gap:6px}.questions span{display:grid;grid-template-columns:1fr auto;align-items:center;border:1px solid var(--line);border-radius:10px;background:#fff;padding:7px;font-size:9px}.questions b{color:var(--accent)}.forecast-chart{position:relative;display:flex;align-items:end;gap:8px;padding:8px;background:linear-gradient(#edf1f8 1px,transparent 1px);background-size:100% 28px}.forecast-chart i{flex:1;border-radius:9px 9px 3px 3px;background:linear-gradient(180deg,var(--accent),#dce7ff)}.forecast-chart svg{position:absolute;left:8px;right:8px;bottom:20px;width:244px}.asset-studio{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.asset-studio i{border-radius:12px;border:1px solid var(--line);background:linear-gradient(var(--r),#fff,var(--bg),#fff3e8)}.asset-studio .wand{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:999px;background:var(--ink);color:#fff;padding:8px 11px;font-size:9px;font-weight:950}.campaign-lab svg{width:100%;height:95px}.campaign-lab div{display:flex;gap:5px;flex-wrap:wrap}.route-map{position:relative;border-radius:14px;background:#f6f9ff}.route-map span{position:absolute;z-index:1;display:grid;place-items:center;min-width:48px;height:28px;border-radius:999px;background:#fff;box-shadow:0 8px 18px rgba(63,78,112,.12);font-size:8px;font-weight:950;color:var(--accent)}.route-map span:nth-child(1){left:14px;top:17px}.route-map span:nth-child(2){left:92px;top:76px}.route-map span:nth-child(3){right:16px;top:26px}.route-map span:nth-child(4){right:78px;bottom:16px}.route-map svg{position:absolute;inset:4px;width:252px}.doc-desk{display:grid;grid-template-columns:1fr 102px;gap:8px}.paper{border:1px solid var(--line);border-radius:12px;background:#fff;padding:12px}.paper b,.paper i{display:block;height:8px;border-radius:99px;background:#dfe5ef;margin-bottom:8px}.paper b{width:72%;background:var(--ink)}.marks{display:grid;gap:5px}.marks span{border:1px solid var(--line);border-radius:9px;background:var(--bg);padding:7px;color:var(--accent);font-size:8px;font-weight:950}.voice-wave{position:relative;display:flex;align-items:center;gap:3px}.voice-wave i{flex:1;border-radius:999px;background:var(--accent)}.transcript{position:absolute;right:0;bottom:0;width:150px;border-radius:12px;background:rgba(255,255,255,.9);border:1px solid var(--line);padding:7px}.vision-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:5px}.vision-grid i{border-radius:5px;background:#dce7ff}.vision-grid i.bad{background:var(--accent2);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent2) 24%,#fff)}.pipeline-flow{display:flex;align-items:center;justify-content:space-between}.pipeline-flow span{width:60px;min-height:66px;display:grid;place-items:center;text-align:center;border:1px solid var(--line);border-radius:14px;background:#fff;padding:7px}.pipeline-flow b{font-size:10px}.pipeline-flow em{font-style:normal;color:var(--muted);font-size:8px}.people-matrix{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.people-matrix span{border:1px solid var(--line);border-radius:10px;background:#fff;padding:7px}.people-matrix b{color:var(--accent)}.people-matrix em{display:block;font-style:normal;color:var(--muted);font-size:8px}.ops-console{display:grid;grid-template-columns:1fr 1.2fr;gap:10px;align-items:end}.ops-console>i{border-radius:9px 9px 3px 3px;background:var(--accent)}
.claim{position:absolute;left:22px;right:22px;bottom:16px;min-height:34px;display:flex;align-items:center;border-radius:999px;background:rgba(255,255,255,.78);border:1px solid var(--line);padding:0 14px;color:var(--muted);font-size:10px;font-weight:900;backdrop-filter:blur(12px)}
html[data-capture] body{width:599px;overflow:hidden;background:var(--bg)}html[data-capture="thumb"] body{height:337px}html[data-capture="data"] body,html[data-capture="logic"] body,html[data-capture="queue"] body,html[data-capture="roi"] body{height:360px}html[data-capture] .product-page{width:599px;padding:0;margin:0}html[data-capture] .page-nav,html[data-capture] .page-intro{display:none}html[data-capture] .shot{margin:0;border-radius:0;border:0;box-shadow:none}html[data-capture="thumb"] .shot:not([data-shot="thumb"]),html[data-capture="data"] .shot:not([data-shot="data"]),html[data-capture="logic"] .shot:not([data-shot="logic"]),html[data-capture="queue"] .shot:not([data-shot="queue"]),html[data-capture="roi"] .shot:not([data-shot="roi"]){display:none}
@media (max-width:760px){.page-intro{grid-template-columns:1fr}.page-intro h1{font-size:38px}.shot{width:100%;height:auto;min-height:360px}.shot.thumb{height:auto;min-height:337px}}
</style>`;
}

function productPage(item) {
    const spec = classify(item);
    const palette = palettes[spec.n % palettes.length];
    return `<!DOCTYPE html>
<html lang="ko" data-capture="">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(spec.productName)} | ${esc(spec.title)}</title>
<script>document.documentElement.dataset.capture = new URLSearchParams(location.search).get("capture") || "";</script>
${pageStyle(spec, palette)}
</head>
<body>
<main class="product-page case-${String(spec.n).padStart(3, "0")}">
    <nav class="page-nav"><b>${esc(spec.productName)}</b><span>${esc(spec.company)} product prototype · ${esc(spec.caseCode)}</span></nav>
    <section class="page-intro">
        <div>
            <h1>${esc(spec.title)}를 위한 독립 AX 제품 화면</h1>
            <p>${esc(josa(spec.user, "이", "가"))} ${esc(josa(spec.object, "을", "를"))} 실제로 운영한다는 전제로 만든 전용 웹/앱 프로토타입입니다. 아티클 이미지는 이 페이지의 메인, 데이터, 로직, 운영, 성과 화면을 각각 브라우저에서 캡처해 사용합니다.</p>
        </div>
        <aside>
            <span>Primary utility</span>
            <b>${esc(spec.metric)} 자동 처리</b>
            <span style="margin-top:14px">Core actions</span>
            <b>${esc(spec.actions.join(" · "))}</b>
        </aside>
    </section>
    <div class="shot-list">
        ${shots.map((shot, index) => renderShot(spec, shot, index)).join("\n")}
    </div>
</main>
</body>
</html>`;
}

function redirectPage(id, variant) {
    return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><script>location.replace("../products/${id}.html?capture=${variant}")</script></head><body></body></html>`;
}

async function main() {
    await rm(productDir, { recursive: true, force: true });
    await rm(legacyDir, { recursive: true, force: true });
    await mkdir(productDir, { recursive: true });
    await mkdir(legacyDir, { recursive: true });

    for (const item of manifest) {
        await writeFile(path.join(productDir, `${item.id}.html`), productPage(item), "utf8");
        for (const shot of shots) {
            await writeFile(path.join(legacyDir, `${item.id}-${shot.key}.html`), redirectPage(item.id, shot.key), "utf8");
        }
    }

    await writeFile(
        path.join(root, "case-assets/capture-board.html"),
        `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><script>const p=new URLSearchParams(location.search);const id=p.get("case")||"case-001";const variant=p.get("variant")||"thumb";location.replace("products/"+id+".html?capture="+variant);</script></head><body></body></html>`,
        "utf8"
    );
    console.log(`Generated ${manifest.length} standalone product pages and ${manifest.length * shots.length} capture redirects.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
