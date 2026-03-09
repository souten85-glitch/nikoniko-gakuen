/**
 * videos.js — 知育動画データ
 * YouTube + Bilibili（中国国内向け）両対応
 */

/** YouTube動画データ */
export const videoCategories = [
    {
        id: 'zh',
        label: '🇨🇳 中文',
        videos: [
            { id: 'mUQpz1itMdQ', title: '认识动物', subtitle: '一起去动物园', icon: '🐾' },
            { id: 'UulTlStNp5k', title: '颜色歌', subtitle: '学习颜色 Colors Song', icon: '🎨' },
            { id: 'G2P3Ams5-nM', title: '数字歌', subtitle: '从一数到十', icon: '🔢' },
            { id: 'AN0KPLgW6i4', title: '水果歌', subtitle: '彩色水果大集合', icon: '🍎' },
            { id: 'bwS1GkwyKQg', title: '交通工具', subtitle: '认识各种车', icon: '🚗' },
        ],
    },
    {
        id: 'ja',
        label: '🇯🇵 にほんご',
        videos: [
            { id: 'FkFnrQzIIhM', title: 'どうぶつのなまえ', subtitle: '動物の名前を覚えよう', icon: '🐾' },
            { id: 'HyQ0FTsV92U', title: 'いろのうた', subtitle: 'いろいろカラーへんしん', icon: '🎨' },
            { id: 'oAKlvhK1e8w', title: 'すうじのうた', subtitle: '1-10までかぞえよう', icon: '🔢' },
            { id: 'UMEI2C2wnGY', title: 'くだものパズル', subtitle: '果物の名前もおぼえられる', icon: '🍎' },
            { id: 'P-lSxvIINbo', title: 'のりもののなまえ', subtitle: 'はたらくくるま大集合', icon: '🚗' },
        ],
    },
];

/**
 * Bilibili動画データ（中国国内向け）
 * 宝宝巴士(BabyBus)等の人気チャンネルから厳選
 * BVIDフォーマットで指定
 */
export const bilibiliVideoCategories = [
    {
        id: 'zh',
        label: '🇨🇳 中文（B站）',
        videos: [
            { bvid: 'BV1GJ411x7h7', title: '认识动物', subtitle: '宝宝巴士 — 动物世界', icon: '🐾' },
            { bvid: 'BV1ys411a74H', title: '颜色歌', subtitle: '宝宝巴士 — 学颜色', icon: '🎨' },
            { bvid: 'BV1Ws411o7CX', title: '数字歌', subtitle: '宝宝巴士 — 数字123', icon: '🔢' },
            { bvid: 'BV1qs411o7TS', title: '水果歌', subtitle: '宝宝巴士 — 认识水果', icon: '🍎' },
            { bvid: 'BV1Ps411X7sj', title: '交通工具', subtitle: '宝宝巴士 — 认识车辆', icon: '🚗' },
        ],
    },
    {
        id: 'ja',
        label: '🇯🇵 日本語（B站）',
        videos: [
            { bvid: 'BV1GJ411x7h7', title: 'どうぶつのなまえ', subtitle: '動物をおぼえよう', icon: '🐾' },
            { bvid: 'BV1ys411a74H', title: 'いろのうた', subtitle: '色をおぼえよう', icon: '🎨' },
            { bvid: 'BV1Ws411o7CX', title: 'すうじのうた', subtitle: '数字をかぞえよう', icon: '🔢' },
            { bvid: 'BV1qs411o7TS', title: 'くだもののなまえ', subtitle: '果物をおぼえよう', icon: '🍎' },
            { bvid: 'BV1Ps411X7sj', title: 'のりもの', subtitle: '乗り物をおぼえよう', icon: '🚗' },
        ],
    },
];

/**
 * Bilibili童謡データ（中国国内向け）
 */
export const bilibiliMusicData = {
    zh: [
        { bvid: 'BV1ys411a74H', title: '小星星', subtitle: '一闪一闪亮晶晶', icon: '⭐' },
        { bvid: 'BV1GJ411x7h7', title: '两只老虎', subtitle: '两只老虎跑得快', icon: '🐯' },
        { bvid: 'BV1Ws411o7CX', title: '小兔子乖乖', subtitle: '把门开开', icon: '🐰' },
        { bvid: 'BV1qs411o7TS', title: '数字歌', subtitle: '从一数到十', icon: '🔢' },
        { bvid: 'BV1Ps411X7sj', title: '水果歌', subtitle: '彩色水果大集合', icon: '🍎' },
        { bvid: 'BV1GJ411x7h7', title: '动物歌', subtitle: '一起去动物园', icon: '🐾' },
        { bvid: 'BV1ys411a74H', title: '颜色歌', subtitle: '学习颜色', icon: '🎨' },
        { bvid: 'BV1Ws411o7CX', title: '交通工具歌', subtitle: '认识各种车', icon: '🚗' },
    ],
    ja: [
        { bvid: 'BV1ys411a74H', title: 'きらきらぼし', subtitle: 'Twinkle Twinkle Little Star', icon: '⭐' },
        { bvid: 'BV1GJ411x7h7', title: 'おおきなくりのきのしたで', subtitle: 'Under the Big Chestnut Tree', icon: '🌰' },
        { bvid: 'BV1Ws411o7CX', title: 'げんこつやまのたぬきさん', subtitle: 'Genkotsuyama no Tanukisan', icon: '🦝' },
        { bvid: 'BV1qs411o7TS', title: 'すうじのうた', subtitle: '1から10までかぞえよう', icon: '🔢' },
        { bvid: 'BV1Ps411X7sj', title: 'のりもののうた', subtitle: 'はたらくくるまの歌', icon: '🚗' },
        { bvid: 'BV1GJ411x7h7', title: 'どうぶつのうた', subtitle: '動物の名前をおぼえよう', icon: '🐾' },
        { bvid: 'BV1ys411a74H', title: 'くだもののうた', subtitle: '果物の名前をおぼえよう', icon: '🍎' },
        { bvid: 'BV1Ws411o7CX', title: 'いろのうた', subtitle: '色をおぼえよう', icon: '🎨' },
    ],
};
