/* 鱼尾狮多语言水帘 —— 可嵌入组件
 *
 *   import { mountMerlion } from './merlion.js';
 *   const scene = mountMerlion('#stage', { chrome:false, title:false });
 *   scene.destroy();
 *
 * 容器高度用 CSS 变量给：#stage { --kc-height: 620px; }
 * 设计与踩坑记录见同目录 PLAN.md，嵌入规范见 docs/EMBEDDING.md。 */

export const DEFAULTS = {
  chrome:   true,          // 顶部条：品牌 + 导航 + 昼夜/声音/配置按钮
  title:    true,          // 左下标题区
  hud:      true,          // 进度条 + 拨动计数
  cursor:   true,          // 自定义圆环光标
  settings: true,          // 配置面板（chrome:false 时自动关闭）

  brand:       '新加坡',
  brandSuffix: ' · Singapore',
  nav:      [{ label: '首页', href: '#' }, { label: '地标', href: '#' }, { label: '社区', href: '#' }],
  eyebrow:  '新加坡 (Singapore) / 四种语言之间',
  heading:  'Singapore',
  ariaLabel: '鱼尾狮吐出的水弧展开成可拨动的水帘，英语、中文、马来语与泰米尔语的短词顺着水流从嘴部漂向海面',
  backdropImage: 'merlion-scene.jpg',
  backdropAlt:   '新加坡鱼尾狮立在滨海湾岸边的石基座上，面朝右方，远处是滨海湾金沙与艺术科学博物馆',

  /* 界面文案：嵌入时按宿主语言覆盖（见 docs/EMBEDDING.md）。soundOn/soundOff 给单字符就是图标按钮，给词就变成带字的胶囊 */

  labels: { theme: '切换昼夜主题', sound: '开关声音', soundOn: '♪', soundOff: '✕', settings: '配置', counter: '水帘拨动' },

  sound: 'off',            // ★ 作品集惯例：默认关闭
  theme: 'day',
  persistTheme: false,     // 嵌入时别写 localStorage
  pauseOffscreen: true,
  words: null,             // 给数组即覆盖 words.txt，且不再发 fetch
  arcWords: null,          // 主带的城市名四语组
  assetBase: 'assets/',
  allowUrlOverrides: false
};

