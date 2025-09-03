class RemoveDuplicateIndexFromGithubTokens < ActiveRecord::Migration[8.0]
  def change
    remove_index :github_tokens, :user_id, if_exists: true
  end
endgit