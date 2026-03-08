/**
 * pinyin.js — ピンイン学習ページ
 * 中国語の声母（shēngmǔ）と韻母（yùnmǔ）をインタラクティブに学習
 * タップで中国語音声読み上げ + バウンスアニメーション
 */
import { t } from '../i18n.js';
import { playSound, speak } from '../audio.js';

/** 声母（shēngmǔ）— 23個 */
const SHENGMU_ROWS = [
  { color: '#FFB3B3', chars: ['b', 'p', 'm', 'f'] },
  { color: '#FFD1A3', chars: ['d', 't', 'n', 'l'] },
  { color: '#FFE8A3', chars: ['g', 'k', 'h', null] },
  { color: '#D4F5A3', chars: ['j', 'q', 'x', null] },
  { color: '#A3F5C8', chars: ['zh', 'ch', 'sh', 'r'] },
  { color: '#A3E8F5', chars: ['z', 'c', 's', null] },
  { color: '#C8A3F5', chars: ['y', 'w', null, null] },
];

/** 韻母（yùnmǔ）— 24個 */
const YUNMU_ROWS = [
  { color: '#FFB3B3', chars: ['a', 'o', 'e', null] },
  { color: '#FFD1A3', chars: ['i', 'u', 'ü', null] },
  { color: '#FFE8A3', chars: ['ai', 'ei', 'ui', null] },
  { color: '#D4F5A3', chars: ['ao', 'ou', 'iu', null] },
  { color: '#A3F5C8', chars: ['ie', 'üe', 'er', null] },
  { color: '#A3E8F5', chars: ['an', 'en', 'in', null] },
  { color: '#A3C8F5', chars: ['un', 'ün', null, null] },
  { color: '#C8A3F5', chars: ['ang', 'eng', 'ing', 'ong'] },
];

/** 四声の例（代表的な文字） */
const TONE_EXAMPLES = {
  'a': 'ā á ǎ à', 'o': 'ō ó ǒ ò', 'e': 'ē é ě è',
  'i': 'ī í ǐ ì', 'u': 'ū ú ǔ ù', 'ü': 'ǖ ǘ ǚ ǜ',
  'ai': 'āi ái ǎi ài', 'ei': 'ēi éi ěi èi', 'ui': 'uī uí uǐ uì',
  'ao': 'āo áo ǎo ào', 'ou': 'ōu óu ǒu òu', 'iu': 'iū iú iǔ iù',
  'ie': 'iē ié iě iè', 'üe': 'üē üé üě üè',
  'an': 'ān án ǎn àn', 'en': 'ēn én ěn èn', 'in': 'īn ín ǐn ìn',
  'un': 'ūn ún ǔn ùn', 'ün': 'ǖn ǘn ǚn ǜn',
  'ang': 'āng áng ǎng àng', 'eng': 'ēng éng ěng èng',
  'ing': 'īng íng ǐng ìng', 'ong': 'ōng óng ǒng òng',
};

/**
 * 音声読み上げ用の中国語代表音節
 * Web Speech API は漢字テキストなら正しく中国語発音する
 */
const SPEAK_TEXT = {
  // 声母（標準教育用音節）
  'b': '波', 'p': '坡', 'm': '摸', 'f': '佛',
  'd': '得', 't': '特', 'n': '讷', 'l': '勒',
  'g': '哥', 'k': '科', 'h': '喝',
  'j': '基', 'q': '期', 'x': '希',
  'zh': '知', 'ch': '吃', 'sh': '诗', 'r': '日',
  'z': '资', 'c': '次', 's': '思',
  'y': '衣', 'w': '乌',
  // 韻母（代表漢字）
  'a': '啊', 'o': '哦', 'e': '鹅',
  'i': '衣', 'u': '乌', 'ü': '鱼',
  'ai': '爱', 'ei': '诶', 'ui': '威',
  'ao': '凹', 'ou': '偶', 'iu': '优',
  'ie': '耶', 'üe': '约', 'er': '耳',
  'an': '安', 'en': '恩', 'in': '因',
  'un': '温', 'ün': '晕',
  'ang': '昂', 'eng': '鞥', 'ing': '英', 'ong': '翁',
};

/** 現在のタブ */
let currentTab = 'shengmu';

/**
 * ピンインページをレンダリング
 */
export function renderPinyin(container, navigate) {
  renderGrid(container, navigate);
}

function renderGrid(container, navigate) {
  const rows = currentTab === 'shengmu' ? SHENGMU_ROWS : YUNMU_ROWS;
  const cols = 4;

  container.innerHTML = `
    <div class="page" id="pinyin-page">
      <div class="page-header">
        <button class="btn-back" id="btn-back-py">◀</button>
        <h1 class="page-title">${t('pinyin')}</h1>
        <div style="width:44px"></div>
      </div>

      <!-- タブ切替 -->
      <div class="hira-tabs">
        <button class="hira-tab ${currentTab === 'shengmu' ? 'active' : ''}" data-tab="shengmu">
          ${t('shengmu')}
        </button>
        <button class="hira-tab ${currentTab === 'yunmu' ? 'active' : ''}" data-tab="yunmu">
          ${t('yunmu')}
        </button>
      </div>

      <div class="page-content page-content--scrollable">
        <div class="hira-grid-wrap" style="max-width: 360px;">
          ${rows.map((row, rowIdx) => `
            <div class="hira-row" style="grid-template-columns: repeat(${cols}, 1fr); animation: slideUp 0.4s ease ${rowIdx * 0.05}s both;">
              ${row.chars.map(ch => {
    if (!ch) return '<div class="hira-cell hira-cell--empty"></div>';
    const toneHint = TONE_EXAMPLES[ch] || '';
    return `
                  <button class="hira-cell pinyin-cell" data-char="${ch}"
                          style="background: ${row.color};">
                    <span class="hira-cell__char" style="font-family: sans-serif; font-weight: 700;">${ch}</span>
                    ${toneHint ? `<span class="pinyin-cell__tones">${toneHint}</span>` : ''}
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
  container.querySelector('#btn-back-py').addEventListener('click', () => {
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

  // セルタップ — 中国語音声読み上げ
  container.querySelectorAll('.pinyin-cell[data-char]').forEach(cell => {
    cell.addEventListener('click', async () => {
      const ch = cell.dataset.char;
      const speakCh = SPEAK_TEXT[ch] || ch;
      cell.classList.add('hira-cell--bounce');
      playSound('sparkle');
      await speak(speakCh, 'zh');
      setTimeout(() => cell.classList.remove('hira-cell--bounce'), 500);
    });
  });
}
