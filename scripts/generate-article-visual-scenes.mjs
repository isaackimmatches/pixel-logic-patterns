import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const sceneDir = path.join(root, "case-assets/article-visuals");
const captureDir = path.join(root, "images/generated/bruteforce-ui");
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const variants = ["data", "logic", "queue", "roi"];

await mkdir(sceneDir, { recursive: true });
await mkdir(captureDir, { recursive: true });

if (!existsSync(chrome)) {
    throw new Error(`Chrome executable not found: ${chrome}`);
}

const manifest = JSON.parse(await readFile(path.join(root, "case-assets/case-manifest.json"), "utf8"));

const companies = [
    "MUSE CONTENT", "Lattice Retail", "Brewline Foods", "Aster Commerce", "Modo Beauty", "Finch Logistics",
    "Nori Edu", "Atlas Works", "Orion Finance", "Careflow Clinic", "Verse Legal", "Studio Round",
    "Nova CX", "Pioneer Ops", "Sable Factory", "Merit CRM", "Cobalt Market", "Signal Goods"
];

const palette = [
    ["#f7fbff", "#111827", "#2563eb", "#9bd4ff", "#ffffff"],
    ["#fff7ed", "#1f2937", "#f97316", "#ffd3b6", "#ffffff"],
    ["#f5f3ff", "#211a36", "#7c3aed", "#d8b4fe", "#ffffff"],
    ["#effaf5", "#10251d", "#10b981", "#b7f3d4", "#ffffff"],
    ["#fff1f4", "#2a1721", "#e11d48", "#ffc4d1", "#ffffff"],
    ["#f8fafc", "#0f172a", "#0ea5e9", "#bae6fd", "#ffffff"],
    ["#f4f6ff", "#1f2333", "#4f46e5", "#c7d2fe", "#ffffff"]
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

function shortWords(title) {
    return title.replace(/[()·]/g, " ").split(/\s+/).filter(Boolean).slice(0, 5);
}

function scenario(item, number) {
    const title = item.title;
    const commerce = number <= 30;
    const marketing = number > 30 && number <= 60;
    const base = {
        company: pick(companies, number),
        app: `${shortWords(title).slice(0, 2).join(" ")} AX Console`,
        owner: commerce ? "커머스 운영팀" : marketing ? "브랜드 운영팀" : "운영 자동화팀",
        domain: commerce ? "commerce" : marketing ? "marketing" : "operations",
        sources: commerce ? ["상품 DB", "주문 로그", "리뷰 텍스트", "재고 원장"] : marketing ? ["광고 API", "CRM 이벤트", "콘텐츠 메타", "검색 로그"] : ["ERP 로그", "승인 이력", "문서 원본", "상담 데이터"],
        signals: ["이상치", "우선순위", "자동 처리율", "검수 필요"],
        actions: ["자동 실행", "담당자 검수", "승인 요청", "리포트 발행"],
        objects: commerce ? ["SKU", "주문", "리뷰", "매장"] : marketing ? ["캠페인", "고객", "소재", "채널"] : ["문서", "티켓", "작업", "승인"],
        metric: commerce ? "재고비 22% 개선" : marketing ? "ROAS 2.4배 개선" : "검토 시간 80% 단축",
        formula: "score = w1*x_source + w2*x_signal - w3*risk"
    };

    const rules = [
        [/상품평|리뷰|부정|불량/, {
            app: "Review Defect Sentinel",
            owner: "품질/MD 운영팀",
            sources: ["상품평 원문", "반품 사유", "SKU 로트", "이미지 증거"],
            signals: ["부정 키워드 급증", "동일 로트 반복", "불량 확률", "회수 우선순위"],
            actions: ["불량 티켓 생성", "입고 로트 잠금", "상품페이지 경고", "MD 알림"],
            objects: ["리뷰", "키워드", "SKU", "로트"],
            metric: "반품률 15% 감소",
            formula: "defect = P(keyword|sku) * return_rate * lot_repeat"
        }],
        [/재고|발주|품절|입출고|창고|피킹|납기|배차|배송|운송/, {
            app: "Inventory Forecast Console",
            owner: "SCM 운영팀",
            sources: ["주문 로그", "센터 재고", "배송 SLA", "프로모션 캘린더"],
            signals: ["품절 예상시점", "과재고 지수", "대체 SKU", "센터 간 이동량"],
            actions: ["발주량 추천", "대체상품 노출", "입고 우선순위 변경", "지연 알림"],
            objects: ["SKU", "센터", "노선", "발주"],
            metric: "과다 재고 22% 개선",
            formula: "q* = demand_mu + z*sigma - on_hand + promo_lift"
        }],
        [/가격|쿠폰|광고비|입찰|CTR|ROAS|배너|캠페인|푸시|리타게팅/, {
            app: "Performance Control Tower",
            owner: "퍼포먼스 마케팅팀",
            sources: ["광고 API", "전환 이벤트", "소재 버전", "예산 캡"],
            signals: ["CTR 예측", "CPC 변동", "피로도", "증분 ROAS"],
            actions: ["입찰 조정", "소재 교체", "예산 이동", "제외 오디언스"],
            objects: ["키워드", "소재", "세그먼트", "예산"],
            metric: "ROAS 300% 달성",
            formula: "bid = LTV * pCVR * margin - fatigue_cost"
        }],
        [/이미지|누끼|배경|영상|프레임|숏폼|자막|소재|저작권|세이프티/, {
            app: "Creative Asset Studio",
            owner: "콘텐츠 제작팀",
            sources: ["원본 에셋", "브랜드 가이드", "채널 규격", "권리 DB"],
            signals: ["피사체 경계", "프레임 변화", "톤 불일치", "저작권 위험"],
            actions: ["자동 마스킹", "하이라이트 추출", "검수 요청", "광고 에셋 배포"],
            objects: ["이미지", "프레임", "레이어", "채널"],
            metric: "제작 시간 1/10 단축",
            formula: "quality = edge_iou + brand_fit - rights_risk"
        }],
        [/계약서|법무|조항|문서|증빙|세금계산서|회계|정산|보험|대출|견적/, {
            app: "Document Risk Workbench",
            owner: "법무/재무 검토팀",
            sources: ["PDF 원본", "거래처 원장", "승인 이력", "표준 조항집"],
            signals: ["핵심 조항", "금액 불일치", "권한 예외", "검토 위험도"],
            actions: ["조항 추출", "검토자 지정", "반려 사유 생성", "승인 큐 등록"],
            objects: ["문서", "조항", "금액", "거래처"],
            metric: "검토 시간 80% 단축",
            formula: "risk = clause_delta + amount_gap + approval_exception"
        }],
        [/상담|콜센터|음성|STT|QA|지식베이스|헬프데스크|라이브|질문|웨비나|VoC/, {
            app: "Conversation Intelligence Desk",
            owner: "CX 운영팀",
            sources: ["상담 녹취", "CRM 프로필", "문의 이력", "지식베이스"],
            signals: ["의도 분류", "감정 변화", "재문의 확률", "품질 점수"],
            actions: ["상담 요약", "답변 추천", "QA 샘플링", "후속 티켓"],
            objects: ["콜", "고객", "의도", "티켓"],
            metric: "CX 점수 4.8/5.0",
            formula: "qa = intent_fit + resolution - silence_penalty"
        }],
        [/생산|설비|안전|작업지시|품질|유지보수|에너지|협력사|원자재|공정|픽셀/, {
            app: "Factory Signal Monitor",
            owner: "공장 운영팀",
            sources: ["MES 로그", "센서 스트림", "검사 이미지", "작업지시서"],
            signals: ["설비 편차", "불량 픽셀", "라인 병목", "정비 우선순위"],
            actions: ["작업지시 추천", "정비 티켓", "라인 정지 알림", "품질 리포트"],
            objects: ["라인", "설비", "LOT", "검사"],
            metric: "불량률 0.1% 미만 관리",
            formula: "anomaly = |sensor_t - baseline| / rolling_sigma"
        }],
        [/채용|근태|교육|수강|회원탈퇴|구독|프로젝트|권한|리텐션/, {
            app: "People Ops Prediction Desk",
            owner: "조직/구독 운영팀",
            sources: ["사용자 프로필", "활동 로그", "결제 이력", "권한 변경"],
            signals: ["이탈 위험", "권한 이상", "응답 지연", "리텐션 점수"],
            actions: ["알림 발송", "담당 배정", "권한 조정", "복구 캠페인"],
            objects: ["사용자", "권한", "결제", "프로젝트"],
            metric: "처리 SLA 42% 개선",
            formula: "priority = churn_prob * revenue + access_risk"
        }]
    ];

    const match = rules.find(([regex]) => regex.test(title));
    return { ...base, ...(match ? match[1] : {}) };
}

function htmlShell(number, variant, item, body, css, js = "") {
    const id = pad2(number);
    const title = esc(item.title);
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>article-scene-${id}-${variant} | ${title}</title>
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

function metricCards(prefix, data, number) {
    return data.signals.map((signal, index) => `
        <article class="${prefix}-metric">
            <span>${esc(signal)}</span>
            <b data-meter>${68 + ((number * 7 + index * 11) % 29)}%</b>
            <i style="--w:${54 + ((number + index * 13) % 40)}%"></i>
        </article>`).join("");
}

function animatedMeters(prefix, number) {
    return `
const ${prefix}meters=[...document.querySelectorAll("[data-meter]")];
let ${prefix}tick=0;
setInterval(()=>{
  ${prefix}tick++;
  ${prefix}meters.forEach((el,i)=>el.textContent=(62+((${prefix}tick*3+i*9+${number})%34))+"%");
},1100);`;
}

function dataScene(item, number) {
    const data = scenario(item, number);
    const [bg, ink, accent, soft, card] = palette[(number + 1) % palette.length];
    const prefix = `av${pad2(number)}d`;
    const mode = number % 4;

    if (mode === 0) {
        const body = `<main class="${prefix}-mapper">
            <header><strong>${esc(data.company)}</strong><h1>${esc(data.app)}</h1><span>DATA INTAKE</span></header>
            <section class="${prefix}-flow">
                <aside>${data.sources.map((source, i) => `<button>${esc(source)}<em>${1200 + number * 37 + i * 204}</em></button>`).join("")}</aside>
                <article class="${prefix}-table">
                    <div class="head">${["source_key", "clean_rule", "owner", "refresh", "status"].map((v) => `<b>${v}</b>`).join("")}</div>
                    ${Array.from({ length: 9 }, (_, i) => `<div><span>${esc(pick(data.objects, i))}-${number}${i}</span><span>${esc(pick(data.signals, i))}</span><span>${esc(data.owner)}</span><span>${i % 3 ? "15 min" : "realtime"}</span><mark>${i % 4 ? "valid" : "review"}</mark></div>`).join("")}
                </article>
                <aside class="right">${metricCards(prefix, data, number)}</aside>
            </section>
        </main>`;
        const css = `body{background:${bg};color:${ink}}.${prefix}-mapper{height:100vh;padding:26px;display:grid;grid-template-rows:86px 1fr;gap:18px}.${prefix}-mapper header{display:flex;align-items:center;gap:18px;border:2px solid ${ink};border-radius:24px;background:${card};padding:0 24px;box-shadow:8px 8px 0 ${ink}}.${prefix}-mapper h1{font-size:34px;margin:0;letter-spacing:-.04em}.${prefix}-mapper strong{color:${accent}}.${prefix}-mapper header span{margin-left:auto;font-weight:950;letter-spacing:.16em}.${prefix}-flow{min-height:0;display:grid;grid-template-columns:260px 1fr 280px;gap:18px}.${prefix}-flow aside, .${prefix}-table{border:2px solid ${ink};border-radius:26px;background:${card};box-shadow:8px 8px 0 ${ink}}.${prefix}-flow aside{padding:16px;display:grid;gap:10px;align-content:start}.${prefix}-flow button{height:64px;border:1px solid ${soft};border-radius:16px;background:${bg};text-align:left;padding:11px 14px;font-weight:950;color:${ink}}.${prefix}-flow button em{display:block;font-size:12px;color:${accent};font-style:normal;margin-top:4px}.${prefix}-table{overflow:hidden}.head, .${prefix}-table div:not(.head){display:grid;grid-template-columns:1.1fr 1.1fr 1fr .7fr .7fr}.head{height:58px;background:${ink};color:${card};align-items:center;padding:0 16px;font-size:12px;text-transform:uppercase}.${prefix}-table div:not(.head){height:58px;align-items:center;border-bottom:1px solid ${soft};padding:0 16px;color:${ink}}.${prefix}-table mark{border-radius:999px;background:${soft};color:${ink};padding:7px 10px;font-weight:950}.right .${prefix}-metric{border:1px solid ${soft};border-radius:18px;padding:14px}.right .${prefix}-metric span{display:block;color:${ink};opacity:.72;font-size:12px}.right .${prefix}-metric b{font-size:28px}.right .${prefix}-metric i{display:block;width:var(--w);height:8px;border-radius:99px;background:${accent};margin-top:9px}`;
        return htmlShell(number, "data", item, body, css, animatedMeters(prefix, number));
    }

    if (mode === 1) {
        const body = `<div class="${prefix}-api">
            <nav><b>${esc(data.company)}</b><span>${esc(item.title)}</span><i>DATA CONTRACT</i></nav>
            <main>
                <section class="contract">${data.sources.map((source, i) => `<article style="--delay:${i}"><h2>${esc(source)}</h2><p>${esc(pick(data.signals, i))} 필드를 ${i % 2 ? "event stream" : "batch sync"}으로 표준화</p><code>{ id:"${pad3(number)}-${i}", latency:${80 + i * 35}ms }</code></article>`).join("")}</section>
                <section class="terminal" id="${prefix}-terminal"></section>
            </main>
        </div>`;
        const css = `body{background:${ink};color:${card}}.${prefix}-api{height:100vh;display:grid;grid-template-rows:70px 1fr;background:radial-gradient(circle at 74% 18%,${accent}44,transparent 30%),${ink}}.${prefix}-api nav{display:flex;align-items:center;gap:18px;border-bottom:1px solid rgba(255,255,255,.14);padding:0 26px}.${prefix}-api nav b{font-size:21px}.${prefix}-api nav span{color:${soft};font-weight:900}.${prefix}-api nav i{margin-left:auto;font-style:normal;border:1px solid rgba(255,255,255,.18);border-radius:99px;padding:8px 12px}.${prefix}-api main{display:grid;grid-template-columns:1fr 420px;gap:18px;padding:18px}.contract{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.contract article{border:1px solid rgba(255,255,255,.14);border-radius:26px;background:rgba(255,255,255,.07);padding:24px;animation:${prefix}rise .8s ease both;animation-delay:calc(var(--delay)*.08s)}.contract h2{font-size:32px;margin:0}.contract p{line-height:1.7;color:${soft}}.contract code,.terminal{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.contract code{display:block;border-radius:14px;background:rgba(0,0,0,.24);padding:16px;color:#a7f3d0}.terminal{border:1px solid rgba(255,255,255,.14);border-radius:26px;background:#020617;padding:18px;overflow:hidden;color:#a7f3d0;font-size:13px;line-height:1.85}@keyframes ${prefix}rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}`;
        const js = `const ${prefix}term=document.getElementById("${prefix}-terminal");const ${prefix}logs=["schema.validate ${data.objects[0]}","stream.join ${data.sources[1]}","dedupe.key ${data.objects[1]}_${number}","quality.gate passed","refresh.window 15m"];let ${prefix}i=0;setInterval(()=>{const p=document.createElement("p");p.textContent="["+new Date().toLocaleTimeString("ko-KR",{hour12:false})+"] "+${prefix}logs[${prefix}i++%${prefix}logs.length];${prefix}term.prepend(p);while(${prefix}term.children.length>22)${prefix}term.lastElementChild.remove();},520);`;
        return htmlShell(number, "data", item, body, css, js);
    }

    if (mode === 2) {
        const points = Array.from({ length: 12 }, (_, i) => [80 + ((i * 97 + number * 13) % 1030), 110 + ((i * 71 + number * 29) % 580)]);
        const body = `<section class="${prefix}-hub">
            <header><p>${esc(data.company)}</p><h1>${esc(data.app)}</h1></header>
            <svg viewBox="0 0 1200 700">
                ${points.map(([x, y], i) => `<path d="M600 350 L${x} ${y}" />`).join("")}
                <circle class="core" cx="600" cy="350" r="74" />
                <text x="600" y="357">${esc(data.objects[0])}</text>
                ${points.map(([x, y], i) => `<g transform="translate(${x},${y})"><circle r="${30 + (i % 4) * 6}" /><text>${esc(pick(data.sources, i))}</text></g>`).join("")}
            </svg>
            <aside>${metricCards(prefix, data, number)}</aside>
        </section>`;
        const css = `body{background:${bg};color:${ink}}.${prefix}-hub{height:100vh;position:relative;overflow:hidden;background-image:linear-gradient(${soft}66 1px,transparent 1px),linear-gradient(90deg,${soft}66 1px,transparent 1px);background-size:42px 42px}.${prefix}-hub header{position:absolute;left:30px;top:26px;z-index:2}.${prefix}-hub header p{margin:0;color:${accent};font-weight:950}.${prefix}-hub h1{font-size:42px;margin:6px 0 0;letter-spacing:-.05em}.${prefix}-hub svg{position:absolute;left:40px;top:100px;width:calc(100% - 380px);height:calc(100% - 120px)}.${prefix}-hub path{stroke:${accent};stroke-width:3;stroke-dasharray:8 10;opacity:.5}.${prefix}-hub circle{fill:${card};stroke:${ink};stroke-width:4}.core{fill:${accent}!important}. ${prefix}-hub text{font-size:13px;text-anchor:middle;dominant-baseline:middle;font-weight:950;fill:${ink}}.${prefix}-hub .core+text{fill:${card};font-size:18px}.${prefix}-hub aside{position:absolute;right:26px;top:26px;bottom:26px;width:300px;border:2px solid ${ink};border-radius:28px;background:${card};box-shadow:8px 8px 0 ${ink};padding:18px;display:grid;gap:14px;align-content:start}.${prefix}-metric{border:1px solid ${soft};border-radius:18px;padding:16px}.${prefix}-metric span{display:block;color:${ink};opacity:.72}.${prefix}-metric b{font-size:30px}.${prefix}-metric i{display:block;width:var(--w);height:8px;border-radius:99px;background:${accent};margin-top:10px}`;
        return htmlShell(number, "data", item, body, css, animatedMeters(prefix, number));
    }

    const body = `<main class="${prefix}-ledger">
        <section class="left"><h1>${esc(data.app)}</h1><p>${esc(item.title)} 원천 데이터 스냅샷</p>${data.sources.map((s, i) => `<div><b>${esc(s)}</b><span>${esc(pick(data.objects, i))} key-${number}${i}</span></div>`).join("")}</section>
        <section class="middle">${Array.from({ length: 42 }, (_, i) => `<i class="${i % 9 === number % 9 ? "hot" : ""}" style="--h:${24 + ((i * 17 + number) % 120)}px"></i>`).join("")}</section>
        <section class="right"><h2>${esc(data.company)}</h2>${metricCards(prefix, data, number)}</section>
    </main>`;
    const css = `body{background:${bg};color:${ink}}.${prefix}-ledger{height:100vh;display:grid;grid-template-columns:310px 1fr 320px;gap:20px;padding:24px}.left,.middle,.right{border:2px solid ${ink};border-radius:28px;background:${card};box-shadow:8px 8px 0 ${ink}}.left,.right{padding:24px}.left h1{font-size:36px;line-height:1.04;margin:0}.left p{color:${accent};font-weight:950}.left div{border-top:1px solid ${soft};padding:16px 0}.left b{display:block}.left span{color:${ink};opacity:.65}.middle{display:grid;grid-template-columns:repeat(7,1fr);align-items:end;gap:10px;padding:22px;background:linear-gradient(180deg,${card},${bg})}.middle i{height:var(--h);border-radius:14px 14px 4px 4px;background:${soft};border:1px solid ${ink}44}.middle i.hot{background:${accent};box-shadow:0 0 0 6px ${soft}}.right h2{font-size:30px;margin:0 0 18px}.${prefix}-metric{border:1px solid ${soft};border-radius:18px;padding:14px;margin-bottom:12px}.${prefix}-metric span{display:block;font-size:12px}.${prefix}-metric b{font-size:28px}.${prefix}-metric i{display:block;width:var(--w);height:8px;border-radius:99px;background:${accent};margin-top:9px}`;
    return htmlShell(number, "data", item, body, css, animatedMeters(prefix, number));
}

function logicScene(item, number) {
    const data = scenario(item, number);
    const [bg, ink, accent, soft, card] = palette[(number + 3) % palette.length];
    const prefix = `av${pad2(number)}l`;
    const mode = (number + 1) % 4;

    if (mode === 0) {
        const nodes = [...data.sources, ...data.signals, ...data.actions].slice(0, 10);
        const body = `<main class="${prefix}-nodes">
            <header><b>${esc(data.company)}</b><h1>${esc(data.app)} Logic Builder</h1><code>${esc(data.formula)}</code></header>
            <section><svg viewBox="0 0 1080 600">
                ${nodes.map((_, i) => `<path d="M${120 + (i % 3) * 310} ${100 + Math.floor(i / 3) * 150} C${260 + (i % 3) * 250} ${90 + Math.floor(i / 3) * 140}, ${360 + (i % 3) * 220} ${180 + Math.floor(i / 3) * 130}, ${430 + (i % 3) * 210} ${160 + Math.floor(i / 3) * 120}" />`).join("")}
                ${nodes.map((node, i) => `<g transform="translate(${120 + (i % 3) * 310},${100 + Math.floor(i / 3) * 150})"><rect x="-82" y="-32" width="164" height="64" rx="18"/><text>${esc(node)}</text></g>`).join("")}
            </svg><aside>${metricCards(prefix, data, number)}</aside></section>
        </main>`;
        const css = `body{background:${bg};color:${ink}}.${prefix}-nodes{height:100vh;padding:24px;display:grid;grid-template-rows:90px 1fr;gap:18px}.${prefix}-nodes header{display:flex;align-items:center;gap:18px;border-radius:28px;background:${ink};color:${card};padding:0 24px}.${prefix}-nodes h1{font-size:30px;margin:0}.${prefix}-nodes code{margin-left:auto;background:${card};color:${ink};border-radius:14px;padding:12px 14px}.${prefix}-nodes section{display:grid;grid-template-columns:1fr 290px;gap:18px}.${prefix}-nodes svg,.${prefix}-nodes aside{border:2px solid ${ink};border-radius:28px;background:${card};box-shadow:8px 8px 0 ${ink}}.${prefix}-nodes path{fill:none;stroke:${soft};stroke-width:5;stroke-dasharray:12 10}. ${prefix}-nodes rect{fill:${bg};stroke:${ink};stroke-width:3}. ${prefix}-nodes text{text-anchor:middle;dominant-baseline:middle;font-size:13px;font-weight:950;fill:${ink}}.${prefix}-nodes aside{padding:18px;display:grid;gap:14px;align-content:start}.${prefix}-metric{border:1px solid ${soft};border-radius:18px;padding:14px}.${prefix}-metric b{font-size:26px}. ${prefix}-metric span{display:block;font-size:12px}. ${prefix}-metric i{display:block;width:var(--w);height:8px;background:${accent};border-radius:99px;margin-top:9px}`;
        return htmlShell(number, "logic", item, body, css, animatedMeters(prefix, number));
    }

    if (mode === 1) {
        const body = `<section class="${prefix}-formula">
            <aside><h1>${esc(item.title)}</h1><p>${esc(data.owner)} 판단식을 실험하는 모델 노트입니다.</p><pre>${esc(data.formula)}</pre></aside>
            <main>${Array.from({ length: 64 }, (_, i) => `<i class="${(i + number) % 11 === 0 ? "risk" : (i + number) % 7 === 0 ? "fit" : ""}">${((i * 13 + number) % 99).toString().padStart(2, "0")}</i>`).join("")}</main>
            <aside class="right">${data.actions.map((a, i) => `<button>${esc(a)}<b>${(0.62 + ((i + number) % 30) / 100).toFixed(2)}</b></button>`).join("")}</aside>
        </section>`;
        const css = `body{background:${ink};color:${card}}.${prefix}-formula{height:100vh;display:grid;grid-template-columns:330px 1fr 300px;gap:18px;padding:22px;background:linear-gradient(135deg,${ink},#020617)}.${prefix}-formula aside,.${prefix}-formula main{border:1px solid rgba(255,255,255,.16);border-radius:28px;background:rgba(255,255,255,.06);box-shadow:0 24px 70px rgba(0,0,0,.24)}.${prefix}-formula aside{padding:24px}.${prefix}-formula h1{font-size:34px;line-height:1.05;margin:0}.${prefix}-formula p{color:${soft};line-height:1.7}.${prefix}-formula pre{white-space:pre-wrap;background:#020617;border-radius:16px;padding:16px;color:#a7f3d0}. ${prefix}-formula main{display:grid;grid-template-columns:repeat(8,1fr);gap:9px;padding:18px}. ${prefix}-formula i{display:grid;place-items:center;border-radius:12px;background:rgba(255,255,255,.08);font-style:normal;font-weight:900;color:${soft}}.${prefix}-formula i.risk{background:${accent};color:${card}}.${prefix}-formula i.fit{outline:3px solid ${soft}}.right{display:grid;align-content:start;gap:12px}.right button{height:74px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(255,255,255,.08);color:${card};text-align:left;padding:0 16px;font-weight:950}.right b{float:right;color:${soft}}`;
        return htmlShell(number, "logic", item, body, css);
    }

    if (mode === 2) {
        const body = `<main class="${prefix}-compiler">
            <section class="editor"><h1>${esc(data.app)} Rule Compiler</h1>${data.signals.map((s, i) => `<p><b>rule.${i + 1}</b><span>when ${esc(s)} then ${esc(pick(data.actions, i))}</span></p>`).join("")}</section>
            <section class="preview"><canvas id="${prefix}-canvas" width="780" height="560"></canvas></section>
            <section class="weights">${data.sources.map((s, i) => `<label>${esc(s)}<input type="range" value="${45 + ((number + i * 17) % 50)}" disabled></label>`).join("")}</section>
        </main>`;
        const css = `body{background:${bg};color:${ink}}.${prefix}-compiler{height:100vh;display:grid;grid-template-columns:360px 1fr 300px;gap:18px;padding:22px}.editor,.preview,.weights{border:2px solid ${ink};border-radius:28px;background:${card};box-shadow:8px 8px 0 ${ink}}.editor{padding:24px}.editor h1{font-size:32px;line-height:1.04;margin:0 0 18px}.editor p{border:1px solid ${soft};border-radius:16px;padding:14px}.editor b{display:block;color:${accent}.editor span{display:block}.preview{display:grid;place-items:center;overflow:hidden}.preview canvas{width:100%;height:100%}.weights{padding:20px}.weights label{display:block;margin-bottom:28px;font-weight:950}.weights input{display:block;width:100%;accent-color:${accent};margin-top:12px}`;
        const fixedCss = css.replace(`color:${accent}.editor`, `color:${accent}}.editor`);
        const js = `const c=document.getElementById("${prefix}-canvas"),ctx=c.getContext("2d");let t=0;function draw(){t+=.03;ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle="${bg}";ctx.fillRect(0,0,c.width,c.height);for(let i=0;i<10;i++){ctx.beginPath();ctx.arc(90+i*70,290+Math.sin(t+i)*130,26+i%3*7,0,Math.PI*2);ctx.fillStyle=i%2?"${soft}":"${accent}";ctx.fill();ctx.strokeStyle="${ink}";ctx.lineWidth=4;ctx.stroke();}ctx.fillStyle="${ink}";ctx.font="800 34px Inter";ctx.fillText("${esc(data.objects[0])} decision surface",42,68);requestAnimationFrame(draw)}draw();`;
        return htmlShell(number, "logic", item, body, fixedCss, js);
    }

    const body = `<div class="${prefix}-matrix">
        <header><h1>${esc(data.company)} Logic Matrix</h1><span>${esc(data.formula)}</span></header>
        <section>${Array.from({ length: 100 }, (_, i) => `<i class="${(i * number) % 17 < 4 ? "hot" : ""}" style="opacity:${0.28 + ((i + number) % 70) / 100}"></i>`).join("")}</section>
        <aside>${metricCards(prefix, data, number)}</aside>
    </div>`;
    const css = `body{background:${bg};color:${ink}}.${prefix}-matrix{height:100vh;display:grid;grid-template-rows:82px 1fr;grid-template-columns:1fr 310px;gap:18px;padding:22px}.${prefix}-matrix header{grid-column:1/3;border:2px solid ${ink};border-radius:24px;background:${card};box-shadow:8px 8px 0 ${ink};display:flex;align-items:center;gap:20px;padding:0 22px}.${prefix}-matrix h1{font-size:32px;margin:0}.${prefix}-matrix header span{margin-left:auto;color:${accent};font-weight:950}.${prefix}-matrix section{display:grid;grid-template-columns:repeat(10,1fr);gap:10px;border:2px solid ${ink};border-radius:28px;background:${card};box-shadow:8px 8px 0 ${ink};padding:18px}.${prefix}-matrix section i{border-radius:12px;background:${soft}}.${prefix}-matrix section i.hot{background:${accent}}.${prefix}-matrix aside{border:2px solid ${ink};border-radius:28px;background:${card};box-shadow:8px 8px 0 ${ink};padding:18px}.${prefix}-metric{border:1px solid ${soft};border-radius:18px;padding:14px;margin-bottom:12px}.${prefix}-metric span{display:block}. ${prefix}-metric b{font-size:28px}. ${prefix}-metric i{display:block;width:var(--w);height:8px;border-radius:99px;background:${accent};margin-top:9px}`;
    return htmlShell(number, "logic", item, body, css, animatedMeters(prefix, number));
}

function queueScene(item, number) {
    const data = scenario(item, number);
    const [bg, ink, accent, soft, card] = palette[(number + 5) % palette.length];
    const prefix = `av${pad2(number)}q`;
    const mode = (number + 2) % 4;

    if (mode === 0) {
        const body = `<main class="${prefix}-kanban">
            <header><b>${esc(data.company)}</b><h1>${esc(data.app)} Operations Queue</h1><span>${esc(data.owner)}</span></header>
            <section>${["incoming", "AI ready", "human review", "done"].map((col, c) => `<div class="col"><h2>${col}</h2>${Array.from({ length: 4 + ((number + c) % 2) }, (_, i) => `<article><b>${esc(pick(data.objects, i + c))}-${number}${c}${i}</b><p>${esc(pick(data.actions, i + c))}</p><em>${60 + ((number + i * c + i) % 37)}%</em></article>`).join("")}</div>`).join("")}</section>
        </main>`;
        const css = `body{background:${bg};color:${ink}}.${prefix}-kanban{height:100vh;padding:22px;display:grid;grid-template-rows:82px 1fr;gap:18px}.${prefix}-kanban header{display:flex;align-items:center;gap:18px;border:2px solid ${ink};border-radius:24px;background:${card};box-shadow:8px 8px 0 ${ink};padding:0 22px}.${prefix}-kanban h1{font-size:30px;margin:0}.${prefix}-kanban b{color:${accent}}.${prefix}-kanban header span{margin-left:auto;font-weight:950}.${prefix}-kanban section{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;min-height:0}.col{border:2px solid ${ink};border-radius:26px;background:${card};box-shadow:8px 8px 0 ${ink};padding:16px;overflow:hidden}.col h2{text-transform:uppercase;font-size:14px;letter-spacing:.08em}.col article{border:1px solid ${soft};border-radius:18px;background:${bg};padding:14px;margin-bottom:12px}.col article b{color:${ink};font-size:14px}.col p{color:${ink};opacity:.7}.col em{display:inline-flex;border-radius:99px;background:${accent};color:${card};padding:7px 10px;font-style:normal;font-weight:950}`;
        return htmlShell(number, "queue", item, body, css);
    }

    if (mode === 1) {
        const body = `<section class="${prefix}-command">
            <aside><h1>${esc(data.app)}</h1><p>${esc(item.title)} 실시간 처리 로그</p>${metricCards(prefix, data, number)}</aside>
            <main id="${prefix}-stream"></main>
            <div class="radar">${Array.from({ length: 9 }, (_, i) => `<i style="--x:${18 + ((i * 23 + number) % 62)}%;--y:${16 + ((i * 31 + number) % 64)}%"></i>`).join("")}</div>
        </section>`;
        const css = `body{background:${ink};color:${card}}.${prefix}-command{height:100vh;display:grid;grid-template-columns:320px 1fr 420px;gap:18px;padding:22px;background:radial-gradient(circle at 76% 30%,${accent}55,transparent 34%),${ink}}.${prefix}-command aside,.${prefix}-command main,.radar{border:1px solid rgba(255,255,255,.15);border-radius:28px;background:rgba(255,255,255,.06)}.${prefix}-command aside{padding:22px}. ${prefix}-command h1{font-size:34px;line-height:1.04;margin:0}. ${prefix}-command p{color:${soft};line-height:1.7}.${prefix}-metric{border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:14px;margin-top:12px}. ${prefix}-metric b{font-size:26px}. ${prefix}-metric span{display:block}. ${prefix}-metric i{display:block;width:var(--w);height:8px;border-radius:99px;background:${accent};margin-top:9px}.${prefix}-command main{padding:18px;font-family:ui-monospace,Menlo,monospace;color:#a7f3d0;line-height:1.8;overflow:hidden}.radar{position:relative;overflow:hidden;background-image:repeating-radial-gradient(circle at center,transparent 0 55px,rgba(255,255,255,.15) 56px 58px)}.radar:after{content:"";position:absolute;left:50%;top:50%;width:2px;height:50%;background:${accent};transform-origin:0 0;animation:${prefix}scan 4s linear infinite}.radar i{position:absolute;left:var(--x);top:var(--y);width:16px;height:16px;border-radius:50%;background:${soft};box-shadow:0 0 0 8px ${soft}33}@keyframes ${prefix}scan{to{transform:rotate(360deg)}}`;
        const js = `const ${prefix}s=document.getElementById("${prefix}-stream");const ${prefix}logs=["${data.actions[0]} queued","${data.signals[0]} threshold crossed","owner=${data.owner}","sla.check passed","handoff ticket ${number}-A"];let ${prefix}n=0;setInterval(()=>{const p=document.createElement("p");p.textContent="["+new Date().toLocaleTimeString("ko-KR",{hour12:false})+"] "+${prefix}logs[${prefix}n++%${prefix}logs.length];${prefix}s.prepend(p);while(${prefix}s.children.length>26)${prefix}s.lastElementChild.remove();},430);${animatedMeters(prefix, number)}`;
        return htmlShell(number, "queue", item, body, css, js);
    }

    if (mode === 2) {
        const body = `<main class="${prefix}-mobile">
            <section class="phone"><header>${esc(data.company)}</header>${Array.from({ length: 8 }, (_, i) => `<article><b>${esc(pick(data.actions, i))}</b><p>${esc(pick(data.objects, i))} #${number}${i} · ${esc(pick(data.signals, i))}</p><button>${i % 3 ? "approve" : "inspect"}</button></article>`).join("")}</section>
            <section class="timeline">${Array.from({ length: 12 }, (_, i) => `<i><b>${String(9 + i).padStart(2, "0")}:00</b><span>${esc(pick(data.actions, i))}</span></i>`).join("")}</section>
            <aside><h1>${esc(data.app)}</h1><p>${esc(data.owner)} 모바일 승인 큐</p></aside>
        </main>`;
        const css = `body{background:${bg};color:${ink}}.${prefix}-mobile{height:100vh;display:grid;grid-template-columns:390px 1fr 300px;gap:22px;padding:22px}.phone,.timeline,.${prefix}-mobile aside{border:2px solid ${ink};border-radius:34px;background:${card};box-shadow:8px 8px 0 ${ink}}.phone{padding:18px;overflow:hidden}.phone header{height:46px;border-radius:18px;background:${ink};color:${card};display:grid;place-items:center;font-weight:950}.phone article{border:1px solid ${soft};border-radius:20px;padding:14px;margin-top:12px}.phone p{color:${ink};opacity:.65}.phone button{border:0;border-radius:99px;background:${accent};color:${card};padding:8px 12px;font-weight:950}.timeline{padding:26px;display:grid;gap:11px}.timeline i{display:grid;grid-template-columns:90px 1fr;align-items:center;border-bottom:1px solid ${soft};padding-bottom:10px;font-style:normal}.timeline b{color:${accent}}.${prefix}-mobile aside{padding:24px}. ${prefix}-mobile h1{font-size:36px;line-height:1.04;margin:0}. ${prefix}-mobile aside p{line-height:1.7;color:${ink};opacity:.7}`;
        return htmlShell(number, "queue", item, body, css);
    }

    const body = `<div class="${prefix}-tickets">
        <header><h1>${esc(data.app)} Ticket Router</h1><span>${esc(data.owner)}</span></header>
        <main>${Array.from({ length: 18 }, (_, i) => `<article class="${i % 5 === 0 ? "urgent" : ""}"><b>${esc(pick(data.objects, i))}-${pad3(number)}-${i}</b><span>${esc(pick(data.signals, i))}</span><em>${esc(pick(data.actions, i))}</em></article>`).join("")}</main>
        <aside>${metricCards(prefix, data, number)}</aside>
    </div>`;
    const css = `body{background:${bg};color:${ink}}.${prefix}-tickets{height:100vh;display:grid;grid-template-rows:80px 1fr;grid-template-columns:1fr 310px;gap:18px;padding:22px}.${prefix}-tickets header{grid-column:1/3;border:2px solid ${ink};border-radius:24px;background:${card};box-shadow:8px 8px 0 ${ink};display:flex;align-items:center;gap:18px;padding:0 22px}.${prefix}-tickets h1{font-size:32px;margin:0}.${prefix}-tickets header span{margin-left:auto;color:${accent};font-weight:950}.${prefix}-tickets main{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}. ${prefix}-tickets article,.${prefix}-tickets aside{border:2px solid ${ink};border-radius:22px;background:${card};box-shadow:6px 6px 0 ${ink}}.${prefix}-tickets article{padding:16px}. ${prefix}-tickets article.urgent{background:${soft}}.${prefix}-tickets article b{display:block;font-size:15px}. ${prefix}-tickets article span{display:block;color:${ink};opacity:.68;margin:12px 0}. ${prefix}-tickets article em{font-style:normal;color:${accent};font-weight:950}.${prefix}-tickets aside{padding:18px}.${prefix}-metric{border:1px solid ${soft};border-radius:18px;padding:14px;margin-bottom:12px}.${prefix}-metric b{font-size:28px}. ${prefix}-metric span{display:block}. ${prefix}-metric i{display:block;width:var(--w);height:8px;border-radius:99px;background:${accent};margin-top:9px}`;
    return htmlShell(number, "queue", item, body, css, animatedMeters(prefix, number));
}

function roiScene(item, number) {
    const data = scenario(item, number);
    const [bg, ink, accent, soft, card] = palette[(number + 6) % palette.length];
    const prefix = `av${pad2(number)}r`;
    const mode = (number + 3) % 4;

    if (mode === 0) {
        const body = `<main class="${prefix}-board">
            <header><b>${esc(data.company)}</b><h1>${esc(data.metric)}</h1><span>${esc(item.title)}</span></header>
            <section class="kpis">${["시간 절감", "오류 감소", "자동 처리", "회수 기간"].map((m, i) => `<article><span>${m}</span><b>${i === 3 ? (2 + (number % 5)) + "개월" : (42 + ((number + i * 17) % 48)) + "%"}</b><i style="--w:${50 + ((number + i * 13) % 42)}%"></i></article>`).join("")}</section>
            <section class="chart">${Array.from({ length: 18 }, (_, i) => `<i style="--h:${42 + ((i * number + 31) % 230)}px"></i>`).join("")}</section>
        </main>`;
        const css = `body{background:${bg};color:${ink}}.${prefix}-board{height:100vh;padding:24px;display:grid;grid-template-rows:86px 170px 1fr;gap:18px}.${prefix}-board header,.kpis article,.chart{border:2px solid ${ink};border-radius:28px;background:${card};box-shadow:8px 8px 0 ${ink}}.${prefix}-board header{display:flex;align-items:center;gap:18px;padding:0 24px}. ${prefix}-board h1{font-size:38px;margin:0}. ${prefix}-board header b{color:${accent}}. ${prefix}-board header span{margin-left:auto;font-weight:950}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.kpis article{padding:18px}.kpis span{display:block;color:${ink};opacity:.7}.kpis b{display:block;font-size:38px;margin-top:12px}.kpis i{display:block;width:var(--w);height:10px;border-radius:99px;background:${accent};margin-top:14px}.chart{display:flex;align-items:end;gap:14px;padding:24px}.chart i{flex:1;height:var(--h);border-radius:18px 18px 6px 6px;background:linear-gradient(180deg,${accent},${soft});border:1px solid ${ink}44}`;
        return htmlShell(number, "roi", item, body, css);
    }

    if (mode === 1) {
        const body = `<section class="${prefix}-memo">
            <article><p>Executive ROI Note</p><h1>${esc(data.app)}</h1><h2>${esc(data.metric)}</h2><div>${data.actions.map((a, i) => `<span>${esc(a)} · ${58 + ((number + i * 8) % 35)}%</span>`).join("")}</div></article>
            <aside>${Array.from({ length: 7 }, (_, i) => `<i><b>week ${i + 1}</b><em>${(14 + ((number * i + 9) % 60))}h saved</em></i>`).join("")}</aside>
        </section>`;
        const css = `body{background:${ink};color:${card}}.${prefix}-memo{height:100vh;display:grid;grid-template-columns:1fr 360px;gap:22px;padding:28px;background:radial-gradient(circle at 20% 20%,${accent}55,transparent 32%),${ink}}.${prefix}-memo article,.${prefix}-memo aside{border:1px solid rgba(255,255,255,.15);border-radius:34px;background:rgba(255,255,255,.07);box-shadow:0 24px 80px rgba(0,0,0,.26)}.${prefix}-memo article{padding:48px}. ${prefix}-memo p{color:${soft};font-weight:950;text-transform:uppercase}. ${prefix}-memo h1{font-size:62px;line-height:.98;letter-spacing:-.06em;margin:0;max-width:820px}. ${prefix}-memo h2{font-size:42px;color:${soft};margin:30px 0}. ${prefix}-memo span{display:inline-flex;border-radius:999px;background:rgba(255,255,255,.1);padding:12px 14px;margin:8px 8px 0 0;font-weight:900}.${prefix}-memo aside{padding:22px;display:grid;gap:12px}. ${prefix}-memo aside i{border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:16px;font-style:normal}. ${prefix}-memo aside b{display:block;color:${soft}}. ${prefix}-memo aside em{display:block;font-size:28px;font-style:normal;font-weight:950;margin-top:6px}`;
        return htmlShell(number, "roi", item, body, css);
    }

    if (mode === 2) {
        const body = `<main class="${prefix}-waterfall">
            <aside><h1>${esc(item.title)}</h1><p>${esc(data.company)} 비용/효용 분해</p></aside>
            <section>${Array.from({ length: 9 }, (_, i) => `<article class="${i % 3 === 0 ? "gain" : ""}" style="--h:${70 + ((i * 29 + number) % 310)}px"><b>${esc(pick([...data.actions, ...data.signals], i))}</b><i></i><span>${i % 3 === 0 ? "+" : "-"}${12 + ((number + i * 7) % 44)}%</span></article>`).join("")}</section>
        </main>`;
        const css = `body{background:${bg};color:${ink}}.${prefix}-waterfall{height:100vh;display:grid;grid-template-columns:310px 1fr;gap:22px;padding:24px}. ${prefix}-waterfall aside,.${prefix}-waterfall section{border:2px solid ${ink};border-radius:32px;background:${card};box-shadow:8px 8px 0 ${ink}}.${prefix}-waterfall aside{padding:26px}. ${prefix}-waterfall h1{font-size:38px;line-height:1.04;margin:0}. ${prefix}-waterfall p{line-height:1.7;color:${accent};font-weight:950}.${prefix}-waterfall section{display:grid;grid-template-columns:repeat(9,1fr);align-items:end;gap:12px;padding:24px}. ${prefix}-waterfall article{display:grid;grid-template-rows:70px 1fr 40px;align-items:end}. ${prefix}-waterfall article b{font-size:12px;line-height:1.2}. ${prefix}-waterfall article i{display:block;height:var(--h);border-radius:18px 18px 6px 6px;background:${soft};border:1px solid ${ink}44}. ${prefix}-waterfall article.gain i{background:${accent}}. ${prefix}-waterfall article span{font-weight:950;color:${accent};font-size:18px;margin-top:10px}`;
        return htmlShell(number, "roi", item, body, css);
    }

    const body = `<div class="${prefix}-cohort">
        <header><h1>${esc(data.app)} Impact Cohort</h1><b>${esc(data.metric)}</b></header>
        <section class="rings">${Array.from({ length: 5 }, (_, i) => `<article style="--p:${45 + ((number + i * 11) % 48)}"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="46"/><circle class="on" cx="60" cy="60" r="46"/></svg><span>${esc(pick(data.objects, i))}</span></article>`).join("")}</section>
        <section class="notes">${data.signals.map((s, i) => `<p><b>${esc(s)}</b><em>${esc(pick(data.actions, i))}</em></p>`).join("")}</section>
    </div>`;
    const css = `body{background:${bg};color:${ink}}.${prefix}-cohort{height:100vh;display:grid;grid-template-rows:86px 1fr 210px;gap:18px;padding:24px}.${prefix}-cohort header,.rings,.notes{border:2px solid ${ink};border-radius:30px;background:${card};box-shadow:8px 8px 0 ${ink}}.${prefix}-cohort header{display:flex;align-items:center;gap:18px;padding:0 24px}. ${prefix}-cohort h1{font-size:34px;margin:0}. ${prefix}-cohort header b{margin-left:auto;color:${accent};font-size:24px}.rings{display:grid;grid-template-columns:repeat(5,1fr);gap:18px;padding:26px}.rings article{display:grid;place-items:center}.rings svg{width:150px}.rings circle{fill:none;stroke:${soft};stroke-width:16}.rings circle.on{stroke:${accent};stroke-dasharray:calc(var(--p)*2.9) 290;transform:rotate(-90deg);transform-origin:center}.rings span{font-weight:950}.notes{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:18px}.notes p{border:1px solid ${soft};border-radius:18px;padding:16px;margin:0}.notes b{display:block}.notes em{display:block;margin-top:12px;color:${accent};font-style:normal;font-weight:950}`;
    return htmlShell(number, "roi", item, body, css);
}

const builders = { data: dataScene, logic: logicScene, queue: queueScene, roi: roiScene };

const requested = process.argv.slice(2).length
    ? process.argv.slice(2).map((value) => Number(value))
    : manifest.map((item) => Number(item.id.replace("case-", "")));

const htmlFiles = [];
for (const number of requested) {
    const item = manifest[number - 1];
    if (!item) continue;
    for (const variant of variants) {
        const html = builders[variant](item, number);
        const file = path.join(sceneDir, `case-${pad3(number)}-${variant}.html`);
        await writeFile(file, html);
        htmlFiles.push({ number, variant, file });
    }
}

function captureOne(entry) {
    const id = pad2(entry.number);
    const png = path.join(captureDir, `case-capture-${id}-${entry.variant}.png`);
    return new Promise((resolve) => {
        execFile(chrome, [
            "--headless",
            "--disable-gpu",
            "--hide-scrollbars",
            "--virtual-time-budget=1800",
            "--window-size=1440,900",
            `--screenshot=${png}`,
            `file://${entry.file}`
        ], (error) => {
            resolve({ ok: !error, file: path.relative(root, entry.file), png: path.relative(root, png), error: error?.message });
        });
    });
}

const concurrency = 6;
const captured = [];
const queue = [...htmlFiles];
const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
        const entry = queue.shift();
        captured.push(await captureOne(entry));
    }
});

await Promise.all(workers);

const failed = captured.filter((item) => !item.ok);
console.log(JSON.stringify({
    htmlCreated: htmlFiles.length,
    captured: captured.length - failed.length,
    failed
}, null, 2));
