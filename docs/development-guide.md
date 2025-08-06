# Engineer Connect - 開発ガイド

## 開発環境セットアップ

### 必要なソフトウェア

#### Backend Requirements
- **Ruby**: 3.3.7+
- **Rails**: 8.0.2+
- **PostgreSQL**: 14.0+
- **Redis**: 7.0+ (キャッシュ・ジョブキュー用)

#### Frontend Requirements  
- **Node.js**: 18.0+
- **npm**: 9.0+ または **yarn**: 1.22+

#### Development Tools
- **Git**: バージョン管理
- **VS Code**: 推奨エディター
- **GitHub CLI**: GitHub操作の自動化

### 初回セットアップ

#### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/hackathon_demo_app.git
cd hackathon_demo_app
```

#### 2. Backend セットアップ
```bash
cd backend

# Ruby環境確認
ruby -v  # 3.3.7以上であることを確認

# 依存関係インストール
bundle install

# データベース作成・マイグレーション
rails db:create
rails db:migrate

# 環境変数設定
cp .env.example .env
# .envファイルを編集して必要な値を設定

# テスト実行（オプション）
rails test

# サーバー起動
rails server -p 3001
```

#### 3. Frontend セットアップ
```bash
cd frontend

# Node.js環境確認
node -v  # 18.0以上であることを確認

# 依存関係インストール
npm install

# 環境変数設定
cp .env.local.example .env.local
# .env.localファイルを編集

# 開発サーバー起動
npm run dev
```

#### 4. 必要な外部サービス設定

##### GitHub OAuth App作成
1. GitHub > Settings > Developer settings > OAuth Apps
2. "New OAuth App"をクリック
3. 以下の情報を入力：
   - Application name: `Engineer Connect (Development)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/auth/callback`
4. Client IDとClient Secretを`.env`と`.env.local`に設定

##### OpenAI API キー取得
1. [OpenAI Platform](https://platform.openai.com/)でアカウント作成
2. API Keysセクションで新しいキーを作成
3. `.env`ファイルに`OPENAI_API_KEY`として設定

## 開発ワークフロー

### ブランチ戦略
```
main                    # 本番反映ブランチ
├── develop            # 開発統合ブランチ  
├── feature/xxx        # 機能開発ブランチ
├── bugfix/xxx         # バグ修正ブランチ
└── hotfix/xxx         # 緊急修正ブランチ
```

### 開発手順
1. **Issue作成**: GitHub Issuesで作業内容を明確化
2. **ブランチ作成**: `feature/issue-123-add-user-profile`
3. **開発・テスト**: 機能実装とテスト作成
4. **Pull Request**: レビュー依頼
5. **マージ**: レビュー承認後にマージ

### コミットメッセージ規約
```
[Type] Brief description

Types:
- [Add]: 新機能追加
- [Fix]: バグ修正
- [Update]: 機能改善
- [Remove]: 機能削除
- [Security]: セキュリティ関連
- [Performance]: パフォーマンス改善
- [Refactor]: リファクタリング
- [Test]: テスト追加・修正
- [Docs]: ドキュメント更新

Example:
[Add] GitHub repository sync functionality
[Fix] JWT token expiration handling
[Security] Implement rate limiting for API endpoints
```

## アーキテクチャ概要

### システム構成
```
Frontend (Next.js)
├── app/                    # App Routerページ
├── components/             # 再利用可能コンポーネント  
├── contexts/               # React Context
├── hooks/                  # カスタムフック
├── lib/                    # ユーティリティ
└── types/                  # TypeScript型定義

Backend (Rails)
├── app/
│   ├── controllers/        # API コントローラー
│   ├── models/             # データモデル
│   ├── services/           # ビジネスロジック
│   └── lib/                # ライブラリ
├── config/                 # 設定ファイル
├── db/                     # データベーススキーマ・マイグレーション
└── test/                   # テストファイル
```

### データフロー
```
User Action → Frontend Component → API Call → Backend Controller 
                                                    ↓
GitHub API ← Service Layer ← Model Layer ← Database Query
    ↓
AI Analysis → Response → Frontend Update → UI Rendering
```

## コーディング規約

### Backend (Ruby/Rails)

#### Ruby Style Guide
```ruby
# Good
class UserRepository
  def initialize(user)
    @user = user
  end

  def sync_repositories
    repositories = fetch_from_github
    save_repositories(repositories)
  end

  private

  def fetch_from_github
    # Implementation
  end
end

# Bad
class user_repository
  def initialize(user)
    @user=user
  end
  def sync_repositories()
    repositories=fetch_from_github()
    save_repositories(repositories)
  end
