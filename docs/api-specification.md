# Engineer Connect - API仕様書

## 基本情報

- **Base URL**: `http://localhost:3001` (開発環境)
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json`
- **API Version**: v1

## 認証

すべてのAPIエンドポイント（OAuth callback除く）は認証が必要です。

### Header Format
```
Authorization: Bearer <jwt_token>
```

### Token取得フロー
1. GitHub OAuthでauthorization codeを取得
2. `/auth/github`にPOSTしてJWTトークンを取得
3. 以降のAPIリクエストでBearerトークンとして使用

## エンドポイント一覧

## 🔐 Authentication API

### GitHub OAuth Callback
GitHub OAuth認証後のコールバック処理を行います。

```
POST /auth/github
```

**Request Body:**
```json
{
  "code": "github_authorization_code",
  "state": "optional_state_parameter"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar_url": "https://avatars.githubusercontent.com/u/1234567"
  }
}
```

**Error Responses:**
- `400`: Invalid authorization code
- `422`: GitHub API error

### Current User Info
認証されたユーザーの情報を取得します。

```
GET /auth/me
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar_url": "https://avatars.githubusercontent.com/u/1234567",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `401`: Invalid or expired token

## 📁 Repositories API

### List Repositories
ユーザーのリポジトリ一覧を取得します。

```
GET /repositories
```

**Query Parameters:**
- `sort` (optional): `name` | `popular` | `recent` (default: `name`)
- `language` (optional): プログラミング言語でフィルタ
- `public_only` (optional): `true` | `false` (default: `false`)
- `page` (optional): ページ番号 (default: 1)
- `per_page` (optional): 1ページあたりの件数 (default: 20)

**Response (200):**
```json
{
  "repositories": [
    {
      "id": 1,
      "github_id": 123456789,
      "name": "awesome-project",
      "full_name": "johndoe/awesome-project",
      "description": "An awesome project built with React",
      "private": false,
      "language": "JavaScript",
      "stars_count": 42,
      "forks_count": 7,
      "html_url": "https://github.com/johndoe/awesome-project",
      "last_commit_message": "Add new feature",
      "last_commit_date": "2025-01-14T15:30:00Z",
      "created_at": "2025-01-10T10:00:00Z",
      "updated_at": "2025-01-15T12:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_count": 50,
    "per_page": 20
  }
}
```

### Get Repository Details
特定のリポジトリの詳細情報を取得します。

```
GET /repositories/:id
```

**Response (200):**
```json
{
  "repository": {
    "id": 1,
    "github_id": 123456789,
    "name": "awesome-project",
    "full_name": "johndoe/awesome-project",
    "description": "An awesome project built with React",
    "private": false,
    "language": "JavaScript",
    "stars_count": 42,
    "forks_count": 7,
    "html_url": "https://github.com/johndoe/awesome-project",
    "readme_content": "# Awesome Project\n\nThis is an awesome project...",
    "last_commit_sha": "abc123def456",
    "last_commit_message": "Add new feature",
    "last_commit_date": "2025-01-14T15:30:00Z",
    "analysis_data": {
      "total_lines": 1250,
      "complexity_score": 15,
      "quality_score": 8,
      "maintainability": "Good"
    },
    "created_at": "2025-01-10T10:00:00Z",
    "updated_at": "2025-01-15T12:00:00Z"
  }
}
```

**Error Responses:**
- `404`: Repository not found

### Sync Repositories
GitHubからリポジトリ情報を同期します。

```
POST /repositories/sync
```

**Response (200):**
```json
{
  "message": "Repository sync completed successfully",
  "synced_count": 15,
  "repositories": [
    // Repository objects...
  ]
}
```

**Error Responses:**
- `422`: GitHub API error
- `500`: Sync process error

## 🤖 Profile Analysis API

### Get Profile Analysis
ユーザーのプロフィール分析結果を取得します。

```
GET /profile_analysis
```

