import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "case-assets/bruteforce-ui");
const manifest = JSON.parse(await readFile(path.join(root, "case-assets/case-manifest.json"), "utf8"));

await mkdir(outDir, { recursive: true });

const companies = [
    "MUSE CONTENT", "Northstar Retail", "Cobalt Market", "Velo Foods", "Anvil Commerce", "Mosaic Beauty",
    "Signal Works", "Prism Edu", "Atlas Factory", "Orbit Finance", "Careline Health", "Verse Logistics",
    "Ledger Legal", "Merit CRM", "Studio Kind", "Nova CX", "Pioneer Ops", "Twelve Labs", "Lattice Retail"
];

const palettes = [
    ["#f7fbff", "#101828", "#2563eb", "#9bd4ff", "#ffffff", "#dbeafe"],
    ["#fff7ed", "#1f2937", "#f97316", "#ffd3b6", "#ffffff", "#ffedd5"],
    ["#f5f3ff", "#211a36", "#7c3aed", "#d8b4fe", "#ffffff", "#ede9fe"],
    ["#effaf5", "#10251d", "#10b981", "#b7f3d4", "#ffffff", "#dcfce7"],
    ["#fff1f4", "#2a1721", "#e11d48", "#ffc4d1", "#ffffff", "#ffe4e6"],
    ["#f8fafc", "#0f172a", "#0ea5e9", "#bae6fd", "#ffffff", "#e0f2fe"],
    ["#f4f6ff", "#1f2333", "#4f46e5", "#c7d2fe", "#ffffff", "#eef2ff"],
    ["#fdfdf8", "#24231f", "#84cc16", "#d9f99d", "#ffffff", "#f7fee7"],
    ["#f7f2ea", "#261b14", "#b45309", "#fed7aa", "#ffffff", "#ffedd5"],
    ["#eef7f8", "#132f33", "#0891b2", "#a5f3fc", "#ffffff", "#cffafe"]
];

