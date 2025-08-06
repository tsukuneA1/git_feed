# Engineer Connect - デプロイガイド

## 本番環境推奨技術スタック

現在はローカル開発環境で動作していますが、本番環境・テスト環境での推奨技術スタックは以下の通りです。

## インフラストラクチャ

### クラウドプロバイダー候補

#### 1. Heroku (推奨 - 初学者フレンドリー)
**Rails Backend**
- Heroku Rails buildpack
- Heroku Postgres (Standard-0以上)
- Redis To Go add-on
- SSL/TLS 自動設定

**Next.js Frontend**
- Vercel (Next.js開発元)
- 自動デプロイメント
- Edge CDN

**利点:**
- 設定が簡単で初学者に優しい
- Rails に特化したサポート
- アドオン生態系が豊富

**想定コスト:** 月額 $25-50

#### 2. AWS (スケーラビリティ重視)
**Backend Infrastructure**
```
ECS Fargate (Rails API)
├── Application Load Balancer
├── RDS PostgreSQL (Multi-AZ)
├── ElastiCache Redis
└── CloudWatch Logs
```

**Frontend Infrastructure**
```
S3 + CloudFront (Next.js静的ファイル)
├── Lambda@Edge (SSR)
├── Route53 (DNS)
└── Certificate Manager (SSL)
```

**利点:**
- 高いスケーラビリティ
- 豊富なマネージドサービス
- 細かい設定制御が可能

**想定コスト:** 月額 $100-300

#### 3. Railway (モダン・開発者体験重視)
**Full Stack Deployment**
- Rails + Next.js 同一プラットフォーム
- PostgreSQL + Redis プラグイン
- GitHub連携自動デプロイ
- 簡単なスケーリング

**利点:**
- モダンなDX
- GitHubとの自動連携
- 透明性の高い料金体系

**想定コスト:** 月額 $20-80

### データベース

#### Production Database
```yaml
PostgreSQL Configuration:
  Version: "14+"
  Extensions:
    - pg_trgm (全文検索)
    - btree_gin (JSON索引)
  Backup:
    - 毎日の自動バックアップ
    - Point-in-time recovery
  Monitoring:
    - Connection pooling
    - Slow query monitoring
```

#### Redis Cache
```yaml
Redis Configuration:
  Version: "7.0+"
  Use Cases:
    - Session storage
    - API response caching
    - Background job queue
  Memory: "512MB - 2GB"
  Persistence: RDB + AOF
```

## 環境変数設定

### Backend Environment Variables
```bash
# Application
RAILS_ENV=production
RAILS_MASTER_KEY=<your_rails_master_key>
PORT=3001

# Database
DATABASE_URL=<postgresql_connection_string>
REDIS_URL=<redis_connection_string>

# Authentication
JWT_SECRET_KEY=<strong_random_secret_key>
SESSION_SECRET=<session_secret_key>

# GitHub Integration
GITHUB_CLIENT_ID=<github_oauth_app_client_id>
GITHUB_CLIENT_SECRET=<github_oauth_app_client_secret>
GITHUB_TOKEN=<github_personal_access_token>

# AI Services
OPENAI_API_KEY=<openai_api_key>

# Cross-Origin
FRONTEND_URL=https://your-frontend-domain.com

# Monitoring (Optional)
SENTRY_DSN=<sentry_error_tracking_url>
NEW_RELIC_LICENSE_KEY=<newrelic_license_key>
```

### Frontend Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_GITHUB_CLIENT_ID=<github_oauth_app_client_id>

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=<ga_tracking_id>
NEXT_PUBLIC_MIXPANEL_TOKEN=<mixpanel_token>
```

## セキュリティ強化

### 1. JWT Token Security
```ruby
# config/application.rb
config.force_ssl = true if Rails.env.production?

# app/lib/jwt_token.rb
class JwtToken
  SECRET_KEY = ENV.fetch('JWT_SECRET_KEY') { 
    raise 'JWT_SECRET_KEY environment variable is required' 
  }
  
  # 短いexpiration時間
  def self.encode(payload, exp = 2.hours.from_now)
    # ...
  end
end
```

### 2. CORS Configuration
```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('FRONTEND_URL', 'http://localhost:3000')
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

### 3. Rate Limiting
```ruby
# Gemfile
gem 'rack-attack'

# config/initializers/rack_attack.rb
class Rack::Attack
  throttle('api/requests/ip', limit: 300, period: 5.minutes) do |req|
    req.ip if req.path.start_with?('/api')
  end
end
```

### 4. Input Validation
```ruby
# Strong Parameters強化
class ApplicationController < ActionController::API
  private
  
  def sanitize_params(params)
    # XSS prevention, SQL injection prevention
  end
end
```

## パフォーマンス最適化

### Backend Optimizations

