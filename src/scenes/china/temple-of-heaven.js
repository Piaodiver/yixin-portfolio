/* 天坛汉字珠帘 —— 可嵌入组件
 *
 *   import { mountTempleOfHeaven } from './temple-of-heaven.js';
 *   const scene = mountTempleOfHeaven('#beijing', { chrome: false, title: false });
 *   scene.destroy();
 *
 * 配套 temple-of-heaven.css。改造规则见 docs/EMBEDDING.md。
 * 物理与绘制代码与原版逐字节一致，这一层只负责 DOM、作用域和生命周期。 */

export const DEFAULTS = {
  chrome:   true,   // 顶部条：品牌 + 导航 + 昼夜/声音/配置按钮
  title:    true,   // 左下标题区
  hud:      true,   // 进度条 + 触碰计数
  cursor:   true,   // 自定义圆环光标
  settings: true,   // 配置面板（chrome 关掉时自动跟着关）

  brand:    '天坛 · Temple of Heaven',
  nav:      [{ label: '首页', href: '#' }, { label: '地标', href: '#' }, { label: '社区', href: '#' }],
  eyebrow:  '北京 (Beijing) / 天地之间',
  headingLines: ['Temple', 'of', 'Heaven'],
  ariaLabel: '天坛屋檐下可交互的中文珠帘',
  templeImage: 'temple-roof-cutout-web.webp',
  templeAlt:   '天坛祈年殿屋顶',

  /* 界面文案：嵌入时按宿主语言覆盖（见 docs/EMBEDDING.md）。soundOn/soundOff 给单字符就是图标按钮，给词就变成带字的胶囊 */

  labels: { theme: '切换昼夜主题', sound: '开关声音', soundOn: '♪', soundOff: '✕', settings: '配置', counter: '珠帘触碰' },

  sound: 'off',            // 作品集惯例：默认静音
  theme: 'day',
  persistTheme: false,     // 嵌入时别写 localStorage，会和宿主站点的主题互相打架
  pauseOffscreen: true,
  glyphs: null,            // 给字符串即覆盖 tiantan.txt，且不再发 fetch
  assetBase: 'assets/'
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function markup(o) {
  const lines = (o.headingLines || []).map((ln, i, all) => {
    const chars = [...String(ln)].map(c => `<span class="ag-char">${esc(c)}</span>`).join('');
    return chars + (i === all.length - 1 ? '<span class="rule"></span>' : '<br>');
  }).join('');
  const nav = (o.nav || []).map(n => `<a href="${esc(n.href || '#')}">${esc(n.label)}</a>`).join('');
  return `
<main class="artboard">
  <canvas class="curtain" aria-label="${esc(o.ariaLabel)}"></canvas>
${o.chrome ? `  <header class="masthead">
    <a class="brand" href="#">${esc(o.brand)}</a>
    <nav class="nav-links" aria-label="Primary">${nav}</nav>
    <div class="masthead-actions">
      <button class="toggle-btn toggle-theme" type="button" title="${esc(o.labels.theme)}" aria-label="${esc(o.labels.theme)}">☀</button>
      <button class="toggle-btn toggle-sound${[...String(o.labels.soundOn)].length > 1 ? ' is-text' : ''}" type="button" title="${esc(o.labels.sound)}" aria-label="${esc(o.labels.sound)}">${esc(o.sound === 'on' ? o.labels.soundOn : o.labels.soundOff)}</button>
      ${o.settings ? `<button class="configure" type="button" aria-expanded="false">${esc(o.labels.settings)}</button>` : ''}
    </div>
  </header>` : ''}
  <div class="temple">
    <img src="${esc(o.assetBase + o.templeImage)}" alt="${esc(o.templeAlt)}"
         width="901" height="730" fetchpriority="high" decoding="async">
  </div>
${o.title ? `  <section class="headline">
    ${o.eyebrow ? `<p class="eyebrow">${esc(o.eyebrow)}</p>` : ''}
    <h1>${lines}</h1>
  </section>` : ''}
${o.hud ? `  <div class="progress" aria-hidden="true"></div>
  <div class="counter" aria-hidden="true">${esc(o.labels.counter)} · 0</div>` : ''}
${o.cursor ? '  <div class="cursor" aria-hidden="true"></div>' : ''}
${o.chrome && o.settings ? `  <aside class="settings" hidden>
    <div class="setting"><label>Strength <output data-kc-out="strength">72</output></label><input data-kc="strength" type="range" min="20" max="110" value="72"></div>
    <div class="setting"><label>Reach <output data-kc-out="reach">34</output></label><input data-kc="reach" type="range" min="18" max="56" value="34"></div>
    <div class="setting"><label>Inertia <output data-kc-out="inertia">97</output></label><input data-kc="inertia" type="range" min="86" max="99" value="97"></div>
    <div class="setting"><label>Auto Breeze <output data-kc-out="breeze">0</output></label><input data-kc="breeze" type="range" min="0" max="100" value="0"></div>
    <button class="reset-btn" type="button">Reset curtain</button>
  </aside>` : ''}
</main>`;
}

let seq = 0;

export function mountTempleOfHeaven(host, options = {}) {
  const opt = { ...DEFAULTS, ...options };
  opt.labels = { ...DEFAULTS.labels, ...(options.labels || {}) };
  if (!opt.chrome) opt.settings = false;
  const root = typeof host === 'string' ? document.querySelector(host) : host;
  if (!root) throw new Error('mountTempleOfHeaven: 找不到容器元素 ' + host);

  const THEME_KEY = 'toh-theme-' + (++seq);
  root.classList.add('toh-scene');
  root.innerHTML = markup(opt);

  const cleanup = [];
  const on = (t, ev, fn, o2) => {
    t.addEventListener(ev, fn, o2);
    cleanup.push(() => t.removeEventListener(ev, fn, o2));
  };

  let rafId = null;
  let onScreen = true;          // 由 IntersectionObserver 维护
  let audioCtx = null;
  let soundEnabled = opt.sound === 'on';

  /* ═══════════════════════════════════════════════
   *  1. 反重力标题：每个字母独立悬浮 + 鼠标弹开
   * ═══════════════════════════════════════════════ */

  function attachAntiGravity(el, opts = {}) {
    const {
      floatAmp = 5,     // 悬浮幅度 (px)
      floatSpeed = 0.35, // 悬浮速度
      rotAmp = 1.5,     // 旋转幅度 (deg)
      pushRadius = 130,  // 鼠标推力范围
      pushForce = 20,    // 推力强度
      springK = 0.055,   // 弹簧刚度
      damping = 0.89     // 阻尼
    } = opts;

    let vx = 0, vy = 0, ox = 0, oy = 0;
    let phase = Math.random() * Math.PI * 2;
    let lastSoundTime = 0, rafId = null, isPushed = false;

    // 五声音阶：触碰时按字符映射不同音高
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

    function playChime(freq, duration, volume) {
      if (!audioCtx || audioCtx.state === 'suspended' || !soundEnabled) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.frequency.value = freq; osc.type = 'sine';
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.start(now); osc.stop(now + duration);
    }

    // 悬浮动画：sin/cos 驱动 X/Y/旋转
    function floatTick() {
      if (isPushed) return;
      const t = Date.now() / 1000;
      const fy = Math.sin(t * floatSpeed + phase) * floatAmp;
      const fx = Math.cos(t * floatSpeed * 0.7 + phase) * (floatAmp * 0.35);
      const rz = Math.sin(t * floatSpeed * 0.45 + phase) * rotAmp;
      el.style.transform = `translate(${fx + ox}px, ${fy + oy}px) rotate(${rz}deg)`;
    }

    // 弹簧物理：鼠标推开后弹性回归
    function physicsTick() {
      if (!isPushed && Math.abs(ox) < 0.1 && Math.abs(oy) < 0.1 &&
          Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01) {
        ox = oy = vx = vy = 0; rafId = null; return;
      }
      vx = (vx + (-ox * springK)) * damping;
      vy = (vy + (-oy * springK)) * damping;
      ox += vx; oy += vy;
      const t = Date.now() / 1000;
      const fy = Math.sin(t * floatSpeed + phase) * floatAmp;
      const fx = Math.cos(t * floatSpeed * 0.7 + phase) * (floatAmp * 0.35);
      const rz = Math.sin(t * floatSpeed * 0.45 + phase) * rotAmp;
      el.style.transform = `translate(${fx + ox}px, ${fy + oy}px) rotate(${rz}deg)`;
      rafId = requestAnimationFrame(physicsTick);
    }

    // 鼠标靠近时推开
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
          playChime(pentatonic[Math.abs(el.textContent.charCodeAt(0)) % pentatonic.length], 0.1, 0.03);
          lastSoundTime = now;
        }
        if (!rafId) rafId = requestAnimationFrame(physicsTick);
      }
    });

    // 鼠标离开时弹回
    el.addEventListener('mouseleave', () => {
      isPushed = false;
      if (!rafId) rafId = requestAnimationFrame(physicsTick);
      playChime(pentatonic[Math.abs(el.textContent.charCodeAt(0)) % pentatonic.length] * 0.5, 0.15, 0.02);
    });

    cleanup.push((id => () => clearInterval(id))(setInterval(floatTick, 33)));
  }

  /* ═══════════════════════════════════════════════
   *  2. Canvas 珠帘：Verlet 物理 + Web Audio 钟声
   * ═══════════════════════════════════════════════ */
  const artboard   = root.querySelector('.artboard');
  const canvas     = root.querySelector('.curtain');
  const ctx        = canvas.getContext('2d');
  const temple     = root.querySelector('.temple');
  // 以下都可能被 options 关掉，一律容忍缺席
  const cursor     = root.querySelector('.cursor');
  const configure  = root.querySelector('.configure');
  const settings   = root.querySelector('.settings');
  const resetBtn   = root.querySelector('.reset-btn');
  const counterEl  = root.querySelector('.counter');

  const chains = [];  // 每条珠帘链条 = [{ x, y, oldX, oldY, ... }, ...]

  // 默认汉字（会尝试从 tiantan.txt 加载更长的文本替换）
  let glyphs = '天坛祈年风调雨顺天地玄黄日月星辰礼乐文明北京春秋山川云海';

  // 鼠标状态
  const mouse = { x: -999, y: -999, oldX: -999, oldY: -999, active: false };

  // 物理参数（配置面板可调）
  const physics = { strength: .72, radius: 34, friction: .965, gravity: .18 };

  // 音频系统
  const sound = {
    context: null, output: null,
    lastStrike: [], lastGlobal: 0, voices: 0,
    // 五声音阶（C5~A6），按列索引取频率
    scale: [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760]
  };

  let width = 0, height = 0, dpr = 1;
  let interactionCount = 0;
  let breezeIntensity = 0, breezePhase = 0;

  /* ---- 解锁音频（浏览器要求用户交互后才能播放） ---- */
  function unlockSound() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!sound.context) {
      const c = new AC();
      const output = c.createGain();
      const comp = c.createDynamicsCompressor();
      const delay = c.createDelay(.3);
      const fb = c.createGain();
      const wet = c.createGain();
      output.gain.value = .62;
      comp.threshold.value = -18; comp.ratio.value = 3;
      delay.delayTime.value = .11; fb.gain.value = .14; wet.gain.value = .13;
      output.connect(comp); output.connect(delay);
      delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(comp);
      comp.connect(c.destination);
      sound.context = c; sound.output = output;
    }
    if (sound.context.state === 'suspended') sound.context.resume().catch(() => {});
    if (!audioCtx) audioCtx = sound.context;
  }

  /* ---- 触发钟声 ----
   * 每次珠帘被推动且冲击力足够大时调用
   * - 按列索引取五声音阶频率
   * - 3 个正弦波分音（基频 + 2 倍频 + 4 倍频）模拟编钟泛音
   * - 立体声平移（按列位置左右分布）
   * - 95ms 同列去抖 + 28ms 全局去抖 + 8 声部上限
   */
  function strikeChain(col, impact, x) {
    const c = sound.context;
    if (!c || c.state !== 'running' || impact < 1.1 || !soundEnabled) return;
    const ts = performance.now();
    if (ts - (sound.lastStrike[col] || 0) < 95) return;
    if (ts - sound.lastGlobal < 28 || sound.voices >= 8) return;
    sound.lastStrike[col] = ts; sound.lastGlobal = ts; sound.voices++;

    const now = c.currentTime;
    const freq = sound.scale[col % sound.scale.length];
    const level = .028 + Math.min(impact, 18) / 18 * .075;
    const dur = .72 + Math.random() * .32;

    // 立体声平移
    const pan = c.createStereoPanner ? c.createStereoPanner() : c.createGain();
    if (pan.pan) pan.pan.setValueAtTime(
      Math.max(-.9, Math.min(.9, x / width * 2 - 1)), now
    );
    pan.connect(sound.output);

    // 3 个分音：基频、2 倍频、4 倍频
    [
      { ratio: 1,    amount: 1,   decay: 1 },
      { ratio: 2.01,  amount: .24, decay: .62 },
      { ratio: 3.96,  amount: .1,  decay: .38 }
    ].forEach(p => {
      const osc = c.createOscillator();
      const env = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p.ratio, now);
      osc.detune.setValueAtTime((Math.random() - .5) * 8, now);
      env.gain.setValueAtTime(level * p.amount, now);
      env.gain.exponentialRampToValueAtTime(.0001, now + dur * p.decay);
      osc.connect(env); env.connect(pan);
      osc.start(now); osc.stop(now + dur + .05);
    });

    setTimeout(() => { sound.voices = Math.max(0, sound.voices - 1); pan.disconnect(); },
              (dur + .15) * 1000);
  }

  /* ---- 构建珠帘 ----
   * 26 列 × 39 行汉字链条
   * 顶部锚点固定在屋檐下（按屋顶曲线计算 y）
   * 汉字从右到左竖排阅读（readingColumn = columns - 1 - column）
   */
  function build() {
    chains.length = 0;
    const narrow = width < 720;
    const columns = narrow ? 16 : 26;
    const tRect = temple.getBoundingClientRect();
    const aRect = artboard.getBoundingClientRect();

    const centerX = tRect.left - aRect.left + tRect.width * .5;
    const cWidth = tRect.width * .84;
    const left = centerX - cWidth / 2;
    const tTop = tRect.top - aRect.top;
    const scale = tRect.width / 901;  // 原图 901px 宽
    const centerEdge = tTop + 682 * scale;  // 屋顶中心檐口
    const sideEdge  = tTop + 726 * scale;   // 屋顶两侧檐口
    const bottom = height - (narrow ? 42 : 48);
    const availH = Math.max(120, bottom - sideEdge);
    const rows = Math.max(18, Math.min(narrow ? 35 : 39, Math.floor(availH / 9.4) + 1));

    for (let col = 0; col < columns; col++) {
      const x = left + col * cWidth / (columns - 1);
      const norm = Math.abs(col / (columns - 1) * 2 - 1);  // 0=中心, 1=两侧
      const top = centerEdge + (sideEdge - centerEdge) * Math.pow(norm, 1.7) - 4;
      const segLen = Math.max(6.4, (bottom - top) / (rows - 1));
      const readingCol = columns - 1 - col;  // 从右往左阅读
      const chain = [];
      for (let row = 0; row < rows; row++) {
        const y = top + row * segLen;
        chain.push({
          x, y, oldX: x, oldY: y, anchorX: x, anchorY: y,
          pinned: row === 0, restLength: segLen,
          char: glyphs[(readingCol * rows + row) % glyphs.length],
          alpha: .36 + ((col + row * 2) % 6) * .055
        });
      }
      chains.push(chain);
    }
  }

  /* ---- 窗口尺寸变化 ---- */
  function resize() {
    const r = artboard.getBoundingClientRect();
    width = r.width; height = r.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);  // 限制 DPR ≤ 2
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    /* ★ 设置 canvas.width 会清空画布，所以重建后必须立刻重绘一次。
     * 循环在跑时下一帧会自动补上，但循环被闸住（页面隐藏 / 滚出视口 /
     * reduced-motion）时没人补——场景就空了。ResizeObserver 在 observe()
     * 时会立刻回调一次，正好撞上这个洞。 */
    draw();
  }

  /* ---- 鼠标推动珠帘 ----
   * 计算鼠标移动速度，对半径内的点施加冲量
   */
  function injectMouseDelta() {
    if (!mouse.active) return;
    const mx = mouse.x - mouse.oldX;
    const my = mouse.y - mouse.oldY;
    const speed = Math.hypot(mx, my);
    if (speed < .01 || speed > 80) return;  // 过慢或过快都忽略

    for (let ci = 0; ci < chains.length; ci++) {
      const chain = chains[ci];
      let strongest = 0;
      for (let i = 1; i < chain.length; i++) {
        const p = chain[i];
        const dist = Math.hypot(p.x - mouse.oldX, p.y - mouse.oldY);
        if (dist >= physics.radius) continue;
        const falloff = 1 - dist / physics.radius;
        strongest = Math.max(strongest, speed * falloff);
        p.x += mx * physics.strength * falloff;
        p.y += my * physics.strength * falloff;
      }
      if (strongest > 0) {
        strikeChain(ci, strongest, chain[0].x);
        registerInteraction();
      }
    }
  }

  /* ---- 自动微风 ----
   * 滑块控制强度，正弦波驱动链条摆动
   * 底部摆幅更大（heightRatio² ），偶发触发钟声
   */
  function injectBreeze() {
    if (breezeIntensity <= 0) return;
    breezePhase += 0.015;
    const sway = breezeIntensity * 0.015;
    for (let ci = 0; ci < chains.length; ci++) {
      const chain = chains[ci];
      const offset = ci * 0.3;
      const s = Math.sin(breezePhase + offset) * sway;
      let strongest = 0;
      for (let i = 1; i < chain.length; i++) {
        const p = chain[i];
        const ratio = i / chain.length;
        const local = s * ratio * ratio;
        p.x += local;
        strongest = Math.max(strongest, Math.abs(local) * 20);
      }
      if (strongest > 1.2 && Math.random() < 0.02) {
        strikeChain(ci, strongest, chain[0].x);
      }
    }
  }

  /* ---- 交互计数器 ---- */
  function registerInteraction() {
    interactionCount++;
    if (!counterEl) return;
    counterEl.textContent = `${opt.labels.counter} · ${interactionCount}`;
    counterEl.classList.add('visible');
    clearTimeout(counterEl._timer);
    counterEl._timer = setTimeout(() => counterEl.classList.remove('visible'), 2000);
  }

  /* ---- Verlet 积分 ----
   * 每个点：新位置 = 旧位置 + (当前位置 - 旧位置) × 摩擦 + 重力
   */
  function integrate() {
    for (const chain of chains) {
      for (const p of chain) {
        if (p.pinned) continue;
        const vx = (p.x - p.oldX) * physics.friction;
        const vy = (p.y - p.oldY) * physics.friction;
        p.oldX = p.x; p.oldY = p.y;
        p.x += vx; p.y += vy + physics.gravity;
      }
    }
  }

  /* ---- 距离约束 ----
   * 8 次迭代，让相邻点之间保持 restLength
   * 第一个点固定不动
   */
  function constrain() {
    for (let pass = 0; pass < 8; pass++) {
      for (const chain of chains) {
        const anchor = chain[0];
        anchor.x = anchor.anchorX; anchor.y = anchor.anchorY;
        for (let i = 1; i < chain.length; i++) {
          const a = chain[i - 1], b = chain[i];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.max(.0001, Math.hypot(dx, dy));
          const diff = (dist - b.restLength) / dist;
          if (a.pinned) {
            b.x -= dx * diff; b.y -= dy * diff;
          } else {
            const cx = dx * diff * .5, cy = dy * diff * .5;
            a.x += cx; a.y += cy; b.x -= cx; b.y -= cy;
          }
        }
      }
    }
  }

  /* ---- 绘制 ---- */
  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getComputedStyle(root)
      .getPropertyValue('--ink').trim() || '#2e251f';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '500 10px ui-monospace, SFMono-Regular, Menlo, monospace';
    for (const chain of chains) {
      for (const p of chain) {
        ctx.globalAlpha = p.alpha;
        ctx.fillText(p.char, p.x, p.y);
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---- 主循环 ---- */
  function tick() {
    injectBreeze();
    integrate(); constrain(); draw();
  }
  function frame() { tick(); rafId = requestAnimationFrame(frame); }
  /* 只有在「文档可见 且 场景在视口内」时才允许循环起来。
   * 少了这道闸，嵌在首屏以下的场景会在页面一加载就开始满帧跑物理。 */
  function start() {
    if (!rafId && !document.hidden && onScreen) rafId = requestAnimationFrame(frame);
  }
  function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  /* ---- 鼠标事件 ---- */
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

  /* ---- 配置面板 ---- */
  function bindRange(id, outId, update) {
    const input = root.querySelector(`[data-kc="${id}"]`);
    const out = root.querySelector(`[data-kc-out="${id}"]`);
    if (!input || !out) return;
    on(input, 'input', () => {
      const v = Number(input.value);
      out.value = String(v);
      update(v);
    });
  }

  /* ═══════════════════════════════════════════════
   *  3. 昼夜主题 + 声音开关 + 初始化
   * ═══════════════════════════════════════════════ */

  /* ★ 主题写在场景根元素上，不碰 <html> —— 否则会和宿主站点的主题系统抢属性 */
  function isNight() { return root.getAttribute('data-theme') === 'night'; }
  function setTheme(mode) {
    if (mode === 'night') root.setAttribute('data-theme', 'night');
    else root.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.textContent = mode === 'night' ? '☾' : '☀';
      themeToggle.classList.toggle('active', mode === 'night');
    }
    if (opt.persistTheme) { try { localStorage.setItem(THEME_KEY, mode); } catch (e) {} }
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
      soundToggle.textContent = soundEnabled ? opt.labels.soundOn : opt.labels.soundOff;
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
  bindRange('inertia',  'inertiaValue',  v => { physics.friction = v / 100; });
  bindRange('breeze',   'breezeValue',   v => { breezeIntensity = v; });

  // Canvas 鼠标事件
  on(canvas, 'pointerenter', enter);
  on(canvas, 'pointermove', move);
  on(canvas, 'pointerleave', leave);
  on(root, 'pointerdown', unlockSound, { passive: true });
  on(window, 'resize', resize);
  on(document, 'visibilitychange', () => document.hidden ? stop() : resume());

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
      onScreen ? resume() : stop();
    }, { rootMargin: '120px' });
    io.observe(root);
    cleanup.push(() => io.disconnect());
  }
  function resume() { if (onScreen && !document.hidden) start(); }

  // 异步加载天坛长文本作为珠帘汉字源
  async function loadBodyText() {
    try {
      const res = await fetch(opt.assetBase + 'tiantan.txt');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const chars = (await res.text()).match(/\p{Script=Han}/gu);
      if (chars && chars.length) {
        glyphs = chars.join('');
        build();
      }
    } catch (e) { console.warn(e); }
  }

  /* ---- 初始化 ---- */
  function init() {
    // 每个标题字母挂载反重力物理
    root.querySelectorAll('.ag-char').forEach(el => {
      attachAntiGravity(el, {
        floatAmp: 3 + Math.random() * 4,
        floatSpeed: 0.25 + Math.random() * 0.3,
        rotAmp: 0.6 + Math.random() * 1.4,
        pushRadius: 110,
        pushForce: 16
      });
    });
    resize();
    tick();                       // 先画一帧：即使循环没起来也不是空白
    if (opt.glyphs) { glyphs = String(opt.glyphs); build(); }
    else loadBodyText();
    start();
  }

  /* 卸载：释放 rAF、监听器、观察器和音频节点。
   * 单页应用里把这一段换掉时必须调用，否则物理循环会一直跑下去。 */
  function destroy() {
    stop();
    cleanup.forEach(fn => { try { fn(); } catch (e) {} });
    cleanup.length = 0;
    if (sound.context && sound.context.state !== 'closed') sound.context.close().catch(() => {});
    root.innerHTML = '';
    root.classList.remove('toh-scene');
    root.removeAttribute('data-theme');
  }

  const handle = {
    el: root, destroy, setTheme,
    render: tick,                 // 手动推进并重绘一帧（循环停着时也能用）
    get running() { return rafId !== null; },
    setSound(v) { soundEnabled = !!v; if (soundEnabled) unlockSound(); }
  };

  init();
  return handle;
}
