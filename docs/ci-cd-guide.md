# CI/CD パイプライン ガイド

## 概要

Engineer Connectプロジェクトでは**GitHub Actions**を使用した継続的インテグレーション（CI）とデプロイメント準備（CD）を実装しています。

高速フィードバックと開発効率を重視し、以下の特徴を持つ軽量CI設計を採用：

- ✅ **コード品質チェック優先** - リント・フォーマット・型チェック
- ❌ **重い処理は除外** - テスト実行・ビルド生成は開発段階では実行しない
- ⚡ **並行実行** - フロントエンド・バックエンドを同時処理
- 🔄 **高速フィードバック** - 平均実行時間 < 2分

## ワークフロー構成

### 🎯 ワークフロー一覧

| ワークフロー | ファイル | 実行内容 | トリガー |
|-------------|----------|----------|----------|
| **Frontend CI** | `frontend-ci.yml` | Biome + ESLint + TypeScript | フロントエンド変更時 |
| **Backend CI** | `backend-ci.yml` | RuboCop | バックエンド変更時 |
| **Full CI** | `full-ci.yml` | 統合チェック + デプロイ準備 | mainブランチ |

### 📂 トリガー条件

```yaml
# パスベースのトリガー
on:
  push:
    branches: [ main, develop ]
    paths: 
      - 'frontend/**'           # フロントエンド変更
      - 'backend/**'            # バックエンド変更
      - '.github/workflows/**'  # CI設定変更
  pull_request:
    branches: [ main, develop ]
    paths: [同上]
```

## Frontend CI Pipeline

### 🔍 実行内容
```yaml
jobs:
  lint-and-check:
    name: Lint & Type Check
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm biome check .          # Biome lint & format
      - run: pnpm next lint              # ESLint
      - run: pnpm tsc --noEmit          # TypeScript
```

### ⚙️ 技術スタック
- **pnpm**: 高速パッケージ管理
- **Biome**: 超高速リント・フォーマッター
- **ESLint**: Next.js専用リント規則
- **TypeScript**: 型チェック

### 🎯 チェック項目
- コードフォーマット（Biome）
- ESLint規則違反
- TypeScript型エラー
- インポート順序・重複チェック

## Backend CI Pipeline

### 🔍 実行内容
```yaml
jobs:
  lint:
    name: RuboCop Check
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3.7'
          bundler-cache: true
      - run: bundle exec rubocop         # Ruby コードスタイル
```

### ⚙️ 技術スタック
- **Ruby 3.3.7**: 実行環境
- **RuboCop**: Rubyコードスタイルチェッカー
- **Rails Omakase**: Rails公式スタイル設定

### 🎯 チェック項目
- Rubyコードスタイル規則
- Rails規約準拠
- セキュリティベストプラクティス

## Full CI Pipeline

### 🔗 統合ワークフロー
```yaml
jobs:
  frontend-ci:
    uses: ./.github/workflows/frontend-ci.yml
  
  backend-ci:
    uses: ./.github/workflows/backend-ci.yml
  
  integration-check:
    needs: [frontend-ci, backend-ci]
    steps:
      - name: Validate Taskfile
        run: task --list
      - name: Check project structure
```

### 🚀 デプロイ準備
```bash
# mainブランチでのみ実行
deployment-ready:
  if: github.ref == 'refs/heads/main'
  steps:
    - name: All checks passed notification
```

## ローカル開発での CI 実行

### 🔄 Task Runner による CI 実行

```bash
# 全体のCI相当チェック
task ci:all

# 個別チェック
task ci:frontend    # Frontend CI相当
task ci:backend     # Backend CI相当

# コードフォーマット実行
task format         # 自動修正
```

### 📋 詳細コマンド

#### Frontend チェック
```bash
cd frontend
pnpm biome check .              # Biomeチェック
pnpm next lint                  # ESLint
pnpm tsc --noEmit              # TypeScript型チェック

# 自動修正
pnpm biome check . --write      # Biome自動修正
pnpm next lint --fix           # ESLint自動修正
```

