/* 雅法文字风幕 —— 可嵌入组件
 *
 *   import { mountJaffa } from './jaffa.js';
 *   const scene = mountJaffa('#telaviv', { chrome: false, title: false });
 *   scene.destroy();
 *
 * 配套 jaffa.css。改造规则见 docs/EMBEDDING.md。
 * 物理与绘制代码与原版逐字节一致，这一层只负责 DOM、作用域和生命周期。 */

export const DEFAULTS = {
  chrome:   true,
  title:    true,
  hud:      true,
  cursor:   true,
  settings: true,

  brand:       '雅法',
  brandSuffix: ' · Jaffa',
  nav:      [{ label: '首页', href: '#' }, { label: '地标', href: '#' }, { label: '社区', href: '#' }],
  eyebrow:  '特拉维夫–雅法 (Tel Aviv–Yafo) / 石与海之间',
  heading:  'Jaffa',
  ariaLabel: '七条被地中海风推动的文字风线，希伯来语与阿拉伯语的完整词语沿线从海一侧缓慢漂向纸面',
  backdropImage: 'jaffa-arch.jpg',
  backdropAlt:   '雅法砂岩石拱框住地中海，远处有旧城石屋、灯塔和一艘小帆船',

  /* 界面文案：嵌入时按宿主语言覆盖（见 docs/EMBEDDING.md）。soundOn/soundOff 给单字符就是图标按钮，给词就变成带字的胶囊 */

  labels: { theme: '切换昼夜主题', sound: '开关声音', soundOn: '♪', soundOff: '✕', settings: '配置', counter: '风线拨动' },

  sound: 'off',
  theme: 'day',
  persistTheme: false,
  pauseOffscreen: true,
  assetBase: 'assets/',
  allowUrlOverrides: false
};

const CLIP_PATH_D = 'M 0.43072,0.00000 0.42610,0.00404 0.41801,0.00807 0.40993,0.01211 0.40185,0.01615 0.39376,0.02018 0.38684,0.02422 0.37991,0.02825 0.37298,0.03229 0.36605,0.03633 0.35912,0.04036 0.35335,0.04440 0.34758,0.04844 0.34065,0.05247 0.33603,0.05651 0.33025,0.06054 0.32448,0.06458 0.31871,0.06862 0.31293,0.07265 0.30831,0.07669 0.30370,0.08073 0.29792,0.08476 0.29330,0.08880 0.28868,0.09284 0.28406,0.09687 0.27945,0.10091 0.27483,0.10494 0.27021,0.10898 0.26674,0.11302 0.26212,0.11705 0.25751,0.12109 0.25404,0.12513 0.25058,0.12916 0.24596,0.13320 0.24249,0.13724 0.23903,0.14127 0.23441,0.14531 0.22864,0.15338 0.22171,0.16145 0.21824,0.16549 0.21478,0.16953 0.20901,0.17760 0.20323,0.18567 0.19746,0.19374 0.19284,0.20182 0.17321,0.20989 0.15358,0.21393 0.12933,0.21796 0.10739,0.22200 0.08430,0.22603 0.06120,0.23007 0.04042,0.23411 0.03118,0.23814 0.09122,0.83552 0.03118,0.83956 0.06120,0.92836 0.11894,0.93239 0.12356,0.93643 0.20901,0.94046 0.29792,0.94450 0.20554,0.94854 0.28522,0.95257 0.31871,0.95661 0.31178,0.96065 0.32679,0.96468 0.34873,0.96872 0.25520,0.97275 0.28060,0.97679 0.31524,0.98083 0.35219,0.98486 0.38337,0.98890 0.41686,0.99294 0.44688,0.99697 L 1,1 L 1,0 Z';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function markup(o, clipId) {
  const chars = [...String(o.heading)].map(c => `<span class="ag-char">${esc(c)}</span>`).join('');
  const nav = (o.nav || []).map(n => `<a href="${esc(n.href || '#')}">${esc(n.label)}</a>`).join('');
  return `
<main class="artboard">
  <svg width="0" height="0" aria-hidden="true" style="position:absolute">
    <defs><clipPath class="arch-clip" id="${clipId}" clipPathUnits="objectBoundingBox">
      <path d="${CLIP_PATH_D}"/>
    </clipPath></defs>
  </svg>

  <img class="backdrop scene" src="${esc(o.assetBase + o.backdropImage)}"
       alt="${esc(o.backdropAlt)}" width="866" height="992" fetchpriority="high" decoding="async">
  <div class="nightwash" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>

  <canvas class="veil" aria-label="${esc(o.ariaLabel)}"></canvas>
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
    <div class="setting"><label>Strength <output data-kc-out="strength">55</output></label><input data-kc="strength" type="range" min="15" max="120" value="55"></div>
    <div class="setting"><label>Reach <output data-kc-out="reach">56</output></label><input data-kc="reach" type="range" min="24" max="110" value="56"></div>
    <div class="setting"><label>Inertia <output data-kc-out="inertia">991</output></label><input data-kc="inertia" type="range" min="950" max="998" value="991"></div>
    <div class="setting"><label>Sea Wind <output data-kc-out="wind">34</output></label><input data-kc="wind" type="range" min="0" max="100" value="34"></div>
    <div class="setting"><label>Drift <output data-kc-out="drift">100</output></label><input data-kc="drift" type="range" min="0" max="220" value="100"></div>
    <button class="reset-btn" type="button">Reset wind lines</button>
  </aside>` : ''}
