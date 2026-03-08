/**
 * settings.js — 保護者設定画面
 * 言語切替、音声読み上げ ON/OFF、利用時間タイマー
 */
import { t, getLang, setLang } from '../i18n.js';
import { isSpeechEnabled, setSpeechEnabled, playSound } from '../audio.js';

const TIMER_KEY = 'nikoniko-timer';

let timerInterval = null;
let timerOverlayEl = null;

/**
 * 設定画面をレンダリング
 */
export function renderSettings(container, navigate) {
    const currentLang = getLang();
    const speechOn = isSpeechEnabled();
    const savedTimer = localStorage.getItem(TIMER_KEY) || '0';

    container.innerHTML = `
    <div class="page" id="settings-page">
      <div class="page-header">
        <button class="btn-back" id="btn-back">◀</button>
        <h1 class="page-title">${t('settings')}</h1>
        <div style="width:44px"></div>
      </div>
      <div class="page-content" style="justify-content: flex-start; overflow-y: auto;">
        <div class="settings-panel">
          <!-- 言語設定 -->
          <div class="settings-group">
            <h3 class="settings-group__title">🌏 ${t('language')}</h3>
            <div class="lang-toggle" style="width: 100%;">
              <button class="lang-toggle__btn ${currentLang === 'ja' ? 'active' : ''}" data-lang="ja" style="flex:1;">
                ${t('langJa')}
              </button>
              <button class="lang-toggle__btn ${currentLang === 'zh' ? 'active' : ''}" data-lang="zh" style="flex:1;">
                ${t('langZh')}
              </button>
              <button class="lang-toggle__btn ${currentLang === 'both' ? 'active' : ''}" data-lang="both" style="flex:1;">
                ${t('langBoth')}
              </button>
            </div>
          </div>

          <!-- 音声設定 -->
          <div class="settings-group">
            <h3 class="settings-group__title">🔊 ${t('speech')}</h3>
            <div class="settings-row">
              <span class="settings-row__label">${t('speech')}</span>
              <div class="toggle-switch ${speechOn ? 'active' : ''}" id="toggle-speech"></div>
            </div>
          </div>

          <!-- タイマー設定 -->
          <div class="settings-group">
            <h3 class="settings-group__title">⏰ ${t('timer')}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
              ${['0', '5', '10', '15', '20', '30']
            .map(
                (min) => `
                <button class="lang-toggle__btn ${savedTimer === min ? 'active' : ''}" 
                        data-timer="${min}"
                        style="min-width: 60px; padding: var(--space-sm); border-radius: var(--radius-md); 
                               background: ${savedTimer === min ? 'var(--color-surface)' : 'var(--color-bg-soft)'}; 
                               box-shadow: ${savedTimer === min ? 'var(--shadow-soft)' : 'none'};">
                  ${min === '0' ? t('timerOff') : min + '分'}
                </button>
              `
            )
            .join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    // 戻るボタン
    container.querySelector('#btn-back').addEventListener('click', () => {
        playSound('pop');
        navigate('home');
    });

    // 言語切替
    container.querySelectorAll('[data-lang]').forEach((btn) => {
        btn.addEventListener('click', () => {
            setLang(btn.dataset.lang);
            playSound('pop');
            renderSettings(container, navigate); // 再レンダリング
        });
    });

    // 音声トグル
    container.querySelector('#toggle-speech').addEventListener('click', () => {
        const newState = !isSpeechEnabled();
        setSpeechEnabled(newState);
        playSound('pop');
        renderSettings(container, navigate);
    });

    // タイマー設定
    container.querySelectorAll('[data-timer]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.timer);
            localStorage.setItem(TIMER_KEY, btn.dataset.timer);
            playSound('pop');

            // 既存タイマーをクリア
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }

            if (minutes > 0) {
                startTimer(minutes);
            }

            renderSettings(container, navigate);
        });
    });
}

function startTimer(minutes) {
    let remaining = minutes * 60;

    timerInterval = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            showTimerOverlay();
        }
    }, 1000);
}

function showTimerOverlay() {
    // オーバーレイを表示
    timerOverlayEl = document.createElement('div');
    timerOverlayEl.className = 'timer-overlay';
    timerOverlayEl.innerHTML = `
    <span class="timer-overlay__icon">🌙</span>
    <p class="timer-overlay__text" style="white-space: pre-line;">
      おしまいだよ！<br>またあそぼうね 🌙<br><br>
      结束啦！下次再玩吧 🌙
    </p>
  `;
    document.body.appendChild(timerOverlayEl);

    // 保護者が3回タップで解除
    let tapCount = 0;
    let tapTimer = null;
    timerOverlayEl.addEventListener('click', () => {
        tapCount++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => (tapCount = 0), 1500);
        if (tapCount >= 5) {
            timerOverlayEl.remove();
            timerOverlayEl = null;
            localStorage.setItem(TIMER_KEY, '0');
        }
    });
}
