class CreateGithubTokens < ActiveRecord::Migration[8.0]
  def change
    create_table :github_tokens do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.text :github_token, null: false
      t.timestamps
    end
  end
end
