/**
 * touch-play.js — タッチ遊び画面
 * Canvas上でタップするとパーティクルエフェクトが発生
 * モード: 花火 / シャボン玉 / キラキラ星 / おえかき(3歳〜)
 */
import { t, getAge } from '../i18n.js';
import { playSound } from '../audio.js';

/** パーティクル数の上限（パフォーマンス保護） */
const MAX_PARTICLES = 300;

let animationId = null;
let particles = [];
let resizeHandler = null;

const MODES = {
    fireworks: {
        icon: '🎆',
        labelKey: 'fireworks',
        create: createFirework,
        bgGradient: ['#1a1235', '#2d1b69'],
        ageGroup: '1-2',
    },
    bubbles: {
        icon: '🫧',
        labelKey: 'bubbles',
        create: createBubbles,
        bgGradient: ['#e8f4f8', '#d0ecf5'],
        ageGroup: '1-2',
    },
    stars: {
        icon: '⭐',
        labelKey: 'stars',
        create: createStars,
        bgGradient: ['#0f0c29', '#302b63'],
        ageGroup: '1-2',
    },
    drawing: {
        icon: '🎨',
        labelKey: 'drawing',
        isDrawing: true,
        bgGradient: ['#FFF8F0', '#FEF3E8'],
        ageGroup: '3-4',
    },
    rainbow: {
        icon: '🌈',
        labelKey: 'rainbow',
        isRainbow: true,
        bgGradient: ['#e8f0ff', '#f0e8ff'],
        ageGroup: '5-6',
    },
    numberTouch: {
        icon: '🔢',
        labelKey: 'numberTouch',
        isNumberTouch: true,
        bgGradient: ['#FFF8F0', '#FEF3E8'],
        ageGroup: '5-6',
    },
};

/** 年齢に応じたモードをフィルタリング */
function getFilteredModes() {
    const age = getAge();
    const ageOrder = { '1-2': 1, '3-4': 2, '5-6': 3 };
    const currentLevel = ageOrder[age] || 1;
    return Object.entries(MODES).filter(([, mode]) => {
        const modeLevel = ageOrder[mode.ageGroup] || 1;
        return modeLevel <= currentLevel;
    });
}

let currentMode = 'fireworks';

/**
 * タッチ遊び画面をレンダリング
 */
export function renderTouchPlay(container, navigate) {
    cleanup(); // 前回のアニメーションをクリーンアップ
    renderModeSelect(container, navigate);
}

/** リソースクリーンアップ */
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    particles = [];
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
}

function renderModeSelect(container, navigate) {
    cleanup();
    const filteredModes = getFilteredModes();

    container.innerHTML = `
    <div class="page" id="touch-mode-page">
      <div class="page-header">
        <button class="btn-back" id="btn-back">◀</button>
        <h1 class="page-title">${t('touchPlay')}</h1>
        <div style="width:44px"></div>
      </div>
      <div class="page-content">
        <div class="touch-mode-selector">
          ${filteredModes
            .map(
                ([key, mode], i) => `
            <button class="touch-mode-btn" data-mode="${key}" style="animation: popIn 0.4s ease ${i * 0.1}s both;">
              <span style="font-size: var(--font-size-giant);">${mode.icon}</span>
              <span class="touch-mode-btn__label">${t(mode.labelKey)}</span>
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;

    container.querySelector('#btn-back').addEventListener('click', () => {
        playSound('pop');
        navigate('home');
    });

    container.querySelectorAll('.touch-mode-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentMode = btn.dataset.mode;
            playSound('chime');
            const m = MODES[currentMode];
            if (m.isDrawing) {
                startDrawingCanvas(container, navigate);
            } else if (m.isRainbow) {
                startRainbowCanvas(container, navigate);
            } else if (m.isNumberTouch) {
                startNumberTouchGame(container, navigate);
            } else {
                startTouchCanvas(container, navigate);
            }
        });
    });
}

