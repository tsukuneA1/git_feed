# Engineer Connect - 技術仕様書

## システム全体像

Engineer Connectは、GitHub OAuthを基盤としたAI駆動型エンジニアプロフィール解析・ネットワーキングプラットフォームです。

## アーキテクチャ概要

```
┌─────────────────┐    HTTP/JSON     ┌──────────────────┐    REST API    ┌─────────────────┐
│   Frontend      │◄────────────────►│    Backend       │◄──────────────►│   GitHub API    │
│   (Next.js)     │     API calls    │   (Rails API)    │   OAuth & Data │   (REST v3/v4)  │
│   Port: 3000    │                  │   Port: 3001     │                │                 │
└─────────────────┘                  └──────────────────┘                └─────────────────┘
                                               │                                    
                                               │ SQL                                
                                               ▼                                    
                                    ┌──────────────────┐    AI API      ┌─────────────────┐
                                    │   PostgreSQL     │◄──────────────►│   OpenAI API    │
                                    │   Database       │                │   GPT-3.5-turbo │
                                    └──────────────────┘                └─────────────────┘
```

## 技術スタック詳細

### Backend (Rails API)

#### Core Framework
- **Rails 8.0.2** (API mode)
  - 理由: 豊富なgem生態系、MVCアーキテクチャの明確性
  - 設定: APIモードで軽量化、CORSサポート

#### Database
- **PostgreSQL**
  - 理由: JSON型サポート、スケーラビリティ、ACID準拠
  - 使用機能: JSON fields（分析データ保存）、インデックス最適化

#### Authentication & Security
- **JWT (JSON Web Token)**
  - 理由: ステートレス認証、フロントエンド分離対応
  - 実装: カスタムJwtTokenクラス、環境変数による秘密鍵管理
- **GitHub OAuth**
  - 理由: エンジニア向けサービスの標準的な認証方法
  - スコープ: `user:email`, `repo`

#### External API Integration
- **Octokit gem (GitHub API Ruby client)**
  - 理由: GitHub APIの公式推奨Ruby client
  - 使用API: User API, Repository API, Contents API
- **ruby-openai gem**
  - 理由: OpenAI APIとの統合が簡単
  - 使用モデル: GPT-3.5-turbo

#### Key Gems
```ruby
gem 'rails', '~> 8.0.2'
gem 'pg', '~> 1.1'              # PostgreSQL driver
gem 'puma', '>= 5.0'            # Web server
gem 'rack-cors'                 # CORS support
gem 'jwt'                       # JSON Web Token
gem 'octokit', '~> 8.0'         # GitHub API client
gem 'ruby-openai'               # OpenAI API client
gem 'dotenv-rails'              # Environment variables
gem 'redis'                     # Caching & background jobs
```

### Frontend (Next.js)

#### Core Framework
- **Next.js 15** with App Router
  - 理由: React生態系、TypeScriptサポート、開発体験
  - 機能: Server Side Rendering, Static Generation, API Routes

#### Language & Type Safety
- **TypeScript**
  - 理由: 型安全性、開発効率向上、エラー削減
  - 設定: strict mode有効

#### Styling
- **Tailwind CSS**
  - 理由: ユーティリティファースト、高速開発、一貫性
  - 設定: カスタムデザインシステム

#### State Management
- **React Context API**
  - 理由: 認証状態管理には十分、追加ライブラリ不要
  - 実装: AuthContext for user authentication

#### HTTP Client
- **Custom API client (Axios wrapper)**
  - 理由: トークン自動付与、エラーハンドリング統一
  - 機能: Request/Response インターセプター

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    github_id INTEGER UNIQUE NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    name VARCHAR,
    email VARCHAR,
    avatar_url VARCHAR,
    access_token VARCHAR,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

#### Repositories Table
```sql
CREATE TABLE repositories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    github_id BIGINT UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    full_name VARCHAR,
    description TEXT,
    private BOOLEAN,
    language VARCHAR,
    stars_count INTEGER DEFAULT 0,
    forks_count INTEGER DEFAULT 0,
    html_url VARCHAR,
    readme_content TEXT,
    last_commit_sha VARCHAR,
    last_commit_message TEXT,
    last_commit_date TIMESTAMP,
    analysis_data JSON,  -- AI解析結果
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

#### Profile Analyses Table
```sql
CREATE TABLE profile_analyses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) UNIQUE,
    summary TEXT,
    skills JSON,           -- ["React", "Node.js", ...]
    technologies JSON,     -- ["JavaScript", "Python", ...]
    experience_level VARCHAR CHECK (experience_level IN ('Junior', 'Mid', 'Senior', 'Lead')),
    personality TEXT,
    strengths JSON,
    communication_style TEXT,
    analyzed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

