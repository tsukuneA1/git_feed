class CreateGithubTokens < ActiveRecord::Migration[8.0]
  def up
    create_table :github_tokens, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.text :github_token, null: false
      t.timestamps
    end

    execute <<~SQL
      ALTER TABLE github_tokens ENABLE ROW LEVEL SECURITY;
    SQL

    execute <<~SQL
      CREATE POLICY github_tokens_isolation ON github_tokens
      USING (user_id = current_setting('app.current_user_id', true)::uuid)
      WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);
    SQL
  end

  def down
    execute <<~SQL
      DROP POLICY IF EXISTS github_tokens_isolation ON github_tokens;
    SQL
    drop_table :github_tokens
  end
end