"""
generate_audio_extra.py — Google Cloud TTS でピンイン/ひらがな/カタカナ/漢字入門/UI音声を生成

Google Cloud TTS (Neural2/Wavenet) を使用し、高品質な発音を実現。
ピンイン韻母は四声バリエーションも生成。

Usage: python generate_audio_extra.py
"""
import os
import requests
import base64
import time

BASE_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")

# Google Cloud TTS API
API_KEY = "***REMOVED***"
TTS_URL = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={API_KEY}"

VOICE_ZH = {"languageCode": "cmn-CN", "name": "cmn-CN-Wavenet-A"}
VOICE_JA = {"languageCode": "ja-JP", "name": "ja-JP-Neural2-B"}
AUDIO_CONFIG = {
    "audioEncoding": "MP3",
    "speakingRate": 0.9,
    "pitch": 1.0,
}

# ===== ピンイン声母 (23個) =====
SHENGMU = [
    ("b", "波"), ("p", "坡"), ("m", "摸"), ("f", "佛"),
    ("d", "得"), ("t", "特"), ("n", "讷"), ("l", "勒"),
    ("g", "哥"), ("k", "科"), ("h", "喝"),
    ("j", "基"), ("q", "期"), ("x", "希"),
    ("zh", "知"), ("ch", "吃"), ("sh", "诗"), ("r", "日"),
    ("z", "资"), ("c", "次"), ("s", "思"),
    ("y", "衣"), ("w", "乌"),
]

# ===== ピンイン韻母 (24個) =====
YUNMU = [
    ("a", "啊"), ("o", "噢"), ("e", "鹅"),
    ("i", "衣"), ("u", "乌"), ("v", "鱼"),
    ("ai", "哀"), ("ei", "杯"), ("ui", "回"),
    ("ao", "猫"), ("ou", "欧"), ("iu", "牛"),
    ("ie", "耶"), ("ve", "月"), ("er", "耳"),
    ("an", "安"), ("en", "恩"), ("in", "因"),
    ("un", "温"), ("vn", "晕"),
    ("ang", "昂"), ("eng", "风"), ("ing", "英"), ("ong", "翁"),
]

# ===== ピンイン韻母の四声バリエーション =====
YUNMU_TONES = {
    "a":   ["阿", "啊", "啊", "啊"],
    "o":   ["噢", "哦", "噢", "哦"],
    "e":   ["鹅", "额", "恶", "饿"],
    "i":   ["衣", "姨", "已", "意"],
    "u":   ["乌", "无", "五", "雾"],
    "v":   ["迂", "鱼", "雨", "玉"],
    "ai":  ["哀", "挨", "矮", "爱"],
    "ei":  ["杯", "培", "北", "贝"],
    "ui":  ["灰", "回", "毁", "会"],
    "ao":  ["猫", "毛", "好", "到"],
    "ou":  ["欧", "偷", "口", "豆"],
    "iu":  ["优", "油", "有", "又"],
    "ie":  ["耶", "爷", "也", "叶"],
    "ve":  ["约", "月", "月", "越"],
    "er":  ["耳", "儿", "耳", "二"],
    "an":  ["安", "难", "俺", "暗"],
    "en":  ["恩", "人", "本", "笨"],
    "in":  ["因", "银", "饮", "印"],
    "un":  ["温", "文", "稳", "问"],
    "vn":  ["晕", "云", "允", "运"],
    "ang": ["昂", "忙", "想", "放"],
    "eng": ["风", "朋", "冷", "梦"],
    "ing": ["英", "明", "影", "命"],
    "ong": ["通", "同", "懂", "动"],
}

