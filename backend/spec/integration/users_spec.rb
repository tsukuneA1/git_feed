require 'swagger_helper'

RSpec.describe 'Users API', type: :request do
  path '/users' do
    get 'ユーザー一覧取得' do
      tags 'Users'
      produces 'application/json'
      response '200', 'ユーザー一覧' do
        schema type: :array, items: {
          type: :object,
          properties: {
            id: { type: :integer },
            uid: { type: :string },
            username: { type: :string },
            name: { type: :string },
            avatar_url: { type: :string, nullable: true },
            bio: { type: :string, nullable: true },
            location: { type: :string, nullable: true },
            skills: { type: :string, nullable: true },
            last_login_at: { type: :string, format: :date_time, nullable: true },
            role: { type: :string },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }
        }
        run_test!
      end
    end
  end

  path '/users/{id}' do
    get 'ユーザー詳細取得' do
      tags 'Users'
      produces 'application/json'
      parameter name: :id, in: :path, type: :integer, description: 'User ID'
      response '200', 'ユーザー詳細' do
        schema type: :object,
          properties: {
            id: { type: :integer },
            uid: { type: :string },
            username: { type: :string },
            name: { type: :string },
            avatar_url: { type: :string, nullable: true },
            bio: { type: :string, nullable: true },
            location: { type: :string, nullable: true },
            skills: { type: :string, nullable: true },
            last_login_at: { type: :string, format: :date_time, nullable: true },
            role: { type: :string },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }
        let(:id) { User.create!(username: 'test', uid: 'u1').id }
        run_test!
      end
      response '400', '不正なID' do
        let(:id) { 'abc' }
        run_test!
      end
      response '404', 'ユーザーが見つかりません' do
        let(:id) { 99999 }
        run_test!
      end
    end
  end
end