function esc(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function pad2(number) {
    return String(number).padStart(2, "0");
}

function pad3(number) {
    return String(number).padStart(3, "0");
}

function pick(list, seed, offset = 0) {
    return list[(seed + offset) % list.length];
}

function words(title) {
    return title.replace(/[()·]/g, " ").split(/\s+/).filter(Boolean);
}

function seeded(seed) {
    let value = seed * 9301 + 49297;
    return () => {
        value = (value * 233280 + 12345) % 2147483647;
        return value / 2147483647;
    };
}

function profile(item, number) {
    const title = item.title;
    const base = {
        company: pick(companies, number),
        app: `${words(title).slice(0, 2).join(" ")} Ops`,
        domain: number <= 30 ? "commerce" : number <= 60 ? "brand" : "operations",
        owner: number <= 30 ? "커머스 운영팀" : number <= 60 ? "브랜드 운영팀" : "AX 운영팀",
        sources: ["원천 데이터", "운영 로그", "검수 이력", "자동화 큐"],
        signals: ["우선순위", "이상치", "처리 확률", "검수 필요"],
        actions: ["자동 처리", "담당자 배정", "승인 요청", "리포트 발행"],
        objects: ["요청", "항목", "담당자", "예외"],
        visual: "control-room",
        metric: "처리 SLA 개선"
    };

    const rules = [
        [/누끼|배경|이미지|상세페이지|소재|프레임|영상|숏폼|자막|저작권|세이프티/, {
            app: "Creative Asset Forge",
            owner: "콘텐츠 제작팀",
            sources: ["원본 에셋", "브랜드 가이드", "채널 규격", "권리 DB"],
            signals: ["마스킹 경계", "프레임 변화", "톤 불일치", "권리 위험"],
            actions: ["자동 생성", "검수 요청", "버전 비교", "배포"],
            objects: ["에셋", "레이어", "프레임", "채널"],
            visual: "asset-lab",
            metric: "제작 시간 단축"
        }],
        [/상품평|리뷰|부정|불량|반품|CS/, {
            app: "Review Defect Sentinel",
            owner: "품질/MD 운영팀",
            sources: ["상품평 원문", "반품 사유", "SKU 로트", "사진 증거"],
            signals: ["부정 키워드", "동일 로트 반복", "불량 확률", "회수 우선순위"],
            actions: ["불량 티켓", "로트 잠금", "상품 경고", "MD 알림"],
            objects: ["리뷰", "키워드", "SKU", "로트"],
            visual: "defect-radar",
            metric: "반품률 개선"
        }],
        [/재고|발주|품절|입출고|창고|피킹|납기|배차|배송|운송/, {
            app: "Inventory Motion Planner",
            owner: "SCM 운영팀",
            sources: ["주문 로그", "센터 재고", "배송 SLA", "프로모션"],
            signals: ["품절 예상시점", "과재고 지수", "센터 이동량", "대체 SKU"],
            actions: ["발주량 추천", "노출 변경", "배차 추천", "지연 알림"],
            objects: ["SKU", "센터", "노선", "발주"],
            visual: "supply-map",
            metric: "재고 비용 개선"
        }],
        [/가격|쿠폰|입찰|광고비|CTR|ROAS|배너|캠페인|푸시|리타게팅|검색광고/, {
            app: "Performance Control Tower",
            owner: "퍼포먼스팀",
            sources: ["광고 API", "전환 이벤트", "소재 버전", "예산 캡"],
            signals: ["CTR 예측", "CPC 변동", "피로도", "증분 ROAS"],
            actions: ["입찰 조정", "소재 교체", "예산 이동", "오디언스 제외"],
            objects: ["키워드", "소재", "세그먼트", "예산"],
            visual: "trading-floor",
            metric: "ROAS 개선"
        }],
        [/검색어|키워드|SEO|FAQ|브랜드 메시지|여정|커뮤니티|PR|뉴스레터|블로그|페르소나|콘텐츠 캘린더/, {
            app: "Insight Cluster Studio",
            owner: "콘텐츠 전략팀",
            sources: ["검색어", "커뮤니티 언급", "유입 로그", "CRM 이벤트"],
            signals: ["토픽 군집", "톤 불일치", "리스크 신호", "전환 힌트"],
            actions: ["초안 생성", "캘린더 배치", "리스크 플래그", "인사이트 발행"],
            objects: ["토픽", "페르소나", "콘텐츠", "채널"],
            visual: "constellation",
            metric: "콘텐츠 속도 개선"
        }],
        [/계약서|법무|조항|문서|증빙|세금계산서|회계|정산|보험|대출|견적서/, {
            app: "Document Risk Workbench",
            owner: "법무/재무팀",
            sources: ["PDF 원본", "거래처 원장", "승인 이력", "표준 조항집"],
            signals: ["핵심 조항", "금액 불일치", "권한 예외", "검토 위험도"],
            actions: ["조항 추출", "검토자 지정", "반려 사유", "승인 큐"],
            objects: ["문서", "조항", "금액", "거래처"],
            visual: "document-desk",
            metric: "검토 시간 단축"
        }],
        [/상담|콜센터|음성|STT|QA|지식베이스|헬프데스크|라이브|질문|웨비나|VoC/, {
            app: "Conversation Intelligence Desk",
            owner: "CX 운영팀",
            sources: ["상담 녹취", "CRM 프로필", "문의 이력", "지식베이스"],
            signals: ["의도 분류", "감정 변화", "재문의 확률", "품질 점수"],
            actions: ["상담 요약", "답변 추천", "QA 샘플링", "후속 티켓"],
            objects: ["콜", "고객", "의도", "티켓"],
            visual: "voice-room",
            metric: "CX 점수 개선"
        }],
        [/생산|설비|안전|작업지시|품질|유지보수|에너지|협력사|원자재|공정|픽셀/, {
            app: "Factory Signal Monitor",
            owner: "공장 운영팀",
            sources: ["MES 로그", "센서 스트림", "검사 이미지", "작업지시서"],
            signals: ["설비 편차", "불량 픽셀", "라인 병목", "정비 우선순위"],
            actions: ["작업지시", "정비 티켓", "라인 알림", "품질 리포트"],
            objects: ["라인", "설비", "LOT", "검사"],
            visual: "factory-floor",
            metric: "불량률 관리"
        }],
        [/채용|근태|교육|수강|회원탈퇴|구독|결제|프로젝트|권한|리텐션|회원/, {
            app: "People Ops Prediction Desk",
            owner: "조직/구독 운영팀",
            sources: ["사용자 프로필", "활동 로그", "결제 이력", "권한 변경"],
            signals: ["이탈 위험", "권한 이상", "응답 지연", "리텐션 점수"],
            actions: ["알림 발송", "담당 배정", "권한 조정", "복구 캠페인"],
            objects: ["사용자", "권한", "결제", "프로젝트"],
            visual: "people-ops",
            metric: "처리 SLA 개선"
        }]
    ];

    const found = rules.find(([regex]) => regex.test(title));
    return { ...base, ...(found ? found[1] : {}) };
}

function shell(item, number, body, css, js = "") {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>case-ui-${pad2(number)} | ${esc(item.title)}</title>
<style>
*{box-sizing:border-box}
html,body{margin:0;width:100%;height:100%;overflow:hidden}
body{font-family:Inter,"Wanted Sans Variable","Pretendard",system-ui,sans-serif}
${css}
</style>
</head>
<body>
${body}
<script>
${js}
</script>
</body>
</html>`;
}

function meterBlock(scope, data, number, count = 4) {
    return Array.from({ length: count }, (_, index) => {
        const label = pick([...data.signals, ...data.sources, ...data.actions], number, index);
        const value = 60 + ((number * 5 + index * 9) % 37);
        return `<article class="${scope}-meter"><span>${esc(label)}</span><b data-live>${value}%</b><i style="--w:${value}%"></i></article>`;
    }).join("");
}

function liveScript(scope, number) {
    return `
const ${scope}Live=[...document.querySelectorAll("[data-live]")];
let ${scope}Frame=0;
setInterval(()=>{${scope}Frame++;${scope}Live.forEach((el,i)=>{el.textContent=(58+((${scope}Frame*3+i*7+${number})%39))+"%";});},1200);
`;
}

function visualMarkup(kind, scope, data, number) {
    if (kind === "asset-lab") {
        return `<div class="${scope}-asset">
            ${Array.from({ length: 18 }, (_, i) => `<i class="${i % 5 === number % 5 ? "sel" : ""}" style="--x:${(i * 37 + number * 11) % 88}%;--y:${(i * 53 + number * 7) % 78}%"></i>`).join("")}
            <b>${esc(pick(data.actions, number, 0))}</b>
        </div>`;
    }
    if (kind === "defect-radar") {
        return `<svg class="${scope}-radar" viewBox="0 0 900 520">
            ${[120, 200, 280].map((r) => `<circle cx="450" cy="260" r="${r}"/>`).join("")}
            ${Array.from({ length: 16 }, (_, i) => `<g transform="translate(${130 + (i * 173 + number * 19) % 640},${80 + (i * 97 + number * 13) % 360})"><rect x="-44" y="-24" width="88" height="48" rx="14"/><text>${esc(pick(data.objects, i))}</text></g>`).join("")}
        </svg>`;
    }
    if (kind === "supply-map") {
        return `<svg class="${scope}-supply" viewBox="0 0 940 540">
            <path d="M80 390 C190 90 350 470 480 210 S760 120 850 395" />
            ${Array.from({ length: 8 }, (_, i) => `<g transform="translate(${90 + (i * 109 + number * 17) % 760},${95 + (i * 137 + number * 11) % 350})"><circle r="${20 + (i % 3) * 8}"/><text>${esc(pick(data.objects, i))}</text></g>`).join("")}
        </svg>`;
    }
    if (kind === "trading-floor") {
        return `<div class="${scope}-trading">
            ${Array.from({ length: 28 }, (_, i) => `<article><small>${pick(data.objects, i)}-${pad2(i + 1)}</small><b data-live>${62 + ((i * 7 + number) % 35)}%</b><i style="height:${34 + ((i * number) % 118)}px"></i></article>`).join("")}
        </div>`;
    }
    if (kind === "constellation") {
        return `<svg class="${scope}-stars" viewBox="0 0 960 540">
            ${Array.from({ length: 22 }, (_, i) => `<line x1="${60 + (i * 43) % 840}" y1="${60 + (i * 97) % 420}" x2="${90 + (i * 137) % 800}" y2="${80 + (i * 73) % 400}"/>`).join("")}
            ${Array.from({ length: 34 }, (_, i) => `<circle cx="${50 + (i * 71 + number * 9) % 860}" cy="${48 + (i * 59 + number * 13) % 440}" r="${3 + (i % 4) * 2}" class="${i % 5 ? "" : "hot"}"/>`).join("")}
            <text x="50" y="500">${esc(pick(data.actions, number, 2))}</text>
        </svg>`;
    }
    if (kind === "document-desk") {
        return `<div class="${scope}-document">
            <section>${Array.from({ length: 13 }, (_, i) => `<p class="${i % 4 === number % 4 ? "mark" : ""}" style="width:${92 - (i % 6) * 7}%"></p>`).join("")}</section>
            <aside>${data.signals.map((signal, i) => `<b>${pad2(i + 1)} ${esc(signal)}</b>`).join("")}</aside>
        </div>`;
    }
    if (kind === "voice-room") {
        return `<div class="${scope}-voice">
            <div>${Array.from({ length: 52 }, (_, i) => `<i style="height:${14 + Math.abs(Math.sin((i + number) / 2.1)) * 160}px"></i>`).join("")}</div>
            <aside>${data.actions.map((action, i) => `<p><b>${esc(action)}</b><span>${esc(pick(data.signals, i))}</span></p>`).join("")}</aside>
        </div>`;
    }
    if (kind === "factory-floor") {
        return `<div class="${scope}-factory">
            ${Array.from({ length: 96 }, (_, i) => `<i class="${(i + number) % 17 === 0 ? "bad" : (i + number) % 9 === 0 ? "warn" : ""}"></i>`).join("")}
        </div>`;
    }
    if (kind === "people-ops") {
        return `<div class="${scope}-people-graph">
            ${Array.from({ length: 10 }, (_, i) => `<section style="--x:${12 + (i * 19 + number) % 72}%;--y:${10 + (i * 29 + number) % 72}%"><b>${esc(pick(data.objects, i))}</b><span data-live>${64 + ((number + i * 8) % 33)}%</span></section>`).join("")}
            ${Array.from({ length: 8 }, (_, i) => `<i style="--r:${(i * 23 + number * 4) % 360}deg;--l:${180 + i * 34}px"></i>`).join("")}
        </div>`;
    }
    return `<div class="${scope}-control">${Array.from({ length: 30 }, (_, i) => `<article><b>${esc(pick(data.objects, i))}</b><span data-live>${60 + ((number + i * 5) % 34)}%</span></article>`).join("")}</div>`;
}

function caseSpecificOverride(item, number, data, colors) {
    const [bg, ink, accent, soft, card, wash] = colors;
    const scope = `cu${pad2(number)}`;
    const title = item.title;

    if (number === 91) {
        const body = `<main class="${scope}-churn">
            <nav><b>Churn Lens</b><span>${esc(title)}</span><em>${esc(data.company)}</em></nav>
            <section class="cohort">${Array.from({ length: 56 }, (_, i) => `<i class="${i % 8 < 2 ? "risk" : i % 11 === 0 ? "save" : ""}"></i>`).join("")}</section>
            <section class="curve"><svg viewBox="0 0 760 430"><path d="M30 360 C170 220 250 280 340 170 S570 110 720 70"/><path class="base" d="M30 390 C180 370 300 330 430 270 S620 185 730 150"/></svg><h1>회원 이탈 생존곡선</h1></section>
            <aside>${meterBlock(scope, data, number, 5)}</aside>
        </main>`;
        const css = `body{background:#fff1f4;color:#2a1721}.${scope}-churn{height:100vh;display:grid;grid-template-columns:300px 1fr 310px;grid-template-rows:76px 1fr;gap:18px;padding:22px}.${scope}-churn nav{grid-column:1/4;border:2px solid #2a1721;border-radius:24px;background:#fff;box-shadow:8px 8px 0 #2a1721;display:flex;align-items:center;gap:18px;padding:0 22px}.${scope}-churn nav b{font-size:24px;color:#e11d48}.${scope}-churn nav em{margin-left:auto;font-style:normal}.cohort,.curve,aside{border:2px solid #2a1721;border-radius:28px;background:#fff;box-shadow:8px 8px 0 #2a1721}.cohort{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;padding:18px}.cohort i{border-radius:12px;background:#ffe4e6}.cohort i.risk{background:#e11d48}.cohort i.save{background:#7c3aed}.curve{position:relative;padding:28px}.curve h1{font-size:42px;margin:0;position:absolute;left:34px;top:34px}.curve svg{position:absolute;inset:92px 36px 34px 36px;width:calc(100% - 72px);height:calc(100% - 126px)}.curve path{fill:none;stroke:#e11d48;stroke-width:10;stroke-linecap:round}.curve path.base{stroke:#c7d2fe;stroke-width:6}aside{padding:18px}.${scope}-meter{border:1px solid #ffc4d1;border-radius:18px;padding:14px;margin-bottom:12px}.${scope}-meter b{font-size:28px}.${scope}-meter span{display:block}.${scope}-meter i{display:block;width:var(--w);height:8px;border-radius:99px;background:#e11d48}`;
        return shell(item, number, body, css, liveScript(scope, number));
    }

    if (number === 92) {
        const body = `<main class="${scope}-pay">
            <header><h1>Payment Recovery Sequencer</h1><b>${esc(title)}</b></header>
            <section class="cards">${["실패 결제", "카드 만료", "재시도 예약", "복구 완료"].map((x, i) => `<article><span>${x}</span><b>${23 + i * 17}</b><i></i></article>`).join("")}</section>
            <section class="rail">${Array.from({ length: 10 }, (_, i) => `<div><b>D+${i}</b><span>${esc(pick(data.actions, i))}</span></div>`).join("")}</section>
            <aside id="${scope}log"></aside>
        </main>`;
        const css = `body{background:#eef7f8;color:#132f33}.${scope}-pay{height:100vh;display:grid;grid-template-rows:90px 180px 1fr;grid-template-columns:1fr 360px;gap:18px;padding:22px}.${scope}-pay header{grid-column:1/3;border-radius:28px;background:#132f33;color:white;display:flex;align-items:center;gap:22px;padding:0 28px}.${scope}-pay h1{font-size:38px;margin:0}.${scope}-pay header b{margin-left:auto;color:#a5f3fc}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.cards article,.rail,aside{border:2px solid #132f33;border-radius:26px;background:#fff;box-shadow:8px 8px 0 #132f33}.cards article{padding:18px}.cards span{display:block;color:#0891b2;font-weight:950}.cards b{font-size:44px}.cards i{display:block;height:8px;border-radius:99px;background:#0891b2}.rail{padding:18px;grid-row:3;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.rail div{border:1px solid #a5f3fc;border-radius:18px;padding:14px}.rail b{display:block;color:#0891b2}.rail span{display:block;margin-top:10px}aside{grid-column:2;grid-row:2/4;background:#06151a;color:#a5f3fc;padding:20px;font-family:ui-monospace,Menlo,monospace;line-height:1.8}`;
        const js = `const log=document.getElementById("${scope}log");const rows=["card.expired detected","retry.window assigned","sms.link issued","payment recovered","invoice state synced"];let i=0;setInterval(()=>{const p=document.createElement("p");p.textContent="["+new Date().toLocaleTimeString("ko-KR",{hour12:false})+"] "+rows[i++%rows.length];log.prepend(p);while(log.children.length>24)log.lastElementChild.remove();},600);`;
        return shell(item, number, body, css, js);
    }

    if (number === 95) {
        const body = `<main class="${scope}-risk">
            <aside><h1>Project Risk Forecaster</h1><p>${esc(title)}</p>${meterBlock(scope, data, number, 4)}</aside>
            <section class="gantt">${Array.from({ length: 9 }, (_, i) => `<div><b>${esc(pick(["PM", "Design", "API", "QA", "Deploy"], i))}</b><i style="--l:${8 + (i * 7) % 42}%;--w:${22 + (i * 11 + number) % 40}%"></i><em>${esc(pick(data.signals, i))}</em></div>`).join("")}</section>
            <section class="radial"><svg viewBox="0 0 420 420">${Array.from({ length: 9 }, (_, i) => `<path d="M210 210 L${210 + Math.cos(i / 9 * Math.PI * 2) * (95 + i * 10)} ${210 + Math.sin(i / 9 * Math.PI * 2) * (95 + i * 10)}"/>`).join("")}<circle cx="210" cy="210" r="86"/><text x="210" y="218">RISK</text></svg></section>
        </main>`;
        const css = `body{background:#f4f6ff;color:#1f2333}.${scope}-risk{height:100vh;display:grid;grid-template-columns:330px 1fr 360px;gap:20px;padding:24px}aside,.gantt,.radial{border:2px solid #1f2333;border-radius:30px;background:#fff;box-shadow:8px 8px 0 #1f2333}aside{padding:24px}aside h1{font-size:36px;line-height:1.03;margin:0}.gantt{padding:24px;display:grid;gap:14px}.gantt div{position:relative;height:54px;border-bottom:1px solid #c7d2fe}.gantt b{position:absolute;left:0;top:12px}.gantt i{position:absolute;left:var(--l);width:var(--w);top:10px;height:28px;border-radius:999px;background:#4f46e5}.gantt em{position:absolute;right:0;top:12px;font-style:normal;color:#4f46e5;font-weight:950}.radial{display:grid;place-items:center}.radial svg{width:88%}.radial path{stroke:#c7d2fe;stroke-width:3}.radial circle{fill:#4f46e5;stroke:#1f2333;stroke-width:5}.radial text{text-anchor:middle;fill:white;font-weight:950;font-size:38px}.${scope}-meter{border:1px solid #c7d2fe;border-radius:18px;padding:14px;margin-top:14px}.${scope}-meter b{font-size:28px}.${scope}-meter span{display:block}.${scope}-meter i{display:block;width:var(--w);height:8px;border-radius:99px;background:#4f46e5}`;
        return shell(item, number, body, css, liveScript(scope, number));
    }

    if (number === 96) {
        const body = `<main class="${scope}-perm">
            <header><h1>Data Permission Control</h1><span>${esc(title)}</span></header>
            <section class="matrix">${Array.from({ length: 64 }, (_, i) => `<i class="${i % 13 === 0 ? "deny" : i % 7 === 0 ? "grant" : ""}"></i>`).join("")}</section>
            <section class="graph"><svg viewBox="0 0 650 500">${Array.from({ length: 11 }, (_, i) => `<line x1="325" y1="250" x2="${80 + (i * 53) % 510}" y2="${70 + (i * 89) % 360}"/>`).join("")}${Array.from({ length: 11 }, (_, i) => `<g transform="translate(${80 + (i * 53) % 510},${70 + (i * 89) % 360})"><circle r="${22 + i % 4 * 6}"/><text>${esc(pick(["Admin", "CRM", "ERP", "BI"], i))}</text></g>`).join("")}</svg></section>
            <aside>${data.sources.map((s, i) => `<article><b>${esc(s)}</b><span>${esc(pick(data.actions, i))}</span></article>`).join("")}</aside>
        </main>`;
        const css = `body{background:#effaf5;color:#10251d}.${scope}-perm{height:100vh;display:grid;grid-template-columns:360px 1fr 310px;grid-template-rows:82px 1fr;gap:18px;padding:22px}header{grid-column:1/4;border:2px solid #10251d;border-radius:24px;background:#fff;box-shadow:8px 8px 0 #10251d;display:flex;align-items:center;gap:18px;padding:0 24px}header h1{font-size:36px;margin:0}header span{margin-left:auto;color:#10b981;font-weight:950}.matrix,.graph,aside{border:2px solid #10251d;border-radius:30px;background:#fff;box-shadow:8px 8px 0 #10251d}.matrix{display:grid;grid-template-columns:repeat(8,1fr);gap:9px;padding:20px}.matrix i{border-radius:12px;background:#dcfce7}.matrix i.deny{background:#fb7185}.matrix i.grant{background:#10b981}.graph{display:grid;place-items:center}.graph svg{width:92%;height:92%}.graph line{stroke:#b7f3d4;stroke-width:3}.graph circle{fill:#dcfce7;stroke:#10251d;stroke-width:4}.graph text{text-anchor:middle;dominant-baseline:middle;font-size:12px;font-weight:950}aside{padding:18px}aside article{border:1px solid #b7f3d4;border-radius:18px;padding:16px;margin-bottom:12px}aside b{display:block}aside span{display:block;color:#10b981;font-weight:950;margin-top:8px}`;
        return shell(item, number, body, css);
    }

    return null;
}

function genericScene(item, number) {
    const data = profile(item, number);
    const colors = palettes[number % palettes.length];
    const override = caseSpecificOverride(item, number, data, colors);
    if (override) return override;

    const [bg, ink, accent, soft, card, wash] = colors;
    const scope = `cu${pad2(number)}`;
    const rand = seeded(number + item.title.length);
    const visual = data.visual;
    const layout = number % 7;
    const metricCount = 3 + (number % 4);
    const navItems = [...data.sources, ...data.actions].slice(0, 5);
    const miniCards = Array.from({ length: 6 + (number % 5) }, (_, index) => `<article><b>${esc(pick(data.objects, index))}-${pad3(number)}-${index}</b><span>${esc(pick([...data.signals, ...data.actions], number, index))}</span><em data-live>${58 + ((number + index * 11) % 39)}%</em></article>`).join("");
    const hero = `<div class="${scope}-hero"><p>${esc(data.company)} · CASE ${pad3(number)}</p><h1>${esc(data.app)}</h1><strong>${esc(item.title)}</strong></div>`;
    const meters = `<div class="${scope}-meters">${meterBlock(scope, data, number, metricCount)}</div>`;
    const nav = `<nav class="${scope}-nav">${navItems.map((navItem, index) => `<span class="${index === number % navItems.length ? "on" : ""}">${esc(navItem)}</span>`).join("")}</nav>`;
    const board = `<section class="${scope}-board">${miniCards}</section>`;
    const visualPanel = `<section class="${scope}-visual">${visualMarkup(visual, scope, data, number)}</section>`;
    const log = `<aside class="${scope}-log" id="${scope}log"></aside>`;

    const bodies = [
        `<main class="${scope} screen-a">${nav}${hero}${visualPanel}${meters}${board}${log}</main>`,
        `<main class="${scope} screen-b">${hero}${meters}${visualPanel}${nav}${board}${log}</main>`,
        `<main class="${scope} screen-c">${visualPanel}${hero}${nav}${board}${meters}${log}</main>`,
        `<main class="${scope} screen-d">${nav}${board}${hero}${visualPanel}${meters}${log}</main>`,
        `<main class="${scope} screen-e">${hero}${visualPanel}${log}${board}${nav}${meters}</main>`,
        `<main class="${scope} screen-f">${meters}${hero}${nav}${visualPanel}${board}${log}</main>`,
        `<main class="${scope} screen-g">${log}${hero}${visualPanel}${board}${meters}${nav}</main>`
    ];

    const extraTexture = `radial-gradient(circle at ${Math.round(rand() * 100)}% ${Math.round(rand() * 100)}%, ${soft}66, transparent 28%), linear-gradient(${wash}55 1px, transparent 1px), linear-gradient(90deg, ${wash}55 1px, transparent 1px)`;

    const css = `
body{background:${bg};color:${ink}}
.${scope}{height:100vh;padding:${18 + number % 9}px;gap:${14 + number % 7}px;background:${extraTexture};background-size:auto,${34 + number % 14}px ${34 + number % 14}px,${34 + number % 14}px ${34 + number % 14}px}
.${scope} > *{min-width:0}
.${scope}-hero,.${scope}-visual,.${scope}-meters,.${scope}-board,.${scope}-log,.${scope}-nav{border:2px solid ${ink};border-radius:${18 + number % 14}px;background:${card};box-shadow:${6 + number % 5}px ${6 + number % 5}px 0 ${ink};overflow:hidden}
.${scope}-hero{padding:24px}.${scope}-hero p{margin:0;color:${accent};font-weight:950;letter-spacing:.06em}.${scope}-hero h1{margin:10px 0 6px;font-size:${34 + number % 18}px;line-height:.98;letter-spacing:-.055em}.${scope}-hero strong{display:block;color:${ink};opacity:.72}
.${scope}-nav{padding:13px;display:grid;gap:10px;align-content:start}.${scope}-nav span{border:1px solid ${soft};border-radius:14px;background:${bg};padding:12px;font-weight:950;font-size:13px}.${scope}-nav span.on{background:${ink};color:${card}}
.${scope}-meters{padding:16px;display:grid;gap:12px;align-content:start}.${scope}-meter{border:1px solid ${soft};border-radius:16px;padding:13px}.${scope}-meter span{display:block;font-size:12px;color:${ink};opacity:.72}.${scope}-meter b{font-size:26px}.${scope}-meter i{display:block;width:var(--w);height:8px;border-radius:99px;background:${accent};margin-top:8px}
.${scope}-board{padding:16px;display:grid;grid-template-columns:repeat(${2 + number % 3},1fr);gap:12px;align-content:start}.${scope}-board article{border:1px solid ${soft};border-radius:16px;background:${bg};padding:13px;min-height:${82 + number % 34}px}.${scope}-board b{display:block;font-size:13px}.${scope}-board span{display:block;margin-top:10px;color:${ink};opacity:.65;font-size:12px}.${scope}-board em{display:block;margin-top:12px;color:${accent};font-style:normal;font-weight:950}
.${scope}-visual{position:relative;padding:18px}.${scope}-log{background:${ink};color:${soft};padding:16px;font-family:ui-monospace,Menlo,monospace;font-size:12px;line-height:1.75}
.screen-a{display:grid;grid-template-columns:250px 1fr 310px;grid-template-rows:170px 1fr 220px}.screen-a .${scope}-nav{grid-row:1/4}.screen-a .${scope}-hero{grid-column:2}.screen-a .${scope}-visual{grid-column:2;grid-row:2/4}.screen-a .${scope}-meters{grid-column:3;grid-row:1/3}.screen-a .${scope}-board{grid-column:3;grid-row:3}.screen-a .${scope}-log{display:none}
.screen-b{display:grid;grid-template-columns:1.2fr .8fr 310px;grid-template-rows:180px 1fr 72px}.screen-b .${scope}-hero{grid-column:1}.screen-b .${scope}-meters{grid-column:2}.screen-b .${scope}-visual{grid-column:1/3;grid-row:2}.screen-b .${scope}-nav{grid-column:1/3;grid-row:3;grid-auto-flow:column}.screen-b .${scope}-board{grid-column:3;grid-row:1/3}.screen-b .${scope}-log{grid-column:3;grid-row:3}
.screen-c{display:grid;grid-template-columns:1fr 330px;grid-template-rows:150px 72px 1fr 180px}.screen-c .${scope}-visual{grid-column:1;grid-row:1/5}.screen-c .${scope}-hero{grid-column:2;grid-row:1}.screen-c .${scope}-nav{grid-column:2;grid-row:2;grid-auto-flow:column}.screen-c .${scope}-board{grid-column:2;grid-row:3}.screen-c .${scope}-meters{grid-column:2;grid-row:4}.screen-c .${scope}-log{display:none}
.screen-d{display:grid;grid-template-columns:220px 1fr;grid-template-rows:1fr 210px}.screen-d .${scope}-nav{grid-row:1/3}.screen-d .${scope}-board{grid-column:2;grid-row:1}.screen-d .${scope}-hero{position:absolute;left:268px;top:38px;width:430px;z-index:2}.screen-d .${scope}-visual{grid-column:2;grid-row:1;clip-path:polygon(18% 0,100% 0,100% 100%,0 100%,0 22%)}.screen-d .${scope}-meters{grid-column:2;grid-row:2}.screen-d .${scope}-log{display:none}
.screen-e{display:grid;grid-template-columns:380px 1fr 280px;grid-template-rows:1fr 210px 72px}.screen-e .${scope}-hero{grid-row:1}.screen-e .${scope}-visual{grid-column:2;grid-row:1/4}.screen-e .${scope}-log{grid-column:3;grid-row:1/3}.screen-e .${scope}-board{grid-column:1;grid-row:2}.screen-e .${scope}-nav{grid-column:1;grid-row:3;grid-auto-flow:column}.screen-e .${scope}-meters{grid-column:3;grid-row:3}
.screen-f{display:grid;grid-template-columns:300px 1fr;grid-template-rows:145px 66px 1fr}.screen-f .${scope}-meters{grid-column:1;grid-row:1/4}.screen-f .${scope}-hero{grid-column:2;grid-row:1}.screen-f .${scope}-nav{grid-column:2;grid-row:2;grid-auto-flow:column}.screen-f .${scope}-visual{grid-column:2;grid-row:3}.screen-f .${scope}-board{position:absolute;right:36px;bottom:36px;width:520px;max-height:220px}.screen-f .${scope}-log{display:none}
.screen-g{display:grid;grid-template-columns:320px 1fr 310px;grid-template-rows:150px 1fr}.screen-g .${scope}-log{grid-row:1/3}.screen-g .${scope}-hero{grid-column:2}.screen-g .${scope}-visual{grid-column:2;grid-row:2}.screen-g .${scope}-board{grid-column:3;grid-row:1}.screen-g .${scope}-meters{grid-column:3;grid-row:2}.screen-g .${scope}-nav{display:none}
.${scope}-asset{position:absolute;inset:0;background:${ink};overflow:hidden}.${scope}-asset i{position:absolute;left:var(--x);top:var(--y);width:${38 + number % 28}px;height:${34 + number % 24}px;border-radius:${8 + number % 14}px;background:${accent};opacity:.72}.${scope}-asset i.sel{background:${soft};box-shadow:0 0 0 10px ${soft}33}.${scope}-asset b{position:absolute;left:26px;bottom:24px;background:${card};color:${ink};border-radius:999px;padding:12px 15px}
.${scope}-radar{width:100%;height:100%}.${scope}-radar circle{fill:none;stroke:${soft};stroke-width:3}.${scope}-radar rect{fill:${card};stroke:${ink};stroke-width:3}.${scope}-radar text{text-anchor:middle;dominant-baseline:middle;font-size:11px;font-weight:950;fill:${ink}}
.${scope}-supply{width:100%;height:100%;background:${bg}}.${scope}-supply path{fill:none;stroke:${accent};stroke-width:10;stroke-dasharray:14 10}.${scope}-supply circle{fill:${card};stroke:${ink};stroke-width:5}.${scope}-supply text{text-anchor:middle;dominant-baseline:middle;font-size:11px;font-weight:950;fill:${ink}}
.${scope}-trading{height:100%;display:grid;grid-template-columns:repeat(${4 + number % 4},1fr);gap:10px}.${scope}-trading article{position:relative;border:1px solid ${soft};border-radius:16px;background:${bg};padding:12px}.${scope}-trading small{font-weight:950;color:${accent}}.${scope}-trading b{display:block;font-size:22px;margin-top:8px}.${scope}-trading i{position:absolute;left:12px;right:12px;bottom:10px;border-radius:10px;background:linear-gradient(180deg,${soft},${accent})}
.${scope}-stars{width:100%;height:100%;background:${ink};border-radius:18px}.${scope}-stars line{stroke:${soft};stroke-width:1;opacity:.45}.${scope}-stars circle{fill:${soft}}.${scope}-stars circle.hot{fill:${accent}}.${scope}-stars text{fill:${card};font-weight:950;font-size:24px}
.${scope}-document{height:100%;display:grid;grid-template-columns:1fr 280px;gap:18px}.${scope}-document section,.${scope}-document aside{border:1px solid ${soft};border-radius:18px;background:${bg};padding:22px}.${scope}-document p{height:13px;border-radius:99px;background:${soft};margin:0 0 16px}.${scope}-document p.mark{background:${accent};box-shadow:0 0 0 8px ${soft}77}.${scope}-document b{display:block;border-bottom:1px solid ${soft};padding:14px 0;color:${accent}}
.${scope}-voice{height:100%;display:grid;grid-template-columns:1fr 320px;gap:18px}.${scope}-voice>div{display:flex;align-items:center;gap:7px}.${scope}-voice i{flex:1;border-radius:99px;background:${accent}}.${scope}-voice aside{border:1px solid ${soft};border-radius:18px;background:${bg};padding:16px}.${scope}-voice p{border-bottom:1px solid ${soft};padding-bottom:12px}.${scope}-voice b,.${scope}-voice span{display:block}
.${scope}-factory{height:100%;display:grid;grid-template-columns:repeat(${8 + number % 5},1fr);gap:9px}.${scope}-factory i{border-radius:10px;background:${wash};border:1px solid ${soft}}.${scope}-factory i.warn{background:#f59e0b}.${scope}-factory i.bad{background:#ef4444;box-shadow:0 0 0 5px #fecaca}
.${scope}-people-graph{position:absolute;inset:0;background:${card}}.${scope}-people-graph section{position:absolute;left:var(--x);top:var(--y);min-width:96px;border:2px solid ${ink};border-radius:999px;background:${bg};padding:10px 12px;text-align:center}.${scope}-people-graph b{display:block;font-size:12px}.${scope}-people-graph span{color:${accent};font-weight:950}.${scope}-people-graph i{position:absolute;left:50%;top:50%;width:var(--l);height:2px;background:${soft};transform:rotate(var(--r));transform-origin:left center}
.${scope}-control{height:100%;display:grid;grid-template-columns:repeat(${3 + number % 4},1fr);gap:10px}.${scope}-control article{border:1px solid ${soft};border-radius:16px;background:${bg};padding:14px}.${scope}-control b,.${scope}-control span{display:block}
`;

    const js = `
${liveScript(scope, number)}
const ${scope}Log=document.getElementById("${scope}log");
if(${scope}Log){
  const rows=${JSON.stringify([...data.signals, ...data.actions, ...data.sources])};
  let idx=0;
  setInterval(()=>{const p=document.createElement("p");p.textContent="["+new Date().toLocaleTimeString("ko-KR",{hour12:false})+"] "+rows[idx++%rows.length]+" synced";${scope}Log.prepend(p);while(${scope}Log.children.length>18)${scope}Log.lastElementChild.remove();},700);
}
`;

    return shell(item, number, bodies[layout], css, js);
}

for (const item of manifest) {
    const number = Number(item.id.replace("case-", ""));
    const html = genericScene(item, number);
    await writeFile(path.join(outDir, `case-ui-${pad2(number)}.html`), html, "utf8");
}

console.log(`Generated ${manifest.length} distinct case UI files.`);