**Response (200):**
```json
{
  "profile_analysis": {
    "id": 1,
    "summary": "経験豊富なフロントエンドエンジニア。React、TypeScriptに精通し、モダンな開発手法を実践している。",
    "skills": ["React", "TypeScript", "Next.js", "Node.js"],
    "technologies": ["JavaScript", "HTML", "CSS", "Git"],
    "experience_level": "Senior",
    "personality": "チームワークを重視し、コードレビューに積極的に参加する協調性のあるエンジニア",
    "strengths": ["フロントエンド開発", "UI/UX設計", "コードレビュー"],
    "communication_style": "技術的な議論を好み、建設的なフィードバックを提供する",
    "analyzed_at": "2025-01-15T12:00:00Z",
    "needs_update": false,
    "created_at": "2025-01-15T12:00:00Z",
    "updated_at": "2025-01-15T12:00:00Z"
  }
}
```

**Error Responses:**
- `404`: Profile analysis not found

### Run Profile Analysis
AIプロフィール分析を実行します。

```
POST /profile_analysis
```

**Response (200):**
```json
{
  "message": "Profile analysis completed successfully",
  "profile_analysis": {
    // Profile analysis object...
  }
}
```

**Error Responses:**
- `422`: Analysis failed (insufficient data, API error, etc.)

### Chat About Profile
プロフィールに関する質問をAIに投げかけます。

```
POST /profile_analysis/chat
```

**Request Body:**
```json
{
  "question": "この人のフロントエンドスキルについて教えて",
  "context": "採用面接での参考情報として"
}
```

**Response (200):**
```json
{
  "question": "この人のフロントエンドスキルについて教えて",
  "answer": "この方は React と TypeScript に精通したシニアレベルのフロントエンドエンジニアです。特に Next.js を使ったモダンな開発に長けており、コンポーネント設計やパフォーマンス最適化の経験も豊富です。",
  "user": {
    "username": "johndoe",
    "name": "John Doe",
    "avatar_url": "https://avatars.githubusercontent.com/u/1234567"
  }
}
```

**Error Responses:**
- `400`: Question is required
- `404`: Profile analysis not found
- `422`: Chat response generation failed

## 🔍 Code Analysis API

### Analyze Repository Code
指定したリポジトリのコード解析を実行します。

```
POST /code_analysis/:id/analyze_repository
```

**Response (200):**
```json
{
  "message": "Code analysis completed successfully",
  "repository": {
    "id": 1,
    "name": "awesome-project",
    "analysis": {
      "total_lines": 1250,
      "complexity_score": 15,
      "function_count": 45,
      "class_count": 12,
      "quality_score": 8,
      "complexity_level": "Medium",
      "maintainability": "Good",
      "architecture_pattern": "MVC with component-based frontend",
      "strengths": "適切なコンポーネント分割、型安全性の確保",
      "improvements": "テストカバレッジの向上、ドキュメント整備",
      "tech_insights": "React hooks を効果的に活用し、モダンな開発パターンを採用",
      "analyzed_at": "2025-01-15T14:30:00Z"
    }
  }
}
```

**Error Responses:**
- `404`: Repository not found
- `422`: Analysis failed

### Get Repository Insights
リポジトリの解析結果詳細を取得します。

```
GET /code_analysis/:id/repository_insights
```

**Response (200):**
```json
{
  "repository": {
    "id": 1,
    "name": "awesome-project"
  },
  "insights": {
    "total_lines": 1250,
    "complexity_score": 15,
    "quality_score": 8,
    "maintainability": "Good",
    "architecture_pattern": "MVC with component-based frontend",
    "strengths": "適切なコンポーネント分割、型安全性の確保",
    "improvements": "テストカバレッジの向上、ドキュメント整備",
    "tech_insights": "React hooks を効果的に活用し、モダンな開発パターンを採用"
  }
}
```

### Get Commit Analysis
リポジトリのコミットパターン分析を取得します。

```
GET /code_analysis/:id/commit_analysis
```

