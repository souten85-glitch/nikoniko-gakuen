/**
 * hiragana.js — ひらがな50音表ページ
 * タップすると音声読み上げ + バウンスアニメーション
 * 清音 / 濁音・半濁音 タブ切替
 */
import { t, getLang } from '../i18n.js';
import { playSound, speak } from '../audio.js';

/** 清音データ（行ごとに配列） */
const SEION_ROWS = [
  { label: 'あ行', color: '#FFB3B3', chars: ['あ', 'い', 'う', 'え', 'お'] },
  { label: 'か行', color: '#FFD1A3', chars: ['か', 'き', 'く', 'け', 'こ'] },
  { label: 'さ行', color: '#FFE8A3', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
  { label: 'た行', color: '#D4F5A3', chars: ['た', 'ち', 'つ', 'て', 'と'] },
  { label: 'な行', color: '#A3F5C8', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { label: 'は行', color: '#A3E8F5', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { label: 'ま行', color: '#A3C8F5', chars: ['ま', 'み', 'む', 'め', 'も'] },
  { label: 'や行', color: '#C8A3F5', chars: ['や', null, 'ゆ', null, 'よ'] },
  { label: 'ら行', color: '#F5A3D8', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
  { label: 'わ行', color: '#F5A3A3', chars: ['わ', null, null, null, 'を'] },
  { label: 'ん',   color: '#D8C8B8', chars: ['ん', null, null, null, null] },
];

/** 濁音・半濁音データ */
const DAKUON_ROWS = [
  { label: 'が行', color: '#FFD1A3', chars: ['が', 'ぎ', 'ぐ', 'げ', 'ご'] },
  { label: 'ざ行', color: '#FFE8A3', chars: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'] },
  { label: 'だ行', color: '#D4F5A3', chars: ['だ', 'ぢ', 'づ', 'で', 'ど'] },
  { label: 'ば行', color: '#A3E8F5', chars: ['ば', 'び', 'ぶ', 'べ', 'ぼ'] },
  { label: 'ぱ行', color: '#C8A3F5', chars: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'] },
];

/** ローマ字マッピング（中国語モード用） */
const ROMAJI = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'di','づ':'du','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
};

/** 現在のタブ */
let currentTab = 'seion';

/**
 * ひらがなページをレンダリング
 */
export function renderHiragana(container, navigate) {
  renderGrid(container, navigate);
}

function renderGrid(container, navigate) {
  const rows = currentTab === 'seion' ? SEION_ROWS : DAKUON_ROWS;
  const lang = getLang();
  const showRomaji = lang === 'zh' || lang === 'both';

  container.innerHTML = `
    <div class="page" id="hiragana-page">
      <div class="page-header">
        <button class="btn-back" id="btn-back-hira">◀</button>
        <h1 class="page-title">${t('hiragana')}</h1>
        <div style="width:44px"></div>
      </div>

      <!-- タブ切替 -->
      <div class="hira-tabs">
        <button class="hira-tab ${currentTab === 'seion' ? 'active' : ''}" data-tab="seion">
          ${t('seion')}
        </button>
        <button class="hira-tab ${currentTab === 'dakuon' ? 'active' : ''}" data-tab="dakuon">
          ${t('dakuon')}
        </button>
      </div>

      <div class="page-content page-content--scrollable">
        <div class="hira-grid-wrap">
          ${rows.map((row, rowIdx) => `
            <div class="hira-row" style="animation: slideUp 0.4s ease ${rowIdx * 0.05}s both;">
              ${row.chars.map(ch => {
                if (!ch) return '<div class="hira-cell hira-cell--empty"></div>';
                return `
                  <button class="hira-cell" data-char="${ch}"
                          style="background: ${row.color};">
                    <span class="hira-cell__char">${ch}</span>
                    ${showRomaji ? `<span class="hira-cell__romaji">${ROMAJI[ch] || ''}</span>` : ''}
                  </button>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // 戻るボタン
  container.querySelector('#btn-back-hira').addEventListener('click', () => {
    playSound('pop');
    navigate('home');
  });

  // タブ切替
  container.querySelectorAll('.hira-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentTab = tab.dataset.tab;
      playSound('pop');
      renderGrid(container, navigate);
    });
  });

  // セルタップ — 読み上げ
  container.querySelectorAll('.hira-cell[data-char]').forEach(cell => {
    cell.addEventListener('click', async () => {
      const ch = cell.dataset.char;
      // バウンスアニメーション
      cell.classList.add('hira-cell--bounce');
      playSound('sparkle');
      await speak(ch, 'ja');
      setTimeout(() => cell.classList.remove('hira-cell--bounce'), 500);
    });
  });
}