</main>`;
}

let seq = 0;

export function mountJaffa(host, options = {}) {
  const opt = { ...DEFAULTS, ...options };
  opt.labels = { ...DEFAULTS.labels, ...(options.labels || {}) };
  if (!opt.chrome) opt.settings = false;
  const root = typeof host === 'string' ? document.querySelector(host) : host;
  if (!root) throw new Error('mountJaffa: 找不到容器元素 ' + host);

  const n = ++seq;
  const CLIP_ID = 'jaffa-arch-clip-' + n;
  const THEME_KEY = 'jaffa-theme-' + n;
  root.classList.add('jaffa-scene');
  root.innerHTML = markup(opt, CLIP_ID);

  const cleanup = [];
  const on = (t, ev, fn, o2) => {
    t.addEventListener(ev, fn, o2);
    cleanup.push(() => t.removeEventListener(ev, fn, o2));
  };

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let onScreen = true;          // 由 IntersectionObserver 维护
  let soundEnabled = opt.sound === 'on';

  const DEBUG = opt.allowUrlOverrides && new URLSearchParams(location.search).has('debug');
  let audioCtx = null;

  /* ═══════════════════════════════════════════════
   *  1. 反重力标题（与另两篇同一套）
   * ═══════════════════════════════════════════════ */
  function attachAntiGravity(el, opts = {}) {
    const { floatAmp = 4, floatSpeed = .3, rotAmp = 1.2,
            pushRadius = 118, pushForce = 15, springK = .055, damping = .89 } = opts;
    let vx = 0, vy = 0, ox = 0, oy = 0, rafId = null, isPushed = false;
    const phase = Math.random() * Math.PI * 2;

    function pose() {
      const t = Date.now() / 1000;
      const fy = Math.sin(t * floatSpeed + phase) * floatAmp;
      const fx = Math.cos(t * floatSpeed * .7 + phase) * floatAmp * .35;
      const rz = Math.sin(t * floatSpeed * .45 + phase) * rotAmp;
      el.style.transform = `translate(${fx + ox}px, ${fy + oy}px) rotate(${rz}deg)`;
    }
    function physicsTick() {
      if (!isPushed && Math.abs(ox) < .1 && Math.abs(oy) < .1 &&
          Math.abs(vx) < .01 && Math.abs(vy) < .01) { ox = oy = vx = vy = 0; rafId = null; return; }
      vx = (vx + (-ox * springK)) * damping;
      vy = (vy + (-oy * springK)) * damping;
      ox += vx; oy += vy; pose();
      rafId = requestAnimationFrame(physicsTick);
    }
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - e.clientX, dy = r.top + r.height / 2 - e.clientY;
      const d = Math.hypot(dx, dy);
      if (d < pushRadius && d > 0) {
        const f = (pushRadius - d) / pushRadius * pushForce;
        vx += dx / d * f * .12; vy += dy / d * f * .12;
        isPushed = true;
        if (!rafId) rafId = requestAnimationFrame(physicsTick);
      }
    });
    el.addEventListener('mouseleave', () => {
      isPushed = false;
      if (!rafId) rafId = requestAnimationFrame(physicsTick);
    });
    if (!reducedMotion) setInterval(() => { if (!isPushed) pose(); }, 33);
  }

  /* ═══════════════════════════════════════════════
   *  2. 几何
   * ═══════════════════════════════════════════════ */
  /* 底图裁切自 1586×992 母版的 x∈[720,1586]。母版里石头左边界实测在 x=746，
   * 所以裁切内的石边在 x=26。底图按视口高度缩放，于是：
   *     s        = height / 992
   *     stoneX   = width - 866·s + 26·s = width - 840·s              */
  const SCENE_W = 866, SCENE_H = 992, STONE_IN_CROP = 26;

  /* 七条风线。★ 绝不等距 —— 等距会读成五线谱。
   * 分三组 3/2/2：组内 36–44，组间 66–68。原型 4 条的 45/55/60 递增间距在这里被放大。
   * 起终点 y 按 992 归一化；终点比起点低 62–88，越下面的线垂得越多（沿用原型姿态）。 */
  const LINES = [
    { y0: 296, y1: 358, dip: 16 },   // ┐
    { y0: 332, y1: 398, dip: 15 },   // ├ 组一
    { y0: 372, y1: 442, dip: 14 },   // ┘
    { y0: 438, y1: 514, dip: 13 },   // ┐ 组二
    { y0: 474, y1: 554, dip: 12 },   // ┘
    { y0: 542, y1: 628, dip: 11 },   // ┐ 组三
    { y0: 586, y1: 674, dip: 10 }    // ┘
  ];
  const OVERHANG = 160;              // 两端锚点伸出画框的距离，波能荡出画面
  const SEG = 14;                    // 节点间距

  /* 漂移速度 px/s：顶部快、底部慢（风切变），再逐条 ±12% 抖开，避免整齐划一 */
  const DRIFT_PX = [38, 35, 33, 29, 27, 23, 20].map((v, i) => v * (1 + ((i * 37) % 25 - 12) / 100));

  /* ═══════════════════════════════════════════════
   *  3. 文字
   * ═══════════════════════════════════════════════ */
  /* ★ 占位词，待希伯来语与阿拉伯语母语者复核后替换。
   *
   * 两个词表逐位一一对应（同一个意思的两种说法），所以线上相邻的一对
   * 其实是同一个词的希伯来语和阿拉伯语版本。其中好几对本身就是同源词 ——
   * אור/نور、רוח/ريح、בית/بيت，而 שלום/سلام 更是同一个闪族语根 Š-L-M。
   * 这一层留给愿意细看的人。
   *
   * 选词只取具体、感官、人本的一组，和石拱／海／旧城同一个语域。
   * 刻意排除在外：טכנולוגיה 科技、קדמה 进步、שגשוג 繁荣、שיתוף פעולה 合作
   * —— 这些读起来像会议标语，会把画面从「地方的记忆」拉向「品牌标语」。
   * 地名 ישראל / תל אביב 也不放：eyebrow 已经写了地名，风里再飘一次是重复。 */
  const WORD_PAIRS = [
    ['ים',     'بحر'],      // 海
    ['אור',    'نور'],      // 光      ★ 同源
    ['רוח',    'ريح'],      // 风      ★ 同源
    ['דרך',    'طريق'],     // 路
    ['אבן',    'حجر'],      // 石
    ['זמן',    'وقت'],      // 时间
    ['יחד',    'معا'],      // 一起
    ['ללמוד',  'تعلم'],     // 学
    ['בית',    'بيت'],      // 家      ★ 同源
    ['קול',    'صوت'],      // 声音
    ['שלום',   'سلام'],     // 和平    ★ 同源，同一个语根 Š-L-M
    ['תקווה',  'أمل'],      // 希望
    ['חיים',   'حياة'],     // 生命
    ['חופש',   'حرية'],     // 自由
    ['גשר',    'جسر'],      // 桥
    ['חיבור',  'تواصل'],    // 连接
    ['קהילה',  'مجتمع'],    // 社群
    ['ידע',    'معرفة'],    // 知识
    ['יופי',   'جمال'],     // 美
    ['אהבה',   'محبة']      // 爱
  ];

  /* 短语作重音，不进主词库。只取最短的两条（99/84px 和 86/66px）——
   * 更长的 גשר בין תרבויות(126px)、שלום ודו־קיום(110px) 一个就吃掉纸面可视宽的
   * 五分之一，两三个撞一起就不再是「风里的词」而是「飘着的句子」。
   * 长短参差本身是有价值的：真实的风里不会只飘同一尺寸的东西。 */
  const PHRASE_PAIRS = [
    ['שלום ותקווה', 'سلام وأمل'],   // 和平与希望
    ['אור ותקווה',  'نور وأمل']     // 光与希望
  ];

  /* 排布沿用原型的做法：一对（同一个词的两种语言）挨着放，对与对之间拉开。
     逐行的起始偏移刻意不单调（原型是 12% / 26% / 18% / 33%），避免七行的词竖着排成柱子。 */
  const PAIRS_PER_LINE = 4;
  const PAIR_GAP = .08;          // 对内间距 ≈141px，对间 ≈300px，2.1 倍差才读得出「成对」
  const LINE_OFFSET = [0, .21, .09, .30, .15, .38, .05];
  const PHRASE_SLOTS = [[1, 2], [4, 0]];   // [第几条线, 第几对]。两条短语分在不同线、不同相位上

  /* 词槽分配：先铺满一轮词库，不够的再补，然后用固定种子打散。
   * 不用 (index * n + p) % len 这种取模公式 —— 那样第 5、6 条线会和第 0、1 条
   * 拿到一模一样的词序。固定种子保证每次刷新一致，方便调试。 */
  function planWords(lineCount, pairsPerLine, allowPhrases) {
    const need = lineCount * pairsPerLine;
    const order = [];
    for (let i = 0; order.length < need; i++) order.push(i % WORD_PAIRS.length);
    let seed = 20260909;
    for (let i = order.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const j = seed % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    const plan = [];
    let k = 0;
    for (let line = 0; line < lineCount; line++) {
      const row = [];
      for (let p = 0; p < pairsPerLine; p++) {
        const slot = allowPhrases
          ? PHRASE_SLOTS.findIndex(([l, i]) => l === line && i === p) : -1;
        row.push(slot >= 0 ? PHRASE_PAIRS[slot] : WORD_PAIRS[order[k++]]);
      }
      plan.push(row);
    }
    return plan;
  }

  /* ═══════════════════════════════════════════════
   *  4. DOM 与状态
   * ═══════════════════════════════════════════════ */
  const artboard = root.querySelector('.artboard');
  const sceneEl  = root.querySelector('img.backdrop');
  const canvas   = root.querySelector('.veil');
  const ctx      = canvas.getContext('2d');
  // 以下都可能被 options 关掉，一律容忍缺席
  const cursor   = root.querySelector('.cursor');
  const counterEl= root.querySelector('.counter');
  const configure= root.querySelector('.configure');
  const settings = root.querySelector('.settings');
  const resetBtn = root.querySelector('.reset-btn');

  /* clipPath 的 id 在整个文档里是全局的，同页放两个实例就会互相抢。
   * 所以裁切改成按实例注入，不写死在样式表里。 */
  root.querySelector('.arch-clip').id = CLIP_ID;
  sceneEl.style.clipPath = `url(#${CLIP_ID})`;
  const nightwash = root.querySelector('.nightwash');
  if (nightwash) nightwash.style.clipPath = `url(#${CLIP_ID})`;

  let width = 0, height = 0, dpr = 1, scale = 1, stoneX = 0, archTop = 0, fontPx = 22;
  let ropes = [], interactionCount = 0, rafId = null;
  let lastT = 0, windPhase = 0, gustX = -1, gustAge = 0, nextGust = 5;

  const mouse = { x: -999, y: -999, oldX: -999, oldY: -999, active: false };

  /* 松线，不是绷紧的弦：shapeK 比金门主缆小一档，friction 更高 */
  const physics = {
    friction: .991, shapeK: .008, radius: 56, strength: .55,
    perpGain: 1.5, axialGain: .4
  };
  let windIntensity = 34, driftScale = 1;

  /* ═══════════════════════════════════════════════
   *  5. 声音：风不是被敲的，是持续的
   *     —— 三篇里唯一不用「击打→衰减」模型的一篇，没有音高、不进音阶体系
   * ═══════════════════════════════════════════════ */
  const sound = { ctx: null, noise: null, band: null, gain: null, running: false };

  function unlockSound() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || sound.ctx) { if (sound.ctx && sound.ctx.state === 'suspended') sound.ctx.resume().catch(() => {}); return; }
    const c = new AC();
    // 2 秒白噪循环
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf; src.loop = true;

    const band = c.createBiquadFilter();
    band.type = 'bandpass'; band.frequency.value = 460; band.Q.value = .8;  // Q 小 = 宽 = 像空气不像哨音
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    const gain = c.createGain(); gain.gain.value = 0;

    src.connect(band); band.connect(lp); lp.connect(gain); gain.connect(c.destination);
    src.start();
    sound.ctx = c; sound.noise = src; sound.band = band; sound.gain = gain;
    audioCtx = c;
  }

  /* 风速 → 滤波中心频率与增益。全部很轻：连续声比断续声更容易烦人。 */
  function updateWindSound(energy) {
    if (!sound.gain || !soundEnabled || !sound.ctx || sound.ctx.state !== 'running') return;
    const now = sound.ctx.currentTime;
    const e = Math.min(1, energy);
    sound.band.frequency.setTargetAtTime(380 + e * 520, now, .35);
    sound.gain.gain.setTargetAtTime(.008 + e * .027, now, .4);
  }
  function silence() {
    if (sound.gain && sound.ctx) sound.gain.gain.setTargetAtTime(0, sound.ctx.currentTime, .08);
  }
  /* 指针划过：一层极短的「布/纸擦过」噪声爆发 */
  let lastBrush = 0;
  function brush(strength) {
    const c = sound.ctx;
    if (!c || !soundEnabled || c.state !== 'running') return;
    const ts = performance.now();
    if (ts - lastBrush < 110) return;
    lastBrush = ts;
    const len = Math.floor(c.sampleRate * .2);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = c.createBufferSource(); s.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass';
    f.frequency.value = 900 + Math.random() * 700; f.Q.value = 1.1;
    const g = c.createGain();
    const now = c.currentTime, peak = Math.min(.05, .012 + strength * .004);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + .02);
    g.gain.exponentialRampToValueAtTime(.0001, now + .2);
    s.connect(f); f.connect(g); g.connect(c.destination);
    s.start(now); s.stop(now + .22);
  }

  /* ═══════════════════════════════════════════════
   *  6. 建线
   * ═══════════════════════════════════════════════ */
  /* 设计线形：起终点连线 + 一个偏左的下坠。
   * sin(π·t^0.62) 的峰值落在 t≈0.33，对应原型 path 在 x≈300–400 处那个早下坠。 */
  function restY(cfg, t) {
    return cfg.y0 + (cfg.y1 - cfg.y0) * t + cfg.dip * Math.sin(Math.PI * Math.pow(t, .62));
  }

  function makeRope(cfg, index, myPairs) {
    const x0 = -OVERHANG, x1 = width + OVERHANG;
    const n = Math.max(8, Math.round((x1 - x0) / SEG) + 1);
    const nodes = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const x = x0 + (x1 - x0) * t;
      const y = restY(cfg, t) * scale;
      nodes.push({ x, y, oldX: x, oldY: y, anchorX: x, anchorY: y, restX: x, restY: y, pinned: false });
    }
    nodes[0].pinned = nodes[n - 1].pinned = true;
    const restLength = [];
    for (let i = 1; i < n; i++)
      restLength.push(Math.hypot(nodes[i].x - nodes[i - 1].x, nodes[i].y - nodes[i - 1].y) * .999);

    /* 词沿绳等间距铺开，逐条错开相位。
     * 一条线约 (width+320)px，6 个词 → 间距约 290px，
     * 落在纸面可视区（约 47% 宽）里的同时只有 2–3 个。 */
    const words = [];
    const pairs = myPairs.length;
    for (let p = 0; p < pairs; p++) {
      const pair = myPairs[p];
      const base = (p / pairs + LINE_OFFSET[index]) % 1;
      const heFirst = (index + p) % 2 === 0;   // 逐对轮换谁在前，两种语言机会均等
      words.push({ text: heFirst ? pair[0] : pair[1], he:  heFirst, s: base, boost: 0 });
      words.push({ text: heFirst ? pair[1] : pair[0], he: !heFirst, s: (base + PAIR_GAP) % 1, boost: 0 });
    }
    return { nodes, restLength, words, cfg, index, speed: DRIFT_PX[index] };
  }

  function build() {
    if (width < 2 || height < 2) return;      // 首帧布局未定时不要建，否则 squeeze 会算出 ±Infinity
    /* ★ 直接量底图的实际盒子，不假设它铺满视口高度 —— 窄屏下 CSS 会改成按宽度铺，
       写死 height/992 会让 stoneX 算到画框外，文字区整个消失。 */
    const sr = sceneEl.getBoundingClientRect(), ar = artboard.getBoundingClientRect();
    scale   = (sr.height || height) / SCENE_H;
    stoneX  = sr.left - ar.left + STONE_IN_CROP * scale;
    archTop = sr.top - ar.top;
    fontPx = Math.max(13, Math.min(28, sr.height * .0242));

    /* 最低一条线不能压到标题 */
    const hl = document.querySelector('.headline');
    const hlTop = hl ? height - hl.getBoundingClientRect().height
                            - parseFloat(getComputedStyle(hl).bottom || 0) : height;
    const lowest = restY(LINES[LINES.length - 1], 1) * scale;
    const squeeze = (lowest > 1 && hlTop > 80 && lowest > hlTop - 26)
                  ? Math.max(.55, (hlTop - 26) / lowest) : 1;

    /* 窄屏降一档密度，并且不放短语 —— 99px 的短语在 390px 宽的屏上会横着占掉四分之一 */
    const narrow = width < 820;
    const plan = planWords(LINES.length, narrow ? 2 : PAIRS_PER_LINE, !narrow);
    ropes = LINES.map((cfg, i) => makeRope(
      squeeze < 1 ? { y0: cfg.y0 * squeeze, y1: cfg.y1 * squeeze, dip: cfg.dip * squeeze } : cfg,
      i, plan[i]));
  }

  function resize() {
    const r = artboard.getBoundingClientRect();
    width = r.width; height = r.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    /* ★ 设置 canvas.width 会清空画布，重建后必须立刻重绘。循环被闸住时
     * （页面隐藏 / 滚出视口）没人补这一帧，ResizeObserver 的首次回调正好撞上。 */
    draw();
  }

  /* ═══════════════════════════════════════════════
   *  7. 物理
   * ═══════════════════════════════════════════════ */
  /* ★ 张力回复力 —— 和金门同一个坑。
   * 距离约束只保长度不保形状：一条折了的线长度没变，求解器认为已收敛，
   * 于是永远卡在折角上。风线重力为 0，必须显式把节点拉回设计线形。
   * 区别只在系数：金门是绷紧钢缆（.014/.026），这里是松线（.008）。 */
  function integrate(rope) {
    const k = physics.shapeK, f = physics.friction;
    for (const p of rope.nodes) {
      if (p.pinned) continue;
      const vx = (p.x - p.oldX) * f, vy = (p.y - p.oldY) * f;
      p.oldX = p.x; p.oldY = p.y;
      p.x += vx; p.y += vy;
      p.x += (p.restX - p.x) * k;
      p.y += (p.restY - p.y) * k;
    }
  }

  /* 两端固定的绳单向遍历会把误差堆到一头，每趟交替方向 */
  function constrain(rope, passes) {
    const n = rope.nodes, L = rope.restLength;
    for (let pass = 0; pass < passes; pass++) {
      n[0].x = n[0].anchorX; n[0].y = n[0].anchorY;
      const last = n.length - 1;
      n[last].x = n[last].anchorX; n[last].y = n[last].anchorY;
      const fwd = pass % 2 === 0;
      for (let k = 1; k < n.length; k++) {
        const i = fwd ? k : n.length - k;
        const a = n[i - 1], b = n[i];
        if (a.pinned && b.pinned) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.max(.0001, Math.hypot(dx, dy));
        const diff = (dist - L[i - 1]) / dist;
        if (a.pinned)      { b.x -= dx * diff; b.y -= dy * diff; }
        else if (b.pinned) { a.x += dx * diff; a.y += dy * diff; }
        else { const cx = dx * diff * .5, cy = dy * diff * .5;
               a.x += cx; a.y += cy; b.x -= cx; b.y -= cy; }
      }
    }
  }

  /* 风场：两个不同频率的行波 + 阵风。主要作用在 y 方向。
   * 端点用 sin(πt) 包络归零，否则会把钉死点扯出来。 */
  function injectWind(dt) {
    if (windIntensity <= 0 || reducedMotion) return 0;
    windPhase += dt * .55;

    gustAge += dt;
    if (gustAge > nextGust) {
      gustAge = 0; nextGust = 8 + Math.random() * 6;
      gustX = width + 200;                                  // 阵风自海（右）向陆（左）扫过
    }
    if (gustX > -300) gustX -= dt * 420;
    const amp = windIntensity * .010;
    let energy = 0;

    for (const rope of ropes) {
      const n = rope.nodes, N = n.length - 1;
      for (let i = 1; i < N; i++) {
        const t = i / N, env = Math.sin(Math.PI * t);
        let d = Math.sin(windPhase * .8 + t * 3.1) * amp                                  // 整片空气一起动 → 保住 3/2/2 分组
              + Math.sin(windPhase * 1.7 + t * 7.4 + rope.index * 1.3) * amp * .30;        // 每条线自己的小抖
        if (gustX > -300) {
          const gd = Math.abs(n[i].x - gustX);
          if (gd < 260) d += Math.cos(gd / 260 * Math.PI / 2) * amp * 2.4;
        }
        d *= env;
        n[i].y += d;
        energy = Math.max(energy, Math.abs(d));
      }
    }
    return energy / Math.max(.001, amp * 3.4);
  }

  /* 指针：吹，不是拨。垂直分量放大、沿线分量削弱（沿用金门），比例更缓。
   * ★ 同时给附近的词一个漂移加速 —— 这是这一篇的交互回报。 */
  function injectMouseDelta() {
    if (!mouse.active) return;
    const mx = mouse.x - mouse.oldX, my = mouse.y - mouse.oldY;
    const speed = Math.hypot(mx, my);
    if (speed < .01 || speed > 80) return;
    let touched = 0;

    for (const rope of ropes) {
      const n = rope.nodes;
      let strongest = 0;
      for (let i = 1; i < n.length - 1; i++) {
        const p = n[i];
        const dist = Math.hypot(p.x - mouse.oldX, p.y - mouse.oldY);
        if (dist >= physics.radius) continue;
        const falloff = 1 - dist / physics.radius;
        const prev = n[i - 1], next = n[i + 1];
        let tx = next.x - prev.x, ty = next.y - prev.y;
        const tl = Math.max(.0001, Math.hypot(tx, ty)); tx /= tl; ty /= tl;
        const along = mx * tx + my * ty;
        const px = mx - along * tx, py = my - along * ty;
        const k = physics.strength * falloff;
        p.x += (px * physics.perpGain + along * tx * physics.axialGain) * k;
        p.y += (py * physics.perpGain + along * ty * physics.axialGain) * k;
        strongest = Math.max(strongest, speed * falloff);
      }
      if (strongest > 0) {
        touched = Math.max(touched, strongest);
        // 附近的词被带着跑一下
        for (const w of rope.words) {
          const pos = sampleRope(rope, w.s);
          if (Math.hypot(pos.x - mouse.x, pos.y - mouse.y) < physics.radius * 2.2)
            w.boost = Math.min(3.4, w.boost + strongest * .06);
        }
      }
    }
    if (touched > 1.2) { brush(touched); registerInteraction(); }
  }

  function registerInteraction() {
    interactionCount++;
    if (!counterEl) return;                 // hud:false 时整块不存在
    counterEl.textContent = `${opt.labels.counter} · ${interactionCount}`;
    counterEl.classList.add('visible');
    clearTimeout(counterEl._timer);
    counterEl._timer = setTimeout(() => counterEl.classList.remove('visible'), 2000);
  }

  /* 漂移：右 → 左（地中海在画面右侧的拱内，海风由海吹向陆地） */
  function drift(dt) {
    if (reducedMotion) return;
    const ropeLen = width + OVERHANG * 2;
    for (const rope of ropes) {
      const ds = rope.speed * driftScale * dt / ropeLen;
      for (const w of rope.words) {
        w.s -= ds * (1 + w.boost);
        w.boost *= Math.pow(.35, dt);          // 约 1.5 秒衰减回基础速度
        if (w.s < 0) w.s += 1;
      }
    }
  }

  /* ═══════════════════════════════════════════════
   *  8. 绘制
   * ═══════════════════════════════════════════════ */
  function sampleRope(rope, s) {
    const n = rope.nodes, N = n.length - 1;
    const f = Math.max(0, Math.min(N - .001, s * N));
    const i = Math.floor(f), r = f - i;
    const a = n[i], b = n[Math.min(N, i + 1)];
    const ia = n[Math.max(0, i - 2)], ib = n[Math.min(N, i + 3)];
    return { x: a.x + (b.x - a.x) * r, y: a.y + (b.y - a.y) * r,
             ang: Math.atan2(ib.y - ia.y, ib.x - ia.x) };
  }

  function css(v) { return getComputedStyle(root).getPropertyValue(v).trim(); }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const lineColor = css('--wind-line') || 'rgba(61,55,48,.28)';
    const heColor = css('--hebrew'), arColor = css('--arabic');

    // 线：整条画过去，包括石头上的那一段
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.15;
    for (const rope of ropes) {
      const n = rope.nodes;
      ctx.beginPath();
      ctx.moveTo(n[0].x, n[0].y);
      for (let i = 1; i < n.length; i++) ctx.lineTo(n[i].x, n[i].y);
      ctx.stroke();
    }

    /* 词：★ 只活在左侧纸面。石头上只有线，没有词 —— 这是原型最好的一个决定。
     * ctx.fillText 传整个词，绝不逐字符：浏览器自己处理阿拉伯语连写和 RTL 强方向。 */
    /* 词只活在纸面上。桌面时拱在右边 → 在石头前 24px 收干净；
       窄屏时拱退到下方 → 拱顶以上整条都是纸，改在画框右缘收。 */
    const fadeL0 = 20, fadeL1 = 150;                    // 左侧出画淡出
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';                    // 基线压在线上，和 SVG textPath 一致

    for (const rope of ropes) {
      for (const w of rope.words) {
        const p = sampleRope(rope, w.s);
        const behindArch = p.y > archTop - 8;
        const fadeR1 = behindArch ? stoneX - 24 : width - 22;
        const fadeR0 = fadeR1 - 96;
        if (p.x >= fadeR1 || p.x < fadeL0 - 60) continue;
        let a = 1;
        if (p.x > fadeR0) a *= 1 - (p.x - fadeR0) / (fadeR1 - fadeR0);
        if (p.x < fadeL1) a *= Math.max(0, (p.x - fadeL0) / (fadeL1 - fadeL0));
        if (a <= .01) continue;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = w.he ? heColor : arColor;
        ctx.font = `400 ${(w.he ? fontPx : fontPx + 1).toFixed(1)}px ${
          w.he ? "'Frank Ruhl Libre', 'Noto Serif Hebrew', serif" : "'Amiri', 'Noto Naskh Arabic', serif"}`;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.ang);
        ctx.fillText(w.text, 0, 0);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ═══════════════════════════════════════════════
   *  9. 主循环
   * ═══════════════════════════════════════════════ */
  function tick(dt) {
    const energy = injectWind(dt);
    injectMouseDelta();
    for (const rope of ropes) { integrate(rope); constrain(rope, 6); }
    drift(dt);
    updateWindSound(energy);
  }

  function frame(ts) {
    const dt = Math.min(.05, lastT ? (ts - lastT) / 1000 : .016);
    lastT = ts;
    tick(dt);
    draw();
    rafId = requestAnimationFrame(frame);
  }
  /* 只有在「文档可见 且 场景在视口内」时才允许循环起来 */
  function start() {
    if (!rafId && !document.hidden && onScreen) { lastT = 0; rafId = requestAnimationFrame(frame); }
  }
  function stop()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  /* ═══════════════════════════════════════════════
   * 10. 事件
   * ═══════════════════════════════════════════════ */
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

  on(canvas, 'pointerenter', enter);
  on(canvas, 'pointermove', move);
  on(canvas, 'pointerleave', leave);
  on(window, 'resize', resize);
  on(root, 'pointerdown', unlockSound, { passive: true });

  /* 页面不可见时暂停物理、渲染和声音 */
  on(document, 'visibilitychange', () => {
    if (document.hidden) { stop(); silence(); } else start();
  });

  /* 容器尺寸变化也要重建——嵌进页面后，栏目宽度变了但视口没变的情况很常见 */
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => resize());
    ro.observe(root);
    cleanup.push(() => ro.disconnect());
  }

  /* ★ 滚出视口就停。作为页面里的一段，访客在读别处时不该还在满帧烧 CPU。 */
  if (opt.pauseOffscreen && window.IntersectionObserver) {
    const io = new IntersectionObserver(es => {
      onScreen = es[0].isIntersecting;
      if (onScreen) start(); else { stop(); silence(); }
    }, { rootMargin: '120px' });
    io.observe(root);
    cleanup.push(() => io.disconnect());
  }

  /* ★ 主题写在场景根元素上，不碰 <html> —— 否则会和宿主站点的主题系统抢属性 */
  const themeToggle = root.querySelector('.toggle-theme');
  const soundToggle = root.querySelector('.toggle-sound');

  function applyTheme(night) {
    if (night) root.setAttribute('data-theme', 'night');
    else root.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.textContent = night ? '☾' : '☀';
      themeToggle.classList.toggle('active', night);
    }
    if (opt.persistTheme) { try { localStorage.setItem(THEME_KEY, night ? 'night' : 'day'); } catch (e) {} }
  }
  function setTheme(mode) { applyTheme(mode === 'night'); }

  let startNight = opt.theme === 'night';
  if (opt.persistTheme) {
    try { startNight = (localStorage.getItem(THEME_KEY) || opt.theme) === 'night'; } catch (e) {}
  }
  if (opt.allowUrlOverrides) {
    const tp = new URLSearchParams(location.search).get('theme');
    if (tp) startNight = tp === 'night';
  }
  applyTheme(startNight);
  if (themeToggle) on(themeToggle, 'click', () =>
    applyTheme(root.getAttribute('data-theme') !== 'night'));

  if (soundToggle) {
    soundToggle.textContent = soundEnabled ? opt.labels.soundOn : opt.labels.soundOff;
    soundToggle.classList.toggle('active', soundEnabled);
    on(soundToggle, 'click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) { unlockSound(); soundToggle.textContent = '♪'; soundToggle.classList.add('active'); }
      else { silence(); soundToggle.textContent = '✕'; soundToggle.classList.remove('active'); }
    });
  }

  if (configure && settings) on(configure, 'click', () => {
    const open = settings.hidden;
    settings.hidden = !open;
    configure.setAttribute('aria-expanded', String(open));
  });
  if (resetBtn) on(resetBtn, 'click', build);
  function bindRange(id, outId, fn) {
    const input = root.querySelector(`[data-kc="${id}"]`);
    const out = root.querySelector(`[data-kc-out="${id}"]`);
    if (!input || !out) return;
    on(input, 'input', () => { out.value = input.value; fn(Number(input.value)); });
  }
  bindRange('strength', 'strengthValue', v => { physics.strength = v / 100; });
  bindRange('reach',    'reachValue',    v => { physics.radius = v; });
  bindRange('inertia',  'inertiaValue',  v => { physics.friction = v / 1000; });
  bindRange('wind',     'windValue',     v => { windIntensity = v; });
  bindRange('drift',    'driftValue',    v => { driftScale = v / 100; });

  /* ---- 调试钩子（?debug=1） ---- */
  function exposeDebug() {
    window.__jaffa = {
      get ropes() { return ropes; },          // getter：build() 会重新赋值 ropes，不能抓快照
      physics,
      get drift() { return driftScale; }, set drift(v) { driftScale = v; },
      get wind() { return windIntensity; }, set wind(v) { windIntensity = v; },
      gust(x = width * .8) { gustX = x; },
      /* 模拟一次匀速划过：比手动拨鼠标可复现得多（沿用金门的做法）。
         同步推进，不依赖 rAF，所以隐藏窗口/无头浏览器里也能测。 */
      sweep(x0, y0, dx, n = 12) {
        mouse.active = true;
        mouse.x = mouse.oldX = x0; mouse.y = mouse.oldY = y0;
        for (let i = 0; i < n; i++) {
          mouse.oldX = mouse.x; mouse.oldY = mouse.y;
          mouse.x += dx;
          tick(1 / 60);
        }
        mouse.active = false;
      },
      settle(n = 60) { stop(); for (let i = 0; i < n; i++) tick(1 / 60); draw(); },
      spread() {
        let m = 0;
        for (const r of ropes) for (const p of r.nodes)
          m = Math.max(m, Math.hypot(p.x - p.restX, p.y - p.restY));
        return +m.toFixed(2);
      },
      geometry: () => ({ width, height, scale: +scale.toFixed(4), stoneX: +stoneX.toFixed(1), archTop: +archTop.toFixed(1), fontPx: +fontPx.toFixed(1) })
    };
  }

  function init() {
    root.querySelectorAll('.ag-char').forEach(el => attachAntiGravity(el, {
      floatAmp: 3 + Math.random() * 3.5,
      floatSpeed: .22 + Math.random() * .26,
      rotAmp: .5 + Math.random() * 1.1
    }));
    resize();
    if (DEBUG) { exposeDebug(); window.__jaffa = window.__veil || window.__jaffa; }
    start();
  }

  /* 卸载：释放 rAF、监听器、观察器和音频节点。 */
  function destroy() {
    stop();
    silence();
    cleanup.forEach(fn => { try { fn(); } catch (e) {} });
    cleanup.length = 0;
    if (audioCtx && audioCtx.state !== 'closed') audioCtx.close().catch(() => {});
    root.innerHTML = '';
    root.classList.remove('jaffa-scene');
    root.removeAttribute('data-theme');
  }

  const handle = {
    el: root, destroy, setTheme,
    render() { tick(.016); draw(); },
    get running() { return rafId !== null; },
    setSound(v) { soundEnabled = !!v; if (soundEnabled) unlockSound(); else silence(); }
  };

  if (sceneEl.complete) init();
  else { on(sceneEl, 'load', init); on(sceneEl, 'error', init); }
  return handle;
}
