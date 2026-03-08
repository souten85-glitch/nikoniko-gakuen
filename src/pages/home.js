/**
 * home.js — ホーム画面
 * 大きなカードアイコンでメニューを表示
 * 年齢セレクター付き
 */
import { t, getAge, setAge } from '../i18n.js';
import { playSound, initAudio } from '../audio.js';

/**
 * ホーム画面をレンダリング
 * @param {HTMLElement} container
 * @param {(page: string) => void} navigate
 */
export function renderHome(container, navigate) {
  const menuItems = [
    { id: 'flashcards', icon: '🃏', labelKey: 'flashcards', bg: 'var(--color-yellow-soft)' },
    { id: 'touch-play', icon: '👆', labelKey: 'touchPlay', bg: 'var(--color-pink-soft)' },
    { id: 'videos', icon: '🎬', labelKey: 'videos', bg: 'var(--color-blue-soft)' },
    { id: 'music', icon: '🎵', labelKey: 'music', bg: 'var(--color-green-soft)' },
  ];

  const currentAge = getAge();

  container.innerHTML = `
    <div class="page" id="home-page">
      <!-- 背景装飾 -->
      <div class="deco-shape deco-shape--1"></div>
      <div class="deco-shape deco-shape--2"></div>
      <div class="deco-shape deco-shape--3"></div>

      <div class="page-header">
        <div style="width:44px"></div>
        <h1 class="page-title" style="font-size: var(--font-size-xl);">
          ${t('appName')}
        </h1>
        <button class="btn-back" id="btn-settings" aria-label="${t('settings')}" style="font-size: 1.2rem;">
          ⚙️
        </button>
      </div>

      <!-- 年齢セレクター -->
      <div class="age-selector" id="age-selector">
        <button class="age-selector__btn ${currentAge === '1-2' ? 'active' : ''}" data-age="1-2">
          🍼 ${t('age12')}
        </button>
        <button class="age-selector__btn ${currentAge === '3-4' ? 'active' : ''}" data-age="3-4">
          🧸 ${t('age34')}
        </button>
        <button class="age-selector__btn ${currentAge === '5-6' ? 'active' : ''}" data-age="5-6">
          📚 ${t('age56')}
        </button>
      </div>

      <div class="page-content">
        <div class="home-grid">
          ${menuItems
      .map(
        (item, i) => `
            <button class="home-card" data-page="${item.id}" 
                    style="background: ${item.bg}; animation-delay: ${i * 0.1}s; animation: popIn 0.5s ease ${i * 0.1}s both;">
              <span class="home-card__icon">${item.icon}</span>
              <span class="home-card__label">${t(item.labelKey)}</span>
            </button>
          `
      )
      .join('')}
        </div>
      </div>
    </div>
  `;

  // イベントリスナー: メニューカード
  container.querySelectorAll('.home-card').forEach((card) => {
    card.addEventListener('click', () => {
      initAudio();
      playSound('pop');
      navigate(card.dataset.page);
    });
  });

  // イベントリスナー: 年齢セレクター
  container.querySelectorAll('.age-selector__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      playSound('pop');
      setAge(btn.dataset.age);
      // 全ボタンのactive解除
      container.querySelectorAll('.age-selector__btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 設定ボタン — 3回連続タップで開く（子供の誤操作防止）
  let settingsTapCount = 0;
  let settingsTapTimer = null;
  const settingsBtn = container.querySelector('#btn-settings');
  settingsBtn.addEventListener('click', () => {
    settingsTapCount++;
    clearTimeout(settingsTapTimer);
    settingsTapTimer = setTimeout(() => {
      settingsTapCount = 0;
    }, 1500);
    if (settingsTapCount >= 3) {
      settingsTapCount = 0;
      navigate('settings');
    }
  });
}