function startTouchCanvas(container, navigate) {
    cleanup();

    const mode = MODES[currentMode];

    container.innerHTML = `
    <div class="page" id="touch-canvas-page" style="padding:0; position:relative;">
      <canvas class="touch-canvas" id="touch-canvas"></canvas>
      <div class="page-header" style="position:absolute; top:0; left:0; right:0; z-index:10;">
        <button class="btn-back" id="btn-back-canvas" 
                style="background: rgba(255,255,255,0.3); backdrop-filter: blur(4px);">◀</button>
        <div></div>
        <div style="width:44px"></div>
      </div>
    </div>
  `;

    const canvas = container.querySelector('#touch-canvas');
    const ctx = canvas.getContext('2d');

    // DPR対応リサイズ
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // 2倍まで
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeHandler = resize;
    resize();
    window.addEventListener('resize', resizeHandler);

    const canvasW = () => window.innerWidth;
    const canvasH = () => window.innerHeight;

    // 背景描画
    function drawBg() {
        const grad = ctx.createLinearGradient(0, 0, 0, canvasH());
        grad.addColorStop(0, mode.bgGradient[0]);
        grad.addColorStop(1, mode.bgGradient[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasW(), canvasH());
    }

    // タッチ座標取得
    function getTouchPos(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.changedTouches && e.changedTouches.length > 0) {
            return Array.from(e.changedTouches).map((touch) => ({
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            }));
        }
        return [{ x: e.clientX - rect.left, y: e.clientY - rect.top }];
    }

    // タッチイベント — パーティクル生成
    function spawnParticles(positions) {
        for (const pos of positions) {
            // パーティクル上限チェック
            if (particles.length >= MAX_PARTICLES) {
                // 古いパーティクルを間引く
                particles.splice(0, Math.floor(MAX_PARTICLES * 0.3));
            }
            mode.create(pos.x, pos.y);

            // 効果音
            if (currentMode === 'fireworks') playSound('whoosh');
            else if (currentMode === 'bubbles') playSound('bubble');
            else playSound('sparkle');
        }
    }

    function handleTouchStart(e) {
        e.preventDefault();
        spawnParticles(getTouchPos(e));
    }

    function handleTouchMove(e) {
        e.preventDefault();
        // touchmoveでも少量パーティクル生成（指の軌跡に沿って）
        const positions = getTouchPos(e);
        for (const pos of positions) {
            if (particles.length < MAX_PARTICLES) {
                if (currentMode === 'bubbles') {
                    particles.push(new BubbleParticle(pos.x, pos.y));
                } else if (currentMode === 'stars') {
                    particles.push(new StarParticle(pos.x, pos.y));
                }
                // 花火はtouchstartのみで生成（moveだと重い）
            }
        }
    }

    function handleMouseDown(e) {
        spawnParticles(getTouchPos(e));
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);

    // アニメーションループ
    let lastTime = 0;
    function animate(timestamp) {
        // フレームレート制限（60fps目標だが30fpsに落ちても滑らか）
        const delta = timestamp - lastTime;
        if (delta < 16) { // 60fps上限
            animationId = requestAnimationFrame(animate);
            return;
        }
        lastTime = timestamp;

        drawBg();

        // 死んだパーティクルを除去
        particles = particles.filter((p) => p.life > 0);

        for (const p of particles) {
            p.update();
            p.draw(ctx);
        }

        animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);

    // 戻るボタン
    const backBtn = container.querySelector('#btn-back-canvas');
    backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cleanup();
        playSound('pop');
        renderModeSelect(container, navigate);
    });
    // タッチでも確実に反応
    backBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cleanup();
        playSound('pop');
        renderModeSelect(container, navigate);
    });
}

// === パーティクル生成関数 ===

function createFirework(x, y) {
    const colors = [
        '#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1',
        '#F7DC6F', '#BB8FCE', '#82E0AA', '#F1948A',
    ];
    const count = 20 + Math.floor(Math.random() * 15); // やや減量して安定化
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new FireworkParticle(x, y, angle, speed, color));
    }
}

