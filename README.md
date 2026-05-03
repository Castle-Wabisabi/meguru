# 姫路城下町 巡 MEGURU

姫路市総社本町にある、昭和レトロの一棟貸し宿「**巡 MEGURU**」公式HP。

> 日本を巡る、その途中で。
> 次の日本へ、もう一歩奥へ。

---

## 概要

| 項目 | 内容 |
|---|---|
| 施設名 | 姫路城下町 巡 MEGURU |
| 所在地 | 姫路市総社本町148-1 |
| アクセス | 姫路駅 徒歩17分 / 姫路城 徒歩12分 |
| 規模 | 1棟（46.44㎡）／定員4名 |
| 形態 | 簡易宿所・1棟貸し |
| 公開URL | （未定） |
| 姉妹施設 | [侘寂 wabisabi-himeji.jp](https://wabisabi-himeji.jp/) |

---

## ファイル構成

```
meguru/
├── index.html           ← 公開用ページ（v6 平面図正式版）
├── 設計書.md            ← LP制作の全設計記録（STEP1〜7 + v1〜v6 履歴）
├── images/
│   ├── 姫路/             姫路駅前夜景（ヒーロー）
│   ├── 平面図/           間取り図
│   ├── 外観/             玄関ドア（姫路城＋桜）
│   ├── 廊下/             網代天井のヘリンボーン廊下
│   ├── 和室/             畳・布団・ちゃぶ台
│   ├── 洋室/             個室（2段ベッド）
│   ├── 洗面脱衣/          洗面・トイレ・茶コーナー
│   ├── 風呂/             北斎の湯（オーナー手描きの神奈川沖浪裏）
│   └── logo/             巡ロゴ
├── README.md
└── .gitignore
```

---

## 技術仕様

- **タイプ**: 静的HTML（単一ファイル）
- **フレームワーク**: なし（バニラHTML/CSS/JS）
- **依存**: Google Fonts（Noto Serif JP / Shippori Mincho / Noto Sans JP）
- **対応ブラウザ**: モダンブラウザ全般
- **モバイル**: ファーストクラス対応
- **アクセシビリティ**: WCAG 2.2 配慮、`prefers-reduced-motion` 対応
- **外部埋め込み**: Google Maps（API key不要の output=embed 方式）

---

## 主な特徴

### 🌃 ナラティブ設計
LP全体を通して「**夜→朝→昼→食卓→夕**」の物語が流れる：
1. ヒーロー：姫路の夜景に到着
2. ストーリー：墨黒に北斎の波が立ち上がる
3. ルーム：南→北の動線をWalking Dotで巡る（12秒ループ）
4. 三つの楽しみ：食・街・湯
5. 立地：姫路城＋食べ歩き
6. 最終CTA：朱×金の夕焼け

### 🎯 ペルソナ
**訪日リピーターの韓国人**（3〜5回目訪日）。
東京・大阪・京都を経験済みで「次の日本」を求める層。

### 🎨 デザインキーワード
- Organic Minimalism / Noise Texture / Scroll-driven Animations
- Kinetic Typography / Subgrid + Fluid Typography
- 「巡」のWalking Dot自動巡回（純CSS、JS不要）

詳細は [`設計書.md`](./設計書.md) 参照。

---

## デプロイ

GitHub Pages で公開可能（Settings → Pages → Branch: main / root）。

---

## 制作

- 案件番号: IT-016
- 制作: ㈱ハウスインフォ IT事業部
- LP制作スキル: `anthropic-skills:lp-creation` STEP1〜7 に沿って設計
