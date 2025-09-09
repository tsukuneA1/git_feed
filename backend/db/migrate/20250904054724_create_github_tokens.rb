class CreateGithubTokens < ActiveRecord::Migration[8.0]
  def up
    create_table :github_tokens do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.text :github_token, null: false
    end

    execute <<~SQL
      ALTER TABLE github_tokens ENABLE ROW LEVEL SECURITY;
    SQL

    execute <<~SQL
      CREATE POLICY github_tokens_isolation ON github_tokens
      USING (user_id = current_setting('app.current_user_id', true)::bigint)
      WITH CHECK (user_id = current_setting('app.current_user_id', true)::bigint);
    SQL
  end

  def down
    execute <<~SQL
      DROP POLICY IF EXISTS github_tokens_isolation ON github_tokens;
      ALTER TABLE github_tokens DISABLE ROW LEVEL SECURITY;
    SQL
    drop_table :github_tokens
  end
end