**Response (200):**
```json
{
  "repository": {
    "id": 1,
    "name": "awesome-project"
  },
  "commit_analysis": {
    "total_commits": 87,
    "commit_frequency": 2.3,
    "commit_message_quality": 78.5,
    "contributor_activity": {
      "total_contributors": 3,
      "main_contributor_percentage": 65.5
    },
    "code_churn": {
      "total_additions": 15420,
      "total_deletions": 3240,
      "churn_ratio": 0.21
    }
  }
}
```

### Get Quality Metrics
コード品質メトリクスを取得します。

```
GET /code_analysis/:id/quality_metrics
```

**Response (200):**
```json
{
  "repository": {
    "id": 1,
    "name": "awesome-project"
  },
  "quality_metrics": {
    "complexity_score": 15,
    "maintainability_index": 8,
    "quality_score": 8,
    "total_lines": 1250,
    "function_count": 45
  }
}
```

### Batch Analyze
複数リポジトリの一括解析を実行します。

```
POST /code_analysis/batch_analyze
```

**Request Body:**
```json
{
  "repository_ids": [1, 2, 3]
}
```

**Response (200):**
```json
{
  "message": "Batch analysis completed",
  "results": [
    {
      "repository_id": 1,
      "status": "success",
      "repository": {
        // Repository with analysis data...
      }
    },
    {
      "repository_id": 2,
      "status": "error", 
      "error": "Analysis failed: insufficient data"
    }
  ]
}
```

## 🤝 Networking API

### Discover Engineers
エンジニアを検索・発見します。

```
GET /networking/discover_engineers
```

**Query Parameters:**
- `skills` (optional): スキル（カンマ区切り）
- `experience_level` (optional): `Junior` | `Mid` | `Senior` | `Lead`
- `technology` (optional): 技術名
- `page` (optional): ページ番号
- `per_page` (optional): 1ページあたりの件数

**Response (200):**
```json
{
  "engineers": [
    {
      "id": 2,
      "username": "janedoe",
      "name": "Jane Doe",
      "avatar_url": "https://avatars.githubusercontent.com/u/2345678",
      "repository_count": 23,
      "total_stars": 156,
      "summary": "バックエンドエンジニア。Python、Django、PostgreSQLに精通。",
      "skills": ["Python", "Django", "PostgreSQL", "Redis"],
      "technologies": ["Python", "SQL", "Docker"],
      "experience_level": "Senior",
      "personality": "問題解決能力が高く、効率的なソリューションを提案する",
      "strengths": ["API設計", "データベース最適化", "システムアーキテクチャ"],
      "communication_style": "論理的で明確なコミュニケーション",
      "analyzed_at": "2025-01-14T09:15:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_count": 45,
    "total_pages": 3
  },
  "filters": {
    "skills": ["Python"],
    "experience_level": "Senior",
    "technology": null
  }
}
```

### Find Similar Engineers
現在のユーザーと類似したエンジニアを取得します。

```
GET /networking/similar_engineers
```

**Response (200):**
```json
{
  "engineers": [
    {
      "id": 3,
      "username": "bobsmith",
      "name": "Bob Smith",
      "avatar_url": "https://avatars.githubusercontent.com/u/3456789",
      "repository_count": 31,
      "total_stars": 89,
      "skills": ["React", "TypeScript", "Node.js"],
      "technologies": ["JavaScript", "CSS", "Git"],
      "experience_level": "Mid",
      "similarity_score": 87.5,
      "summary": "フロントエンドエンジニア。React エコシステムに深く精通。"
    }
  ],
  "message": null
}
```

### Get Trending Skills
トレンドスキルと技術を取得します。

```
GET /networking/trending_skills
```

**Response (200):**
```json
{
  "trending_skills": [
    {"name": "React", "count": 145},
    {"name": "TypeScript", "count": 98},
    {"name": "Python", "count": 87},
    {"name": "Node.js", "count": 76}
  ],
  "trending_technologies": [
    {"name": "JavaScript", "count": 234},
    {"name": "Python", "count": 156},
    {"name": "Java", "count": 98},
    {"name": "Go", "count": 67}
  ]
}
```