class FireworkParticle {
    constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = 0.015 + Math.random() * 0.01; // やや速く消えるように
        this.size = 2 + Math.random() * 3;
        this.color = color;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, this.size * this.life), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createBubbles(x, y) {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
        particles.push(new BubbleParticle(
            x + (Math.random() - 0.5) * 60,
            y + (Math.random() - 0.5) * 60
        ));
    }
}

class BubbleParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 10 + Math.random() * 25;
        this.maxSize = this.size;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = -1 - Math.random() * 2;
        this.life = 1;
        this.decay = 0.004 + Math.random() * 0.006;
        this.wobble = Math.random() * Math.PI * 2;
        this.hue = 180 + Math.random() * 40;
    }
    update() {
        this.wobble += 0.05;
        this.x += this.vx + Math.sin(this.wobble) * 0.5;
        this.y += this.vy;
        this.life -= this.decay;
        this.size = Math.max(0, this.maxSize * this.life);
    }
    draw(ctx) {
        if (this.size <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life * 0.6);

        const gradient = ctx.createRadialGradient(
            this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.1,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 60%, 90%, 0.8)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 50%, 80%, 0.3)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 40%, 70%, 0.1)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // ハイライト
        ctx.globalAlpha = Math.max(0, this.life * 0.4);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(
            this.x - this.size * 0.25,
            this.y - this.size * 0.25,
            this.size * 0.2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }
}

function createStars(x, y) {
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
        particles.push(new StarParticle(
            x + (Math.random() - 0.5) * 80,
            y + (Math.random() - 0.5) * 80
        ));
    }
}

class StarParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.maxSize = 8 + Math.random() * 15;
        this.life = 1;
        this.decay = 0.008 + Math.random() * 0.008;
        this.rotation = Math.random() * Math.PI;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
        this.vy = -0.5 - Math.random() * 1;
        this.hue = 40 + Math.random() * 20;
        this.growing = true;
    }
    update() {
        this.rotation += this.rotSpeed;
        this.y += this.vy;
        this.life -= this.decay;
        if (this.growing) {
            this.size += (this.maxSize - this.size) * 0.15;
            if (this.size > this.maxSize * 0.95) this.growing = false;
        } else {
            this.size = Math.max(0, this.maxSize * this.life);
        }
    }
    draw(ctx) {
        if (this.size <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = `hsl(${this.hue}, 80%, 70%)`;
        ctx.shadowColor = `hsl(${this.hue}, 80%, 70%)`;
        ctx.shadowBlur = 10;

        drawStar(ctx, 0, 0, 5, this.size, this.size * 0.4);

        ctx.restore();
    }
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
    if (outerR <= 0 || innerR <= 0) return;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);

    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fill();
}

// ==============================
// おえかきモード
// ==============================

const DRAWING_COLORS = [
    { color: '#E8706B', label: 'あか' },
    { color: '#F5C542', label: 'きいろ' },
    { color: '#5BB85B', label: 'みどり' },
    { color: '#5B9BD5', label: 'あお' },
    { color: '#C87FD8', label: 'むらさき' },
    { color: '#E88C6B', label: 'オレンジ' },
];

