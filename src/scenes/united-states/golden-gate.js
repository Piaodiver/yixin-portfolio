/* Golden Gate Signal Curtain —— 可嵌入组件
 *
 *   import { mountGoldenGate } from './golden-gate.js';
 *   const scene = mountGoldenGate('#bay', { chrome: false, title: false });
 *   scene.destroy();
 *
 * 配套 golden-gate.css。样式全在 .gg-scene 作用域下，不会外溢。
 * 物理与绘制代码与定稿版逐字节一致，这一层只负责 DOM、作用域和生命周期。 */

export const DEFAULTS = {
  // —— 界面部件：嵌进自己网站时通常全部关掉 ——
  chrome:   true,   // 顶部条：品牌 + 导航 + 昼夜/声音/配置按钮
  title:    true,   // 左下标题区
  hud:      true,   // 进度条 + 触碰计数
  cursor:   true,   // 自定义圆环光标
  settings: true,   // 配置面板（chrome 关掉时自动跟着关）

  // —— 文案：改这里，不用动 HTML ——
  brand:       '金门大桥',
  brandSuffix: ' · Golden Gate',
  nav:      [{ label: '首页', href: '#' }, { label: '地标', href: '#' }, { label: '社区', href: '#' }],
  heading:  'Golden Gate Bridge',
  subtitle: 'Bridge of Signals',
  locality: 'SAN FRANCISCO',
  ariaLabel: '金门大桥的主缆与吊索，指针拨动后会像琴弦一样振动；索上排布英文关键词',

  // —— 行为 ——
  sound: 'off',            // 'off' | 'on' —— 作品集里默认静音
  theme: 'day',            // 'day' | 'night'
  persistTheme: false,     // 嵌入时别写 localStorage，会和宿主站点的主题互相打架
  pauseOffscreen: true,    // 滚出视口就暂停物理与渲染
  textMode: 'words',       // 'words' | 'dense' | 'path'
  words: null,             // 给数组即覆盖 keywords.txt，且不再发起 fetch
  cableText: null,
  assetBase: 'assets/',    // keywords.txt 所在目录，按你站点的路径改
  allowUrlOverrides: false // 只有独立演示页才该开
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function markup(o) {
  const chars = [...String(o.heading)].map(c =>
    c === ' ' ? '<span class="sp"> </span>' : `<span class="ag-char">${esc(c)}</span>`).join('');
  const nav = (o.nav || []).map(n => `<a href="${esc(n.href || '#')}">${esc(n.label)}</a>`).join('');
  return `
<main class="artboard">
  <canvas class="scenery" aria-hidden="true"></canvas>
  <div class="fog" aria-hidden="true"></div>
  <canvas class="bridge" aria-label="${esc(o.ariaLabel)}"></canvas>
${o.chrome ? `  <header class="masthead">
    <a class="brand" href="#">${esc(o.brand)}<span class="brand-en">${esc(o.brandSuffix)}</span></a>
    <nav class="nav-links" aria-label="Primary">${nav}</nav>
    <div class="masthead-actions">
      <button class="toggle-btn toggle-theme" type="button" title="切换昼夜主题" aria-label="切换昼夜主题">☀</button>
      <button class="toggle-btn toggle-sound" type="button" title="开关声音" aria-label="开关声音">♪</button>
      ${o.settings ? '<button class="configure" type="button" aria-expanded="false">配置</button>' : ''}
    </div>
  </header>` : ''}
${o.title ? `  <section class="headline">
    <h1>${chars}</h1>
    ${o.subtitle ? `<p class="subtitle"><span class="accent-rule" aria-hidden="true"></span>${esc(o.subtitle)}</p>` : ''}
    ${o.locality ? `<p class="locality">${esc(o.locality)}</p>` : ''}
  </section>` : ''}
${o.hud ? `  <div class="progress" aria-hidden="true"></div>
  <div class="counter" aria-hidden="true">桥索拨动 · 0</div>` : ''}
${o.cursor ? '  <div class="cursor" aria-hidden="true"></div>' : ''}
${o.chrome && o.settings ? `  <aside class="settings" hidden>
    <div class="setting"><label>Strength <output data-gg-out="strength">85</output></label><input data-gg="strength" type="range" min="20" max="140" value="85"></div>
    <div class="setting"><label>Reach <output data-gg-out="reach">48</output></label><input data-gg="reach" type="range" min="24" max="90" value="48"></div>
    <div class="setting"><label>Inertia <output data-gg-out="inertia">985</output></label><input data-gg="inertia" type="range" min="940" max="996" value="985"></div>
    <div class="setting"><label>Bay Wind <output data-gg-out="wind">0</output></label><input data-gg="wind" type="range" min="0" max="100" value="0"></div>
    <button class="reset-btn" type="button">Reset cables</button>
  </aside>` : ''}
</main>`;
}

let seq = 0;

export function mountGoldenGate(host, options = {}) {
  const opt = { ...DEFAULTS, ...options };
  if (!opt.chrome) opt.settings = false;
  const root = typeof host === 'string' ? document.querySelector(host) : host;
  if (!root) throw new Error('mountGoldenGate: 找不到容器元素 ' + host);

  const THEME_KEY = 'gg-theme-' + (++seq);
  root.classList.add('gg-scene');
  root.innerHTML = markup(opt);

  const cleanup = [];
  const on = (t, ev, fn, o2) => {
    t.addEventListener(ev, fn, o2);
    cleanup.push(() => t.removeEventListener(ev, fn, o2));
  };

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let audioCtx = null;
  let soundEnabled = opt.sound === 'on';

  /* ═══════════════════════════════════════════════
   *  1. 反重力标题（与天坛篇同一套）
   * ═══════════════════════════════════════════════ */
  function attachAntiGravity(el, opts = {}) {
    const {
      floatAmp = 5, floatSpeed = 0.35, rotAmp = 1.5,
      pushRadius = 130, pushForce = 20, springK = 0.055, damping = 0.89
    } = opts;

    let vx = 0, vy = 0, ox = 0, oy = 0;
    let phase = Math.random() * Math.PI * 2;
    let lastSoundTime = 0, rafId = null, isPushed = false;

    // 标题用的音阶比珠帘更低一层，和桥索声保持同一世界
    const pentatonic = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63];

    function playChime(freq, duration, volume) {
      if (!audioCtx || audioCtx.state !== 'running' || !soundEnabled) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.frequency.value = freq; osc.type = 'sine';
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.start(now); osc.stop(now + duration);
    }

    function pose() {
      const t = Date.now() / 1000;
      const fy = Math.sin(t * floatSpeed + phase) * floatAmp;
      const fx = Math.cos(t * floatSpeed * 0.7 + phase) * (floatAmp * 0.35);
      const rz = Math.sin(t * floatSpeed * 0.45 + phase) * rotAmp;
      el.style.transform = `translate(${fx + ox}px, ${fy + oy}px) rotate(${rz}deg)`;
    }

    function floatTick() { if (!isPushed) pose(); }

    function physicsTick() {
      if (!isPushed && Math.abs(ox) < 0.1 && Math.abs(oy) < 0.1 &&
          Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01) {
        ox = oy = vx = vy = 0; rafId = null; return;
      }
      vx = (vx + (-ox * springK)) * damping;
      vy = (vy + (-oy * springK)) * damping;
      ox += vx; oy += vy;
      pose();
      rafId = requestAnimationFrame(physicsTick);
    }

    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = cx - e.clientX, dy = cy - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pushRadius && dist > 0) {
        const force = (pushRadius - dist) / pushRadius * pushForce;
        vx += (dx / dist) * force * 0.12;
        vy += (dy / dist) * force * 0.12;
        isPushed = true;
        const now = Date.now();
        if (now - lastSoundTime > 90) {
          playChime(pentatonic[Math.abs(el.textContent.charCodeAt(0)) % pentatonic.length], 0.14, 0.028);
          lastSoundTime = now;
        }
        if (!rafId) rafId = requestAnimationFrame(physicsTick);
      }
    });

    el.addEventListener('mouseleave', () => {
      isPushed = false;
      if (!rafId) rafId = requestAnimationFrame(physicsTick);
      playChime(pentatonic[Math.abs(el.textContent.charCodeAt(0)) % pentatonic.length] * 0.5, 0.2, 0.02);
    });

    cleanup.push((id => () => clearInterval(id))(setInterval(floatTick, 33)));
  }

  /* ═══════════════════════════════════════════════
   *  2. 几何：桥的比例全部按视口归一化
   *     （天坛篇靠图上量出来的 901/682/726；
   *      这里桥是 Canvas 画的，几何即代码，不需要标定）
   * ═══════════════════════════════════════════════ */
  const GEO = {
    // 双塔全景，比例照参考图量出（近塔靠左、远塔靠右、桥面向右下透视）
    // 全部换算自 design-spec.json 的 1672×941 参考坐标系
    nearTowerX: .1824,  // 305/1672，主缆峰顶所在
    farTowerX:  .9091,  // 1520/1672
    nearSaddleY:.1169,  // 110/941
    farSaddleY: .3910,  // 368/941
    deckY:      .6153,  // 桥面中点 (538+620)/2 / 941
    deckTilt:   .0872,  // (620-538)/941，桥面左高右低
    leftAnchorX: -.22, leftAnchorY: .50,   // 窄屏回退用
    rightAnchorX: 1.25, rightAnchorY: .60,
    sideSagL: .03, sideSagR: .02
  };

  /* 窄屏（<720px）裁成单塔近景：远塔推到画外，只看得到主缆下坠并驶出画面。
   * 整跨硬塞进 375px 会把优雅的悬链线压成一个尖 V。 */
  const GEO_NARROW = {
    nearTowerX: .30,  nearSaddleY: .085,
    farTowerX: 2.10,  farSaddleY: .52,
    leftAnchorX: -.90, leftAnchorY: .58,
    rightAnchorX: 3.20, rightAnchorY: .40,
    deckTilt: .030            // 窄屏收窄倾斜，否则桥面会歪得很夸张
  };

  const REF_W = 1672, REF_H = 941;

  /* design-spec.json 的 mainCableSvgPath：四段三次贝塞尔。
   * 直接采样这条曲线，而不是拿抛物线去拟合——设计线形即静止形态，
   * 左峰、中央低谷、右侧次峰的连续张力是 spec 里不可破坏的约束。 */
  const CABLE_BEZ = [
    [[0, 270],    [120, 230],  [215, 125],  [305, 110]],
    [[305, 110],  [500, 300],  [760, 495],  [1195, 542]],
    [[1195, 542], [1340, 550], [1455, 420], [1520, 368]],
    [[1520, 368], [1570, 402], [1620, 432], [1672, 458]]
  ];
  // 岸锚延伸出画外，波才荡得出画面（spec 的路径只到画框边）
  const EXT_L = [[-236, 348], [0, 270]], EXT_R = [[1672, 458], [1908, 576]];

  function bezAt(b, t) {
    const u = 1 - t, a = u * u * u, c1 = 3 * u * u * t, c2 = 3 * u * t * t, d = t * t * t;
    return [a * b[0][0] + c1 * b[1][0] + c2 * b[2][0] + d * b[3][0],
            a * b[0][1] + c1 * b[1][1] + c2 * b[2][1] + d * b[3][1]];
  }

  function specCable(seg) {
    const sx = width / REF_W, sy = height / REF_H;
    const pts = [];
    const push = (x, y) => {
      const q = { x: x * sx, y: y * sy };
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(q.x - last.x, q.y - last.y) > .5) pts.push(q);
    };
    const line = (a, b, incl) => {
      const n = Math.max(2, Math.round(Math.hypot((b[0] - a[0]) * sx, (b[1] - a[1]) * sy) / seg));
      for (let i = incl ? 1 : 0; i <= (incl ? n : n - 1); i++)
        push(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n);
    };
    line(EXT_L[0], EXT_L[1], false);
    const marks = [];
    CABLE_BEZ.forEach(b => {
      let L = 0, prev = bezAt(b, 0);
      for (let i = 1; i <= 24; i++) {
        const q = bezAt(b, i / 24);
        L += Math.hypot((q[0] - prev[0]) * sx, (q[1] - prev[1]) * sy); prev = q;
      }
      marks.push(pts.length);                       // 该段起点在 pts 中的下标
      const m = Math.max(3, Math.round(L / seg));
      for (let i = 0; i < m; i++) { const q = bezAt(b, i / m); push(q[0], q[1]); }
    });
    push(1672, 458);
    line(EXT_R[0], EXT_R[1], true);
    return { pts, nearIdx: marks[1], farIdx: marks[3] };   // 两段起点即两处鞍座
  }

  /* 垂度不能写成「视口高度的百分比」——跨度按宽度走、垂度按高度走，
   * 窄高屏上垂度就会大于跨度。改成：由竖向可用空间决定，再用跨度封顶。 */
  function sagFor(spanX, saddleY) {
    return Math.min((deckPx - saddleY) * .52, Math.abs(spanX) * .75);
  }

  /* 桥面在某个 x 处的高度。倾斜以画面中线为轴，两边各一半落差。 */
  function deckYAt(x) {
    return deckPx + (G.deckTilt || 0) * height * (x / Math.max(1, width) - .5);
  }

  // 桥体配色（JS 侧，方便做渐变；与 CSS 变量保持一致）
  const PALETTE = {
    day: {
      orange: [168, 72, 46],  bridgeDark: [105, 48, 33], bead: [204, 90, 53],
      steel:  [120, 134, 140], ink: [19, 18, 17],
      signal: [53, 191, 210], accent: [203, 230, 33],
      sun:  [248, 244, 236],  fog: [255, 255, 255],
      hill: [185, 196, 200],  hillFar: [216, 221, 220],
      city: [122, 134, 140],  water: [185, 196, 200],
      fogK: 1
    },
    night: {
      orange: [212, 98, 63],  bridgeDark: [138, 64, 40], bead: [224, 118, 74],
      steel:  [92, 116, 126],  ink: [234, 230, 220],
      signal: [79, 216, 232], accent: [203, 230, 33],
      sun:  [150, 178, 196],  fog: [110, 160, 184],
      hill: [30, 48, 60],     hillFar: [22, 36, 46],
      city: [16, 28, 36],     water: [18, 32, 42],
      fogK: .32
    }
  };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  let pal = PALETTE.day;
  let G = GEO;                 // 当前生效的几何（窄屏会被 GEO_NARROW 覆盖）

  /* ═══════════════════════════════════════════════
   *  3. DOM 与状态
   * ═══════════════════════════════════════════════ */
  const artboard  = root.querySelector('.artboard');
  const canvas    = root.querySelector('.bridge');
  const ctx       = canvas.getContext('2d');
  const skyCanvas = root.querySelector('.scenery');
  const sky       = skyCanvas.getContext('2d');
  // 以下都可能被 options 关掉，一律容忍缺席
  const cursor    = root.querySelector('.cursor');
  const configure = root.querySelector('.configure');
  const settings  = root.querySelector('.settings');
  const resetBtn  = root.querySelector('.reset-btn');
  const counterEl = root.querySelector('.counter');

  let cable = null;          // 主缆（一根从左岸锚到右岸锚的连续绳）
  const suspenders = [];     // 吊索：顶端跟随主缆节点，底端钉在桥面

  // 文字源（异步从 assets/keywords.txt 覆盖）
  /* 吊索排版模式（?type= 可临时覆盖，选定后把默认值改掉即可）
   *   dense —— 每个节点一个字母，连续字母流（= 天坛珠帘的机制）
   *   words —— 少数吊索各挂一个完整短词，字母直立堆叠，高度错落
   *   path  —— 少数吊索各挂一个完整短词，字母沿索方向旋转，随索弯曲 */
  let TEXT_MODE = 'words';
  let TOWER = 'v2';            // ?tower=v1 切回旧塔身，用于对比
  const WORD_EVERY = 3;        // words / path 模式下：每几条索挂一个词
  // HANDOFF.md 的标准词表（fetch 失败时的回退，必须与 keywords.txt 一致）
  // fetch 失败时的回退，必须与 keywords.txt 一致
  let WORDS = ['BUILD', 'SIGNAL', 'MODEL', 'LEARN', 'PROMPT', 'CRAFT',
               'CONNECTION', 'TRAIN', 'MOMENTUM', 'ADAPT', 'REASON', 'CURIOSITY'];
  let CABLE_TEXT = 'SIGNALS CROSS THE SPAN · SHAPING HOW I BUILD · ';

  const mouse = { x: -999, y: -999, oldX: -999, oldY: -999, active: false };

  /* 物理参数：和天坛篇是同一个 Verlet 求解器，但常数完全不同
   * 天坛 = 单端悬挂的钟摆（gravity .18, friction .965, radius 34）
   * 金门 = 两端固定的琴弦（gravity 近 0，靠张力回弹；余振更长、影响半径更大） */
  const physics = {
    strength: .85,
    radius: 48,
    friction: .985,       // 余振比天坛(.965)长得多
    cableGravity: .02,
    suspGravity: .03,
    cableShapeK: .014,    // 主缆张力：慢、沉、荡得远
    suspShapeK: .026,     // 吊索张力：快一些，像细弦
    cableGive: .34,       // 主缆更重，同样的手速推不动那么多
    suspGive: 1,
    iterations: 10,
    perpGain: 1.6,   // 垂直于索的分量放大 → "拨弦"
    axialGain: .30   // 沿索方向的分量削弱 → 不会被指针拖着走
  };

  const sound = {
    context: null, output: null,
    lastStrike: [], lastGlobal: 0, lastHorn: 0, voices: 0,
    // 低两个八度的五声音阶（C3–A4）：比天坛的 C5–A6 更低、更开阔
    scale: [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00]
  };

  let onScreen = true;          // 由 IntersectionObserver 维护
  let width = 0, height = 0, dpr = 1;
  // 桥面/雾/地平线的像素位置：由 GEO 比例算出，再按标题实际高度让位
  let deckPx = 0, fadeEndPx = 0, horizonPx = 0;
  let interactionCount = 0;
  let windIntensity = 0, windPhase = 0;
  let rafId = null;

  /* ═══════════════════════════════════════════════
   *  4. 音频：钢索拨弦 + 稀有雾笛
   * ═══════════════════════════════════════════════ */
  function unlockSound() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!sound.context) {
      const c = new AC();
      const output = c.createGain();
      const comp = c.createDynamicsCompressor();
      const delay = c.createDelay(.6);
      const fb = c.createGain();
      const wet = c.createGain();
      output.gain.value = .58;
      comp.threshold.value = -20; comp.ratio.value = 3.5;
      // 比天坛长得多的延时与反馈 → "开阔"
      delay.delayTime.value = .28; fb.gain.value = .26; wet.gain.value = .18;
      output.connect(comp); output.connect(delay);
      delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(comp);
      comp.connect(c.destination);
      sound.context = c; sound.output = output;
    }
    if (sound.context.state === 'suspended') sound.context.resume().catch(() => {});
    if (!audioCtx) audioCtx = sound.context;
  }

  /* 钢索被拨动的音色
   * 分音比 1 / 2.003 / 3.012 / 4.03 —— 略微「拉伸」的近整数比，是绷紧钢弦的特征
   * （天坛的 2.01 / 3.96 是编钟被「压缩」的泛音，两套不能混）
   * 另加一个 0.5 倍频的低频体感，衰减比天坛长一倍以上 */
  const PARTIALS = [
    { ratio: 0.5,   amount: .14, decay: .92 },
    { ratio: 1,     amount: 1,   decay: 1   },
    { ratio: 2.003, amount: .42, decay: .74 },
    { ratio: 3.012, amount: .18, decay: .50 },
    { ratio: 4.03,  amount: .08, decay: .34 }
  ];

  function strikeCable(idx, impact, x) {
    const c = sound.context;
    if (!c || c.state !== 'running' || impact < 1.2 || !soundEnabled) return;
    const ts = performance.now();
    if (ts - (sound.lastStrike[idx] || 0) < 140) return;   // 同索去抖（音长，抖动阈值比天坛大）
    if (ts - sound.lastGlobal < 34 || sound.voices >= 6) return;
    sound.lastStrike[idx] = ts; sound.lastGlobal = ts; sound.voices++;

    const now = c.currentTime;
    const freq = sound.scale[idx % sound.scale.length];
    const level = .024 + Math.min(impact, 20) / 20 * .066;
    const dur = 1.6 + Math.random() * .8;

    const pan = c.createStereoPanner ? c.createStereoPanner() : c.createGain();
    if (pan.pan) pan.pan.setValueAtTime(Math.max(-.9, Math.min(.9, x / width * 2 - 1)), now);
    pan.connect(sound.output);

    PARTIALS.forEach(p => {
      const osc = c.createOscillator();
      const env = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p.ratio, now);
      osc.detune.setValueAtTime((Math.random() - .5) * 6, now);
      env.gain.setValueAtTime(level * p.amount, now);
      env.gain.exponentialRampToValueAtTime(.0001, now + dur * p.decay);
      osc.connect(env); env.connect(pan);
      osc.start(now); osc.stop(now + dur + .05);
    });

    setTimeout(() => { sound.voices = Math.max(0, sound.voices - 1); pan.disconnect(); },
              (dur + .2) * 1000);

    // 雾笛：只在大幅拨动、且至少 9 秒没响过时出现的稀有彩蛋
    if (impact > 14 && ts - sound.lastHorn > 9000 && Math.random() < .5) {
      sound.lastHorn = ts;
      foghorn();
    }
  }

  function foghorn() {
    const c = sound.context;
    if (!c || !soundEnabled) return;
    const now = c.currentTime;
    const bus = c.createGain();
    bus.gain.setValueAtTime(.0001, now);
    bus.gain.exponentialRampToValueAtTime(.05, now + .35);   // 慢起
    bus.gain.setValueAtTime(.05, now + 1.5);
    bus.gain.exponentialRampToValueAtTime(.0001, now + 2.8);
    bus.connect(sound.output);
    [110, 116.54].forEach(f => {                              // 双音，微微打拍
      const o = c.createOscillator();
      o.type = 'triangle'; o.frequency.setValueAtTime(f, now);
      o.connect(bus); o.start(now); o.stop(now + 2.9);
    });
    setTimeout(() => bus.disconnect(), 3100);
  }

  /* ═══════════════════════════════════════════════
   *  5. 建桥：把主缆与吊索建成 Verlet 绳
   * ═══════════════════════════════════════════════ */

  /* 抛物线采样：弦 + 对称垂度。restLength 取每段实际初始长度，
   * 所以「设计好的垂度就是静止形态」，扰动后会回到这条曲线。 */
  function samplePath(p0, p1, sag, seg) {
    const chord = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const n = Math.max(4, Math.round(chord / seg) + 1);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      pts.push({
        x: p0.x + (p1.x - p0.x) * t,
        y: p0.y + (p1.y - p0.y) * t + sag * 4 * t * (1 - t)
      });
    }
    return pts;
  }

  function makeRope(pts, pinnedIdx, gravity) {
    const nodes = pts.map(p => ({
      x: p.x, y: p.y, oldX: p.x, oldY: p.y,
      anchorX: p.x, anchorY: p.y,      // 钉死点的位置
      restX: p.x, restY: p.y,          // 设计线形：张力要把节点拉回这里
      pinned: false, restLength: 0
    }));
    for (let i = 1; i < nodes.length; i++) {
      nodes[i].restLength = Math.hypot(nodes[i].x - nodes[i - 1].x, nodes[i].y - nodes[i - 1].y) * .997;
    }
    pinnedIdx.forEach(i => { nodes[i].pinned = true; });
    return { nodes, gravity };
  }

  /* 桥面不能压到左下角的标题：矮视口下按标题实际高度把桥面往上顶。
   * 这也顺带把塔基的雾和地平线一起带上去。 */
  function layout() {
    const hl = root.querySelector('.headline');
    const hlTop = hl ? height - hl.getBoundingClientRect().height
                            - parseFloat(getComputedStyle(hl).bottom || 0) : height;
    deckPx = Math.min(height * GEO.deckY, hlTop - 18);
    deckPx = Math.max(height * .40, deckPx);          // 也别顶得太高
    const below = height - deckPx;
    // ★ 近塔现在压在标题的横向范围内（参考图的构图），所以塔基必须在标题上沿之前
    //   就化尽，否则会有一层橙雾糊在 "Golden" 上。
    fadeEndPx = Math.min(deckPx + below * .46, hlTop - 10);
    horizonPx = deckPx + below * .60;
    const fog = root.querySelector('.fog');
    if (fog) { fog.style.top = `${deckPx - below * .10}px`; fog.style.height = `${below * .60}px`; }
  }

  function build() {
    const narrow = width < 720;
    G = narrow ? { ...GEO, ...GEO_NARROW } : GEO;
    const X = f => f * width, Y = f => f * height;
    layout();

    const nearSaddle = { x: X(G.nearTowerX), y: Y(G.nearSaddleY) };
    const farSaddle  = { x: X(G.farTowerX),  y: Y(G.farSaddleY) };
    const leftAnchor = { x: X(G.leftAnchorX),  y: Y(G.leftAnchorY) };
    const rightAnchor= { x: X(G.rightAnchorX), y: Y(G.rightAnchorY) };
    const seg = narrow ? 14 : 11;

    let pts, pinned, saddles;
    if (narrow) {
      // 窄屏：spec 要求专门的移动构图，沿用单塔近景的抛物线拼接
      const a = samplePath(leftAnchor, nearSaddle, Y(G.sideSagL), seg);
      const b = samplePath(nearSaddle, farSaddle,  sagFor(farSaddle.x - nearSaddle.x, nearSaddle.y), seg);
      const c = samplePath(farSaddle,  rightAnchor,Y(G.sideSagR), seg);
      pts = a.concat(b.slice(1), c.slice(1));
      saddles = [a.length - 1, a.length + b.length - 2];
    } else {
      const r = specCable(seg);
      pts = r.pts; saddles = [r.nearIdx, r.farIdx];
    }
    pinned = [0, saddles[0], saddles[1], pts.length - 1];
    cable = makeRope(pts, pinned, physics.cableGravity);
    cable.shapeK = physics.cableShapeK;
    cable.give = physics.cableGive;
    cable.saddleIdx = saddles;

    /* 吊索系统（spec §文案和文字插入规则 / §珠点和信号节点）
     *  - 桌面 52–72 条，普通索:珠点索:文字索 ≈ 2:2:1
     *  - 近塔两侧密、主跨低谷处明显疏开
     *  - 只用 HANDOFF.md 的 11 个标准词，不用随机字母填充 */
    suspenders.length = 0;
    const nearX = X(G.nearTowerX), farXc = X(G.farTowerX);
    const half = Math.max(1, (farXc - nearX) * .5);
    const gapAt = x => {
      if (narrow) return 38;
      const t = Math.min(1, Math.min(Math.abs(x - nearX), Math.abs(x - farXc)) / half);
      return 14 + 15 * (t * t * (3 - 2 * t));      // 塔边 14px → 跨中 29px
    };
    const nodeGap = narrow ? 15 : 14;
    const towerHalf = width * (narrow ? .0604 : .0318) + 6;
    let lastX = -Infinity, stream = 0;
    const letters = (WORDS.join(' · ') + ' · ').toUpperCase();

    for (let ci = 1; ci < cable.nodes.length; ci++) {
      const top = cable.nodes[ci];
      if (top.x < -30 || top.x > farXc + 4) continue;
      // 塔身范围内不挂吊索——真桥的吊索从塔的外侧才开始
      if (Math.abs(top.x - nearX) < towerHalf) continue;
      if (!narrow && Math.abs(top.x - farXc) < width * .016) continue;
      if (top.x - lastX < gapAt(top.x)) continue;
      const len = deckYAt(top.x) - top.y;          // 桥面是斜的，逐条索取当地高度
      if (len < 22) continue;
      lastX = top.x;

      const rows = Math.max(4, Math.round(len / nodeGap) + 1);
      const pts2 = [];
      for (let r = 0; r < rows; r++) {
        const t = r / (rows - 1);
        pts2.push({ x: top.x, y: top.y + len * t });
      }
      const rope = makeRope(pts2, [0, rows - 1], physics.suspGravity);
      rope.shapeK = physics.suspShapeK;
      rope.give = physics.suspGive;
      rope.cableIdx = ci;
      rope.col = suspenders.length;
      // 2:2:1 —— 每五条里两条普通、两条珠点、一条文字
      const m = rope.col % 5;
      rope.kind = m < 2 ? 'plain' : (m < 4 ? 'bead' : 'word');
      rope.chars = []; rope.alphas = [];
      for (let r = 0; r < rows; r++) {
        rope.chars.push(letters[stream % letters.length]); stream++;
        rope.alphas.push(.34 + ((rope.col + r * 2) % 6) * .055);
      }
      rope.word = null; rope.signal = false;
      suspenders.push(rope);
    }
    assignWords();
    assignSignalNodes();
    assignWords();
  }

  /* 整词模式的分词：★ 长词配长索。
   * 吊索长度从跨中的 ~105px 到塔边的 ~510px 相差五倍，
   * 按索的序号轮流发词的话，7 个字母的词迟早会落到只装得下 5 个字母的短索上。
   * 所以两边都按长度排序再对齐，并且装不下就干脆不挂——少挂几个词只会更安静。 */
  /* 响应式词量与节点量，见 design-spec.json §responsive */
  function budgets() {
    if (width >= 1440) return { words: 11, nodes: 8 };
    if (width >= 900)  return { words: 8,  nodes: 6 };
    if (width >= 600)  return { words: 5,  nodes: 4 };
    return { words: 4, nodes: 3 };
  }

  /* 青色信号节点：只出现在主缆与选定吊索的连接处，数量克制 */
  function assignSignalNodes() {
    suspenders.forEach(r => { r.signal = false; });
    const n = budgets().nodes;
    if (!suspenders.length || n < 1) return;
    for (let i = 0; i < n; i++) {
      const idx = Math.round((i + .5) * suspenders.length / n);
      const rope = suspenders[Math.min(suspenders.length - 1, idx)];
      if (rope) rope.signal = true;
    }
  }

  function assignWords() {
    const vis = r => r.nodes[0].x > 10 && r.nodes[0].x < width - 6;
    const slots = suspenders.filter(r => r.kind === 'word' && vis(r));
    const byLen = [...slots].sort((a, b) => b.nodes.length - a.nodes.length);
    /* ★ 贪心装配：长索优先，每条取「装得下的最长未用词」。
     * 直接按长度 zip 会让尾部的短索分到装不下的词，白白空掉几条。 */
    const pool = WORDS.map(w => w.toUpperCase())
                      .slice(0, budgets().words)
                      .sort((a, b) => b.length - a.length);
    suspenders.forEach(r => { r.word = null; });
    byLen.forEach(rope => {
      const rows = rope.nodes.length;
      const k = pool.findIndex(w => w.length <= rows - 2);
      if (k < 0) return;
      const w = pool.splice(k, 1)[0];
      rope.word = w;
      const frac = [.30, .58, .42, .70, .36, .62, .48][rope.col % 7];
      rope.wordStart = Math.max(1, Math.min(rows - w.length - 1,
                                            Math.round((rows - w.length) * frac)));
    });

    /* 还有词没挂上，就把最长的非文字索改成文字索。
     * 跨中的索只有 4–5 个节点，连 SPAN 都装不下，硬塞会把词挤成一团。 */
    while (pool.length) {
      const w = pool[pool.length - 1];                  // 先安置最短的，位置最自由
      const placed = suspenders.filter(r => r.word);
      let best = null, bestGap = -1;
      for (const rope of suspenders) {
        if (rope.word || !vis(rope) || rope.nodes.length - 2 < w.length) continue;
        // ★ 挑离现有文字索最远的位置，否则补挂的几个会全堆在近塔一侧
        const d = placed.length
          ? Math.min(...placed.map(q => Math.abs(q.nodes[0].x - rope.nodes[0].x)))
          : Infinity;
        if (d > bestGap) { bestGap = d; best = rope; }
      }
      if (!best) break;
      pool.pop();
      const rows = best.nodes.length;
      best.kind = 'word'; best.word = w;
      const frac = [.30, .58, .42, .70, .36, .62, .48][best.col % 7];
      best.wordStart = Math.max(1, Math.min(rows - w.length - 1,
                                            Math.round((rows - w.length) * frac)));
    }
  }

  function resize() {
    const r = artboard.getBoundingClientRect();
    width = r.width; height = r.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    skyCanvas.width = Math.round(width * dpr);
    skyCanvas.height = Math.round(height * dpr);
    sky.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    drawScenery();
    /* ★ 设置 canvas.width 会清空画布，所以重建后必须立刻重绘一次。
     * 循环在跑时下一帧会自动补上，但循环被闸住（页面隐藏 / 滚出视口 /
     * reduced-motion）时没人补——场景就空了。ResizeObserver 在 observe()
     * 时会立刻回调一次，正好撞上这个洞。 */
    draw();
  }

  /* ═══════════════════════════════════════════════
   *  6. 物理
   * ═══════════════════════════════════════════════ */
  /* ★ 张力回复力
   * 距离约束只保证「每段长度不变」，不保证形状 —— 一条折了的索和原曲线长度相同，
   * 求解器认为它已经收敛，于是永远卡在折角上。天坛靠重力把珠帘拉直，
   * 桥索重力≈0，必须显式加一条把节点拉回设计线形的力。这才是「绷紧的钢索」。
   * 弹簧刚度 shapeK 决定音高（回弹快慢），friction 决定余振长度。 */
  function integrate(rope) {
    const g = rope.gravity, k = rope.shapeK;
    for (const p of rope.nodes) {
      if (p.pinned) continue;
      const vx = (p.x - p.oldX) * physics.friction;
      const vy = (p.y - p.oldY) * physics.friction;
      p.oldX = p.x; p.oldY = p.y;
      p.x += vx; p.y += vy + g;
      p.x += (p.restX - p.x) * k;
      p.y += (p.restY - p.y) * k;
    }
  }

  /* 吊索的设计线形是「当前顶端到桥面的直线」——顶端跟着主缆走，
   * 所以主缆一荡，整排吊索的静止位置跟着平移，而不是各自回到出厂位置。 */
  function refreshSuspenderRest(rope) {
    const n = rope.nodes, last = n.length - 1;
    const ax = n[0].anchorX, ay = n[0].anchorY;
    const bx = n[last].anchorX, by = n[last].anchorY;
    for (let i = 1; i < last; i++) {
      const t = i / last;
      n[i].restX = ax + (bx - ax) * t;
      n[i].restY = ay + (by - ay) * t;
    }
  }

  /* 两端固定的绳，单向遍历会把误差堆到一头；每趟交替方向让它对称收敛 */
  function constrain(rope, passes) {
    const n = rope.nodes;
    for (let pass = 0; pass < passes; pass++) {
      for (const p of n) if (p.pinned) { p.x = p.anchorX; p.y = p.anchorY; }
      const fwd = pass % 2 === 0;
      for (let k = 1; k < n.length; k++) {
        const i = fwd ? k : n.length - k;
        const a = n[i - 1], b = n[i];
        if (a.pinned && b.pinned) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.max(.0001, Math.hypot(dx, dy));
        const diff = (dist - b.restLength) / dist;
        if (a.pinned)      { b.x -= dx * diff;     b.y -= dy * diff; }
        else if (b.pinned) { a.x += dx * diff;     a.y += dy * diff; }
        else {
          const cx = dx * diff * .5, cy = dy * diff * .5;
          a.x += cx; a.y += cy; b.x -= cx; b.y -= cy;
        }
      }
    }
  }

  /* 指针冲量：把位移分解成「垂直于索」和「沿索」两个分量，
   * 垂直分量放大、沿索分量削弱 —— 这是「被拨动」而不是「被拖走」的关键。 */
  function pushRope(rope, idx, mx, my, speed) {
    const n = rope.nodes;
    let strongest = 0;
    for (let i = 1; i < n.length - 1; i++) {
      const p = n[i];
      const dist = Math.hypot(p.x - mouse.oldX, p.y - mouse.oldY);
      if (dist >= physics.radius) continue;
      const falloff = 1 - dist / physics.radius;

      const prev = n[i - 1], next = n[i + 1];
      let tx = next.x - prev.x, ty = next.y - prev.y;
      const tl = Math.max(.0001, Math.hypot(tx, ty));
      tx /= tl; ty /= tl;
      const along = mx * tx + my * ty;
      const px = mx - along * tx, py = my - along * ty;

      const k = physics.strength * falloff * rope.give;
      p.x += (px * physics.perpGain + along * tx * physics.axialGain) * k;
      p.y += (py * physics.perpGain + along * ty * physics.axialGain) * k;
      strongest = Math.max(strongest, speed * falloff);
    }
    if (strongest > 0) {
      strikeCable(idx, strongest, n[Math.floor(n.length / 2)].x);
      registerInteraction();
    }
  }

  function injectMouseDelta() {
    if (!mouse.active) return;
    const mx = mouse.x - mouse.oldX;
    const my = mouse.y - mouse.oldY;
    const speed = Math.hypot(mx, my);
    if (speed < .01 || speed > 80) return;

    // 主缆用一个特殊索引（放最后一格音阶，最低沉）
    pushRope(cable, sound.scale.length - 1, mx, my, speed);
    for (let i = 0; i < suspenders.length; i++) pushRope(suspenders[i], i, mx, my, speed);
  }

  /* 湾区风：两端固定的弦，基频振型是 sin(π·t)（中间最大），
   * 与天坛自由悬链的 (row/rows)² 完全不同 —— 物理不一样，风的样子也不一样。 */
  function injectWind() {
    if (windIntensity <= 0 || reducedMotion) return;
    windPhase += .011;
    const amp = windIntensity * .012;

    const cn = cable.nodes;
    for (let i = 1; i < cn.length - 1; i++) {
      const t = i / (cn.length - 1);
      cn[i].y += Math.sin(windPhase * .7 + t * 4.2) * amp * Math.sin(Math.PI * t) * 1.4;
    }
    for (let s = 0; s < suspenders.length; s++) {
      const n = suspenders[s].nodes;
      const phase = windPhase + s * .26;
      let strongest = 0;
      for (let i = 1; i < n.length - 1; i++) {
        const t = i / (n.length - 1);
        const d = Math.sin(phase) * amp * Math.sin(Math.PI * t);
        n[i].x += d;
        strongest = Math.max(strongest, Math.abs(d) * 22);
      }
      if (strongest > 1.4 && Math.random() < .012) strikeCable(s, strongest, n[0].x);
    }
  }

  function registerInteraction() {
    interactionCount++;
    if (!counterEl) return;
    counterEl.textContent = `桥索拨动 · ${interactionCount}`;
    counterEl.classList.add('visible');
    clearTimeout(counterEl._timer);
    counterEl._timer = setTimeout(() => counterEl.classList.remove('visible'), 2000);
  }

  /* ═══════════════════════════════════════════════
   *  7. 绘制
   * ═══════════════════════════════════════════════ */

  /* 塔腿的竖向渐变：桥面以上实、往下溶进雾里，
   * 既做出经典的「雾中金门」，也让出左下角给标题。 */
  function fadeGradient(topY, color, alpha, deckLocal) {
    const fadeEnd = fadeEndPx;
    const dk = deckLocal == null ? deckPx : deckLocal;
    const g = ctx.createLinearGradient(0, topY, 0, fadeEnd);
    // 实心保持到桥面以下一半，X 形支撑才不会一出场就化在雾里
    const raw = (dk + (fadeEnd - dk) * .46 - topY) / (fadeEnd - topY);
    // 尺寸尚未就绪时 raw 会是 NaN，addColorStop 会抛错 → 兜底
    const s = Number.isFinite(raw) ? Math.max(.01, Math.min(.99, raw)) : .5;
    g.addColorStop(0, rgba(color, alpha));
    g.addColorStop(s, rgba(color, alpha));
    g.addColorStop(1, rgba(color, 0));
    return g;
  }

  /* Art Deco 桥塔
   * 金门大桥塔身的辨识点不是「有横杆」，而是：
   *   1) 门洞很高（高远大于宽），所以横撑要少、要细
   *   2) 塔腿逐级退台（每过一道横撑就收一次腰），不是平滑锥形
   *   3) 塔顶三层阶梯冠
   * 平滑锥形 + 密横撑 = 梯子，这是最容易做砸的一步。 */
  /* ── 桥塔 v2 ────────────────────────────────────────────
   * 照参考照片重做。辨识点按重要性：
   *   1) 桥面以下的 X 形交叉支撑 —— 除颜色外最强的识别信号
   *   2) 塔身是「实体挖洞」：塔腿宽度接近门洞宽度，读作一整块实体，
   *      而不是两根细柱加横档（细柱 + 均匀横档 = 梯子）
   *   3) 门洞只在桥面以上，数量少、每个都高，最下一道横撑落在桥面
   *   4) 逐级退台：塔顶明显比塔基窄，塔腿也跟着变细
   *   5) 鞍座下方有一段实心塔身，主缆从这里翻过去
   */
  /* ═══════════════════════════════════════════════
   *  背景层（#scenery，正常混合）
   *  雾、山、日轮都是「提亮」的元素，画在 multiply 的桥体层上出不来，
   *  所以独立一层。只在 resize / 换主题时重画，不进逐帧循环。
   * ═══════════════════════════════════════════════ */

  /* 山脊线：三个正弦叠加，比手写控制点平滑，也不会在任何宽度下露馅 */
  function ridge(c, baseY, amp, freq, phase) {
    c.beginPath();
    c.moveTo(-4, height + 4);
    for (let x = -4; x <= width + 4; x += 5) {
      const t = x / Math.max(1, width);
      const y = baseY - amp * (
        .55 * Math.sin(t * freq * 6.2832 + phase) +
        .30 * Math.sin(t * freq * 2.3 * 6.2832 + phase * 1.7) +
        .15 * Math.sin(t * freq * 4.1 * 6.2832 + phase * 2.3));
      c.lineTo(x, y);
    }
    c.lineTo(width + 4, height + 4);
    c.closePath();
    c.fill();
  }

  /* 雾团：椭圆径向渐变，边缘天然是软的，比多段线性渐变干净 */
  function fogBank(c, cx, cy, rx, ry, a) {
    c.save();
    c.translate(cx, cy); c.scale(rx, ry);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0,  rgba(pal.fog, a * pal.fogK));
    g.addColorStop(.5, rgba(pal.fog, a * pal.fogK * .72));
    g.addColorStop(1,  rgba(pal.fog, 0));
    c.fillStyle = g;
    c.beginPath(); c.arc(0, 0, 1, 0, 6.2832); c.fill();
    c.restore();
  }

  /* 旧金山天际线：低对比剪影，泛美金字塔是唯一需要一眼认出的形 */
  function skyline(c, baseY, x0, x1, h) {
    c.fillStyle = rgba(pal.city, .24);
    const towers = [
      [.00, .34], [.05, .52], [.10, .40], [.15, .66], [.21, .46],
      [.27, .58], [.32, .38], [.38, .72], [.44, .44], [.50, .60],
      [.57, .36], [.63, .50], [.70, .42], [.77, .62], [.84, .38], [.91, .48]
    ];
    const span = x1 - x0;
    towers.forEach(([t, hh], i) => {
      const w = span * (.020 + (i % 3) * .006);
      c.fillRect(x0 + t * span, baseY - h * hh, w, h * hh);
    });
    // 泛美金字塔：天际线里唯一需要一眼认出的形，所以给足高度
    const px = x0 + span * .46, ph = h * 1.55;
    c.beginPath();
    c.moveTo(px, baseY - ph);
    c.lineTo(px + span * .026, baseY);
    c.lineTo(px - span * .026, baseY);
    c.closePath(); c.fill();
  }

  function sailboat(c, x, y, sc) {
    c.fillStyle = rgba(pal.fog, .95 * Math.max(.5, pal.fogK));
    c.beginPath();                                   // 帆
    c.moveTo(x, y - 26 * sc);
    c.lineTo(x + 11 * sc, y);
    c.lineTo(x - 8 * sc, y);
    c.closePath(); c.fill();
    c.fillStyle = rgba(pal.city, .34);
    c.fillRect(x - 10 * sc, y, 21 * sc, 2 * sc);     // 船身
  }

  function drawScenery() {
    const c = sky;
    c.clearRect(0, 0, width, height);
    if (!deckPx) return;
    const narrow = width < 720;
    const below = height - deckPx;
    const at = f => deckPx + below * f;      // ★ 一切以桥面为基准，不以画面比例
    const water = at(.42);

    // ── 日轮：实心盘 + 柔晕，压在山后 ──
    const sx = width * .775, sy = height * .270, sr = width * (narrow ? .11 : .058);
    const halo = c.createRadialGradient(sx, sy, sr * .7, sx, sy, sr * 2.1);
    halo.addColorStop(0, rgba(pal.sun, .38 * pal.fogK));
    halo.addColorStop(1, rgba(pal.sun, 0));
    c.fillStyle = halo;
    c.beginPath(); c.arc(sx, sy, sr * 2.1, 0, 6.2832); c.fill();
    c.fillStyle = rgba(pal.sun, .62);
    c.beginPath(); c.arc(sx, sy, sr, 0, 6.2832); c.fill();

    // ── 远山：山峰必须抬到桥面之上，山才在桥「后面」而不是「脚下」 ──
    c.fillStyle = rgba(pal.hillFar, .30);
    ridge(c, at(.06), below * .22, 1.3, .8);
    c.fillStyle = rgba(pal.hillFar, .44);
    ridge(c, at(.15), below * .15, 2.1, 2.4);

    // ── 天际线：夹在中景山和近景山之间，小而低对比 ──
    if (!narrow) skyline(c, at(.17), width * .665, width * .835, below * .125);

    c.fillStyle = rgba(pal.hill, .36);
    ridge(c, at(.27), below * .11, 1.7, 4.9);

    // ── 水面 ──
    // 水只是一条淡色带，不是一块板：上沿要淡入（否则出现一条硬的水平接缝），
    // 底部要重新亮回来，标题才不会陷进去
    const wg = c.createLinearGradient(0, water - below * .10, 0, height);
    wg.addColorStop(0,   rgba(pal.water, 0));
    wg.addColorStop(.22, rgba(pal.water, .24));
    wg.addColorStop(.55, rgba(pal.water, .14));
    wg.addColorStop(1,   rgba(pal.water, .03));
    c.fillStyle = wg;
    c.fillRect(0, water - below * .10, width, height - water + below * .10);

    if (!narrow) sailboat(c, width * .615, at(.56), Math.max(.7, width / 1440));

    // ── 雾带：一层层把山脚、天际线和塔基吃掉 ──
    fogBank(c, width * .30, at(.02), width * .46, below * .10, .55);
    fogBank(c, width * .72, at(.10), width * .40, below * .09, .50);
    fogBank(c, width * .08, at(.21), width * .36, below * .10, .46);
    fogBank(c, width * .55, at(.34), width * .60, below * .12, .52);
    fogBank(c, width * .93, at(.16), width * .28, below * .08, .42);
    fogBank(c, width * .34, at(.72), width * .78, below * .20, .52);   // 托住底部留白
  }

  function drawTower(cx, topY, cfg) {
    const { halfTop, halfBase, legW, alpha, openings = 4, cross = true } = cfg;
    const fadeEnd = fadeEndPx;
    const deck = Math.min(deckYAt(cx), fadeEnd - 12);
    const span = fadeEnd - topY;
    const paint = fadeGradient(topY, pal.orange, alpha, deck);
    ctx.fillStyle = paint;

    const halfAt = y => halfTop + (halfBase - halfTop) * Math.max(0, Math.min(1, (y - topY) / span));
    const wAt    = y => legW * (.80 + .20 * Math.max(0, Math.min(1, (y - topY) / span)));
    // 整段实心（横撑 / 顶部实体）
    const solid = (y0, h) => {
      const half = halfAt(y0), w = wAt(y0);
      ctx.fillRect(cx - half - w / 2, y0, (half + w / 2) * 2, h);
    };
    // 只画两条塔腿，中间留出门洞
    const legs = (y0, h) => {
      const half = halfAt(y0), w = wAt(y0);
      ctx.fillRect(cx - half - w / 2, y0, w, h);
      ctx.fillRect(cx + half - w / 2, y0, w, h);
    };

    // ── 桥面以上：鞍座实心段 + N 个高门洞 ──
    // ★ 门洞自上而下逐个变大（.70 → 1.30）。等高门洞会立刻读成梯子，
    //   照片里的塔是往下逐级放大的，这条比门洞数量更能决定像不像。
    const aboveH = deck - topY;
    const capH   = aboveH * .10;
    const braceH = aboveH * .032;
    const w = [];
    for (let i = 0; i < openings; i++) w.push(.70 + (openings < 2 ? 0 : i / (openings - 1)) * .60);
    const wSum = w.reduce((a, b) => a + b, 0);
    const openTotal = aboveH - capH - braceH * openings;
    let y = topY;
    solid(y, capH); y += capH;
    for (let i = 0; i < openings; i++) {
      legs(y, openTotal * w[i] / wSum);  y += openTotal * w[i] / wSum;
      solid(y, braceH); y += braceH;      // 最后一道正好落在桥面
    }

    // ── 桥面以下：X 形交叉支撑（上下各一道横梁夹住） ──
    const belowH = fadeEnd - deck;
    legs(deck, belowH);
    if (cross && belowH > 24) {
      const xTop = deck + belowH * .10, xBot = deck + belowH * .74;
      const hT = halfAt(xTop), hB = halfAt(xBot);
      solid(xTop - braceH * .5, braceH * .85);
      ctx.strokeStyle = paint;
      ctx.lineWidth = wAt(xTop) * .55;
      ctx.beginPath();
      ctx.moveTo(cx - hT, xTop); ctx.lineTo(cx + hB, xBot);
      ctx.moveTo(cx + hT, xTop); ctx.lineTo(cx - hB, xBot);
      ctx.stroke();
      solid(xBot, braceH * .85);
    }

    // ── 塔顶阶梯冠：三层薄片，几乎与塔身齐平 ──
    const crownH = Math.max(2, span * .005);
    const topHalf = halfTop + wAt(topY) * .5;
    for (let i = 0; i < 3; i++) {
      const half = topHalf * (1 + i * .04);
      ctx.fillRect(cx - half, topY - crownH * (3 - i) * 1.1, half * 2, crownH);
    }
  }

  function drawTowerV1(cx, topY, halfTop, halfBase, legW, alpha, levels) {
    const fadeEnd = fadeEndPx;
    const H = fadeEnd - topY;
    ctx.fillStyle = fadeGradient(topY, pal.orange, alpha);

    // 分段位置手写，不等分：上密下疏，最下一道横撑正好落在桥面上方
    const T = levels || [0, .16, .44, .74, 1];
    for (let i = 0; i < T.length - 1; i++) {
      const y0 = topY + H * T[i], y1 = topY + H * T[i + 1];
      const t = i / (T.length - 2);
      const half = halfTop + (halfBase - halfTop) * t;   // 每段一个固定腰宽 → 退台
      const w = legW * (.86 + .14 * t);
      for (const side of [-1, 1]) {
        ctx.fillRect(cx + side * half - w / 2, y0, w, y1 - y0 + .6);
      }
      if (i > 0) {                          // 门式横撑：细，让门洞显得高
        const braceH = 3.2 + t * 2.4;
        ctx.fillRect(cx - half - w / 2, y0 - braceH * .5, (half + w / 2) * 2, braceH);
      }
    }

    // 塔顶阶梯冠：三层薄片，几乎与塔身齐平。宽出去就成锤子头了。
    const crownH = Math.max(2, H * .0045);
    const topHalf = halfTop + legW * .5;
    for (let i = 0; i < 3; i++) {
      const half = topHalf * (1 + i * .035);
      ctx.fillRect(cx - half, topY - crownH * (3 - i) * 1.1, half * 2, crownH);
    }
  }

  /* 桥面：先把坐标系旋到透视角度，再按水平画。
   * 这样桁架竖杆和灯柱自动垂直于桥面，不用逐个算角度。 */
  function drawDeck() {
    const yL = deckYAt(0), yR = deckYAt(width);
    const ang = Math.atan2(yR - yL, width);
    const L = Math.hypot(width, yR - yL) + 8;
    ctx.save();
    ctx.translate(0, yL);
    ctx.rotate(ang);

    const band = (a0, a1, col) => {
      const g = ctx.createLinearGradient(0, 0, L, 0);
      g.addColorStop(0,   rgba(col, a0));
      g.addColorStop(.78, rgba(col, a1));
      g.addColorStop(1,   rgba(col, a1 * .45));   // 右端退进雾里，但不消失
      return g;
    };

    // 路面上沿：吊索底端钉在这条线上
    ctx.fillStyle = band(.94, .82, pal.orange);
    ctx.fillRect(-4, 0, L, 3.4);
    // 灯柱
    ctx.fillStyle = band(.42, .30, pal.orange);
    for (let x = 0; x < L; x += 74) {
      ctx.fillRect(x, -11, 1.2, 11);
      ctx.fillRect(x - 2, -13, 5, 2);
    }
    // 桁架：竖杆 + 下弦
    ctx.fillStyle = band(.46, .34, pal.bridgeDark);
    for (let x = 0; x < L; x += 15) ctx.fillRect(x, 3, 1, 9);
    ctx.fillStyle = band(.62, .48, pal.bridgeDark);
    ctx.fillRect(-4, 11.5, L, 2.2);
    ctx.restore();
  }

  function drawHorizon() {
    const y = horizonPx;
    const g = ctx.createLinearGradient(0, 0, width, 0);
    g.addColorStop(0,   rgba(pal.steel, 0));
    g.addColorStop(.35, rgba(pal.steel, .16));
    g.addColorStop(.8,  rgba(pal.steel, .10));
    g.addColorStop(1,   rgba(pal.steel, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, y, width, 1);
  }

  function drawCableLine() {
    const n = cable.nodes;
    ctx.strokeStyle = rgba(pal.orange, .90);
    ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(n[0].x, n[0].y);
    for (let i = 1; i < n.length; i++) ctx.lineTo(n[i].x, n[i].y);
    ctx.stroke();
    // 与主缆基本重合的一条极细信号轨迹
    ctx.strokeStyle = rgba(pal.signal, .40);
    ctx.lineWidth = .9;
    ctx.beginPath();
    ctx.moveTo(n[0].x, n[0].y - 2.4);
    for (let i = 1; i < n.length; i++) ctx.lineTo(n[i].x, n[i].y - 2.4);
    ctx.stroke();
    // 主缆上的索夹
    ctx.fillStyle = rgba(pal.bead, .60);
    for (let i = 0; i < n.length; i += 4) {
      if (n[i].x < -6 || n[i].x > width + 6) continue;
      ctx.beginPath(); ctx.arc(n[i].x, n[i].y, 2.0, 0, 6.2832); ctx.fill();
    }
  }

  /* 主缆上的横向文字：沿弧长等距落字，每个字母旋转对齐切线 */
  function drawCableText() {
    const n = cable.nodes;
    const gap = 14;
    ctx.font = '500 11px "IBM Plex Mono", "Space Mono", ui-monospace, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = rgba(pal.ink, 1);

    let acc = 0, idx = 0;
    for (let i = 1; i < n.length; i++) {
      const a = n[i - 1], b = n[i];
      const dx = b.x - a.x, dy = b.y - a.y;
      const segLen = Math.hypot(dx, dy);
      if (segLen < .001) continue;
      let d = gap - acc;
      while (d <= segLen) {
        const t = d / segLen;
        const x = a.x + dx * t, y = a.y + dy * t;
        if (x > -20 && x < width + 20) {
          const ch = CABLE_TEXT[idx % CABLE_TEXT.length];
          if (ch !== ' ') {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.atan2(dy, dx));
            ctx.globalAlpha = .62;
            ctx.fillText(ch, 0, -9);            // 沿局部法线抬起，字始终骑在缆上方
            ctx.restore();
          }
        }
        idx++; d += gap;
      }
      acc = (acc + segLen) % gap;
    }
    ctx.globalAlpha = 1;
  }

  function drawSuspenders() {
    const dense = TEXT_MODE === 'dense';

    // 索线：改成橙色（参考图里吊索和主缆同色，不是钢灰）
    ctx.strokeStyle = rgba(pal.orange, dense ? .26 : .34);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const rope of suspenders) {
      const n = rope.nodes;
      ctx.moveTo(n[0].x, n[0].y);
      for (let i = 1; i < n.length; i++) ctx.lineTo(n[i].x, n[i].y);
    }
    ctx.stroke();

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    if (dense) {
      ctx.font = '500 10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = rgba(pal.ink, 1);
      for (const rope of suspenders) {
        const n = rope.nodes;
        for (let i = 0; i < n.length; i++) {
          const ch = rope.chars[i];
          if (ch === ' ') continue;
          ctx.globalAlpha = rope.alphas[i];
          ctx.fillText(ch, n[i].x, n[i].y);
        }
      }
      ctx.globalAlpha = 1;
      return;
    }

    /* 整词模式（spec 的构成）：
     *  plain 只有细索；bead 挂珠点；word 挂一个完整标准词。
     *  珠点不得遮挡字母 —— 词占的节点连同前后各一格一律留空。 */
    ctx.fillStyle = rgba(pal.bead, .62);
    for (const rope of suspenders) {
      if (rope.kind === 'plain') continue;
      const n = rope.nodes;
      const w0 = rope.word ? rope.wordStart - 1 : -99;
      const w1 = rope.word ? rope.wordStart + rope.word.length + 1 : -99;
      for (let i = 1; i < n.length - 1; i++) {
        if (i >= w0 && i <= w1) continue;
        const r = (i % 7 === 3) ? 2.9 : 1.9;        // 少量强调珠点
        ctx.beginPath(); ctx.arc(n[i].x, n[i].y, r, 0, 6.2832); ctx.fill();
      }
    }

    ctx.font = '500 12px "IBM Plex Mono", "Space Mono", ui-monospace, monospace';
    ctx.fillStyle = rgba(pal.ink, 1);
    for (const rope of suspenders) {
      if (!rope.word) continue;
      const n = rope.nodes;
      for (let k = 0; k < rope.word.length; k++) {
        const i = rope.wordStart + k;
        if (i >= n.length) break;
        const p = n[i];
        ctx.globalAlpha = .84;
        if (TEXT_MODE === 'path') {
          const a = n[Math.max(0, i - 1)], b = n[Math.min(n.length - 1, i + 1)];
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x) - Math.PI / 2);
          ctx.fillText(rope.word[k], 0, 0);
          ctx.restore();
        } else {
          ctx.fillText(rope.word[k], p.x, p.y);     // 字母正向，自上而下堆叠
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  /* 青色信号节点：只在主缆与选定吊索的连接处。
   * 实心核心 + 透明外圈，不做霓虹发光——它标注的是连接关系，不是赛博朋克。
   * 外圈同时承担「不只靠颜色表意」的无障碍要求。 */
  function drawSignalNodes() {
    for (const rope of suspenders) {
      if (!rope.signal) continue;
      const p = rope.nodes[0];
      if (p.x < -12 || p.x > width + 12) continue;
      ctx.fillStyle = rgba(pal.signal, .22);
      ctx.beginPath(); ctx.arc(p.x, p.y, 11.5, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = rgba(pal.signal, .55); ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 11.5, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = rgba(pal.signal, .95);
      ctx.beginPath(); ctx.arc(p.x, p.y, 4.2, 0, 6.2832); ctx.fill();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const s0 = width < 720 ? 1.9 : 1;   // 窄屏塔身按比例加粗，否则细成一根针
    const far = G.farTowerX < 1.05;     // 窄屏远塔在画外，不画
    if (TOWER === 'v1') {
      if (far) drawTowerV1(width * G.farTowerX, height * G.farSaddleY,
                width * .0088, width * .0118, width * .0050, .11, [0, .26, .62, 1]);
      drawDeck();
      drawTowerV1(width * G.nearTowerX, height * G.nearSaddleY,
                width * .0170 * s0, width * .0240 * s0, width * .0105 * s0, .84);
    } else {
      // 远塔：透视更小，但参考图里它是看得清的橙色，不是鬼影
      if (far) drawTower(width * G.farTowerX, height * G.farSaddleY, {
        halfTop: width * .0085, halfBase: width * .0105, legW: width * .0075,
        alpha: .48, openings: 2
      });
      drawDeck();
      // 近塔：宽高比约 1:5.4
      drawTower(width * G.nearTowerX, height * G.nearSaddleY, {
        halfTop: width * .0150 * s0, halfBase: width * .0185 * s0, legW: width * .0130 * s0,
        alpha: .88, openings: 3
      });
    }
    drawCableLine();
    drawSuspenders();
    drawCableText();
    drawSignalNodes();
  }

  /* ═══════════════════════════════════════════════
   *  8. 主循环（页面不可见时暂停）
   * ═══════════════════════════════════════════════ */
  function tick() {
    injectWind();
    integrate(cable);
    constrain(cable, physics.iterations);
    for (const rope of suspenders) {
      rope.nodes[0].anchorX = cable.nodes[rope.cableIdx].x;   // 吊索顶端跟着主缆走
      rope.nodes[0].anchorY = cable.nodes[rope.cableIdx].y;
      refreshSuspenderRest(rope);
      integrate(rope);
      constrain(rope, physics.iterations);
    }
    draw();
  }
  function frame() {
    tick();
    rafId = requestAnimationFrame(frame);
  }

  /* ---- 调试钩子（?debug=1）----
   * 同步逐帧推进，不依赖 rAF/可见性，用来复现手感和调参：
   *   __bridge.sweep(x0, y0, dx, n)  模拟一次匀速划过
   *   __bridge.settle(n)             不碰它，只让它自己振下去
   *   __bridge.spread()              量当前偏离设计线形的最大距离 */
  function exposeDebug() {
    window.__bridge = {
      physics, cable, suspenders,
      step(mx, my) {
        if (mx == null) { mouse.active = false; }
        else {
          if (!mouse.active) { mouse.x = mouse.oldX = mx; mouse.y = mouse.oldY = my; mouse.active = true; }
          else { mouse.oldX = mouse.x; mouse.oldY = mouse.y; mouse.x = mx; mouse.y = my; }
          injectMouseDelta();
        }
        tick();
      },
      sweep(x0, y0, dx, n) { for (let i = 0; i < n; i++) this.step(x0 + i * dx, y0); },
      settle(n) { for (let i = 0; i < n; i++) this.step(null); },
      spread() {
        let m = 0;
        const scan = r => r.nodes.forEach(p => { m = Math.max(m, Math.hypot(p.x - p.restX, p.y - p.restY)); });
        scan(cable); suspenders.forEach(scan);
        return Math.round(m * 10) / 10;
      }
    };
  }
  /* 只有在「文档可见 且 场景在视口内」时才允许循环起来。
   * 少了这道闸，嵌在首屏以下的场景会在页面一加载就开始满帧跑物理。 */
  function start() {
    if (!rafId && !document.hidden && onScreen) rafId = requestAnimationFrame(frame);
  }
  function stop()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  /* ═══════════════════════════════════════════════
   *  9. 事件
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
    if (!mouse.active) enter(e);
    mouse.oldX = mouse.x; mouse.oldY = mouse.y;
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    injectMouseDelta();
    if (cursor) { cursor.style.left = `${mouse.x}px`; cursor.style.top = `${mouse.y}px`; }
  }
  function leave() {
    mouse.active = false;
    artboard.classList.remove('is-active');
  }

  function bindRange(id, outId, update) {
    const input = root.querySelector(`[data-gg="${id}"]`);
    const out = root.querySelector(`[data-gg-out="${id}"]`);
    if (!input || !out) return;
    on(input, 'input', () => {
      const v = Number(input.value);
      out.value = String(v);
      update(v);
    });
  }

  /* ★ 主题写在场景根元素上，不碰 <html> —— 否则会和宿主站点的主题系统抢属性 */
  function isNight() { return root.getAttribute('data-theme') === 'night'; }
  function syncPalette() {
    pal = isNight() ? PALETTE.night : PALETTE.day;
    if (width) drawScenery();
  }
  function setTheme(mode) {
    if (mode === 'night') root.setAttribute('data-theme', 'night');
    else root.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.textContent = mode === 'night' ? '☾' : '☀';
      themeToggle.classList.toggle('active', mode === 'night');
    }
    if (opt.persistTheme) { try { localStorage.setItem(THEME_KEY, mode); } catch (e) {} }
    syncPalette();
  }

  const themeToggle = root.querySelector('.toggle-theme');
  const soundToggle = root.querySelector('.toggle-sound');

  let startTheme = opt.theme;
  if (opt.persistTheme) {
    try { startTheme = localStorage.getItem(THEME_KEY) || opt.theme; } catch (e) {}
  }
  setTheme(startTheme === 'night' ? 'night' : 'day');

  if (themeToggle) on(themeToggle, 'click', () => setTheme(isNight() ? 'day' : 'night'));

  if (soundToggle) {
    const paintSound = () => {
      soundToggle.textContent = soundEnabled ? '♪' : '✕';
      soundToggle.classList.toggle('active', soundEnabled);
    };
    paintSound();
    on(soundToggle, 'click', () => {
      soundEnabled = !soundEnabled;
      paintSound();
      if (soundEnabled) unlockSound();
    });
  }

  if (configure && settings) on(configure, 'click', () => {
    const open = settings.hidden;
    settings.hidden = !open;
    configure.setAttribute('aria-expanded', String(open));
  });
  if (resetBtn) on(resetBtn, 'click', build);
  bindRange('strength', 'strengthValue', v => { physics.strength = v / 100; });
  bindRange('reach',    'reachValue',    v => { physics.radius = v; });
  bindRange('inertia',  'inertiaValue',  v => { physics.friction = v / 1000; });
  bindRange('wind',     'windValue',     v => { windIntensity = v; });

  on(canvas, 'pointerenter', enter);
  on(canvas, 'pointermove', move);
  on(canvas, 'pointerleave', leave);
  on(root, 'pointerdown', unlockSound, { passive: true });
  on(window, 'resize', resize);
  on(document, 'visibilitychange', () => document.hidden ? stop() : resume());

  /* 容器尺寸变化也要重建——嵌进页面后，栏目宽度变了但视口没变的情况很常见 */
  let ro = null;
  if (window.ResizeObserver) {
    ro = new ResizeObserver(() => resize());
    ro.observe(root);
    cleanup.push(() => ro.disconnect());
  }

  /* ★ 滚出视口就停。作为页面里的一段，访客在读别处时不该还在满帧烧 CPU。 */
  let io = null;
  if (opt.pauseOffscreen && window.IntersectionObserver) {
    io = new IntersectionObserver(es => {
      onScreen = es[0].isIntersecting;
      onScreen ? resume() : stop();
    }, { rootMargin: '120px' });
    io.observe(root);
    cleanup.push(() => io.disconnect());
  }
  function resume() { if (onScreen && !document.hidden) start(); }

  /* ---- 文字源：# 注释，__CABLE__ 之后是主缆长句 ---- */
  async function loadWords() {
    try {
      const res = await fetch(opt.assetBase + 'keywords.txt');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      // 分隔行必须独占一行，避免注释里出现标记就被提前切开
      const [wordPart, cablePart] = raw.split(/^__CABLE__\s*$/m);
      const words = wordPart.split('\n')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('#'));
      if (words.length) WORDS = words;
      if (cablePart) {
        const line = cablePart.split('\n').map(s => s.trim()).filter(Boolean)[0];
        if (line) CABLE_TEXT = line.toUpperCase() + ' ';
      }
      build();
    } catch (e) { console.warn('[golden-gate] keywords.txt 未加载，使用内置词表：', e.message); }
  }

  function init() {
    root.querySelectorAll('.ag-char').forEach(el => {
      attachAntiGravity(el, {
        floatAmp: reducedMotion ? 0 : 3 + Math.random() * 4,
        floatSpeed: 0.25 + Math.random() * 0.3,
        rotAmp: reducedMotion ? 0 : 0.6 + Math.random() * 1.4,
        pushRadius: 110,
        pushForce: reducedMotion ? 5 : 16
      });
    });
    if (reducedMotion) { physics.strength = .3; physics.perpGain = .8; }
    if (opt.textMode) TEXT_MODE = opt.textMode;
    if (opt.words) WORDS = opt.words.map(String);
    if (opt.cableText) CABLE_TEXT = String(opt.cableText).toUpperCase() + ' ';
    // URL 开关只在独立演示页启用，嵌进网站后访客不该能改场景
    if (opt.allowUrlOverrides) {
      const q = new URLSearchParams(location.search);
      const t = q.get('type');
      if (['dense', 'words', 'path'].includes(t)) TEXT_MODE = t;
      if (q.get('tower') === 'v1') TOWER = 'v1';
      if (location.search.includes('debug')) { exposeDebug(); window.__bridge = handle.debug; }
    }
    resize();
    tick();                       // 先画一帧：即使循环没起来也不是空白
    if (!opt.words) loadWords();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (width) draw(); });
    start();
  }

  /* 卸载：释放 rAF、监听器、观察器和音频节点。
   * 单页应用里把这一段换掉时必须调用，否则物理循环会一直跑下去。 */
  function destroy() {
    stop();
    cleanup.forEach(fn => { try { fn(); } catch (e) {} });
    cleanup.length = 0;
    if (sound.context && sound.context.state !== 'closed') {
      sound.context.close().catch(() => {});
    }
    root.innerHTML = '';
    root.classList.remove('gg-scene');
    root.removeAttribute('data-theme');
  }

  const handle = {
    el: root, destroy, setTheme,
    /* 物理与渲染循环是否在跑。滚出视口或标签页隐藏时会自动变 false。 */
    get running() { return rafId !== null; },
    setSound(on_) { soundEnabled = !!on_; if (soundEnabled) unlockSound(); },
    get debug() { return window.__bridge; }
  };

  init();
  return handle;
}
