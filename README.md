# Engineer Connect - ソフトウェアエンジニア交流サービス

## 概要
Engineer ConnectはソフトウェアエンジニアのためのAI駆動型プロフィール解析・交流サービスです。GitHub OAuthを通じてユーザーのリポジトリ情報を取得し、AIがそれを解析してコード品質評価、スキル判定、そしてチャット形式で他のユーザーにプロフィールを説明します。

### デモアプリケーション画像
> 以下は [デモ版リポジトリ](https://github.com/tsukuneA1/hackathon_demo_app) で実装された機能のスクリーンショットです

<img width="1535" height="934" alt="image" src="https://github.com/user-attachments/assets/1526aa8e-a7f8-4672-bf4e-6e56444f2748" />
<img width="1532" height="941" alt="image" src="https://github.com/user-attachments/assets/dc406f32-d202-494a-b6f3-ddb40a7d6356" />
<img width="1535" height="941" alt="image" src="https://github.com/user-attachments/assets/21231dbc-5a82-4a7b-b644-f4ba857bb85d" />

## 💡 コンセプトと背景

### AI時代のエンジニア参入者増加への対応
近年、AIツールの普及により、従来のプログラミング経験がない人でもある程度のエンジニアリング作業を疑似的に行えるようになってきています。この現象により、エンジニア界隈に新しく参入してくる人々が増加すると予想されます。

Engineer Connectは、このような**新規エンジニア参入者**と**既存エンジニアコミュニティ**をつなぐプラットフォームとして設計されており、以下の価値を提供します：

- **スキルの可視化**: 実際のGitHubリポジトリから客観的なスキル評価
- **技術的コミュニケーション**: AIを介した自然な技術説明
- **ネットワーキング**: 類似技術スタックやレベルのエンジニア同士のマッチング
- **成長支援**: コード品質分析による具体的な改善提案

### 技術選択の理由

#### Next.js を選択した理由
- **学習コストの低さ**: HTML/CSSの基礎知識の延長線上にある
- **モダンな開発体験**: TypeScriptサポート、App Routerによる直感的な開発
- **エコシステム**: React生態系の豊富なリソース
- **初学者フレンドリー**: ドキュメントが充実し、学習リソースが豊富

#### Rails を選択した理由
- **GitHub OAuth対応**: GitHubとのOAuth認可に対応した便利なgemが豊富
- **MVCアーキテクチャ**: 明確に構造化されており、初学者でも理解しやすい
- **コンベンション**: Rails Wayにより、迷いなく開発を進められる
- **エコシステム**: gem生態系による豊富な機能拡張

この技術選択により、エンジニア参入者にとって学習しやすく、既存エンジニアにとっても馴染みやすいプラットフォームを実現しています。

## 🚀 主要機能

### 予定機能（デモ版で実装済み）
1. **GitHub OAuth認証** - 安全なログイン・認証システム
2. **リポジトリデータ同期** - GitHub APIを通じた自動データ取得
3. **AIプロフィール解析** - OpenAI APIによるスキル・経験の自動分析
4. **コード品質解析** - リポジトリのコード品質評価とメトリクス算出
5. **エンジニアネットワーキング** - スキル類似度によるエンジニア発見・マッチング
6. **AI チャット機能** - プロフィールに関するQ&A機能

### 現在の開発状況
- ✅ **プロジェクト初期セットアップ** - Rails 8 API + Next.js 15基盤構築
- 🔄 **基本認証システム** - GitHub OAuth連携の実装中
- ⏳ **データベース設計** - ユーザー・リポジトリモデルの設計
- ⏳ **フロントエンド基盤** - UI/UXコンポーネントの開発

## 📊 開発ロードマップ

### 🔄 Phase 1: プロジェクト基盤構築 (進行中)
- ✅ Rails 8 API + Next.js 15環境セットアップ
- ✅ 基本的なプロジェクト構造の作成
- 🔄 GitHub OAuth認証システムの実装
- ⏳ データベーススキーマの設計・実装
- ⏳ JWT トークンベース認証の構築

### ⏳ Phase 2: GitHubデータ連携機能 (予定)
- Repository モデルによるリポジトリ情報管理
- GitHub API経由でのリポジトリデータ取得
- README・コミット履歴の自動取得
- フィルタリング・ソート機能付きダッシュボード

### ⏳ Phase 3: AI統合とプロフィール解析 (予定)
- OpenAI API統合
- GitHubデータのAI解析
- エンジニアプロフィールの自動生成
- チャット形式でのプロフィール説明機能

### ⏳ Phase 4: コード解析とネットワーキング (予定)
- リアルタイムコード品質分析
- リポジトリ深度解析（複雑度、メンテナンス性）
- エンジニア検索・発見機能
- スキルベースの類似度マッチング

## 🛠 技術スタック

技術的な詳細は [docs](./docs) ディレクトリを参照してください。

### Core Technologies
- **Backend**: Rails 8.0.2 (API mode) + PostgreSQL
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Authentication**: GitHub OAuth + JWT
- **External APIs**: GitHub REST API, Octokit

## ⚡ クイックスタート

### 環境変数設定
```bash
# Backend (.env)
cp backend/.env.example backend/.env
# 必要な値を設定

# Frontend (.env.local)
cp frontend/.env.example frontend/.env.local
# 必要な値を設定
```

### 起動方法
```bash
# Backend
cd backend
bundle install
rails db:create db:migrate
rails server

# Frontend (別ターミナル)
cd frontend
npm install
npm run dev
```

アプリケーションは http://localhost:3000 でアクセス可能です。

## 📚 ドキュメント

- [技術仕様書](./docs/technical-specification.md)
- [API仕様](./docs/api-specification.md)
- [デプロイガイド](./docs/deployment-guide.md)
- [開発ガイド](./docs/development-guide.md)

## 🎯 対象ユーザー

- **AI支援エンジニア**: AIツールを活用してエンジニアリングに参入する新規ユーザー
- **メンターエンジニア**: 新規参入者をサポートしたいエンジニア
- **技術コミュニティ**: スキルベースでのネットワーキングを求めるエンジニア
- **学習者**: 自分のコードスキルを客観的に評価・改善したい人

## 🔗 関連リポジトリ

- **[デモ版](https://github.com/tsukuneA1/hackathon_demo_app)**: 完全に実装されたプロトタイプ版
- **本リポジトリ**: 実用化に向けた改良・拡張版

## ⚠️ プロジェクト状況

このプロジェクトは現在**開発初期段階**です：

- 🏗️ **基盤構築中**: Rails 8 + Next.js 15の環境構築完了
- 📋 **設計フェーズ**: データベース設計・API設計の進行中
- 🔄 **継続開発**: デモ版の機能を本格実装に向けて再構築中

## 📄 ライセンス

このプロジェクトは学習・開発用途として公開されています。