/**
 * videos.js — 知育YouTube動画データ
 * 日本語・中国語の子供向け知育動画
 * 
 * 2026-03-08: YouTube検索で有効なIDに全更新
 */

export const videoCategories = [
    {
        id: 'ja',
        label: '🇯🇵 にほんご',
        videos: [
            {
                id: 'FkFnrQzIIhM',
                title: 'どうぶつのなまえ',
                subtitle: '動物の名前を覚えよう',
                icon: '🐾',
            },
            {
                id: 'HyQ0FTsV92U',
                title: 'いろのうた',
                subtitle: 'いろいろカラーへんしん',
                icon: '🎨',
            },
            {
                id: 'oAKlvhK1e8w',
                title: 'すうじのうた',
                subtitle: '1-10までかぞえよう',
                icon: '🔢',
            },
            {
                id: 'UMEI2C2wnGY',
                title: 'くだものパズル',
                subtitle: '果物の名前もおぼえられる',
                icon: '🍎',
            },
            {
                id: 'P-lSxvIINbo',
                title: 'のりもののなまえ',
                subtitle: 'はたらくくるま大集合',
                icon: '🚗',
            },
        ],
    },
    {
        id: 'zh',
        label: '🇨🇳 中文',
        videos: [
            {
                id: 'mUQpz1itMdQ',
                title: '认识动物',
                subtitle: '一起去动物园',
                icon: '🐾',
            },
            {
                id: 'UulTlStNp5k',
                title: '颜色歌',
                subtitle: '学习颜色 Colors Song',
                icon: '🎨',
            },
            {
                id: 'G2P3Ams5-nM',
                title: '数字歌',
                subtitle: '从一数到十',
                icon: '🔢',
            },
            {
                id: 'AN0KPLgW6i4',
                title: '水果歌',
                subtitle: '彩色水果大集合',
                icon: '🍎',
            },
            {
                id: 'bwS1GkwyKQg',
                title: '交通工具',
                subtitle: '认识各种车',
                icon: '🚗',
            },
        ],
    },
];