end
```

#### Rails Conventions
```ruby
# Controllers - RESTful actions
class RepositoriesController < ApplicationController
  def index
    @repositories = current_user.repositories.includes(:user)
    render json: { repositories: @repositories }
  end
end

# Models - Business logic
class Repository < ApplicationRecord
  belongs_to :user
  validates :github_id, presence: true, uniqueness: true
  
  scope :popular, -> { order(stars_count: :desc) }
  scope :recent, -> { order(updated_at: :desc) }
end

# Services - Complex operations
class GitAnalysisService
  def initialize(user)
    @user = user
  end

  def analyze_repository_code(repository)
    # Complex analysis logic
  end
end
```

### Frontend (TypeScript/React)

#### Component Structure
```typescript
// Good - Functional component with TypeScript
interface Props {
  user: User;
  onUpdate: (user: User) => void;
}

export default function UserProfile({ user, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  
  const handleUpdate = useCallback(async () => {
    setLoading(true);
    try {
      const updatedUser = await updateUser(user.id);
      onUpdate(updatedUser);
    } finally {
      setLoading(false);
    }
  }, [user.id, onUpdate]);

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}
```

#### Custom Hooks
```typescript
// Custom hook for API calls
export function useRepositories(filters?: RepositoryFilters) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/repositories', { params: filters });
      setRepositories(data.repositories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  return { repositories, loading, error, refetch: fetchRepositories };
}
```

## テスト戦略

### Backend Testing

#### Model Tests
```ruby
# test/models/user_test.rb
class UserTest < ActiveSupport::TestCase
  test "should create user from github oauth data" do
    github_data = {
      'id' => 12345,
      'login' => 'testuser',
      'name' => 'Test User'
    }
    
    user = User.from_github_oauth(github_data, 'access_token')
    
    assert user.persisted?
    assert_equal 12345, user.github_id
    assert_equal 'testuser', user.username
  end
end
```

#### Controller Tests
```ruby
# test/controllers/repositories_controller_test.rb
class RepositoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @token = JwtToken.encode(user_id: @user.id)
  end

  test "should get repositories" do
    get repositories_url,
        headers: { 'Authorization' => "Bearer #{@token}" }
    
    assert_response :success
    assert_not_empty JSON.parse(response.body)['repositories']
  end
end
```

#### Service Tests
```ruby
# test/services/ai_analysis_service_test.rb
class AiAnalysisServiceTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)
    @service = AiAnalysisService.new(@user)
  end

  test "should analyze profile successfully" do
    VCR.use_cassette("ai_analysis") do
      analysis = @service.analyze_profile
      
      assert_not_nil analysis
      assert_not_empty analysis.summary
    end
  end
end
```

### Frontend Testing

#### Component Tests
```typescript
// __tests__/components/UserProfile.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from '@/components/UserProfile';

