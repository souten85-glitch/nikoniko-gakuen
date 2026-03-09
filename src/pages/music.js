/**
 * music.js — 童謡・音楽画面
 * 日本語・中国語の童謡をリスト表示、YouTube埋め込みで再生
 * 
 * 2026-03-08: YouTube検索で有効なIDに全更新
 */
import { t, getLang } from '../i18n.js';
import { playSound } from '../audio.js';
import { bilibiliMusicData } from '../data/videos.js';
import { isInChina } from '../region.js';

const musicData = {
  ja: [
    { id: '6HIchtMO1Sw', title: 'きらきらぼし', subtitle: 'Twinkle Twinkle Little Star', icon: '⭐' },
    { id: 'BJcIRth6tTo', title: 'おおきなくりのきのしたで', subtitle: 'Under the Big Chestnut Tree', icon: '🌰' },
    { id: '6dj0paBPsiw', title: 'げんこつやまのたぬきさん', subtitle: 'Genkotsuyama no Tanukisan', icon: '🦝' },
    { id: 'oAKlvhK1e8w', title: 'すうじのうた', subtitle: '1から10までかぞえよう', icon: '🔢' },
    { id: 'P-lSxvIINbo', title: 'のりもののうた', subtitle: 'はたらくくるまの歌', icon: '🚗' },
    { id: 'FkFnrQzIIhM', title: 'どうぶつのうた', subtitle: '動物の名前をおぼえよう', icon: '🐾' },
    { id: 'UMEI2C2wnGY', title: 'くだもののうた', subtitle: '果物の名前をおぼえよう', icon: '🍎' },
    { id: 'HyQ0FTsV92U', title: 'いろのうた', subtitle: '色をおぼえよう', icon: '🎨' },
  ],
  zh: [
    { id: 'Ap3cDy74p1w', title: '小星星', subtitle: '一闪一闪亮晶晶', icon: '⭐' },
    { id: 'RApHGXfBKO0', title: '两只老虎', subtitle: '两只老虎跑得快', icon: '🐯' },
    { id: 'rFrQMUx_OJs', title: '小兔子乖乖', subtitle: '把门开开', icon: '🐰' },
    { id: 'G2P3Ams5-nM', title: '数字歌', subtitle: '从一数到十', icon: '🔢' },
    { id: 'AN0KPLgW6i4', title: '水果歌', subtitle: '彩色水果大集合', icon: '🍎' },
    { id: 'mUQpz1itMdQ', title: '动物歌', subtitle: '一起去动物园', icon: '🐾' },
    { id: 'UulTlStNp5k', title: '颜色歌', subtitle: '学习颜色', icon: '🎨' },
    { id: 'bwS1GkwyKQg', title: '交通工具歌', subtitle: '认识各种车', icon: '🚗' },
  ],
};

/**
 * 音楽画面をレンダリング
 */
export function renderMusic(container, navigate) {
  const lang = getLang();
  const china = isInChina();
  let displayLists = [];

  if (china) {
    // 中国国内: Bilibiliデータを使用
    const bData = bilibiliMusicData;
    if (lang === 'ja') {
      displayLists = [{ label: '🇯🇵 にほんのうた（B站）', songs: bData.ja, isBilibili: true }];
    } else if (lang === 'zh') {
      displayLists = [{ label: '🇨🇳 中文儿歌（B站）', songs: bData.zh, isBilibili: true }];
    } else {
      displayLists = [
        { label: '🇨🇳 中文儿歌（B站）', songs: bData.zh, isBilibili: true },
        { label: '🇯🇵 にほんのうた（B站）', songs: bData.ja, isBilibili: true },
      ];
    }
  } else {
    // 海外: YouTubeデータを使用
    if (lang === 'ja') {
      displayLists = [{ label: '🇯🇵 にほんのうた', songs: musicData.ja, isBilibili: false }];
    } else if (lang === 'zh') {
      displayLists = [{ label: '🇨🇳 中文儿歌', songs: musicData.zh, isBilibili: false }];
    } else {
      displayLists = [
        { label: '🇨🇳 中文儿歌', songs: musicData.zh, isBilibili: false },
        { label: '🇯🇵 にほんのうた', songs: musicData.ja, isBilibili: false },
      ];
    }
  }

  container.innerHTML = `
    <div class="page" id="music-page">
      <div class="page-header">
        <button class="btn-back" id="btn-back-music">◀</button>
        <h1 class="page-title">${t('music')}</h1>
        <div style="width:44px"></div>
      </div>
      <div class="page-content page-content--scrollable" id="music-scroll">
        ${displayLists
      .map(
        (list) => `
          <div style="width:100%; max-width:600px;">
            <h2 style="font-size: var(--font-size-md); padding: var(--space-sm) var(--space-md); color: var(--color-text-light);">
              ${list.label}
            </h2>
            <div class="media-list-wrap">
              ${list.songs
            .map(
              (song, i) => `
                <div class="media-item" data-sid="${song.bvid || song.id}" data-bilibili="${list.isBilibili}">
                  <div class="media-card"
                       style="animation: slideUp 0.3s ease ${i * 0.06}s both; cursor:pointer;">
                    <span class="media-card__icon">${song.icon}</span>
                    <div class="media-card__info">
                      <div class="media-card__title">${song.title}</div>
                      <div class="media-card__subtitle">${song.subtitle}</div>
                    </div>
                    <span class="media-card__play">♪</span>
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
  const backBtn = container.querySelector('#btn-back-music');
  backBtn.onclick = () => {
    playSound('pop');
    navigate('home');
  };

  let currentSongId = null;

  // 各メディアカードに直接 onclick を設定
  const mediaItems = container.querySelectorAll('.media-item');
  mediaItems.forEach((item) => {
    const card = item.querySelector('.media-card');
    const player = item.querySelector('.inline-player');
    const songId = item.dataset.sid;

    card.onclick = () => {
      playSound('pop');

      if (currentSongId === songId) {
        player.style.display = 'none';
        player.innerHTML = '';
        card.style.outline = '';
        currentSongId = null;
        return;
      }

      // 他のプレイヤーを閉じる
      mediaItems.forEach((other) => {
        other.querySelector('.inline-player').style.display = 'none';
        other.querySelector('.inline-player').innerHTML = '';
        other.querySelector('.media-card').style.outline = '';
      });

      // プレイヤーを挿入
      currentSongId = songId;
      card.style.outline = '3px solid var(--color-green)';
      card.style.outlineOffset = '2px';
      player.style.display = 'block';

      const isBilibili = item.dataset.bilibili === 'true';

      if (isBilibili) {
        player.innerHTML = `
          <div class="video-player-wrap" style="display:block; margin-top: var(--space-sm);">
            <iframe 
              src="https://player.bilibili.com/player.html?bvid=${songId}&autoplay=1&high_quality=1"
              allow="autoplay; fullscreen"
              allowfullscreen
              sandbox="allow-scripts allow-same-origin allow-popups"
              title="Bilibili player">
            </iframe>
          </div>
        `;
      } else {
        player.innerHTML = `
          <div class="video-player-wrap" style="display:block; margin-top: var(--space-sm);">
            <iframe 
              src="https://www.youtube.com/embed/${songId}?autoplay=1&playsinline=1&rel=0&loop=1" 
              allow="autoplay; encrypted-media; picture-in-picture"
              allowfullscreen
              title="Music player">
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