# ===== ひらがな =====
HIRAGANA = [
    "あ", "い", "う", "え", "お",
    "か", "き", "く", "け", "こ",
    "さ", "し", "す", "せ", "そ",
    "た", "ち", "つ", "て", "と",
    "な", "に", "ぬ", "ね", "の",
    "は", "ひ", "ふ", "へ", "ほ",
    "ま", "み", "む", "め", "も",
    "や", "ゆ", "よ",
    "ら", "り", "る", "れ", "ろ",
    "わ", "を", "ん",
    "が", "ぎ", "ぐ", "げ", "ご",
    "ざ", "じ", "ず", "ぜ", "ぞ",
    "だ", "ぢ", "づ", "で", "ど",
    "ば", "び", "ぶ", "べ", "ぼ",
    "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
    "きゃ", "きゅ", "きょ",
    "しゃ", "しゅ", "しょ",
    "ちゃ", "ちゅ", "ちょ",
    "にゃ", "にゅ", "にょ",
    "ひゃ", "ひゅ", "ひょ",
    "みゃ", "みゅ", "みょ",
    "りゃ", "りゅ", "りょ",
    "ぎゃ", "ぎゅ", "ぎょ",
    "じゃ", "じゅ", "じょ",
    "びゃ", "びゅ", "びょ",
    "ぴゃ", "ぴゅ", "ぴょ",
]

# ===== カタカナ =====
KATAKANA = [
    "ア", "イ", "ウ", "エ", "オ",
    "カ", "キ", "ク", "ケ", "コ",
    "サ", "シ", "ス", "セ", "ソ",
    "タ", "チ", "ツ", "テ", "ト",
    "ナ", "ニ", "ヌ", "ネ", "ノ",
    "ハ", "ヒ", "フ", "ヘ", "ホ",
    "マ", "ミ", "ム", "メ", "モ",
    "ヤ", "ユ", "ヨ",
    "ラ", "リ", "ル", "レ", "ロ",
    "ワ", "ヲ", "ン",
    "ガ", "ギ", "グ", "ゲ", "ゴ",
    "ザ", "ジ", "ズ", "ゼ", "ゾ",
    "ダ", "ヂ", "ヅ", "デ", "ド",
    "バ", "ビ", "ブ", "ベ", "ボ",
    "パ", "ピ", "プ", "ペ", "ポ",
]

# ===== 漢字入門 =====
KANJI = [
    ("一", "いち"), ("二", "に"), ("三", "さん"),
    ("四", "よん"), ("五", "ご"), ("六", "ろく"),
    ("七", "なな"), ("八", "はち"), ("九", "きゅう"),
    ("十", "じゅう"), ("百", "ひゃく"), ("千", "せん"),
    ("大", "おおきい"), ("小", "ちいさい"), ("上", "うえ"),
    ("下", "した"), ("左", "ひだり"), ("右", "みぎ"),
    ("日", "にち"), ("月", "つき"), ("火", "ひ"),
    ("水", "みず"), ("木", "き"), ("金", "きん"),
    ("土", "つち"), ("山", "やま"), ("川", "かわ"),
    ("人", "ひと"), ("口", "くち"), ("目", "め"),
]

# ===== ゲームUI音声 =====
GAME_UI = {
    "zh": [
        ("correct", "太棒了"),
        ("wrong", "再试一次"),
        ("perfect", "完美"),
        ("great", "做得很好"),
        ("tryagain", "加油"),
        ("howmany", "数一数，有几个"),
    ],
    "ja": [
        ("correct", "すごい"),
        ("wrong", "もういっかい"),
        ("perfect", "かんぺき"),
        ("great", "よくできました"),
        ("tryagain", "がんばって"),
        ("howmany", "いくつあるかな"),
    ],
}


def generate_tts(text, voice_config, output_path):
    """Google Cloud TTS で1ファイル生成"""
    body = {
        "input": {"text": text},
        "voice": voice_config,
        "audioConfig": AUDIO_CONFIG,
    }
    r = requests.post(TTS_URL, json=body)
    if r.status_code == 200:
        audio = base64.b64decode(r.json()["audioContent"])
        with open(output_path, "wb") as f:
            f.write(audio)
        return True
    else:
        print(f"    ERROR: {r.status_code} {r.text[:100]}")
        return False