### Chat with Engineer
他のエンジニアについてAIに質問します。

```
POST /networking/chat_with_engineer
```

**Request Body:**
```json
{
  "engineer_id": 2,
  "question": "このエンジニアのバックエンドスキルはどの程度ですか？",
  "context": "チーム編成の参考として"
}
```

**Response (200):**
```json
{
  "question": "このエンジニアのバックエンドスキルはどの程度ですか？",
  "answer": "このエンジニアは Python と Django に精通したシニアレベルのバックエンドエンジニアです。特に API 設計とデータベース最適化に長けており、スケーラブルなシステム構築の経験が豊富です。",
  "engineer": {
    "id": 2,
    "username": "janedoe",
    "name": "Jane Doe",
    "avatar_url": "https://avatars.githubusercontent.com/u/2345678"
  },
  "asked_by": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `400`: Question is required
- `403`: Cannot chat about your own profile
- `404`: Engineer profile analysis not available
- `422`: Chat response generation failed

### Get Engineer Profile
特定のエンジニアの詳細プロフィールを取得します。

```
GET /networking/:id/engineer_profile
```

**Response (200):**
```json
{
  "engineer": {
    "id": 2,
    "username": "janedoe",
    "name": "Jane Doe",
    "avatar_url": "https://avatars.githubusercontent.com/u/2345678",
    "repository_count": 23,
    "total_stars": 156,
    "summary": "バックエンドエンジニア。Python、Django、PostgreSQLに精通。",
    "skills": ["Python", "Django", "PostgreSQL", "Redis"],
    "technologies": ["Python", "SQL", "Docker"],
    "experience_level": "Senior",
    "personality": "問題解決能力が高く、効率的なソリューションを提案する",
    "strengths": ["API設計", "データベース最適化", "システムアーキテクチャ"],
    "communication_style": "論理的で明確なコミュニケーション",
    "top_repositories": [
      {
        "id": 15,
        "name": "api-framework",
        "description": "高性能なREST APIフレームワーク",
        "language": "Python",
        "stars_count": 67,
        "forks_count": 12,
        "html_url": "https://github.com/janedoe/api-framework",
        "analysis_data": {
          "quality_score": 9,
          "complexity_level": "Low"
        }
      }
    ],
    "languages_used": [
      ["Python", 15],
      ["JavaScript", 5],
      ["Go", 3]
    ]
  }
}
```

**Error Responses:**
- `403`: Cannot view your own profile through this endpoint
- `404`: Engineer not found

## エラーレスポンス

### 共通エラーフォーマット
```json
{
  "error": "Error message",
  "details": {
    "field": "specific error details"
  }
}
```

### HTTPステータスコード
- `200`: Success
- `400`: Bad Request - 不正なリクエストパラメータ
- `401`: Unauthorized - 認証が必要または無効なトークン
- `403`: Forbidden - リソースへのアクセス権限なし
- `404`: Not Found - リソースが見つからない
- `422`: Unprocessable Entity - バリデーションエラーまたは処理エラー
- `500`: Internal Server Error - サーバー内部エラー

## レート制限

現在のバージョンではレート制限は実装されていませんが、本番環境では以下の制限を設ける予定です：

- **一般API**: 300 requests/5分/IP
- **AI API**: 10 requests/分/ユーザー
- **大容量処理**: 5 requests/時間/ユーザー

## SDKとサンプルコード

### JavaScript/TypeScript
```typescript
// API client例
class EngineerConnectAPI {
  constructor(private token: string) {}

  async getProfile(): Promise<ProfileAnalysis> {
    const response = await fetch('/profile_analysis', {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  async analyzeRepository(repositoryId: number): Promise<Repository> {
    const response = await fetch(`/code_analysis/${repositoryId}/analyze_repository`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
}
```

この API 仕様書により、Engineer Connect の全機能を効率的に活用することが可能です。