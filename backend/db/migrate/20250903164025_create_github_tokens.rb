class CreateGithubTokens < ActiveRecord::Migration[8.0]
  def change
    create_table :github_tokens, id: :uuid, if_not_exists: true do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.text :github_token, null: false
      t.timestamps
    end

    add_index :github_tokens, :user_id, unique: true, if_not_exists: true
  end
end