def main():
    total = 0
    skipped = 0
    errors = 0

    # --- ピンイン声母 ---
    d = os.path.join(BASE_DIR, "pinyin", "shengmu")
    os.makedirs(d, exist_ok=True)
    for key, char in SHENGMU:
        p = os.path.join(d, f"{key}.mp3")
        if not os.path.exists(p):
            print(f"  SHENGMU: {key} ({char})")
            if generate_tts(char, VOICE_ZH, p):
                total += 1
            else:
                errors += 1
            time.sleep(0.1)
        else:
            skipped += 1

    # --- ピンイン韻母（デフォルト） ---
    d = os.path.join(BASE_DIR, "pinyin", "yunmu")
    os.makedirs(d, exist_ok=True)
    for key, char in YUNMU:
        p = os.path.join(d, f"{key}.mp3")
        if not os.path.exists(p):
            print(f"  YUNMU: {key} ({char})")
            if generate_tts(char, VOICE_ZH, p):
                total += 1
            else:
                errors += 1
            time.sleep(0.1)
        else:
            skipped += 1

    # --- ピンイン韻母の四声 ---
    for key, tones in YUNMU_TONES.items():
        for tone_num, char in enumerate(tones, 1):
            p = os.path.join(d, f"{key}_tone{tone_num}.mp3")
            if not os.path.exists(p):
                print(f"  YUNMU TONE: {key}_tone{tone_num} ({char})")
                if generate_tts(char, VOICE_ZH, p):
                    total += 1
                else:
                    errors += 1
                time.sleep(0.1)
            else:
                skipped += 1

    # --- ひらがな ---
    d = os.path.join(BASE_DIR, "hiragana")
    os.makedirs(d, exist_ok=True)
    for ch in HIRAGANA:
        fname = "_".join(f"{ord(c):04x}" for c in ch)
        p = os.path.join(d, f"{fname}.mp3")
        if not os.path.exists(p):
            print(f"  HIRAGANA: {ch}")
            if generate_tts(ch, VOICE_JA, p):
                total += 1
            else:
                errors += 1
            time.sleep(0.1)
        else:
            skipped += 1

    # --- カタカナ ---
    d = os.path.join(BASE_DIR, "katakana")
    os.makedirs(d, exist_ok=True)
    for ch in KATAKANA:
        fname = "_".join(f"{ord(c):04x}" for c in ch)
        p = os.path.join(d, f"{fname}.mp3")
        if not os.path.exists(p):
            print(f"  KATAKANA: {ch}")
            if generate_tts(ch, VOICE_JA, p):
                total += 1
            else:
                errors += 1
            time.sleep(0.1)
        else:
            skipped += 1

    # --- 漢字入門 ---
    for lang_dir in ["zh", "ja"]:
        os.makedirs(os.path.join(BASE_DIR, "kanji", lang_dir), exist_ok=True)
    for kanji, ja_reading in KANJI:
        fname = f"{ord(kanji):04x}"
        # 中国語
        p = os.path.join(BASE_DIR, "kanji", "zh", f"{fname}.mp3")
        if not os.path.exists(p):
            print(f"  KANJI ZH: {kanji}")
            if generate_tts(kanji, VOICE_ZH, p):
                total += 1
            else:
                errors += 1
            time.sleep(0.1)
        else:
            skipped += 1
        # 日本語
        p = os.path.join(BASE_DIR, "kanji", "ja", f"{fname}.mp3")
        if not os.path.exists(p):
            print(f"  KANJI JA: {kanji} ({ja_reading})")
            if generate_tts(ja_reading, VOICE_JA, p):
                total += 1
            else:
                errors += 1
            time.sleep(0.1)
        else:
            skipped += 1

    # --- ゲームUI音声 ---
    for lang, items in GAME_UI.items():
        d = os.path.join(BASE_DIR, "ui", lang)
        os.makedirs(d, exist_ok=True)
        for key, text in items:
            p = os.path.join(d, f"{key}.mp3")
            if not os.path.exists(p):
                voice = VOICE_ZH if lang == "zh" else VOICE_JA
                print(f"  UI {lang}: {key} ({text})")
                if generate_tts(text, voice, p):
                    total += 1
                else:
                    errors += 1
                time.sleep(0.1)
            else:
                skipped += 1

    print(f"\n完了: {total} 生成, {skipped} スキップ, {errors} エラー")


if __name__ == "__main__":
    main()