function startDrawingCanvas(container, navigate) {
    cleanup();

    let drawColor = DRAWING_COLORS[0].color;
    let lineWidth = 8;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    container.innerHTML = `
    <div class="page" id="drawing-page" style="padding:0; position:relative; background: #FFF8F0;">
      <canvas class="touch-canvas" id="drawing-canvas" style="background: #FFF8F0;"></canvas>
      <div class="page-header" style="position:absolute; top:0; left:0; right:0; z-index:10;">
        <button class="btn-back" id="btn-back-draw" 
                style="background: rgba(255,255,255,0.7); backdrop-filter: blur(4px);">◀</button>
        <div></div>
        <div style="width:44px"></div>
      </div>
      <div class="drawing-toolbar" id="drawing-toolbar">
        ${DRAWING_COLORS.map((c, i) => `
          <button class="drawing-color ${i === 0 ? 'active' : ''}" 
                  data-color="${c.color}" 
                  style="background: ${c.color};" 
                  title="${c.label}"></button>
        `).join('')}
        <div class="drawing-divider"></div>
        <button class="drawing-btn active" id="btn-thick">${t('drawThick')}</button>
        <button class="drawing-btn" id="btn-thin">${t('drawThin')}</button>
        <div class="drawing-divider"></div>
        <button class="drawing-btn" id="btn-clear">🗑️</button>
      </div>
    </div>
  `;

    const canvas = container.querySelector('#drawing-canvas');
    const ctx = canvas.getContext('2d');

    // DPR対応リサイズ
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        // 既存の描画内容を保存
        const imageData = canvas.width > 0 ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (imageData) ctx.putImageData(imageData, 0, 0);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    resizeHandler = resize;
    resize();
    window.addEventListener('resize', resizeHandler);

    // 描画座標取得
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
        // 点を描画（タップのみの場合）
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, lineWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = drawColor;
        ctx.fill();
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
    }

    function endDraw() {
        isDrawing = false;
    }

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw);
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);

    // カラーパレット
    container.querySelectorAll('.drawing-color').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            drawColor = btn.dataset.color;
            container.querySelectorAll('.drawing-color').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            playSound('pop');
        });
    });

    // 太さ切替
    const thickBtn = container.querySelector('#btn-thick');
    const thinBtn = container.querySelector('#btn-thin');
    thickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        lineWidth = 8;
        thickBtn.classList.add('active');
        thinBtn.classList.remove('active');
        playSound('pop');
    });
    thinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        lineWidth = 3;
        thinBtn.classList.add('active');
        thickBtn.classList.remove('active');
        playSound('pop');
    });

    // 全消し
    container.querySelector('#btn-clear').addEventListener('click', (e) => {
        e.stopPropagation();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        playSound('chime');
    });

    // 戻るボタン
    const backBtn = container.querySelector('#btn-back-draw');
    backBtn.onclick = (e) => {
        e.stopPropagation();
        cleanup();
        playSound('pop');
        renderModeSelect(container, navigate);
    };
}

// ==============================
// にじつくりモード
// ==============================

function startRainbowCanvas(container, navigate) {
    cleanup();

    const RAINBOW_COLORS = [
        '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#0ABDE3', '#C56CF0', '#FF6B81',
    ];

    container.innerHTML = `
    <div class="page" id="rainbow-page" style="padding:0; position:relative;">
      <canvas class="touch-canvas" id="rainbow-canvas"></canvas>
      <div class="page-header" style="position:absolute; top:0; left:0; right:0; z-index:10;">
        <button class="btn-back" id="btn-back-rainbow"
                style="background: rgba(255,255,255,0.5); backdrop-filter: blur(4px);">◀</button>
        <div></div>
        <div style="width:44px"></div>
      </div>
    </div>
  `;

    const canvas = container.querySelector('#rainbow-canvas');
    const ctx = canvas.getContext('2d');
    let colorIdx = 0;
    let isDrawing = false;
    let lastX = 0, lastY = 0;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth, h = window.innerHeight;
        const imgData = canvas.width > 0 ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (imgData) ctx.putImageData(imgData, 0, 0);
        // 背景グラデーション
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#e8f0ff');
        grad.addColorStop(1, '#f0e8ff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    resizeHandler = resize;
    resize();
    window.addEventListener('resize', resizeHandler);

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        // 虹色のラインを描画（色が循環する）
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = RAINBOW_COLORS[colorIdx % RAINBOW_COLORS.length];
        ctx.lineWidth = 12;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
        // 距離に応じて色を変える
        const dist = Math.hypot(pos.x - lastX, pos.y - lastY);
        if (dist > 8) colorIdx++;
        lastX = pos.x;
        lastY = pos.y;
        // キラキラパーティクル
        if (Math.random() < 0.3 && particles.length < 100) {
            particles.push({
                x: pos.x + (Math.random() - 0.5) * 20,
                y: pos.y + (Math.random() - 0.5) * 20,
                size: 2 + Math.random() * 4,
                life: 1,
                color: RAINBOW_COLORS[colorIdx % RAINBOW_COLORS.length],
            });
        }
    }

    function endDraw() {
        isDrawing = false;
        colorIdx = 0;
    }

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw);
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);

    // パーティクルアニメーション
    function animateSparkles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= 0.03;
            p.y -= 0.5;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        animationId = requestAnimationFrame(animateSparkles);
    }
    animationId = requestAnimationFrame(animateSparkles);

    // 戻る
    const backBtn = container.querySelector('#btn-back-rainbow');
    backBtn.onclick = (e) => {
        e.stopPropagation();
        cleanup();
        playSound('pop');
        renderModeSelect(container, navigate);
    };
}

