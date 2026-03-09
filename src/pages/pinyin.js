/**
 * pinyin.js — ピンイン学習ページ
 * 中国語の声母（shēngmǔ）と韻母（yùnmǔ）をインタラクティブに学習
 * タップで中国語音声読み上げ + バウンスアニメーション
 * 韻母タップ時は四声（第1声→第2声→第3声→第4声）を順番に再生
 */
import { t } from '../i18n.js';
import { playSound, speak, speakWord } from '../audio.js';

/** 声母（shēngmǔ）— 23個: [表示文字, 読み上げ用漢字] */
const SHENGMU_ROWS = [
  { color: '#FFB3B3', chars: [['b', '波'], ['p', '坡'], ['m', '摸'], ['f', '佛']] },
  { color: '#FFD1A3', chars: [['d', '得'], ['t', '特'], ['n', '讷'], ['l', '勒']] },
  { color: '#FFE8A3', chars: [['g', '哥'], ['k', '科'], ['h', '喝'], null] },
  { color: '#D4F5A3', chars: [['j', '基'], ['q', '期'], ['x', '希'], null] },
  { color: '#A3F5C8', chars: [['zh', '知'], ['ch', '吃'], ['sh', '诗'], ['r', '日']] },
  { color: '#A3E8F5', chars: [['z', '资'], ['c', '次'], ['s', '思'], null] },
  { color: '#C8A3F5', chars: [['y', '衣'], ['w', '乌'], null, null] },
];

/** 韻母（yùnmǔ）— 24個: [表示文字, 読み上げ用漢字（フォールバック用）] */
const YUNMU_ROWS = [
  { color: '#FFB3B3', chars: [['a', '啊'], ['o', '噢'], ['e', '鹅'], null] },
  { color: '#FFD1A3', chars: [['i', '衣'], ['u', '乌'], ['ü', '鱼'], null] },
  { color: '#FFE8A3', chars: [['ai', '哀'], ['ei', '杯'], ['ui', '回'], null] },
  { color: '#D4F5A3', chars: [['ao', '猫'], ['ou', '欧'], ['iu', '牛'], null] },
  { color: '#A3F5C8', chars: [['ie', '耶'], ['üe', '月'], ['er', '耳'], null] },
  { color: '#A3E8F5', chars: [['an', '安'], ['en', '恩'], ['in', '因'], null] },
  { color: '#A3C8F5', chars: [['un', '温'], ['ün', '晕'], null, null] },
  { color: '#C8A3F5', chars: [['ang', '昂'], ['eng', '风'], ['ing', '英'], ['ong', '翁']] },
];

/** 四声の表示テキスト（各韻母に対応） */
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

/** 現在のタブ */
let currentTab = 'shengmu';

/**
 * ピンインページをレンダリング
 */
export function renderPinyin(container, navigate) {
  renderGrid(container, navigate);
}

/**
 * 韻母の四声を順番に再生する（第1声→第2声→第3声→第4声）
 * @param {string} fileKey - 韻母のファイルキー（例: 'a', 'o', 'v'）
 * @param {string} speakText - フォールバック用テキスト
 */
async function playYunmuTones(fileKey, speakText) {
  for (let tone = 1; tone <= 4; tone++) {
    const toneFileKey = `${fileKey}_tone${tone}`;
    await speakWord('pinyin/yunmu', toneFileKey, speakText, 'zh');
    // 各声調間に短い間隔を入れる
    if (tone < 4) {
      await new Promise(r => setTimeout(r, 300));
    }
  }
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
    const [display, speakCh] = ch;
    const toneHint = TONE_EXAMPLES[display] || '';
    return `
                  <button class="hira-cell pinyin-cell" data-speak="${speakCh}" data-display="${display}"
                          style="background: ${row.color};">
                    <span class="hira-cell__char" style="font-family: sans-serif; font-weight: 700;">${display}</span>
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

  // セルタップ — 音声読み上げ
  container.querySelectorAll('.pinyin-cell[data-speak]').forEach(cell => {
    cell.addEventListener('click', async () => {
      // 再生中のセルは無視（連打防止）
      if (cell.classList.contains('hira-cell--bounce')) return;

      const speakCh = cell.dataset.speak;
      const display = cell.dataset.display;
      const isYunmu = currentTab === 'yunmu';
      // ü -> v でファイル名を対応
      const fileKey = display.replace('ü', 'v');

      cell.classList.add('hira-cell--bounce');
      playSound('sparkle');

      if (isYunmu) {
        // 韻母: 四声を順番に再生（第1声→第2声→第3声→第4声）
        await playYunmuTones(fileKey, speakCh);
      } else {
        // 声母: 単一音声を再生
        await speakWord(`pinyin/shengmu`, fileKey, speakCh, 'zh');
      }

      cell.classList.remove('hira-cell--bounce');
    });
  });
}
