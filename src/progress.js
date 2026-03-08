/**
 * progress.js — 進捗トラッキングシステム
 * localStorageを使ってゲームの成績・学習進捗を管理
 * バッジ/メダルシステム付き
 */

const STORAGE_KEY = 'nikoniko_progress';

/** バッジ定義 */
const BADGES = [
    { id: 'first_game', icon: '🌟', nameZh: '初次游戏', nameJa: 'はじめてのゲーム', condition: (p) => getTotalGames(p) >= 1 },
    { id: 'math_5', icon: '🧮', nameZh: '算术达人', nameJa: 'けいさんたつじん', condition: (p) => (p.games?.['math-game']?.played || 0) >= 5 },
    { id: 'counting_5', icon: '🔢', nameZh: '数字小能手', nameJa: 'かぞえるめいじん', condition: (p) => (p.games?.['counting-game']?.played || 0) >= 5 },
    { id: 'memory_5', icon: '🎴', nameZh: '记忆大师', nameJa: 'きおくマスター', condition: (p) => (p.games?.['memory-game']?.played || 0) >= 5 },
    { id: 'perfect', icon: '💯', nameZh: '满分达人', nameJa: 'まんてん！', condition: (p) => p.perfectScores >= 1 },
    { id: 'streak_3', icon: '🔥', nameZh: '连续3天', nameJa: '3にちれんぞく', condition: (p) => p.maxStreak >= 3 },
    { id: 'kanji_10', icon: '字', nameZh: '汉字学徒', nameJa: 'かんじのたまご', condition: (p) => (p.kanjiViewed || 0) >= 10 },
    { id: 'kanji_30', icon: '📚', nameZh: '汉字博士', nameJa: 'かんじはかせ', condition: (p) => (p.kanjiViewed || 0) >= 30 },
];

function getTotalGames(p) {
    if (!p.games) return 0;
    return Object.values(p.games).reduce((sum, g) => sum + (g.played || 0), 0);
}

/**
 * 進捗データを取得
 */
export function getProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return createDefaultProgress();
        return JSON.parse(raw);
    } catch {
        return createDefaultProgress();
    }
}

function createDefaultProgress() {
    return {
        games: {},
        perfectScores: 0,
        kanjiViewed: 0,
        badges: [],
        maxStreak: 0,
        lastPlayDate: null,
        currentStreak: 0,
        totalPlayTime: 0,
    };
}

/**
 * 進捗データを保存
 */
function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * ゲーム結果を記録
 * @param {string} gameId - ゲームID (e.g. 'math-game', 'counting-game', 'memory-game')
 * @param {number} score - 獲得スコア
 * @param {number} maxScore - 最大スコア
 */
export function recordGame(gameId, score, maxScore) {
    const p = getProgress();

    if (!p.games[gameId]) {
        p.games[gameId] = { played: 0, totalScore: 0, bestScore: 0, maxPossible: maxScore };
    }

    const g = p.games[gameId];
    g.played++;
    g.totalScore += score;
    if (score > g.bestScore) g.bestScore = score;
    g.maxPossible = maxScore;

    // パーフェクトスコア
    if (score === maxScore) p.perfectScores++;

    // 連続日数
    updateStreak(p);

    // バッジチェック
    checkBadges(p);

    saveProgress(p);
}

/**
 * 漢字の閲覧を記録
 */
export function recordKanjiView() {
    const p = getProgress();
    p.kanjiViewed = (p.kanjiViewed || 0) + 1;
    checkBadges(p);
    saveProgress(p);
}

/**
 * 連続ログインの更新
 */
function updateStreak(p) {
    const today = new Date().toISOString().split('T')[0];
    if (p.lastPlayDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (p.lastPlayDate === yesterday) {
        p.currentStreak++;
    } else {
        p.currentStreak = 1;
    }

    if (p.currentStreak > p.maxStreak) {
        p.maxStreak = p.currentStreak;
    }

    p.lastPlayDate = today;
}

/**
 * バッジチェック — 新しいバッジがあれば追加
 */
function checkBadges(p) {
    if (!p.badges) p.badges = [];
    BADGES.forEach(badge => {
        if (!p.badges.includes(badge.id) && badge.condition(p)) {
            p.badges.push(badge.id);
        }
    });
}

/**
 * 獲得済みバッジの一覧を返す
 */
export function getEarnedBadges() {
    const p = getProgress();
    return BADGES.filter(b => (p.badges || []).includes(b.id));
}

/**
 * 全バッジ定義
 */
export function getAllBadges() {
    return BADGES;
}

/**
 * ゲーム統計を取得
 */
export function getGameStats(gameId) {
    const p = getProgress();
    return p.games?.[gameId] || { played: 0, totalScore: 0, bestScore: 0 };
}