// ==============================
// かずタッチゲーム
// ==============================

function startNumberTouchGame(container, navigate) {
    cleanup();

    const MAX_NUM = 10;
    let currentTarget = 1;
    let numberPositions = [];
    let score = 0;
    let gameComplete = false;

    function generatePositions() {
        numberPositions = [];
        const padding = 60;
        const w = window.innerWidth - padding * 2;
        const h = window.innerHeight - 160;
        for (let i = 1; i <= MAX_NUM; i++) {
            let x, y, overlap;
            let attempts = 0;
            do {
                x = padding + Math.random() * w;
                y = 100 + Math.random() * h;
                overlap = numberPositions.some(p => Math.hypot(p.x - x, p.y - y) < 70);
                attempts++;
            } while (overlap && attempts < 50);
            numberPositions.push({ num: i, x, y, found: false });
        }
    }

    function render() {
        const numBubbles = numberPositions.map(p => {
            const foundClass = p.found ? 'number-bubble--found' : '';
            const targetClass = p.num === currentTarget && !p.found ? 'number-bubble--target' : '';
            return `
        <button class="number-bubble ${foundClass} ${targetClass}" 
                data-num="${p.num}"
                style="left: ${p.x}px; top: ${p.y}px;">
          ${p.num}
        </button>
      `;
        }).join('');

        container.innerHTML = `
      <div class="page" id="number-touch-page" style="padding:0; position:relative; background: linear-gradient(135deg, #FFF8F0, #FEF3E8); overflow:hidden;">
        <div class="page-header" style="position:absolute; top:0; left:0; right:0; z-index:10;">
          <button class="btn-back" id="btn-back-numtouch"
                  style="background: rgba(255,255,255,0.7); backdrop-filter: blur(4px);">◀</button>
          <h1 class="page-title" style="font-size: var(--font-size-lg);">
            ${gameComplete ? '🎉 すごい！' : `${currentTarget} をタッチ！`}
          </h1>
          <div style="width:44px"></div>
        </div>
        ${numBubbles}
      </div>
    `;

        // イベント
        container.querySelector('#btn-back-numtouch').onclick = (e) => {
            e.stopPropagation();
            cleanup();
            playSound('pop');
            renderModeSelect(container, navigate);
        };

        if (!gameComplete) {
            container.querySelectorAll('.number-bubble').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const num = parseInt(btn.dataset.num);
                    if (num === currentTarget) {
                        // 正解
                        playSound('chime');
                        const pos = numberPositions.find(p => p.num === num);
                        pos.found = true;
                        currentTarget++;
                        if (currentTarget > MAX_NUM) {
                            gameComplete = true;
                            playSound('sparkle');
                        }
                        render();
                    } else {
                        // 不正解：ブルブル
                        btn.style.animation = 'shake 0.4s ease';
                        playSound('pop');
                        setTimeout(() => { btn.style.animation = ''; }, 400);
                    }
                });
            });
        } else {
            // ゲーム完了→3秒後にリスタート
            setTimeout(() => {
                currentTarget = 1;
                gameComplete = false;
                generatePositions();
                render();
            }, 3000);
        }
    }

    generatePositions();
    render();
}
