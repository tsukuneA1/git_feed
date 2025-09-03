class AddUniqueIndexToGithubReposOnUserIdAndRepoId < ActiveRecord::Migration[8.0]
  def change
    add_index :github_repos, [ :user_id, :repo_id ], unique: true, if_not_exists: true
  end
end
