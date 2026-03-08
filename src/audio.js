/**
 * audio.js — 音声管理モジュール
 * Web Speech API + Web Audio API で読み上げと効果音を提供
 */

const SPEECH_KEY = 'nikoniko-speech';
let speechEnabled = localStorage.getItem(SPEECH_KEY) !== 'false';

/** AudioContext (遅延初期化) */
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

/**
 * 音声読み上げの有効/無効を取得
 */
export function isSpeechEnabled() {
    return speechEnabled;
}

/**
 * 音声読み上げの有効/無効を設定
 */
export function setSpeechEnabled(enabled) {
    speechEnabled = enabled;
    localStorage.setItem(SPEECH_KEY, enabled ? 'true' : 'false');
}

/**
 * テキストを音声で読み上げ
 * @param {string} text - 読み上げるテキスト
 * @param {'ja' | 'zh'} lang - 言語
 * @returns {Promise<void>}
 */
export function speak(text, lang = 'ja') {
    if (!speechEnabled || !window.speechSynthesis) return Promise.resolve();

    return new Promise((resolve) => {
        // 既存の読み上げを停止
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'zh' ? 'zh-CN' : 'ja-JP';
        utterance.rate = 0.8; // ゆっくり話す（子供向け）
        utterance.pitch = 1.1; // やや高めの声
        utterance.volume = 0.8;

        utterance.onend = resolve;
        utterance.onerror = resolve;

        // 少し遅延して発話（Chrome バグ対策）
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 50);
    });
}

/**
 * 両言語で読み上げ（日本語 → 中国語）
 * @param {string} jaText
 * @param {string} zhText
 */
export async function speakBoth(jaText, zhText) {
    await speak(jaText, 'ja');
    await new Promise((r) => setTimeout(r, 400));
    await speak(zhText, 'zh');
}

/**
 * タッチ効果音を再生（Web Audio API で生成）
 * @param {'pop' | 'sparkle' | 'whoosh' | 'bubble' | 'chime'} type
 */
export function playSound(type = 'pop') {
    try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;

        switch (type) {
            case 'pop': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            }
            case 'sparkle': {
                for (let i = 0; i < 3; i++) {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    const freq = 800 + i * 400;
                    osc.frequency.setValueAtTime(freq, now + i * 0.08);
                    gain.gain.setValueAtTime(0.12, now + i * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
                    osc.start(now + i * 0.08);
                    osc.stop(now + i * 0.08 + 0.2);
                }
                break;
            }
            case 'whoosh': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
            }
            case 'bubble': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            }
            case 'chime': {
                const frequencies = [523, 659, 784]; // C5, E5, G5
                frequencies.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + i * 0.12);
                    gain.gain.setValueAtTime(0.12, now + i * 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.5);
                    osc.start(now + i * 0.12);
                    osc.stop(now + i * 0.12 + 0.5);
                });
                break;
            }
        }
    } catch (e) {
        // 音声再生に失敗してもクラッシュさせない
        console.warn('Audio playback failed:', e);
    }
}

/**
 * AudioContextを初期化（ユーザー操作のコールバック内で呼ぶ）
 */
export function initAudio() {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
    } catch (e) {
        console.warn('AudioContext init failed:', e);
    }
}