const esc = s => String(s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ★ DOM 由 JS 按 options 生成，不由 HTML 提供。
   关掉一个部件是传 false，不是删标签 —— 于是没有 null 可踩。 */
function markup(o) {
  const chars = [...String(o.heading)].map(c => `<span class="ag-char">${esc(c)}</span>`).join('');
  const nav = (o.nav || []).map(n => `<a href="${esc(n.href || '#')}">${esc(n.label)}</a>`).join('');
  return `
<main class="artboard">
  <img class="scene" src="${esc(o.assetBase + o.backdropImage)}"
       alt="${esc(o.backdropAlt)}" width="1586" height="992" fetchpriority="high" decoding="async">
  <div class="nightwash" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>

  <canvas class="water" aria-label="${esc(o.ariaLabel)}"></canvas>
${o.chrome ? `  <header class="masthead">
    <a class="brand" href="#">${esc(o.brand)}<span class="brand-en">${esc(o.brandSuffix)}</span></a>
    <nav class="nav-links" aria-label="Primary">${nav}</nav>
    <div class="masthead-actions">
      <button class="toggle-btn toggle-theme" type="button" title="${esc(o.labels.theme)}" aria-label="${esc(o.labels.theme)}">☀</button>
      <button class="toggle-btn toggle-sound${[...String(o.labels.soundOn)].length > 1 ? ' is-text' : ''}" type="button" title="${esc(o.labels.sound)}" aria-label="${esc(o.labels.sound)}">${esc(o.sound === 'on' ? o.labels.soundOn : o.labels.soundOff)}</button>
      ${o.settings ? `<button class="configure" type="button" aria-expanded="false">${esc(o.labels.settings)}</button>` : ''}
    </div>
  </header>` : ''}
${o.title ? `  <section class="headline">
    ${o.eyebrow ? `<p class="eyebrow">${esc(o.eyebrow)}</p>` : ''}
    <h1>${chars}<span class="rule"></span></h1>
  </section>` : ''}
${o.hud ? `  <div class="progress" aria-hidden="true"></div>
  <div class="counter" aria-hidden="true">${esc(o.labels.counter)} · 0</div>` : ''}
${o.cursor ? '  <div class="cursor" aria-hidden="true"></div>' : ''}
${o.chrome && o.settings ? `  <aside class="settings" hidden>
    <div class="setting"><label>Flow <output data-kc-out="flow">100</output></label><input data-kc="flow" type="range" min="20" max="220" value="100"></div>
    <div class="setting"><label>Text <output data-kc-out="textsize">30</output></label><input data-kc="textsize" type="range" min="16" max="46" value="30"></div>
    <div class="setting"><label>Strength <output data-kc-out="strength">88</output></label><input data-kc="strength" type="range" min="20" max="140" value="88"></div>
    <div class="setting"><label>Reach <output data-kc-out="reach">52</output></label><input data-kc="reach" type="range" min="20" max="110" value="52"></div>
    <div class="setting"><label>Heal <output data-kc-out="heal">92</output></label><input data-kc="heal" type="range" min="70" max="99" value="92"></div>
    <button class="reset-btn" type="button">Reset curtain</button>
  </aside>` : ''}
</main>`;
}

let seq = 0;

export function mountMerlion(host, options = {}) {
  const opt = { ...DEFAULTS, ...options };
  opt.labels = { ...DEFAULTS.labels, ...(options.labels || {}) };
  if (!opt.chrome) opt.settings = false;
  const root = typeof host === 'string' ? document.querySelector(host) : host;
  if (!root) throw new Error('mountMerlion: 找不到容器元素 ' + host);

  const n = ++seq;
  const THEME_KEY = 'merlion-theme-' + n;
  root.classList.add('merlion-scene');
  if (opt.cursor) root.classList.add('has-cursor');
  root.innerHTML = markup(opt);

  const cleanup = [];
  const on = (t, ev, fn, o2) => {
    t.addEventListener(ev, fn, o2);
    cleanup.push(() => t.removeEventListener(ev, fn, o2));
  };

  let onScreen = true;                 // 由 IntersectionObserver 维护
  const DEBUG = opt.allowUrlOverrides &&
                new URLSearchParams(location.search).has('debug');
  /* ═══════════════════════════════════════════════════════════════
   *  Singapore / 鱼尾狮 —— 多语言水帘
   *
   *  和前三篇最大的架构分歧：这里的节点不是「材料点」，是「空间点」。
   *  天坛的珠子、金门的钢索都是同一块材料始终待在原地，所以「推开→弹回原位」
   *  是对的。水不是：每个位置上的水一直在换。照抄 Verlet + shapeK 会得到
   *  一条被推歪再弹回原处的绳子 —— 那是珠帘换了个颜色，不是水。
   *
   *  所以这里没有求解器：
   *    静止形态 = 解析弹道抛物线（不需要迭代）
   *    扰动     = 一维法向偏移场 u[]，每帧被「平流」到下游，上游补 0
   *  判据只有一条：指针划一道，缺口要顺流冲走，手边立刻被上游新水补满。
   * ═══════════════════════════════════════════════════════════════ */

  /* ---- 底图标定（从 assets/merlion-scene.jpg 上逐像素量出来的）----
     全部是归一化坐标，跟着图一起缩放。量错了水就从脸上喷出来。 */
  const IMG = {
    w: 1586, h: 992,
    mouthX: 344 / 1586,     // 0.2169  嘴的出水口（张口前缘），逐像素量出来的
    mouthY: 233 / 992,      // 0.2349
    aperture: 17 / 992,     // 嘴的开口高度 → 各道在起点铺开一点，不从一个数学点出发
    bayY: 0.760             // 落水线：海面中距。地平线实测在 .718，
                            // 落在地平线上等于水飞了几公里，压到 .760 才像落在中距海面
  };

  /* ═══════════════════════════════════════════════
   *  水弧几何：弹道抛物线，落进海里
   *
   *  这里一度改成交接包那族近乎水平的贝塞尔（最大 21°、从右边缘出画）。
   *  压平确实让字好读了，但丢掉了「水砸进海里」这件事。
   *
   *  ★ 关键认识：上一版的可读性提升，只有一条依赖压平。
   *    字号 13→23px、宽水带当底衬、四条带每条 1–2 词、流速减半 —— 这四条
   *    在陡弧上一样成立。陡弧唯一的害处是「字跟着切线转立」，
   *    那就直接治这一条：rotCap 给文字角度封顶（见 drawWords）。
   *    于是可读性集中在上游平缓段，真实感集中在下游陡段，两者不抢地方。
   * ═══════════════════════════════════════════════ */
  const ARC = {
    m: -0.20,        // 出嘴切线斜率（负 = 略向上），波峰高出嘴约 16px
    landNear: 0.70,  // 最慢那道的落点（视口宽比例）
    landFar:  0.95,  // 最快那道的落点
    seg: 9,          // 节点弧长间距

    /* ★ 四条水带（定稿 sg-d 概念稿）。
       u=1.00 是最平最长那条 —— 主带，挂城市名当锚；其余三条跑四语词表。
       曾经用过 10 条（4 宽带 + 6 细流线），但颗粒质感一上来，
       细流线只是把画面弄脏，band 之间反而分不开。四条就够。 */
    lanes:       [1.00, 0.76, 0.53, 0.31],
    lanesNarrow: [1.00, 0.70, 0.40],

    /* 颗粒喷雾：参考图的水是「带身 + 颗粒」两层。
       只留颗粒 → 正常观看距离上平均成一片灰雾，整条带消失；
       只留带身 → 变成实心色块，空气感全丢。两层都要。 */
    halfA: 2.2, halfB: 13.5,   // 带半宽：嘴部 → 下游
    densA: 22,  densB: 9,      // 每节点颗粒数：嘴部 → 下游递减
    bodyAlpha: .26,            // 带身不透明度（嘴部）
    grainStride: 2,            // 每隔几个节点撒一次颗粒（性能）

    /* ★ 34 → 50。这个门槛是「字跟着切线转」时代的遗物：那时切线一陡字就立得读不了。
       现在有 rotCap，字最多只转 14°，切线 50° 的带上照样是平着的字。
       门槛卡在 34° 的副作用是：每条带只有嘴部那一小段能放词，
       而嘴部恰恰是四条带还没分开的地方 —— 四条带的词于是全糊在一起。 */
    wordDeg: 50,
    /* ★ 每条带的词依次往下游错开，形成左上→右下的对角线（定稿概念稿就是这样排的）。
       只靠 flowWord 的随机相位不够：四条带在嘴部间距只有十几 px，
       必须让它们在「不同的 x」上出现，垂直方向才拉得开。
       ★ 错开量要按「各自射程的比例」给，不能给绝对 px ——
         越陡的带射程越短（实测 1053 / 968 / 889 / 810），
         绝对错开量会把最后几条带直接推出射程，一个词都不剩。 */
    wordFrac0: .16, wordFracStep: .20,   // 实测 .20/.16 时相邻带的词只差 136px，仍会撞
    breakStart: 40,  // 水带从这里开始碎（真实水柱只在快入水才散）
    breakEnd: 48,    // 到这里基本碎光（入水约 47.6°）
    rotCap: 14,      // ★ 文字角度上限：水带可转到 47°，字最多转 14°

    xGap: 620,       // 词槽间距：配合错开，每条带同屏留 1–2 个词
    wordStart: .06,
    wordMinPx: 210,  // 嘴部收拢区不放词，否则四条带的词重叠
    wordFont: 30     /* ★ 23（读不出）→ 42（太大）→ 33 → 30 定稿。
                        真正决定可读性的是「字号 + 外晕」，不是一味放大。 */
  };

  const NARROW = 720;

  /* ---- 物理 ---- */
  const physics = {
    flow: 1.0,        // 流速倍率（配置面板）
    strength: .88,    // 指针冲量
    radius: 52,       // 指针半径
    heal: .92,        // 扰动衰减（越大余波越长）
    springK: .16,     // 涟漪回复
    vxWord: 104,      // ★ 词的流速 236 → 104 px/s：一个词横穿可读区约 10 秒
    vxDrop: 250       // ★ 水滴纹理 620 → 250。仍比词快 2.4 倍
                      //   ——「水要快 / 字要慢」还是两个速度，只是整体降下来了
  };
  /* ---- DOM（全部从场景根查，不用 getElementById）---- */
  const artboard  = root.querySelector('.artboard');
  const sceneImg  = root.querySelector('.scene');
  const canvas    = root.querySelector('.water');
  const ctx       = canvas.getContext('2d');
  const cursor    = root.querySelector('.cursor');        // cursor:false 时为 null
  const configure = root.querySelector('.configure');     // settings:false 时为 null
  const settings  = root.querySelector('.settings');
  const resetBtn  = root.querySelector('.reset-btn');
  const counterEl = root.querySelector('.counter');       // hud:false 时为 null
  let width = 0, height = 0, dpr = 1, narrow = false;
  let rafId = null, lastT = 0, interactionCount = 0;
  let soundEnabled = false;          // ★ 正式作品集里声音默认关闭（设计文档第 8 节）
  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const streams = [];
  const splashes = [];
  const mouse = { x:-999, y:-999, oldX:-999, oldY:-999, active:false };

  /* ═══════════════════════════════════════════════
   *  1. 文字源：四元组（en | zh | ms | ta）
   * ═══════════════════════════════════════════════ */
  const LANGS = ['en','zh','ms','ta'];          // ★ 顺序 = MRT 报站顺序
  let WORDS = [
    ['Hope','希望','Harapan','நம்பிக்கை'],
    ['Light','光明','Cahaya','ஒளி'],
    ['Unity','团结','Perpaduan','ஒற்றுமை'],
    ['Peace','和平','Kedamaian','அமைதி'],
    ['Community','社区','Komuniti','சமூகம்'],
    ['Opportunity','机会','Peluang','வாய்ப்பு'],
    ['Innovation','创新','Inovasi','புதுமை'],
    ['Technology','科技','Teknologi','தொழில்நுட்பம்'],
    ['Progress','进步','Kemajuan','முன்னேற்றம்'],
    ['Beautiful','美好','Indah','அழகு']
  ];
  let ARC_WORDS = ['Singapore','新加坡','Singapura','சிங்கப்பூர்'];

  /* ★ Tamil 有组合字符：[...str] / split('') 会把一个字拆成基字 + 元音符号
     两个孤立块，直接出错字。四种语言统一走 grapheme 切分。
     Intl.Segmenter 自 2024-04 起是 Baseline，不需要 polyfill。 */
  /* ★ 现在只用整词 fillText，不再逐字形摆字，所以 graphemeRun / splitGraphemes
     一并删掉了。Canvas 的 fillText 会走平台的文字塑形引擎，Tamil 的元音符号、
     连写全部由它处理 —— 比我自己按 grapheme 摆更安全。
     （之前需要逐字形，是因为下游要把词「甩散」；那一段现在没有字了。） */

  /* ★ 字号从 13px 提到 23px（设计稿 27px@1586，1440 宽时约 24.5px）。
     四种文字视觉重量差很大 —— Tamil 圆而高、中文方而满、拉丁窄 ——
     所以字号和不透明度都按语言各给一份补偿，否则并排会显得不齐。
     字号跟着视口缩放，窄屏不至于把一个词撑出水带。 */
  let FONTS = {};
  /* 拉丁字族定稿：Cormorant Garamond 600。
     比过 Spectral / Instrument Serif / Playfair —— 选它的理由有两条：
     ① 高对比、笔画有提按，和中文衬线是同一种「毛笔来的对比」，四种文字并排气质统一；
     ② 设计文档硬要求「四语文字视觉权重相等」，Instrument Serif 在 30px 上
        拉丁明显比中文轻，直接出局；Cormorant 用 600 字重刚好站得住。
     ★ 1.13 是 x-height 补偿：Cormorant 小字面，同号数看着比别家小一圈。 */
  const LATIN = '"Cormorant Garamond", Georgia, serif';
  const LATIN_W = 600, LATIN_K = 1.13;

  function buildFonts(scale) {
    // 各家 x-height 差很多：Cormorant 小字面，同号数看着更小，用第三个系数补回来
    const S = ARC.wordFont * scale * LATIN_K;
    /* ★ 全部走衬线，且拉丁用 Playfair Display —— 和左下角那个 Singapore 大标题同一款。
       水上的词与标题于是是同一个声音，而不是「标题衬线 + 水上 UI 无衬线」两套。
       （接进真场景时一度误写成 Inter，那是回归：批准的概念稿用的就是 Playfair。）
       字重取 400 而非 500：display 衬线在这个尺寸上，细一点才优雅，粗了发糊。
       Tamil 用 Noto Serif Tamil —— 交接包 design-spec.json 的字体表里它是第一顺位。 */
    FONTS = {
      en: `${LATIN_W} ${(S).toFixed(1)}px ${LATIN}`,
      ms: `${LATIN_W} ${(S * .97).toFixed(1)}px ${LATIN}`,
      zh: `400 ${(S * 1.04 / LATIN_K).toFixed(1)}px "Noto Serif SC", "Songti SC", serif`,
      ta: `400 ${(S * .95 / LATIN_K).toFixed(1)}px "Noto Serif Tamil", "Noto Sans Tamil", serif`
    };
  }
  buildFonts(1);
  /* ★ 四语「视觉权重相等」的补偿系数，不是拍脑袋估的，是量出来的。
     方法：把每种语言的词画到离屏画布，算墨迹覆盖率 ÷ 字形包围面积（归一化掉词长）。
     字重组合试了 12 种，当前这套（拉丁 600 / 中文 400 / 泰米尔 400）
     离散度最小 = 1.205×，已是最优；剩下的差用不透明度补平：

         ms .187（最轻）→ 1.00
         en .202        → .93
         zh .210        → .89
         ta .226（最重）→ .83

     ★ 教训：第一次量出来是 1.46×、且拉丁最重 —— 那是 Cormorant 还没加载完，
       量到的其实是 Georgia 回退字体。测字体一定要先 await document.fonts.ready，
       而且要确认 document.fonts.check 真的为 true。 */
  const LANG_ALPHA = { ms:1, en:.93, zh:.89, ta:.83 };

  /* ═══════════════════════════════════════════════
   *  2. 几何：底图 → 画板坐标
   * ═══════════════════════════════════════════════ */
  /* object-fit:cover + object-position:left center 的反解。
     底图被怎么裁，嘴就跟着走到哪 —— 任何视口下水都从嘴里出来。 */
  /* ★ 窄屏必须把底图往左推。
     宽屏左对齐时嘴在 .217W，右边有 78% 的宽度给水弧。
     竖屏（如 390×844）按高铺满后底图宽 1349px，左对齐会把嘴推到 .75W ——
     只剩 77px 射程却要落 443px，抛物线被压成一根竖钩，正是金门篇
     「垂度不能按视口高度写」的同一个坑。把嘴锚回 22% 处，射程回到 284px。 */
  function sceneAnchor() { return narrow ? .216 : 0; }

  function imageRect() {
    const ar = IMG.w / IMG.h;
    let w, h;
    if (width / height > ar) { w = width;  h = width / ar; }   // 视口更宽 → 按宽铺满，上下裁
    else                     { h = height; w = height * ar; }  // 视口更高 → 按高铺满，左右裁
    return { x: (width - w) * sceneAnchor(), y: (height - h) / 2, w, h };
  }
  const mapX = (nx, r) => r.x + nx * r.w;
  const mapY = (ny, r) => r.y + ny * r.h;

  /* ═══════════════════════════════════════════════
   *  3. 建水帘
   * ═══════════════════════════════════════════════ */
  function build() {
    streams.length = 0; splashes.length = 0;
    const r = imageRect();
    // CSS 与 JS 共用同一个锚点，绝不让两边算出不同的裁切
    sceneImg.style.objectPosition = `${(sceneAnchor() * 100).toFixed(2)}% 50%`;
    buildFonts(r.w / 1586);            // 字号跟着底图一起缩放

    const mouth = { x: mapX(IMG.mouthX, r), y: mapY(IMG.mouthY, r) };
    /* ★ 落水线只能取底图上真实的海面。曾为了让窄屏的弧平缓一点把它抬到 .615，
       结果水落在半空、涟漪浮在天上 —— 那是底图纵向比例，海在图上就在 .718 以下。 */
    const bayY = mapY(IMG.bayY, r);
    const aperPx = IMG.aperture * r.h;

    const LANES = narrow ? ARC.lanesNarrow : ARC.lanes;
    const m = ARC.m;

    const far  = Math.min(ARC.landFar * width, width - 18);
    const near = Math.max((narrow ? .52 : ARC.landNear) * width,
                          mouth.x + (far - mouth.x) * .34);
    const runFar  = Math.max(60, far  - mouth.x);
    const runNear = Math.max(40, near - mouth.x);
    const drop    = Math.max(40, bayY - mouth.y);

    const Cfast = (drop - m * runFar)  / (runFar  * runFar);
    const Cslow = (drop - m * runNear) / (runNear * runNear);
    /* 扇形不需要「展开」逻辑：同角度、变初速的抛物线族共享同一条起始切线，
       嘴边几乎重合，越往下游越分开 —— 就是「靠近鱼尾狮时集中，向外分散」。 */
    const fracMin = Math.sqrt(Cfast / Cslow);
    const sc = r.w / 1586;

    for (let i = 0; i < LANES.length; i++) {
      const u = LANES[i];
      const vxFrac = fracMin + (1 - fracMin) * Math.pow(u, .85);
      const C = Cfast / (vxFrac * vxFrac);
      const y0 = mouth.y + (i / (LANES.length - 1) - .5) * aperPx;

      const pts = [];
      let x = 0;
      while (pts.length < 700) {
        const py = y0 + m * x + C * x * x;
        if (py > bayY) break;                   // ★ 碰到海面就结束
        const slope = m + 2 * C * x;
        const inv = 1 / Math.hypot(1, slope);
        pts.push({ x: mouth.x + x, y: py, mx: x,
                   tx: inv, ty: slope * inv,
                   nx: -slope * inv, ny: inv,
                   slope, stretch: 1 / inv });
        x += ARC.seg * inv;
      }
      if (pts.length < 6) continue;

      const n = pts.length;
      const st = {
        pts, n, vxFrac, band: i,
        uArr: new Float32Array(n), w: new Float32Array(n),
        tu: new Float32Array(n), tw: new Float32Array(n),
        shift: new Float32Array(n),
        runMax: pts[n - 1].mx,
        flowWord: Math.random() * ARC.xGap,
        flowDrop: Math.random() * 200,
        /* ★ 内容模型：band 0（最平最长的主带）挂城市名当锚，
           其余三条跑四语词表，各以一种语言起头再顺流循环。
           只放城市名信息量太薄；全跑词表又少了「这里是哪」的支点。 */
        isAnchor: i === 0,
        lang: i % 4,
        wordSeed: (i * 3) % WORDS.length,
        halfA: ARC.halfA * sc, halfB: ARC.halfB * sc,
        wordMin: Math.max(ARC.wordMinPx,
                          pts[n - 1].mx * (ARC.wordFrac0 + i * ARC.wordFracStep)),
        landX: pts[n - 1].x,
        lastDrip: 0
      };
      for (let k = 0; k < n; k++) st.shift[k] = pts[k].stretch / ARC.seg;
      streams.push(st);
    }
    hero.rect = r; hero.mouth = mouth; hero.bayY = bayY;
  }
  const hero = { mouth:{x:0,y:0}, bayY:0, rect:null };

  /* ═══════════════════════════════════════════════
   *  4. 物理：平流 + 弹簧阻尼
   * ═══════════════════════════════════════════════ */
  /* ★ 这一步就是全部的「水感」。
     偏移场整体朝下游挪，上游补 0（新流进来的水是干净的）。
     于是指针划出的缺口会离开指针往下游走，手边立刻被补满 —— 这是水。
     Verlet 做不到这件事：它的节点是材料点，只会原地弹回去。 */
  function advect(st, dtx) {
    const { n, uArr: u, w, tu, tw, shift } = st;
    for (let i = 0; i < n; i++) {
      const src = i - shift[i] * dtx;
      if (src <= 0) { tu[i] = 0; tw[i] = 0; continue; }
      const i0 = src | 0, f = src - i0;
      const i1 = i0 + 1 < n ? i0 + 1 : n - 1;
      tu[i] = u[i0] * (1 - f) + u[i1] * f;
      tw[i] = w[i0] * (1 - f) + w[i1] * f;
    }
    u.set(tu); w.set(tw);
  }

  function relax(st) {
    const { n, uArr: u, w } = st;
    const k = physics.springK, d = physics.heal;
    for (let i = 0; i < n; i++) {
      w[i] = (w[i] - u[i] * k) * d;
      u[i] += w[i];
    }
  }

  /* 指针冲量：只取垂直于股线的分量（沿股线的分量削弱）——
     和金门篇 perpGain / axialGain 同一手法，「被拨开」而不是「被拖走」。 */
  function pushStream(st, si, mx, my, speed) {
    const { n, pts, uArr: u } = st;
    const R = physics.radius;
    let strongest = 0, hitX = 0, hitY = 0;
    for (let i = 1; i < n; i++) {
      const p = pts[i];
      const px = p.x + p.nx * u[i], py = p.y + p.ny * u[i];
      const dist = Math.hypot(px - mouse.oldX, py - mouse.oldY);
      if (dist >= R) continue;
      const falloff = 1 - dist / R;
      const perp = mx * p.nx + my * p.ny;          // 法向分量
      u[i] += perp * falloff * physics.strength;
      if (speed * falloff > strongest) { strongest = speed * falloff; hitX = px; hitY = py; }
    }
    if (strongest > 0) {
      drip(st, si, strongest, hitX);
      if (strongest > 3) spawnSplash(hitX, hitY, Math.min(4, strongest / 5));
    }
    return strongest;
  }

  function injectPointer() {
    if (!mouse.active) return;
    const mx = mouse.x - mouse.oldX, my = mouse.y - mouse.oldY;
    const speed = Math.hypot(mx, my);
    if (speed < .01 || speed > 90) return;
    let any = 0;
    for (let i = 0; i < streams.length; i++) any += pushStream(streams[i], i, mx, my, speed);
    /* ★ 一次指针移动只记一次。按股线记的话，16 条股线一帧就 +16，
       划两秒计数器就冲到四位数，这个数字立刻失去意义。 */
    if (any > 0) registerInteraction();
  }

  /* ═══════════════════════════════════════════════
   *  5. 飞溅粒子（落点带 + 指针接触点）
   * ═══════════════════════════════════════════════ */
  function spawnSplash(x, y, n) {
    for (let i = 0; i < n; i++) {
      if (splashes.length > 220) break;
      const a = -Math.PI * (.15 + Math.random() * .7);
      const v = 34 + Math.random() * 92;
      splashes.push({ x, y, vx: Math.cos(a) * v * (Math.random() < .3 ? -.4 : 1), vy: Math.sin(a) * v,
                      life: 1, r: .8 + Math.random() * 1.5 });
    }
  }
  function stepSplash(dt) {
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.vy += 900 * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.life -= dt * 1.5;
      if (s.life <= 0 || s.y > height + 20) splashes.splice(i, 1);
    }
  }

  /* ═══════════════════════════════════════════════
   *  6. 声音：水泡是单模态 —— 没有泛音列
   *
   *  滴水声来自入水时卷入的小气泡共振（Minnaert 呼吸模态）。
   *  这是三篇最干净的对比，不是「调了不同参数」，是三种不同的物理：
   *    天坛  1 / 2.01 / 3.96      编钟：被压缩的泛音    523–1760Hz  0.7–1.0s
   *    金门  1 / 2.003 / 3.012…   钢弦：被拉伸的泛音    130–440Hz   1.6–2.4s
   *    鱼尾狮 只有基频，无分音      气泡：本就没有泛音列  1200–3000Hz 0.04–0.09s
   *  ★ 衰减过程中音高上滑，是「水」的听觉签名；没有它就只是个电子点击。
   * ═══════════════════════════════════════════════ */
  const sound = { context:null, out:null, noise:null, lastGlobal:0, voices:0 };

  function unlockSound() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!sound.context) {
      const c = new AC();
      const out = c.createGain(); out.gain.value = .5;
      const comp = c.createDynamicsCompressor();
      comp.threshold.value = -22; comp.ratio.value = 4;
      const delay = c.createDelay(.4); delay.delayTime.value = .17;
      const fb = c.createGain(); fb.gain.value = .18;
      const wet = c.createGain(); wet.gain.value = .16;
      out.connect(comp); out.connect(delay);
      delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(comp);
      comp.connect(c.destination);
      // 一次性生成 2 秒噪声缓冲，供瞬态复用
      const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      sound.context = c; sound.out = out; sound.noise = buf;
    }
    if (sound.context.state === 'suspended') sound.context.resume().catch(() => {});
  }

  function drip(st, si, impact, x) {
    const c = sound.context;
    if (!c || c.state !== 'running' || !soundEnabled || impact < 1.4) return;
    const ts = performance.now();
    if (ts - st.lastDrip < 60) return;                  // 同股线去抖
    if (ts - sound.lastGlobal < 18 || sound.voices >= 10) return;
    st.lastDrip = ts; sound.lastGlobal = ts; sound.voices++;

    const now = c.currentTime;
    // 越靠外的股线水越细 → 气泡越小 → 音越高
    const f0 = 1200 + (si / Math.max(1, streams.length - 1)) * 1400 + Math.random() * 220;
    const level = .012 + Math.min(impact, 20) / 20 * .05;
    const dur = .04 + Math.random() * .05;

    const pan = c.createStereoPanner ? c.createStereoPanner() : c.createGain();
    if (pan.pan) pan.pan.setValueAtTime(Math.max(-.9, Math.min(.9, x / width * 2 - 1)), now);
    pan.connect(sound.out);

    const osc = c.createOscillator(); osc.type = 'sine';
    osc.frequency.setValueAtTime(f0, now);
    osc.frequency.exponentialRampToValueAtTime(f0 * 1.13, now + dur);   // ★ 上滑
    const env = c.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(level, now + .002);
    env.gain.exponentialRampToValueAtTime(.0001, now + dur);
    osc.connect(env); env.connect(pan);
    osc.start(now); osc.stop(now + dur + .02);

    // 入水的「嗒」：2–4ms 带通噪声瞬态
    const src = c.createBufferSource(); src.buffer = sound.noise;
    src.playbackRate.value = 1.4;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.value = f0 * 1.6; bp.Q.value = 1.4;
    const ng = c.createGain();
    ng.gain.setValueAtTime(level * .5, now);
    ng.gain.exponentialRampToValueAtTime(.0001, now + .004);
    src.connect(bp); bp.connect(ng); ng.connect(pan);
    src.start(now, Math.random() * 1.5); src.stop(now + .02);

    setTimeout(() => { sound.voices = Math.max(0, sound.voices - 1); pan.disconnect(); }, (dur + .1) * 1000);
  }

  function registerInteraction() {
    interactionCount++;
    if (!counterEl) return;                 // hud:false 时整块不存在
    counterEl.textContent = `${opt.labels.counter} · ${interactionCount}`;
    counterEl.classList.add('visible');
    clearTimeout(counterEl._t);
    counterEl._t = setTimeout(() => counterEl.classList.remove('visible'), 2000);
  }

  /* ═══════════════════════════════════════════════
   *  7. 绘制
   * ═══════════════════════════════════════════════ */
  let inkRGB = [38,51,44], watRGB = [155,207,211], coreRGB = [201,230,229], foamRGB = [244,252,251],
      wordRGB = [44,69,104];
  function syncPalette() {
    const cs = getComputedStyle(root);
    inkRGB = parseColor(cs.getPropertyValue('--ink').trim())  || inkRGB;
    watRGB  = parseColor(cs.getPropertyValue('--water').trim())      || watRGB;
    coreRGB = parseColor(cs.getPropertyValue('--water-core').trim()) || coreRGB;
    foamRGB = parseColor(cs.getPropertyValue('--foam').trim())        || foamRGB;
    wordRGB = parseColor(cs.getPropertyValue('--word-ink').trim())    || wordRGB;
  }
  function parseColor(h) {
    h = h.replace('#','');
    if (h.length !== 6) return null;
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  const rgba = (c,a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  // 成股 = 玻璃蓝，碎花 = 水沫白
  const mixc = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];

  // 按材料坐标 x 找节点（二分不必要，n 小，线性够）
  function nodeAtX(st, mx) {
    const pts = st.pts;
    if (mx <= 0) return 0;
    for (let i = 1; i < st.n; i++) if (pts[i].mx >= mx) return i;
    return -1;
  }
  function posAt(st, i) {
    const p = st.pts[i], u = st.uArr[i];
    return { x: p.x + p.nx * u, y: p.y + p.ny * u, p };
  }

  /* 右边缘淡出：按屏幕 x 算，不按曲线参数 t。
     水在 0.70–0.94W 就落海了，到不了边缘，所以这里只是窄屏的安全垫；
     EDGE 给大了会把最快那道的落点也一起压暗，落水就交代不出来。 */
  const EDGE = 70;
  const edgeFade = x => Math.min(1, Math.max(0, (width - x) / EDGE));

  const brkAt = deg => Math.min(1, Math.max(0,
        (deg - ARC.breakStart) / (ARC.breakEnd - ARC.breakStart)));
  const degAt = p => Math.abs(Math.atan(p.slope) * 180 / Math.PI);
  const halfAt = (st, t) => st.halfA + t * st.halfB;

  /* ═══ 水带：带身 + 颗粒两层 ═══
     ★ 参考图那四条水带高级在哪：带子不是实心色块，是由细密颗粒组成的。
       但只留颗粒也不行 —— 在正常观看距离上会平均成一片灰雾，整条带消失。
       两层都要：带身给「一条带」的形，颗粒给空气感和边缘羽化。 */
  function drawBands() {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const st of streams) {
      let prev = posAt(st, 0);
      for (let i = 1; i < st.n; i++) {
        const q = posAt(st, i), p = st.pts[i];
        const t = p.mx / st.runMax, brk = brkAt(degAt(p));
        const fade = Math.min(1, t / .04) * edgeFade(q.x);
        if (fade <= .01) { prev = q; continue; }
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y); ctx.lineTo(q.x, q.y);
        // 成股时是玻璃蓝，碎成花时是白的 —— 也解决了浅海面上的对比问题
        ctx.strokeStyle = rgba(mixc(watRGB, foamRGB, brk * .9),
                               ARC.bodyAlpha * (1 - t * .5) * (1 - brk * .3) * fade);
        ctx.lineWidth = halfAt(st, t) * 2.7;
        ctx.stroke();
        prev = q;
      }
    }
  }

  /* ═══ 颗粒 ═══
     ★ 颗粒必须「顺流走」，否则整片会原地沙沙地闪。
       做法：横向偏移不是按节点散列算的（那是静态的），
       而是按「材料坐标 − flowDrop」这个相位算 —— 相位随流动推进，
       整片斑点图案就跟着往下游平移。这和水带的厚度起伏是同一个手法。
     两个不同频率的正弦相乘，值天然集中在 0 附近，
     正好给出「中间密、两侧疏」的喷雾断面，不用额外做分布。 */
  function drawGrain() {
    const S = ARC.grainStride;
    for (const st of streams) {
      for (let i = 1; i < st.n; i += S) {
        const p = st.pts[i], q = posAt(st, i);
        const t = p.mx / st.runMax, brk = brkAt(degAt(p));
        const fade = Math.min(1, t / .04) * edgeFade(q.x);
        if (fade <= .02) continue;
        const half = halfAt(st, t);
        const dens = Math.max(3, Math.round(ARC.densA - t * ARC.densB));
        const ph = (p.mx - st.flowDrop) * .085;
        // 每节点只设一次颜色/透明度：逐点设状态会拖垮帧率
        ctx.fillStyle = rgba(mixc(watRGB, foamRGB, Math.min(1, brk * .9 + t * .35)), 1);
        ctx.globalAlpha = (.30 + brk * .28) * (1 - t * .18) * fade;
        for (let k = 0; k < dens; k++) {
          const g = Math.sin(ph * 1.7 + k * 2.399) * Math.sin(ph * .61 + k * 5.131);
          const j = g * half;
          const sz = .8 + (1 - Math.abs(g)) * .7 + t * .8;
          // 小方块代替圆：这个尺寸上肉眼无差，但省掉每点一次 arc()
          ctx.fillRect(q.x + q.p.nx * j - sz * .5, q.y + q.p.ny * j - sz * .5, sz, sz);
        }
        // 过喷：带子之外零星几点，空气感全靠这个
        if (((i * 37 + st.band * 91) % 7) === 0) {
          const g2 = Math.sin(ph * .93 + st.band) * 2.3;
          ctx.globalAlpha *= .55;
          ctx.fillRect(q.x + q.p.nx * g2 * half - .5, q.y + q.p.ny * g2 * half - .5, 1.4, 1.4);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  /* 文字：骑在水带上，每条带同屏 1–2 个词，只出现在切线 ≤30° 的上游平缓段。
     ★ 角度封顶（rotCap）是本篇恢复落海弧的关键：
       水带可以一路转到 47° 砸进海里，字最多只转 14°。
       读起来像「浮在水面上的标签」，而不是「刷在水管上的漆」——
       既还跟着水走，又不会立起来。 */
  let lastPlaced = [];
  function drawWords() {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const CAP = ARC.rotCap * Math.PI / 180;
    /* ★ 语言按「带号 + 一个共享的周期数」定，不按各带自己的 slot。
       原来是 (st.lang + slot) % 4，各带的 slot 互不相干，
       于是会出现两条带同时都是中文、而泰米尔一个都不露的情况。
       改成共享周期后，四条带在任意时刻必定是四种不同语言 ——
       「四语同时在场」本来就是这一篇的立意，不能靠运气。 */
    const cyc = streams.length ? Math.floor(streams[0].flowWord / ARC.xGap) : 0;
    /* ★ 直接做碰撞排除，不再靠调错开量。
       扫一整个流动周期实测过：光靠 wordFrac 错开，最近的两个词会到 46px
       （词宽约 130px），必然重叠 —— 而且改参数是按下葫芦浮起瓢，
       换个相位又撞。这里改成贪心排除：本帧已放下的词记进 placed，
       新候选与任何一个重叠就跳过。band 0 是锚，循环从它开始，所以它永远优先。 */
    const placed = [];
    const clashes = (x, y, w, h) => {
      for (const b of placed)
        if (Math.abs(x - b.x) < (w + b.w) * .5 + 26 &&
            Math.abs(y - b.y) < (h + b.h) * .5 + 20) return true;
      return false;
    };
    for (let si = 0; si < streams.length; si++) {
      const st = streams[si];
      // ★ 新模型下四条带全部挂词（band 0 挂城市名，其余跑词表），不再有「不挂词的带」
      /* ★ 每条带恒定只有一个词，位置在自己的窗口里连续漂移、到头绕回。
         原来是「按 xGap 打槽、落在窗口里的槽就画」，两个毛病：
           · 同一条带可能同时命中两个槽 → 画出「新加坡 | 新加坡」两遍；
           · 某些相位下一条带一个槽都不命中 → 四条带只剩一两个词，
             「四语同时在场」变成看运气。
         改成一带一词之后，四条带 = 四个词 = 四种语言，恒定成立。 */
      const span = st.runMax - st.wordMin;
      if (span < 60) continue;
      const turns = st.flowWord / span;
      const phase = turns - Math.floor(turns);          // 0..1，在窗口里的位置
      const mx = st.wordMin + phase * span;

      const i = nodeAtX(st, mx);
      if (i < 1) continue;
      const q = posAt(st, i);
      const deg = Math.abs(Math.atan(q.p.slope) * 180 / Math.PI);
      if (deg > ARC.wordDeg) continue;

      // 语言按「带号 + 共享周期」，四条带任意时刻必是四种不同语言
      const li = (st.band + cyc) % 4;
      const lang = LANGS[li];
      /* 主带挂城市名当锚（四语轮转），其余三条跑词表。
         只放城市名信息量太薄；全跑词表又少了「这里是哪」的支点。 */
      const word = st.isAnchor
        ? ARC_WORDS[li]
        : WORDS[(st.wordSeed + Math.floor(turns)) % WORDS.length][li];

      // 两端淡入淡出，绕回时不会硬切
      const fade = Math.min(1, phase / .14) * Math.min(1, (1 - phase) / .18)
                 * Math.min(1, Math.max(0, (ARC.wordDeg - deg) / 7)) * edgeFade(q.x);
      const a = (st.isAnchor ? .90 : .80) * fade * (LANG_ALPHA[lang] || 1);
      if (a < .03) continue;

      {
        // 先量尺寸做碰撞判定（保险丝：正常情况下四条带已经错开）
        ctx.font = FONTS[lang];
        const bw = ctx.measureText(word).width, bh = ARC.wordFont * 1.15;
        if (clashes(q.x, q.y, bw, bh)) continue;
        placed.push({ x: q.x, y: q.y, w: bw, h: bh, lang, word, band: st.band });

        const rot = Math.atan2(q.p.ty, q.p.tx);
        ctx.save();
        ctx.font = FONTS[lang];
        // 拉丁衬线在这个尺寸上开一点字距更从容（浏览器不支持就自动忽略）
        try { ctx.letterSpacing = (lang === 'zh' ? '.06em' : '.015em'); } catch (e) {}
        ctx.translate(q.x, q.y);
        ctx.rotate(Math.max(-CAP, Math.min(CAP, rot)));   // ★ 封顶
        /* ★ 挖空，而不是加外晕。
           外晕是「在字周围糊一圈光」，本质是把字垫高压在水上，容易显旧；
           挖空是让水在字的形状周围让开一圈 —— 字于是嵌在水里，
           读起来是「水绕着字流」而不是「字盖在水上」。同样解决对比问题，
           但更干净、更现代，也不需要 halo 那支颜色随昼夜翻转。
           擦不擦得干净由 alpha 控制：留一点水没擦掉，边缘才不硬。 */
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = a * .78;
        ctx.lineJoin = 'round'; ctx.miterLimit = 2;
        ctx.lineWidth = Math.max(4, ARC.wordFont * .19);
        ctx.strokeStyle = '#000';
        ctx.strokeText(word, 0, 0);
        ctx.fillText(word, 0, 0);

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a;
        ctx.fillStyle = rgba(wordRGB, 1);
        ctx.fillText(word, 0, 0);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    lastPlaced = placed;      // 调试钩子读它：measure what the code does, not a re-implementation
  }

  function drawSplashes() {
    ctx.fillStyle = rgba(foamRGB, 1);
    for (const s of splashes) {
      ctx.globalAlpha = Math.max(0, s.life) * .72;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.284); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* 落水处的交代：亮斑 + 扩散涟漪。
     ★ 这一层是「弧线落在海里」这句话唯一的证明。
       只画细涟漪时，在浅海面上几乎看不见 —— 必须先有一个亮斑压住落点，
       涟漪才有出发点。三样东西叠出来：贴水面的亮斑、两圈扩散的涟漪、
       以及 frame() 里持续溅起的水花。 */
  function drawImpact(now) {
    for (let si = 0; si < streams.length; si++) {
      const st = streams[si];
      const ef = edgeFade(st.landX);
      if (ef <= .01) continue;
      const puls = .78 + .22 * Math.sin(now * .004 + si * 1.7);

      // 贴着水面的亮斑：横向压扁，像被砸开的一小片白水
      ctx.fillStyle = rgba(foamRGB, 1);
      ctx.globalAlpha = .34 * puls * ef;
      ctx.beginPath();
      ctx.ellipse(st.landX, hero.bayY, 13 * puls, 3.4 * puls, 0, 0, 6.284);
      ctx.fill();
      ctx.globalAlpha = .18 * puls * ef;
      ctx.beginPath();
      ctx.ellipse(st.landX, hero.bayY, 26 * puls, 6 * puls, 0, 0, 6.284);
      ctx.fill();

      // 向外扩散的涟漪
      ctx.strokeStyle = rgba(foamRGB, 1); ctx.lineWidth = 1.3;
      const ph = (now * .00042 + si * .37) % 1;
      for (let k = 0; k < 2; k++) {
        const pr = (ph + k * .5) % 1;
        ctx.globalAlpha = (1 - pr) * .40 * ef;
        ctx.beginPath();
        ctx.ellipse(st.landX, hero.bayY, 8 + pr * 46, 2 + pr * 9, 0, 0, 6.284);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    drawImpact(now);   // 落水亮斑 + 涟漪，画在最底层
    drawBands();       // 带身：四条水带的形
    drawGrain();       // 颗粒：空气感、边缘羽化、顺流的斑点
    drawWords();       // 骑在水带上的四语短词
    drawSplashes();    // 只剩指针接触点溅起的水花
  }

  /* ═══════════════════════════════════════════════
   *  8. 主循环
   * ═══════════════════════════════════════════════ */
  function frame(now) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - lastT) / 1000 || .016);
    lastT = now;

    if (!reduceMotion) {
      const dxWord = physics.vxWord * physics.flow * dt;
      const dxDrop = physics.vxDrop * physics.flow * dt;
      for (const st of streams) {
        st.flowWord += dxWord * st.vxFrac;
        st.flowDrop += dxDrop * st.vxFrac;
        advect(st, dxDrop * st.vxFrac);
        relax(st);
      }
      stepSplash(dt);
      /* 落水处持续溅起细水花。0.34 的概率 ≈ 每秒 20 颗，
         克制到「看得出在砸水」但不会在落点带堆出一团白雾。 */
      if (Math.random() < .7) {
        const st = streams[(Math.random() * streams.length) | 0];
        if (st) spawnSplash(st.landX, hero.bayY, 1 + (Math.random() < .3 ? 1 : 0));
      }
    }
    injectPointer();
    draw(now);
  }
  /* ★ 起停要同时看「标签页可见」和「在视口内」。
     少了后半条，嵌在首屏以下的场景会在页面一加载就开跑。 */
  function start() {
    if (!rafId && !document.hidden && onScreen) { lastT = performance.now(); rafId = requestAnimationFrame(frame); }
  }
  function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
  /* ═══════════════════════════════════════════════
   *  9. 尺寸 / 事件 / 初始化
   * ═══════════════════════════════════════════════ */
  function resize() {
    const r = artboard.getBoundingClientRect();
    width = r.width; height = r.height;
    narrow = width < NARROW;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    /* ★ 设 canvas.width 会清空画布。循环在跑时下一帧会补上，
       但循环停着的时候（标签页隐藏 / 滚出视口）没人补 ——
       而 ResizeObserver 的首次回调正好撞在挂载后那一刻，
       结果就是嵌进页面、还没滚到时那一段是空白的。所以这里必须自己补一帧。 */
    draw(performance.now());
  }

  function enter(e) {
    const r = canvas.getBoundingClientRect();
    mouse.x = mouse.oldX = e.clientX - r.left;
    mouse.y = mouse.oldY = e.clientY - r.top;
    mouse.active = true;
    if (cursor) { cursor.style.left = `${mouse.x}px`; cursor.style.top = `${mouse.y}px`; }
    artboard.classList.add('is-active');
  }
  function move(e) {
    if (!mouse.active) return enter(e);
    mouse.oldX = mouse.x; mouse.oldY = mouse.y;
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    if (cursor) { cursor.style.left = `${mouse.x}px`; cursor.style.top = `${mouse.y}px`; }
  }
  function leave() { mouse.active = false; artboard.classList.remove('is-active'); }

  /* settings:false 时这些元素根本不存在 —— 取用处必须容忍缺席，
     否则删掉配置面板会在 init() 之前抛错，结果不是「面板没了」是「水不画」。 */
  function bindRange(id, fn) {
    const el = root.querySelector(`[data-kc="${id}"]`);
    const out = root.querySelector(`[data-kc-out="${id}"]`);
    if (!el || !out) return;
    on(el, 'input', () => { const v = +el.value; out.value = String(v); fn(v); });
  }

  /* ═══ ★ Canvas 字体必须显式加载 ═══
     Web 字体是懒加载的：只有 DOM 里真的用到才会下载。
     `ctx.font = '600 30px "Cormorant Garamond"'` **不会触发下载** ——
     浏览器直接回退，而且不报错，画面看着「有字」，实际是 Georgia / 系统衬线。
     `document.fonts.ready` 也救不了，它只等已经被触发的那些。

     必须调 `document.fonts.load(font, text)` 主动拉。第二个参数对
     中文/泰米尔这种按 unicode-range 切片的字体尤其重要 ——
     不给样本文本，只会拉到不含所需字形的那几片。

     踩过的坑：因为没做这一步，之前拿三款候选字体做的比稿全部是无效的
     （fallback 链都是 → Georgia，比的其实是 Georgia 的不同字重）。 */
  async function ensureFonts() {
    if (!document.fonts || !document.fonts.load) return;
    const bag = { en:new Set(), zh:new Set(), ms:new Set(), ta:new Set() };
    const eat = (k, str) => { for (const ch of str) bag[k].add(ch); };
    for (const row of WORDS) LANGS.forEach((k, i) => eat(k, row[i] || ''));
    LANGS.forEach((k, i) => eat(k, ARC_WORDS[i] || ''));
    const jobs = LANGS.map(k => {
      const txt = [...bag[k]].join('');
      return txt ? document.fonts.load(FONTS[k], txt).catch(() => {}) : null;
    }).filter(Boolean);
    await Promise.all(jobs);
  }

  /* ---- 文字源 ---- */
  async function loadWords() {
    try {
      const res = await fetch(opt.assetBase + 'words.txt');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const lines = (await res.text()).split('\n');
      const sets = []; let arc = null, inArc = false;
      for (let raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        if (line === '__ARC__') { inArc = true; continue; }
        const parts = line.split('|').map(s => s.trim());
        if (parts.length !== 4 || parts.some(p => !p)) continue;
        if (inArc) { if (!arc) arc = parts; } else sets.push(parts);
      }
      if (sets.length) WORDS = sets;
      if (arc) ARC_WORDS = arc;
      build();
    } catch (e) { console.warn('words.txt 未加载，使用内置词表：', e.message); }
  }
  /* ═══════════════════════════════════════════════
   *  10. 主题 / 声音 / 事件 / 生命周期
   * ═══════════════════════════════════════════════ */

  /* ★ data-theme 写在场景根上，不写 <html>。
     宿主站点多半也用 data-theme 做暗色模式，写 <html> 两边会互相覆盖。 */
  const themeToggle = root.querySelector('.toggle-theme');
  const soundToggle = root.querySelector('.toggle-sound');

  function applyTheme(night) {
    if (night) root.setAttribute('data-theme', 'night');
    else root.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.textContent = night ? '☾' : '☀';
      themeToggle.classList.toggle('active', night);
    }
    if (opt.persistTheme) {
      try { localStorage.setItem(THEME_KEY, night ? 'night' : 'day'); } catch (e) {}
    }
    syncPalette();
  }
  function setTheme(t) { applyTheme(t === 'night'); }

  let initialNight = opt.theme === 'night';
  if (opt.persistTheme) {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) initialNight = saved === 'night';
    } catch (e) {}
  }
  applyTheme(initialNight);
  if (themeToggle) on(themeToggle, 'click', () =>
    applyTheme(root.getAttribute('data-theme') !== 'night'));

  /* ---- 声音（默认关）---- */
  let soundEnabledInit = opt.sound === 'on';
  soundEnabled = soundEnabledInit;
  function silence() {
    if (sound.context && sound.context.state === 'running') sound.context.suspend().catch(() => {});
  }
  if (soundToggle) {
    soundToggle.textContent = soundEnabled ? opt.labels.soundOn : opt.labels.soundOff;
    soundToggle.classList.toggle('active', soundEnabled);
    on(soundToggle, 'click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.textContent = soundEnabled ? opt.labels.soundOn : opt.labels.soundOff;
      soundToggle.classList.toggle('active', soundEnabled);
      if (soundEnabled) unlockSound(); else silence();
    });
  }

  if (configure && settings) on(configure, 'click', () => {
    const open = settings.hidden;
    settings.hidden = !open;
    configure.setAttribute('aria-expanded', String(open));
  });
  if (resetBtn) on(resetBtn, 'click', build);

  bindRange('flow',     v => { physics.flow = v / 100; });
  bindRange('textsize', v => { ARC.wordFont = v; build(); });
  bindRange('strength', v => { physics.strength = v / 100; });
  bindRange('reach',    v => { physics.radius = v; });
  bindRange('heal',     v => { physics.heal = v / 100; });

  on(canvas, 'pointerenter', enter);
  on(canvas, 'pointermove', move);
  on(canvas, 'pointerleave', leave);
  on(canvas, 'pointerdown', () => { if (soundEnabled) unlockSound(); }, { passive: true });
  on(window, 'resize', resize);

  on(document, 'visibilitychange', () => { if (document.hidden) { stop(); silence(); } else start(); });
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  on(mqReduce, 'change', e => { reduceMotion = e.matches; });

  /* 容器尺寸变化（嵌进弹性栏目里时，window resize 根本不触发） */
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => resize());
    ro.observe(root);
    cleanup.push(() => ro.disconnect());
  }

  /* ★ 滚出视口就停。本篇是四篇里唯一常驻动画的场景 ——
     不停的话，访客在读页面别处时它仍在满帧烧 CPU。 */
  if (opt.pauseOffscreen && window.IntersectionObserver) {
    const io = new IntersectionObserver(es => {
      onScreen = es[0].isIntersecting;
      if (onScreen) start(); else { stop(); silence(); }
    }, { rootMargin: '120px' });
    io.observe(root);
    cleanup.push(() => io.disconnect());
  }

  /* ---- 调试钩子（只在 allowUrlOverrides 且 ?debug 时挂）---- */
  function exposeDebug() {
    window.__sg = {
      get streams() { return streams; },      // getter：build() 会重填，不能抓快照
      physics, ARC, IMG, hero,
      /* ★ step() 只推进物理，不画。面板隐藏时 rAF 也不跑 ——
         想量「真正画出去的词」必须显式调一次 draw()。 */
      draw: () => { draw(performance.now()); return lastPlaced; },
      words: () => lastPlaced,
      /* 模拟匀速划过。★ dy 不能省：水弧在可读段近乎水平，
         横向划过的法向分量几乎是 0，拨不动 —— 竖向划才是自然的「拨」。 */
      sweep(x0, y0, dx, dy = 0, n = 8) {
        mouse.active = true; mouse.x = mouse.oldX = x0; mouse.y = mouse.oldY = y0;
        for (let i = 0; i < n; i++) {
          mouse.oldX = mouse.x; mouse.oldY = mouse.y;
          mouse.x += dx; mouse.y += dy;
          injectPointer();
        }
        mouse.active = false;
      },
      /* ★ 水的判据：扰动的重心应随时间往下游走。
         返回每条股线偏移最大处的索引 —— 连续调用应看到它单调变大。 */
      front() { return streams.map(st => {
        let bi = 0, bv = 0;
        for (let i = 0; i < st.n; i++) { const a = Math.abs(st.uArr[i]); if (a > bv) { bv = a; bi = i; } }
        return { i: bi, u: +bv.toFixed(2), frac: +(bi / st.n).toFixed(3) };
      }); },
      step(n2 = 1) { for (let i = 0; i < n2; i++) {
        for (const st of streams) { const d = physics.vxDrop * .016 * st.vxFrac; advect(st, d); relax(st); }
      } }
    };
  }

  function init() {
    syncPalette();
    resize();
    if (opt.words) WORDS = opt.words;
    if (opt.arcWords) ARC_WORDS = opt.arcWords;
    /* 给了 words 就不再发 fetch（嵌入方通常自己带文案） */
    if (!opt.words) loadWords();
    if (DEBUG) exposeDebug();
    draw(performance.now());          // ★ 挂载后先画一帧：循环没起来也不是空白
    start();
  }

  /* 字体没就位时 measureText 会用回退度量。
     先按 ready 建一次（首帧不空），字体真正拉到之后再建一次量准字宽。 */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => build())
      .then(ensureFonts)
      .then(() => { build(); draw(performance.now()); })
      .catch(() => {});
  }

  /* 卸载：释放 rAF、监听器、观察器和音频节点。
     单页应用换掉这一段时必须调用，否则 rAF 和 AudioContext 会一直留着。 */
  function destroy() {
    stop();
    silence();
    cleanup.forEach(fn => { try { fn(); } catch (e) {} });
    cleanup.length = 0;
    if (counterEl && counterEl._t) clearTimeout(counterEl._t);
    if (sound.context && sound.context.state !== 'closed') sound.context.close().catch(() => {});
    if (DEBUG && window.__sg) { try { delete window.__sg; } catch (e) { window.__sg = undefined; } }
    root.innerHTML = '';
    root.classList.remove('merlion-scene', 'has-cursor');
    root.removeAttribute('data-theme');
  }

  const handle = {
    el: root, destroy, setTheme,
    render() { draw(performance.now()); },
    get running() { return rafId !== null; },
    setSound(v) { soundEnabled = !!v; if (soundEnabled) unlockSound(); else silence(); }
  };

  if (sceneImg.complete) init();
  else { on(sceneImg, 'load', init); on(sceneImg, 'error', init); }
  return handle;
}
