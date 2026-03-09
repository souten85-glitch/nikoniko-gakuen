/**
 * videos.js — 動画画面
 * YouTube知育動画をカテゴリ別にリスト表示し、タップでiframe再生
 * 中国国内アクセス時はBilibili版に自動切替
 */
import { t, getLang } from '../i18n.js';
import { playSound } from '../audio.js';
import { videoCategories, bilibiliVideoCategories } from '../data/videos.js';
import { isInChina } from '../region.js';

/**
 * 動画画面をレンダリング
 */
export function renderVideos(container, navigate) {
  const lang = getLang();
  const china = isInChina();
  const source = china ? bilibiliVideoCategories : videoCategories;

  let displayCategories = source;
  if (lang === 'ja') {
    displayCategories = source.filter((c) => c.id === 'ja');
  } else if (lang === 'zh') {
    displayCategories = source.filter((c) => c.id === 'zh');
  }

  // カード用のID取得キー
  const idKey = china ? 'bvid' : 'id';

  container.innerHTML = `
    <div class="page" id="videos-page">
      <div class="page-header">
        <button class="btn-back" id="btn-back-videos">◀</button>
        <h1 class="page-title">${t('videos')}</h1>
        <div style="width:44px"></div>
      </div>
      <div class="page-content page-content--scrollable" id="videos-scroll">
        ${china ? '<div style="text-align:center; font-size: var(--font-size-xs); color: var(--color-text-light); margin-bottom: var(--space-sm);">📺 B站版</div>' : ''}
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
                <div class="media-item" data-vid="${video[idKey]}">
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

  const mediaItems = container.querySelectorAll('.media-item');
  mediaItems.forEach((item) => {
    const card = item.querySelector('.media-card');
    const player = item.querySelector('.inline-player');
    const videoId = item.dataset.vid;

    card.onclick = () => {
      playSound('pop');

      if (currentVideoId === videoId) {
        player.style.display = 'none';
        player.innerHTML = '';
        card.style.outline = '';
        currentVideoId = null;
        return;
      }

      mediaItems.forEach((other) => {
        other.querySelector('.inline-player').style.display = 'none';
        other.querySelector('.inline-player').innerHTML = '';
        other.querySelector('.media-card').style.outline = '';
      });

      currentVideoId = videoId;
      card.style.outline = '3px solid var(--color-pink)';
      card.style.outlineOffset = '2px';
      player.style.display = 'block';

      if (china) {
        // Bilibili埋め込みプレイヤー
        player.innerHTML = `
          <div class="video-player-wrap" style="display:block; margin-top: var(--space-sm);">
            <iframe 
              src="https://player.bilibili.com/player.html?bvid=${videoId}&autoplay=1&high_quality=1"
              allow="autoplay; fullscreen"
              allowfullscreen
              sandbox="allow-scripts allow-same-origin allow-popups"
              title="Bilibili player">
            </iframe>
          </div>
        `;
      } else {
        // YouTube埋め込みプレイヤー
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
      }

      setTimeout(() => {
        player.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    };
  });
}
