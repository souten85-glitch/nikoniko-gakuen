/**
 * flashcard-data.js — フラッシュカードのバイリンガルデータ
 * 各カードには、絵文字（フォールバック用）、画像パス、日本語名、中国語名、ピンインを含む
 * ageGroup: カテゴリの対象年齢グループ ('1-2' | '3-4' | '5-6')
 */

export const categories = [
    // === 1-2歳 ===
    {
        id: 'animals',
        icon: '🐶',
        colorVar: '--color-animals',
        colorSoftVar: '--color-animals-soft',
        ageGroup: '1-2',
    },
    {
        id: 'fruits',
        icon: '🍎',
        colorVar: '--color-fruits',
        colorSoftVar: '--color-fruits-soft',
        ageGroup: '1-2',
    },
    {
        id: 'colors',
        icon: '🎨',
        colorVar: '--color-colors',
        colorSoftVar: '--color-colors-soft',
        ageGroup: '1-2',
    },
    {
        id: 'numbers',
        icon: '🔢',
        colorVar: '--color-numbers',
        colorSoftVar: '--color-numbers-soft',
        ageGroup: '1-2',
    },
    {
        id: 'vehicles',
        icon: '🚗',
        colorVar: '--color-vehicles',
        colorSoftVar: '--color-vehicles-soft',
        ageGroup: '1-2',
    },
    // === 3-4歳 ===
    {
        id: 'shapes',
        icon: '🔷',
        colorVar: '--color-shapes',
        colorSoftVar: '--color-shapes-soft',
        ageGroup: '3-4',
    },
    {
        id: 'body',
        icon: '🖐️',
        colorVar: '--color-body',
        colorSoftVar: '--color-body-soft',
        ageGroup: '3-4',
    },
    {
        id: 'food',
        icon: '🍙',
        colorVar: '--color-food',
        colorSoftVar: '--color-food-soft',
        ageGroup: '3-4',
    },
    {
        id: 'weather',
        icon: '☀️',
        colorVar: '--color-weather',
        colorSoftVar: '--color-weather-soft',
        ageGroup: '3-4',
    },
    // === 5-6歳 ===
    {
        id: 'greetings',
        icon: '👋',
        colorVar: '--color-greetings',
        colorSoftVar: '--color-greetings-soft',
        ageGroup: '5-6',
    },
    {
        id: 'family',
        icon: '👨‍👩‍👧',
        colorVar: '--color-family',
        colorSoftVar: '--color-family-soft',
        ageGroup: '5-6',
    },
    {
        id: 'seasons',
        icon: '🌸',
        colorVar: '--color-seasons',
        colorSoftVar: '--color-seasons-soft',
        ageGroup: '5-6',
    },
];

