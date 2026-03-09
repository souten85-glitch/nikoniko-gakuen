"""
generate_audio.py — Google Cloud TTS で音声ファイルを一括生成
フラッシュカードの全語彙を中国語・日本語両方で MP3 生成

Google Cloud TTS (Neural2/Wavenet) を使用し、高品質な発音を実現。

Usage: python generate_audio.py
"""
import os
import requests
import base64
import time

# 出力ディレクトリ
BASE_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")

# Google Cloud TTS API
API_KEY = "***REMOVED***"
TTS_URL = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={API_KEY}"

# 音声設定
VOICE_ZH = {"languageCode": "cmn-CN", "name": "cmn-CN-Wavenet-A"}   # 女性、自然
VOICE_JA = {"languageCode": "ja-JP", "name": "ja-JP-Neural2-B"}     # 女性、自然
AUDIO_CONFIG = {
    "audioEncoding": "MP3",
    "speakingRate": 0.9,   # 子供向けにゆっくり
    "pitch": 1.0,
}

# ===== フラッシュカードデータ =====
FLASHCARD_DATA = {
    "animals": [
        {"zh": "狗", "ja": "犬", "file": "dog"},
        {"zh": "猫", "ja": "猫", "file": "cat"},
        {"zh": "兔子", "ja": "うさぎ", "file": "rabbit"},
        {"zh": "熊猫", "ja": "パンダ", "file": "panda"},
        {"zh": "大象", "ja": "ぞう", "file": "elephant"},
        {"zh": "狮子", "ja": "ライオン", "file": "lion"},
        {"zh": "鱼", "ja": "さかな", "file": "fish"},
        {"zh": "鸟", "ja": "とり", "file": "bird"},
        {"zh": "青蛙", "ja": "カエル", "file": "frog"},
        {"zh": "熊", "ja": "熊", "file": "bear"},
    ],
    "fruits": [
        {"zh": "苹果", "ja": "りんご", "file": "apple"},
        {"zh": "香蕉", "ja": "バナナ", "file": "banana"},
        {"zh": "葡萄", "ja": "ぶどう", "file": "grape"},
        {"zh": "草莓", "ja": "いちご", "file": "strawberry"},
        {"zh": "橘子", "ja": "みかん", "file": "orange"},
        {"zh": "西瓜", "ja": "すいか", "file": "watermelon"},
        {"zh": "桃子", "ja": "桃", "file": "peach"},
        {"zh": "樱桃", "ja": "さくらんぼ", "file": "cherry"},
        {"zh": "蜜瓜", "ja": "メロン", "file": "melon"},
        {"zh": "猕猴桃", "ja": "キウイ", "file": "kiwi"},
    ],
    "colors": [
        {"zh": "红色", "ja": "赤", "file": "red"},
        {"zh": "蓝色", "ja": "青", "file": "blue"},
        {"zh": "黄色", "ja": "黄色", "file": "yellow"},
        {"zh": "绿色", "ja": "緑", "file": "green"},
        {"zh": "白色", "ja": "白", "file": "white"},
        {"zh": "黑色", "ja": "黒", "file": "black"},
        {"zh": "粉色", "ja": "ピンク", "file": "pink"},
        {"zh": "橙色", "ja": "オレンジ", "file": "orange_c"},
        {"zh": "紫色", "ja": "むらさき", "file": "purple"},
        {"zh": "棕色", "ja": "茶色", "file": "brown"},
    ],
    "numbers": [
        {"zh": "一", "ja": "いち", "file": "1"},
        {"zh": "二", "ja": "に", "file": "2"},
        {"zh": "三", "ja": "さん", "file": "3"},
        {"zh": "四", "ja": "よん", "file": "4"},
        {"zh": "五", "ja": "ご", "file": "5"},
        {"zh": "六", "ja": "ろく", "file": "6"},
        {"zh": "七", "ja": "なな", "file": "7"},
        {"zh": "八", "ja": "はち", "file": "8"},
        {"zh": "九", "ja": "きゅう", "file": "9"},
        {"zh": "十", "ja": "じゅう", "file": "10"},
    ],
    "vehicles": [
        {"zh": "汽车", "ja": "くるま", "file": "car"},
        {"zh": "公共汽车", "ja": "バス", "file": "bus"},
        {"zh": "电车", "ja": "電車", "file": "train"},
        {"zh": "飞机", "ja": "飛行機", "file": "airplane"},
        {"zh": "船", "ja": "ふね", "file": "ship"},
        {"zh": "自行车", "ja": "自転車", "file": "bicycle"},
        {"zh": "消防车", "ja": "消防車", "file": "firetruck"},
        {"zh": "救护车", "ja": "救急車", "file": "ambulance"},
        {"zh": "警车", "ja": "パトカー", "file": "police"},
        {"zh": "直升机", "ja": "ヘリコプター", "file": "helicopter"},
    ],
    "shapes": [
        {"zh": "圆形", "ja": "まる", "file": "circle"},
        {"zh": "三角形", "ja": "三角", "file": "triangle"},
        {"zh": "正方形", "ja": "四角", "file": "square"},
        {"zh": "星形", "ja": "ほし", "file": "star"},
        {"zh": "心形", "ja": "ハート", "file": "heart"},
        {"zh": "菱形", "ja": "ひしがた", "file": "diamond"},
        {"zh": "五边形", "ja": "五角形", "file": "pentagon"},
        {"zh": "六边形", "ja": "六角形", "file": "hexagon"},
    ],
    "body": [
        {"zh": "眼睛", "ja": "め", "file": "eyes"},
        {"zh": "耳朵", "ja": "みみ", "file": "ear"},
        {"zh": "鼻子", "ja": "はな", "file": "nose"},
        {"zh": "嘴巴", "ja": "くち", "file": "mouth"},
        {"zh": "手", "ja": "て", "file": "hand"},
        {"zh": "脚", "ja": "あし", "file": "foot"},
        {"zh": "胳膊", "ja": "うで", "file": "arm"},
        {"zh": "牙齿", "ja": "は", "file": "tooth"},
        {"zh": "头", "ja": "あたま", "file": "head"},
        {"zh": "肚子", "ja": "おなか", "file": "tummy"},
    ],
    "food": [
        {"zh": "饭团", "ja": "おにぎり", "file": "onigiri"},
        {"zh": "面包", "ja": "パン", "file": "bread"},
        {"zh": "牛奶", "ja": "牛乳", "file": "milk"},
        {"zh": "鸡蛋", "ja": "たまご", "file": "egg"},
        {"zh": "蛋糕", "ja": "ケーキ", "file": "cake"},
        {"zh": "冰淇淋", "ja": "アイス", "file": "icecream"},
        {"zh": "拉面", "ja": "ラーメン", "file": "ramen"},
        {"zh": "披萨", "ja": "ピザ", "file": "pizza"},
        {"zh": "寿司", "ja": "おすし", "file": "sushi"},
        {"zh": "胡萝卜", "ja": "にんじん", "file": "carrot"},
    ],
    "weather": [
        {"zh": "晴天", "ja": "はれ", "file": "sunny"},
        {"zh": "多云", "ja": "くもり", "file": "cloudy"},
        {"zh": "下雨", "ja": "あめ", "file": "rainy"},
        {"zh": "下雪", "ja": "ゆき", "file": "snowy"},
        {"zh": "彩虹", "ja": "にじ", "file": "rainbow"},
        {"zh": "打雷", "ja": "かみなり", "file": "thunder"},
    ],
    "greetings": [
        {"zh": "早上好", "ja": "おはよう", "file": "morning"},
        {"zh": "你好", "ja": "こんにちは", "file": "hello"},
        {"zh": "晚安", "ja": "おやすみ", "file": "goodnight"},
        {"zh": "谢谢", "ja": "ありがとう", "file": "thankyou"},
        {"zh": "对不起", "ja": "ごめんなさい", "file": "sorry"},
        {"zh": "初次见面", "ja": "はじめまして", "file": "nicetomeetyou"},
        {"zh": "我开动了", "ja": "いただきます", "file": "itadakimasu"},
        {"zh": "再见", "ja": "さようなら", "file": "goodbye"},
    ],
    "family": [
        {"zh": "妈妈", "ja": "おかあさん", "file": "mother"},
        {"zh": "爸爸", "ja": "おとうさん", "file": "father"},
        {"zh": "姐姐", "ja": "おねえちゃん", "file": "sister"},
        {"zh": "哥哥", "ja": "おにいちゃん", "file": "brother"},
        {"zh": "宝宝", "ja": "あかちゃん", "file": "baby"},
        {"zh": "爷爷", "ja": "おじいちゃん", "file": "grandfather"},
        {"zh": "奶奶", "ja": "おばあちゃん", "file": "grandmother"},
        {"zh": "家人", "ja": "かぞく", "file": "family"},
    ],
    "seasons": [
        {"zh": "春天", "ja": "はる", "file": "spring"},
        {"zh": "夏天", "ja": "なつ", "file": "summer"},
        {"zh": "秋天", "ja": "あき", "file": "autumn"},
        {"zh": "冬天", "ja": "ふゆ", "file": "winter"},
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

    for category, items in FLASHCARD_DATA.items():
        zh_dir = os.path.join(BASE_DIR, category, "zh")
        ja_dir = os.path.join(BASE_DIR, category, "ja")
        os.makedirs(zh_dir, exist_ok=True)
        os.makedirs(ja_dir, exist_ok=True)

        for item in items:
            # 中国語音声
            zh_path = os.path.join(zh_dir, f"{item['file']}.mp3")
            if not os.path.exists(zh_path):
                print(f"  ZH: {item['zh']} -> {item['file']}.mp3")
                if generate_tts(item["zh"], VOICE_ZH, zh_path):
                    total += 1
                else:
                    errors += 1
                time.sleep(0.1)  # API レート制限対策
            else:
                skipped += 1

            # 日本語音声
            ja_path = os.path.join(ja_dir, f"{item['file']}.mp3")
            if not os.path.exists(ja_path):
                print(f"  JA: {item['ja']} -> {item['file']}.mp3")
                if generate_tts(item["ja"], VOICE_JA, ja_path):
                    total += 1
                else:
                    errors += 1
                time.sleep(0.1)
            else:
                skipped += 1

    print(f"\n完了: {total} 生成, {skipped} スキップ, {errors} エラー")


if __name__ == "__main__":
    main()