#### 1. Database Query Optimization
```ruby
# N+1クエリ防止
class RepositoriesController < ApplicationController
  def index
    @repositories = current_user.repositories
                               .includes(:user)  # Eager loading
                               .order(:name)
                               .page(params[:page])
  end
end

# Database indexing
class AddIndexesToRepositories < ActiveRecord::Migration[8.0]
  def change
    add_index :repositories, [:user_id, :language]
    add_index :repositories, :stars_count
    add_index :profile_analyses, :experience_level
    # JSON field indexing
    add_index :repositories, 'analysis_data', using: :gin
  end
end
```

#### 2. Caching Strategy
```ruby
# Redis caching
class GitAnalysisService
  def analyze_repository_code(repository)
    cache_key = "repo_analysis_#{repository.id}_#{repository.updated_at.to_i}"
    
    Rails.cache.fetch(cache_key, expires_in: 1.hour) do
      # Expensive analysis operation
      perform_analysis(repository)
    end
  end
end
```

#### 3. Background Processing
```ruby
# Gemfile
gem 'sidekiq'

# Background AI analysis
class AnalyzeProfileJob < ApplicationJob
  queue_as :default
  
  def perform(user_id)
    user = User.find(user_id)
    AiAnalysisService.new(user).analyze_profile
  end
end
```

### Frontend Optimizations

#### 1. Code Splitting
```typescript
// Dynamic imports for heavy components
const CodeAnalysis = lazy(() => import('@/components/CodeAnalysis'));
const NetworkingPage = lazy(() => import('@/app/networking/page'));

// Route-based code splitting with Next.js App Router
```

#### 2. Image Optimization
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

#### 3. API Response Caching
```typescript
// Frontend cache strategy
const useRepositories = () => {
  return useSWR('/repositories', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 300000, // 5 minutes
  });
};
```

## 監視・ロギング

### Application Monitoring

#### 1. Error Tracking
```ruby
# Gemfile
gem 'sentry-ruby'
gem 'sentry-rails'

# config/initializers/sentry.rb
Sentry.init do |config|
  config.dsn = ENV['SENTRY_DSN']
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]
end
```

#### 2. Performance Monitoring
```ruby
# Gemfile
gem 'newrelic_rpm'

# config/newrelic.yml
production:
  license_key: <%= ENV['NEW_RELIC_LICENSE_KEY'] %>
  app_name: "Engineer Connect API"
```

#### 3. Custom Metrics
```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  after_action :track_api_usage

  private

  def track_api_usage
    Rails.logger.info({
      endpoint: "#{controller_name}##{action_name}",
      user_id: current_user&.id,
      response_time: (Time.current - @request_start_time) * 1000,
      status: response.status
    }.to_json)
  end
end
```

## デプロイメント自動化

### GitHub Actions Workflow

#### Backend Deployment
```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.3.7
          bundler-cache: true
          working-directory: ./backend
      
      - name: Run tests
        working-directory: ./backend
        run: |
          bundle exec rails test
          bundle exec rubocop
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "engineer-connect-api"
          heroku_email: ${{secrets.HEROKU_EMAIL}}
          appdir: "backend"
```

#### Frontend Deployment (Vercel)
```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: './frontend/package-lock.json'
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Build and test
        working-directory: ./frontend
        run: |
          npm run build
          npm run test
          npm run lint
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## バックアップ・災害復旧

### Database Backup Strategy
```bash
# Daily automated backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Point-in-time recovery setup
# Configure WAL archiving for PostgreSQL
```

### Application Recovery Plan
1. **RTO (Recovery Time Objective)**: 30分以内
2. **RPO (Recovery Point Objective)**: 4時間以内
3. **Backup retention**: 30日間
4. **災害復旧手順書**の整備

## スケーリング戦略

### Horizontal Scaling
```yaml
# Heroku dyno scaling
web: 2-5 dynos (based on traffic)
worker: 1-3 dynos (for background jobs)

# Database connection pooling
# config/database.yml
production:
  pool: 25
  checkout_timeout: 5
```

### Vertical Scaling
- メモリ使用量監視
- CPU使用率監視  
- データベースパフォーマンス監視

## 運用チェックリスト

### Pre-deployment
- [ ] 環境変数設定確認
- [ ] テスト実行・合格確認
- [ ] セキュリティ設定確認
- [ ] データベースマイグレーション確認

### Post-deployment
- [ ] ヘルスチェック実行
- [ ] 主要機能動作確認
- [ ] エラーログ監視
- [ ] パフォーマンスメトリクス確認

### Ongoing Maintenance
- [ ] 依存関係の定期更新
- [ ] セキュリティパッチ適用
- [ ] バックアップ検証
- [ ] 監視アラート設定見直し

このデプロイガイドにより、Engineer Connectを本番環境で安全かつスケーラブルに運用することが可能になります。