export const flashcardData = {
    // ===========================
    // 1-2歳カテゴリ (既存)
    // ===========================
    animals: [
        { emoji: '🐶', ja: 'いぬ', zh: '狗', pinyin: 'gǒu', image: '/images/animals/dog.png' },
        { emoji: '🐱', ja: 'ねこ', zh: '猫', pinyin: 'māo', image: '/images/animals/cat.png' },
        { emoji: '🐰', ja: 'うさぎ', zh: '兔子', pinyin: 'tùzi', image: '/images/animals/rabbit.png' },
        { emoji: '🐼', ja: 'パンダ', zh: '熊猫', pinyin: 'xióngmāo', image: '/images/animals/panda.png' },
        { emoji: '🐘', ja: 'ぞう', zh: '大象', pinyin: 'dàxiàng', image: '/images/animals/elephant.png' },
        { emoji: '🦁', ja: 'ライオン', zh: '狮子', pinyin: 'shīzi', image: '/images/animals/lion.png' },
        { emoji: '🐟', ja: 'さかな', zh: '鱼', pinyin: 'yú', image: '/images/animals/fish.png' },
        { emoji: '🐦', ja: 'とり', zh: '鸟', pinyin: 'niǎo', image: '/images/animals/bird.png' },
        { emoji: '🐸', ja: 'カエル', zh: '青蛙', pinyin: 'qīngwā', image: '/images/animals/frog.png' },
        { emoji: '🐻', ja: 'くま', zh: '熊', pinyin: 'xióng', image: '/images/animals/bear.png' },
    ],

    fruits: [
        { emoji: '🍎', ja: 'りんご', zh: '苹果', pinyin: 'píngguǒ', image: '/images/fruits/apple.png' },
        { emoji: '🍌', ja: 'バナナ', zh: '香蕉', pinyin: 'xiāngjiāo', image: '/images/fruits/banana.png' },
        { emoji: '🍇', ja: 'ぶどう', zh: '葡萄', pinyin: 'pútao', image: '/images/fruits/grape.png' },
        { emoji: '🍓', ja: 'いちご', zh: '草莓', pinyin: 'cǎoméi', image: '/images/fruits/strawberry.png' },
        { emoji: '🍊', ja: 'みかん', zh: '橘子', pinyin: 'júzi', image: '/images/fruits/orange.png' },
        { emoji: '🍉', ja: 'すいか', zh: '西瓜', pinyin: 'xīguā', image: '/images/fruits/watermelon.png' },
        { emoji: '🍑', ja: 'もも', zh: '桃子', pinyin: 'táozi', image: '/images/fruits/peach.png' },
        { emoji: '🍒', ja: 'さくらんぼ', zh: '樱桃', pinyin: 'yīngtáo', image: '/images/fruits/cherry.png' },
        { emoji: '🍈', ja: 'メロン', zh: '蜜瓜', pinyin: 'mìguā', image: '/images/fruits/melon.png' },
        { emoji: '🥝', ja: 'キウイ', zh: '猕猴桃', pinyin: 'míhóutáo', image: '/images/fruits/kiwi.png' },
    ],

    colors: [
        { emoji: '🔴', ja: 'あか', zh: '红色', pinyin: 'hóngsè', image: '/images/colors/red.png', hex: '#E8A0A0' },
        { emoji: '🔵', ja: 'あお', zh: '蓝色', pinyin: 'lánsè', image: '/images/colors/blue.png', hex: '#9DC8E8' },
        { emoji: '🟡', ja: 'きいろ', zh: '黄色', pinyin: 'huángsè', image: '/images/colors/yellow.png', hex: '#F5D98E' },
        { emoji: '🟢', ja: 'みどり', zh: '绿色', pinyin: 'lǜsè', image: '/images/colors/green.png', hex: '#A8D8A8' },
        { emoji: '⚪', ja: 'しろ', zh: '白色', pinyin: 'báisè', image: '/images/colors/white.png', hex: '#F5F0EB' },
        { emoji: '⚫', ja: 'くろ', zh: '黑色', pinyin: 'hēisè', image: '/images/colors/black.png', hex: '#6B6360' },
        { emoji: '🩷', ja: 'ピンク', zh: '粉色', pinyin: 'fěnsè', image: '/images/colors/pink.png', hex: '#F4A4B8' },
        { emoji: '🟠', ja: 'オレンジ', zh: '橙色', pinyin: 'chéngsè', image: '/images/colors/orange_c.png', hex: '#F0BF8E' },
        { emoji: '🟣', ja: 'むらさき', zh: '紫色', pinyin: 'zǐsè', image: '/images/colors/purple.png', hex: '#C4A8D8' },
        { emoji: '🟤', ja: 'ちゃいろ', zh: '棕色', pinyin: 'zōngsè', image: '/images/colors/brown.png', hex: '#C4A882' },
    ],

    numbers: [
        { emoji: '1️⃣', ja: 'いち', zh: '一', pinyin: 'yī', image: '/images/numbers/1.png', num: 1 },
        { emoji: '2️⃣', ja: 'に', zh: '二', pinyin: 'èr', image: '/images/numbers/2.png', num: 2 },
        { emoji: '3️⃣', ja: 'さん', zh: '三', pinyin: 'sān', image: '/images/numbers/3.png', num: 3 },
        { emoji: '4️⃣', ja: 'し', zh: '四', pinyin: 'sì', image: '/images/numbers/4.png', num: 4 },
        { emoji: '5️⃣', ja: 'ご', zh: '五', pinyin: 'wǔ', image: '/images/numbers/5.png', num: 5 },
        { emoji: '6️⃣', ja: 'ろく', zh: '六', pinyin: 'liù', image: '/images/numbers/6.png', num: 6 },
        { emoji: '7️⃣', ja: 'なな', zh: '七', pinyin: 'qī', image: '/images/numbers/7.png', num: 7 },
        { emoji: '8️⃣', ja: 'はち', zh: '八', pinyin: 'bā', image: '/images/numbers/8.png', num: 8 },
        { emoji: '9️⃣', ja: 'きゅう', zh: '九', pinyin: 'jiǔ', image: '/images/numbers/9.png', num: 9 },
        { emoji: '🔟', ja: 'じゅう', zh: '十', pinyin: 'shí', image: '/images/numbers/10.png', num: 10 },
    ],

    vehicles: [
        { emoji: '🚗', ja: 'くるま', zh: '汽车', pinyin: 'qìchē', image: '/images/vehicles/car.png' },
        { emoji: '🚌', ja: 'バス', zh: '公共汽车', pinyin: 'gōnggòng qìchē', image: '/images/vehicles/bus.png' },
        { emoji: '🚃', ja: 'でんしゃ', zh: '电车', pinyin: 'diànchē', image: '/images/vehicles/train.png' },
        { emoji: '✈️', ja: 'ひこうき', zh: '飞机', pinyin: 'fēijī', image: '/images/vehicles/airplane.png' },
        { emoji: '🚢', ja: 'ふね', zh: '船', pinyin: 'chuán', image: '/images/vehicles/ship.png' },
        { emoji: '🚲', ja: 'じてんしゃ', zh: '自行车', pinyin: 'zìxíngchē', image: '/images/vehicles/bicycle.png' },
        { emoji: '🚒', ja: 'しょうぼうしゃ', zh: '消防车', pinyin: 'xiāofáng chē', image: '/images/vehicles/firetruck.png' },
        { emoji: '🚑', ja: 'きゅうきゅうしゃ', zh: '救护车', pinyin: 'jiùhù chē', image: '/images/vehicles/ambulance.png' },
        { emoji: '🚓', ja: 'パトカー', zh: '警车', pinyin: 'jǐngchē', image: '/images/vehicles/police.png' },
        { emoji: '🚁', ja: 'ヘリコプター', zh: '直升机', pinyin: 'zhíshēngjī', image: '/images/vehicles/helicopter.png' },
    ],

    // ===========================
    // 3-4歳カテゴリ (新規)
    // ===========================
    shapes: [
        { emoji: '⭕', ja: 'まる', zh: '圆形', pinyin: 'yuánxíng', image: '/images/shapes/circle.png' },
        { emoji: '🔺', ja: 'さんかく', zh: '三角形', pinyin: 'sānjiǎoxíng', image: '/images/shapes/triangle.png' },
        { emoji: '🟦', ja: 'しかく', zh: '正方形', pinyin: 'zhèngfāngxíng', image: '/images/shapes/square.png' },
        { emoji: '⭐', ja: 'ほし', zh: '星形', pinyin: 'xīngxíng', image: '/images/shapes/star.png' },
        { emoji: '❤️', ja: 'ハート', zh: '心形', pinyin: 'xīnxíng', image: '/images/shapes/heart.png' },
        { emoji: '🔷', ja: 'ひしがた', zh: '菱形', pinyin: 'língxíng', image: '/images/shapes/diamond.png' },
        { emoji: '⬟', ja: 'ごかくけい', zh: '五边形', pinyin: 'wǔbiānxíng', image: '/images/shapes/pentagon.png' },
        { emoji: '⬡', ja: 'ろっかくけい', zh: '六边形', pinyin: 'liùbiānxíng', image: '/images/shapes/hexagon.png' },
    ],

    body: [
        { emoji: '👀', ja: 'め', zh: '眼睛', pinyin: 'yǎnjīng', image: '/images/body/eyes.png' },
        { emoji: '👂', ja: 'みみ', zh: '耳朵', pinyin: 'ěrduo', image: '/images/body/ear.png' },
        { emoji: '👃', ja: 'はな', zh: '鼻子', pinyin: 'bízi', image: '/images/body/nose.png' },
        { emoji: '👄', ja: 'くち', zh: '嘴巴', pinyin: 'zuǐba', image: '/images/body/mouth.png' },
        { emoji: '🖐️', ja: 'て', zh: '手', pinyin: 'shǒu', image: '/images/body/hand.png' },
        { emoji: '🦶', ja: 'あし', zh: '脚', pinyin: 'jiǎo', image: '/images/body/foot.png' },
        { emoji: '💪', ja: 'うで', zh: '胳膊', pinyin: 'gēbo', image: '/images/body/arm.png' },
        { emoji: '🦷', ja: 'は', zh: '牙齿', pinyin: 'yáchǐ', image: '/images/body/tooth.png' },
        { emoji: '💁', ja: 'あたま', zh: '头', pinyin: 'tóu', image: '/images/body/head.png' },
        { emoji: '🫁', ja: 'おなか', zh: '肚子', pinyin: 'dùzi', image: '/images/body/tummy.png' },
    ],

    food: [
        { emoji: '🍙', ja: 'おにぎり', zh: '饭团', pinyin: 'fàntuán', image: '/images/food/onigiri.png' },
        { emoji: '🍞', ja: 'パン', zh: '面包', pinyin: 'miànbāo', image: '/images/food/bread.png' },
        { emoji: '🥛', ja: 'ぎゅうにゅう', zh: '牛奶', pinyin: 'niúnǎi', image: '/images/food/milk.png' },
        { emoji: '🥚', ja: 'たまご', zh: '鸡蛋', pinyin: 'jīdàn', image: '/images/food/egg.png' },
        { emoji: '🍰', ja: 'ケーキ', zh: '蛋糕', pinyin: 'dàngāo', image: '/images/food/cake.png' },
        { emoji: '🍦', ja: 'アイス', zh: '冰淇淋', pinyin: 'bīngqílín', image: '/images/food/icecream.png' },
        { emoji: '🍜', ja: 'ラーメン', zh: '拉面', pinyin: 'lāmiàn', image: '/images/food/ramen.png' },
        { emoji: '🍕', ja: 'ピザ', zh: '披萨', pinyin: 'pīsà', image: '/images/food/pizza.png' },
        { emoji: '🍣', ja: 'おすし', zh: '寿司', pinyin: 'shòusī', image: '/images/food/sushi.png' },
        { emoji: '🥕', ja: 'にんじん', zh: '胡萝卜', pinyin: 'húluóbo', image: '/images/food/carrot.png' },
    ],

    weather: [
        { emoji: '☀️', ja: 'はれ', zh: '晴天', pinyin: 'qíngtiān', image: '/images/weather/sunny.png' },
        { emoji: '☁️', ja: 'くもり', zh: '多云', pinyin: 'duōyún', image: '/images/weather/cloudy.png' },
        { emoji: '🌧️', ja: 'あめ', zh: '下雨', pinyin: 'xiàyǔ', image: '/images/weather/rainy.png' },
        { emoji: '❄️', ja: 'ゆき', zh: '下雪', pinyin: 'xiàxuě', image: '/images/weather/snowy.png' },
        { emoji: '🌈', ja: 'にじ', zh: '彩虹', pinyin: 'cǎihóng', image: '/images/weather/rainbow.png' },
        { emoji: '⛈️', ja: 'かみなり', zh: '打雷', pinyin: 'dǎléi', image: '/images/weather/thunder.png' },
    ],

    // ===========================
    // 5-6歳カテゴリ (新規 — Session 4で画像追加)
    // ===========================
    greetings: [
        { emoji: '🌅', ja: 'おはよう', zh: '早上好', pinyin: 'zǎoshang hǎo', image: '/images/greetings/morning.png' },
        { emoji: '👋', ja: 'こんにちは', zh: '你好', pinyin: 'nǐ hǎo', image: '/images/greetings/hello.png' },
        { emoji: '🌙', ja: 'おやすみ', zh: '晚安', pinyin: 'wǎnān', image: '/images/greetings/goodnight.png' },
        { emoji: '🙏', ja: 'ありがとう', zh: '谢谢', pinyin: 'xièxie', image: '/images/greetings/thankyou.png' },
        { emoji: '🙇', ja: 'ごめんなさい', zh: '对不起', pinyin: 'duìbuqǐ', image: '/images/greetings/sorry.png' },
        { emoji: '🤝', ja: 'はじめまして', zh: '初次见面', pinyin: 'chūcì jiànmiàn', image: '/images/greetings/nicetomeetyou.png' },
        { emoji: '👏', ja: 'いただきます', zh: '我开动了', pinyin: 'wǒ kāidòng le', image: '/images/greetings/itadakimasu.png' },
        { emoji: '😊', ja: 'さようなら', zh: '再见', pinyin: 'zàijiàn', image: '/images/greetings/goodbye.png' },
    ],

    family: [
        { emoji: '👩', ja: 'おかあさん', zh: '妈妈', pinyin: 'māma', image: '/images/family/mother.png' },
        { emoji: '👨', ja: 'おとうさん', zh: '爸爸', pinyin: 'bàba', image: '/images/family/father.png' },
        { emoji: '👧', ja: 'おねえちゃん', zh: '姐姐', pinyin: 'jiějie', image: '/images/family/sister.png' },
        { emoji: '👦', ja: 'おにいちゃん', zh: '哥哥', pinyin: 'gēge', image: '/images/family/brother.png' },
        { emoji: '👶', ja: 'あかちゃん', zh: '宝宝', pinyin: 'bǎobao', image: '/images/family/baby.png' },
        { emoji: '👴', ja: 'おじいちゃん', zh: '爷爷', pinyin: 'yéye', image: '/images/family/grandfather.png' },
        { emoji: '👵', ja: 'おばあちゃん', zh: '奶奶', pinyin: 'nǎinai', image: '/images/family/grandmother.png' },
        { emoji: '👨‍👩‍👧‍👦', ja: 'かぞく', zh: '家人', pinyin: 'jiārén', image: '/images/family/family.png' },
    ],

    seasons: [
        { emoji: '🌸', ja: 'はる', zh: '春天', pinyin: 'chūntiān', image: '/images/seasons/spring.png' },
        { emoji: '🌻', ja: 'なつ', zh: '夏天', pinyin: 'xiàtiān', image: '/images/seasons/summer.png' },
        { emoji: '🍂', ja: 'あき', zh: '秋天', pinyin: 'qiūtiān', image: '/images/seasons/autumn.png' },
        { emoji: '⛄', ja: 'ふゆ', zh: '冬天', pinyin: 'dōngtiān', image: '/images/seasons/winter.png' },
    ],
};
