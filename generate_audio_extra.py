"""
generate_audio_extra.py — ピンイン/ひらがな/カタカナ/漢字入門 + ゲームUI音声の一括生成
"""
import asyncio
import os
import edge_tts

BASE_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")
VOICE_ZH = "zh-CN-XiaoxiaoNeural"
VOICE_JA = "ja-JP-NanamiNeural"
RATE = "-10%"
PITCH = "+5Hz"

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
    ("a", "啊"), ("o", "喔"), ("e", "鹅"),
    ("i", "衣"), ("u", "乌"), ("v", "鱼"),  # ü -> v for filename
    ("ai", "爱"), ("ei", "杯"), ("ui", "回"),
    ("ao", "猫"), ("ou", "狗"), ("iu", "牛"),
    ("ie", "耶"), ("ve", "月"), ("er", "耳"),  # üe -> ve
    ("an", "安"), ("en", "恩"), ("in", "因"),
    ("un", "温"), ("vn", "晕"),  # ün -> vn
    ("ang", "昂"), ("eng", "风"), ("ing", "英"), ("ong", "翁"),
]

# ===== ひらがな (46音 + 濁音/半濁音/拗音) =====
HIRAGANA = [
    # 清音 50音
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
    # 濁音
    "が", "ぎ", "ぐ", "げ", "ご",
    "ざ", "じ", "ず", "ぜ", "ぞ",
    "だ", "ぢ", "づ", "で", "ど",
    "ば", "び", "ぶ", "べ", "ぼ",
    # 半濁音
    "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
    # 拗音
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

# ===== カタカナ（ひらがなと同じ音、カタカナ表記） =====
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
    # 濁音
    "ガ", "ギ", "グ", "ゲ", "ゴ",
    "ザ", "ジ", "ズ", "ゼ", "ゾ",
    "ダ", "ヂ", "ヅ", "デ", "ド",
    "バ", "ビ", "ブ", "ベ", "ボ",
    # 半濁音
    "パ", "ピ", "プ", "ペ", "ポ",
]

# ===== 漢字入門（30字、中国語+日本語） =====
KANJI = [
    ("一", "いち"), ("二", "に"), ("三", "さん"),
    ("四", "し"), ("五", "ご"), ("六", "ろく"),
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


async def generate_one(text, voice, output_path):
    """1つの音声ファイルを生成"""
    communicate = edge_tts.Communicate(text, voice, rate=RATE, pitch=PITCH)
    await communicate.save(output_path)


async def main():
    total = 0
    skipped = 0

    # --- ピンイン声母 ---
    d = os.path.join(BASE_DIR, "pinyin", "shengmu")
    os.makedirs(d, exist_ok=True)
    for key, char in SHENGMU:
        p = os.path.join(d, f"{key}.mp3")
        if not os.path.exists(p):
            print(f"  SHENGMU: {key} ({char}) -> {p}")
            await generate_one(char, VOICE_ZH, p)
            total += 1
        else:
            skipped += 1

    # --- ピンイン韻母 ---
    d = os.path.join(BASE_DIR, "pinyin", "yunmu")
    os.makedirs(d, exist_ok=True)
    for key, char in YUNMU:
        p = os.path.join(d, f"{key}.mp3")
        if not os.path.exists(p):
            print(f"  YUNMU: {key} ({char}) -> {p}")
            await generate_one(char, VOICE_ZH, p)
            total += 1
        else:
            skipped += 1

    # --- ひらがな ---
    d = os.path.join(BASE_DIR, "hiragana")
    os.makedirs(d, exist_ok=True)
    for ch in HIRAGANA:
        # ファイル名にはUnicodeコードポイントを使用（安全なファイル名のため）
        fname = "_".join(f"{ord(c):04x}" for c in ch)
        p = os.path.join(d, f"{fname}.mp3")
        if not os.path.exists(p):
            print(f"  HIRAGANA: {ch} -> {p}")
            await generate_one(ch, VOICE_JA, p)
            total += 1
        else:
            skipped += 1

    # --- カタカナ ---
    d = os.path.join(BASE_DIR, "katakana")
    os.makedirs(d, exist_ok=True)
    for ch in KATAKANA:
        fname = "_".join(f"{ord(c):04x}" for c in ch)
        p = os.path.join(d, f"{fname}.mp3")
        if not os.path.exists(p):
            print(f"  KATAKANA: {ch} -> {p}")
            await generate_one(ch, VOICE_JA, p)
            total += 1
        else:
            skipped += 1

    # --- 漢字入門 ---
    for lang_dir in ["zh", "ja"]:
        d = os.path.join(BASE_DIR, "kanji", lang_dir)
        os.makedirs(d, exist_ok=True)
    for kanji, ja_reading in KANJI:
        fname = f"{ord(kanji):04x}"
        # 中国語
        p = os.path.join(BASE_DIR, "kanji", "zh", f"{fname}.mp3")
        if not os.path.exists(p):
            print(f"  KANJI ZH: {kanji} -> {p}")
            await generate_one(kanji, VOICE_ZH, p)
            total += 1
        else:
            skipped += 1
        # 日本語
        p = os.path.join(BASE_DIR, "kanji", "ja", f"{fname}.mp3")
        if not os.path.exists(p):
            print(f"  KANJI JA: {kanji} ({ja_reading}) -> {p}")
            await generate_one(ja_reading, VOICE_JA, p)
            total += 1
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
                print(f"  UI {lang}: {key} ({text}) -> {p}")
                await generate_one(text, voice, p)
                total += 1
            else:
                skipped += 1

    print(f"\n完了: {total} ファイル生成, {skipped} スキップ")


if __name__ == "__main__":
    asyncio.run(main())