#### Backend チェック
```bash
cd backend
bundle exec rubocop            # RuboCopチェック
bundle exec rubocop -a        # RuboCop自動修正
```

## CI 最適化戦略

### ⚡ 高速化のための設計思想

1. **軽量チェックのみ実行**
   - ❌ テスト実行なし（開発段階）
   - ❌ ビルド生成なし
   - ❌ DBセットアップなし

2. **並行実行の活用**
   ```yaml
   strategy:
     matrix:
       check: [biome, eslint, typescript]
   ```

3. **キャッシュ戦略**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'pnpm'
       cache-dependency-path: frontend/pnpm-lock.yaml
   ```

4. **条件分岐実行**
   ```yaml
   # フロントエンド変更時のみフロントエンドCI実行
   paths: ['frontend/**']
   ```

### 📊 パフォーマンス指標

| 項目 | 目標時間 | 実測値 |
|------|----------|--------|
| Frontend CI | < 90秒 | ~60秒 |
| Backend CI | < 60秒 | ~30秒 |
| Full Pipeline | < 2分 | ~90秒 |

## エラー対応ガイド

### 🚨 よくあるCI失敗と対処法

#### Frontend エラー

**Biome チェックエラー**
```bash
# ローカルで確認・修正
cd frontend
pnpm biome check .
pnpm biome check . --write  # 自動修正
```

**ESLint エラー**
```bash
pnpm next lint
pnpm next lint --fix       # 自動修正
```

**TypeScript エラー**
```bash
pnpm tsc --noEmit
# 型定義を修正後、再実行
```

#### Backend エラー

**RuboCop エラー**
```bash
cd backend
bundle exec rubocop
bundle exec rubocop -a     # 自動修正
```

### 🔧 CI スキップ方法

緊急時のCI スキップ（推奨しません）
```bash
git commit -m "hotfix: critical issue [skip ci]"
```

## CI設定のカスタマイズ

### 📝 ワークフロー設定変更

#### チェック項目の追加
```yaml
# frontend-ci.yml に新しいステップ追加
- name: Run custom check
  run: pnpm run custom-lint
```

#### 新しいワークフロー追加
```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on:
  schedule:
    - cron: '0 2 * * 1'  # 毎週月曜日 午前2時
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Security scan
        run: |
          # セキュリティスキャン実行
```

### 🎛️ Taskfile 拡張

```yaml
# 新しいCIタスクの追加
tasks:
  ci:security:
    desc: "セキュリティチェック"
    dir: "{{.BACKEND_DIR}}"
    cmds:
      - bundle exec brakeman
      - bundle audit
```

## CI/CD ベストプラクティス

### ✅ 推奨事項

1. **PRでのCI必須化**
   - 全PRでCI通過を必須に
   - ブランチプロテクション設定

2. **失敗時の迅速な修正**
   - CI失敗はすぐに修正
   - 破損したmainブランチの回避

3. **定期的な依存関係更新**
   ```bash
   # 月次メンテナンス
   pnpm update      # Frontend
   bundle update    # Backend
   ```

4. **CI時間の監視**
   - 実行時間の定期チェック
   - 2分を超えた場合の最適化

### ❌ 避けるべき事項

1. **CI スキップの常用**
2. **重い処理の追加**（テスト・ビルド）
3. **secrets の平文コミット**
4. **CI設定の頻繁な変更**

## トラブルシューティング

### 🆘 緊急対応

**CI が完全に停止した場合**
```bash
# 1. ローカルで同等チェック実行
task ci:all

# 2. 問題修正後、強制プッシュ
git push --force-with-lease

# 3. CI再実行
```

**リソース不足エラー**
```yaml
# GitHub Actions の制限確認
# Settings > Billing > Actions minutes
```

この CI/CD パイプラインにより、高品質なコードの維持と開発効率の両立を実現できます。