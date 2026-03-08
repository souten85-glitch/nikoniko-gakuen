/**
 * videos.js — 動画画面
 * YouTube知育動画をカテゴリ別にリスト表示し、タップでiframe再生
 * 
 * v3: プレイヤーをカード直下にインライン挿入する方式に変更
 */
import { t, getLang } from '../i18n.js';
import { playSound } from '../audio.js';
import { videoCategories } from '../data/videos.js';

/**
 * 動画画面をレンダリング
 */
export function renderVideos(container, navigate) {
  const lang = getLang();
  let displayCategories = videoCategories;
  if (lang === 'ja') {
    displayCategories = videoCategories.filter((c) => c.id === 'ja');
  } else if (lang === 'zh') {
    displayCategories = videoCategories.filter((c) => c.id === 'zh');
  }

  container.innerHTML = `
    <div class="page" id="videos-page">
      <div class="page-header">
        <button class="btn-back" id="btn-back-videos">◀</button>
        <h1 class="page-title">${t('videos')}</h1>
        <div style="width:44px"></div>
      </div>
      <div class="page-content page-content--scrollable" id="videos-scroll">
        ${displayCategories
      .map(
        (cat) => `
          <div style="width:100%; max-width:600px;">
            <h2 style="font-size: var(--font-size-md); padding: var(--space-sm) var(--space-md); color: var(--color-text-light);">
              ${cat.label}
            </h2>
            <div class="media-list-wrap">
              ${cat.videos
            .map(
              (video, i) => `
                <div class="media-item" data-vid="${video.id}">
                  <div class="media-card" 
                       style="animation: slideUp 0.3s ease ${i * 0.06}s both; cursor:pointer;">
                    <span class="media-card__icon">${video.icon}</span>
                    <div class="media-card__info">
                      <div class="media-card__title">${video.title}</div>
                      <div class="media-card__subtitle">${video.subtitle}</div>
                    </div>
                    <span class="media-card__play">▶</span>
                  </div>
                  <div class="inline-player" style="display:none;"></div>
                </div>
              `
            )
            .join('')}
            </div>
          </div>
        `
      )
      .join('')}
      </div>
    </div>
  `;

  // 戻るボタン
  const backBtn = container.querySelector('#btn-back-videos');
  backBtn.onclick = () => {
    playSound('pop');
    navigate('home');
  };

  let currentVideoId = null;

  // 各メディアカードに直接 onclick を設定
  const mediaItems = container.querySelectorAll('.media-item');
  mediaItems.forEach((item) => {
    const card = item.querySelector('.media-card');
    const player = item.querySelector('.inline-player');
    const videoId = item.dataset.vid;

    card.onclick = () => {
      playSound('pop');

      if (currentVideoId === videoId) {
        // 同じカード → プレイヤーを閉じる
        player.style.display = 'none';
        player.innerHTML = '';
        card.style.outline = '';
        currentVideoId = null;
        return;
      }

      // 他のプレイヤーを閉じる
      mediaItems.forEach((other) => {
        other.querySelector('.inline-player').style.display = 'none';
        other.querySelector('.inline-player').innerHTML = '';
        other.querySelector('.media-card').style.outline = '';
      });

      // プレイヤーを挿入
      currentVideoId = videoId;
      card.style.outline = '3px solid var(--color-pink)';
      card.style.outlineOffset = '2px';
      player.style.display = 'block';
      player.innerHTML = `
        <div class="video-player-wrap" style="display:block; margin-top: var(--space-sm);">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0" 
            allow="autoplay; encrypted-media; picture-in-picture" 
            allowfullscreen
            title="Video player">
          </iframe>
        </div>
      `;

      // プレイヤーまでスクロール
      setTimeout(() => {
        player.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    };
  });
}