describe('UserProfile', () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    username: 'testuser'
  };

  test('renders user information', () => {
    render(<UserProfile user={mockUser} onUpdate={() => {}} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('calls onUpdate when update button clicked', async () => {
    const mockOnUpdate = jest.fn();
    render(<UserProfile user={mockUser} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByText('Update'));
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });
});
```

#### API Hook Tests
```typescript
// __tests__/hooks/useRepositories.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useRepositories } from '@/hooks/useRepositories';

// Mock API
jest.mock('@/lib/api');

describe('useRepositories', () => {
  test('fetches repositories successfully', async () => {
    const mockRepositories = [{ id: 1, name: 'test-repo' }];
    (api.get as jest.Mock).mockResolvedValue({ repositories: mockRepositories });

    const { result } = renderHook(() => useRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repositories).toEqual(mockRepositories);
  });
});
```

## デバッグ・トラブルシューティング

### よくある問題と解決方法

#### Backend Issues

##### Database Connection Error
```bash
# PostgreSQLが起動していない場合
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# データベースが存在しない場合
rails db:create
```

##### Gem Installation Error
```bash
# Bundler バージョン問題
gem update bundler
bundle install

# ネイティブエクステンション問題
bundle config build.nokogiri --use-system-libraries
bundle install
```

##### JWT Token Issues
```ruby
# app/controllers/application_controller.rb
def authenticate_request
  # デバッグ用ログ追加
  Rails.logger.debug "Authorization header: #{request.headers['Authorization']}"
  Rails.logger.debug "Decoded JWT: #{decoded}" if decoded
  
  # トークンの有効期限チェック
  if decoded && decoded[:exp] < Time.current.to_i
    Rails.logger.error "JWT token expired"
    render json: { error: 'Token expired' }, status: :unauthorized
  end
end
```

#### Frontend Issues

##### CORS Errors
```javascript
// Backend config/initializers/cors.rb で origins を確認
// フロントエンドのリクエスト URL が正しいか確認
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

##### TypeScript Errors
```bash
# 型定義の再生成
npm run build
# または
npx next build

# 型定義ファイル確認
ls -la types/
```

##### API Call Failures
```typescript
// lib/api.ts でリクエスト/レスポンスをログ出力
api.interceptors.request.use((config) => {
  console.log('API Request:', config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);
```

### デバッグツール

#### Backend Debugging
```ruby
# Gemfile (development group)
gem 'byebug'        # デバッガー
gem 'better_errors' # エラー画面改善
gem 'binding_of_caller'

# 使用例
def analyze_repository
  byebug  # ブレークポイント
  repository = current_user.repositories.find(params[:id])
end
```

#### Frontend Debugging
```typescript
// React Developer Tools
// Redux DevTools Extension (状態管理使用時)

// コンソールデバッグ
const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};
```

## パフォーマンス最適化

### Backend Optimization

#### Database Query Optimization
```ruby
# N+1クエリの回避
def index
  # Bad
  @repositories = current_user.repositories
  # このあとビューで@repositories.each { |repo| repo.user.name }を呼ぶとN+1

  # Good
  @repositories = current_user.repositories.includes(:user)
end

# インデックスの追加
class AddIndexesToTables < ActiveRecord::Migration[8.0]
  def change
    add_index :repositories, [:user_id, :language]
    add_index :repositories, :stars_count
    add_index :profile_analyses, :experience_level
  end
end
```

#### Caching Strategy
```ruby
# config/environments/development.rb
config.cache_store = :redis_cache_store, { url: ENV['REDIS_URL'] }

# Service layer caching
class AiAnalysisService
  def analyze_profile
    Rails.cache.fetch("user_profile_#{@user.id}", expires_in: 1.hour) do
      perform_expensive_analysis
    end
  end
end
```

### Frontend Optimization

#### Component Performance
```typescript
// React.memo でコンポーネントメモ化
const RepositoryCard = React.memo(({ repository }: Props) => {
  return (
    <div className="repository-card">
      <h3>{repository.name}</h3>
      <p>{repository.description}</p>
    </div>
  );
});

// useMemo で計算結果をメモ化
const ExpensiveComponent = ({ repositories }: Props) => {
  const sortedRepositories = useMemo(() => {
    return repositories.sort((a, b) => b.stars_count - a.stars_count);
  }, [repositories]);

  return <RepositoryList repositories={sortedRepositories} />;
};
```

#### API Call Optimization
```typescript
// SWR を使用したキャッシュ・再取得戦略
import useSWR from 'swr';

export function useRepositories(filters: RepositoryFilters) {
  const { data, error, mutate } = useSWR(
    ['/repositories', filters],
    ([url, params]) => api.get(url, { params }),
    {
      revalidateOnFocus: false,
      refreshInterval: 300000, // 5分
      dedupingInterval: 10000,  // 10秒
    }
  );

  return {
    repositories: data?.repositories || [],
    loading: !error && !data,
    error,
    mutate
  };
}
```

## セキュリティ考慮事項

### 実装必須のセキュリティ対策

#### Input Validation
```ruby
# Strong Parameters
class RepositoriesController < ApplicationController
  private

  def repository_params
    params.require(:repository).permit(:name, :description, :language)
  end
end

# Model validation
class User < ApplicationRecord
  validates :username, presence: true, 
                      format: { with: /\A[a-zA-Z0-9_-]+\z/ },
                      length: { maximum: 39 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
end
```

#### XSS Prevention
```typescript
// フロントエンドでのサニタイゼーション
import DOMPurify from 'dompurify';

const SafeHTML = ({ content }: { content: string }) => {
  const sanitized = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

#### CSRF Protection
```ruby
# Rails デフォルトで有効だが、API mode では無効
# 必要に応じて protect_from_forgery を設定
```

## リリースプロセス

### プリリリースチェックリスト
- [ ] 全テスト通過確認
- [ ] セキュリティスキャン実行
- [ ] パフォーマンステスト実行
- [ ] 依存関係の脆弱性チェック
- [ ] 本番環境変数設定確認
- [ ] データベースマイグレーション確認
- [ ] バックアップ確認

### デプロイコマンド
```bash
# Heroku example
git push heroku main
heroku run rails db:migrate
heroku restart
```

このガイドに従って開発することで、Engineer Connect プロジェクトの品質と保守性を維持できます。