## API設計

### RESTful Endpoints

#### Authentication
```
POST /auth/github       # GitHub OAuth callback
GET  /auth/me          # Current user info
```

#### Repositories
```
GET    /repositories           # List user repositories
GET    /repositories/:id       # Get repository details
POST   /repositories/sync      # Sync from GitHub
```

#### Profile Analysis
```
GET    /profile_analysis       # Get user's profile analysis
POST   /profile_analysis       # Run AI analysis
POST   /profile_analysis/chat  # Chat about profile
```

#### Code Analysis
```
POST   /code_analysis/:id/analyze_repository  # Analyze repository code
GET    /code_analysis/:id/repository_insights # Get analysis insights
GET    /code_analysis/:id/commit_analysis     # Get commit patterns
GET    /code_analysis/:id/quality_metrics     # Get quality metrics
POST   /code_analysis/batch_analyze           # Batch analyze repositories
```

#### Networking
```
GET    /networking/discover_engineers         # Discover engineers
GET    /networking/similar_engineers          # Find similar engineers
GET    /networking/trending_skills            # Get trending skills
POST   /networking/chat_with_engineer         # Chat about engineer
GET    /networking/:id/engineer_profile       # Get engineer profile
```

### Response Format

#### Success Response
```json
{
  "data": { ... },
  "message": "Operation successful"
}
```

#### Error Response
```json
{
  "error": "Error message",
  "details": { ... }
}
```

## AI Integration Architecture

### Profile Analysis Flow

1. **Data Collection**
   ```
   GitHub API → Repository Data → AI Prompt Generation
   ```

2. **AI Analysis**
   ```
   Structured Prompt → OpenAI GPT-3.5 → Parsed Response
   ```

3. **Data Storage**
   ```
   Parsed AI Response → JSON Fields → PostgreSQL
   ```

### Prompt Engineering

#### Profile Analysis Prompt Structure
```
System: あなたは経験豊富な技術面接官です
User: 以下のGitHubデータを分析してください...
- ユーザー情報
- リポジトリ統計  
- 人気リポジトリ
- README内容

Response Format:
SUMMARY: [総合評価]
SKILLS: [スキル一覧]
EXPERIENCE: [経験レベル]
...
```

## Security Considerations

### Authentication Security
- JWT token with expiration (24 hours)
- Secret key stored in environment variables
- GitHub OAuth with appropriate scopes

### API Security
- CORS configuration for frontend domain
- Rate limiting (future implementation)
- Input validation and sanitization

### Data Privacy
- GitHub access tokens encrypted storage
- User consent for data analysis
- No sensitive data logging

## Performance Optimizations

### Database
- Appropriate indexing on foreign keys
- JSON field indexing for analysis data
- Connection pooling

### API
- Pagination for large datasets
- Caching for GitHub API responses
- Background processing for AI analysis

### Frontend
- React component memoization
- Lazy loading for heavy components
- Image optimization for avatars

## Monitoring & Observability

### Logging
- Structured logging with Rails logger
- API request/response logging
- Error tracking and reporting

### Metrics
- API response times
- Database query performance
- AI API usage tracking

### Health Checks
- Database connectivity check
- External API availability
- Application health endpoint

## Development Workflow

### Environment Setup
1. Ruby 3.3.7 + Rails 8.0.2
2. Node.js 18+ + npm/yarn
3. PostgreSQL 14+
4. GitHub OAuth App setup
5. OpenAI API key acquisition

### Testing Strategy
- Unit tests for models and services
- Integration tests for API endpoints
- Frontend component testing
- End-to-end testing for critical flows

### Code Quality
- RuboCop for Ruby code style
- ESLint + Prettier for TypeScript/React
- TypeScript strict mode
- Git pre-commit hooks

## Deployment Considerations

本番環境デプロイのための推奨技術スタックについては、[deployment-guide.md](./deployment-guide.md) を参照してください。