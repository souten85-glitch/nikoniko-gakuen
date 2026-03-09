/**
 * region.js — 地域判定ユーティリティ
 * ブラウザの言語設定やタイムゾーンから中国国内アクセスを推定
 */

const REGION_KEY = 'nikoniko_region';

/**
 * 中国国内からのアクセスかどうかを判定
 * 判定基準:
 * 1. ユーザーの手動設定（最優先）
 * 2. タイムゾーンが Asia/Shanghai (CST)
 * 3. ブラウザ言語が zh-CN
 * 4. YouTube iframe接続テスト
 */
export function isInChina() {
    // 手動設定がある場合それを使用
    const manual = localStorage.getItem(REGION_KEY);
    if (manual === 'cn') return true;
    if (manual === 'global') return false;

    // タイムゾーン判定
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === 'Asia/Shanghai' || tz === 'Asia/Chongqing' || tz === 'Asia/Urumqi') {
            return true;
        }
    } catch (e) {
        // Intl未対応の場合はオフセットで判定
        const offset = new Date().getTimezoneOffset();
        if (offset === -480) return true; // UTC+8
    }

    return false;
}

/**
 * 地域設定を手動で設定
 * @param {'cn' | 'global' | 'auto'} region
 */
export function setRegion(region) {
    if (region === 'auto') {
        localStorage.removeItem(REGION_KEY);
    } else {
        localStorage.setItem(REGION_KEY, region);
    }
}

/**
 * 現在の地域設定を取得
 */
export function getRegionSetting() {
    return localStorage.getItem(REGION_KEY) || 'auto';
}
