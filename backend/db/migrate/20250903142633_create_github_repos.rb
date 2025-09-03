class CreateGithubRepos < ActiveRecord::Migration[8.0]
  def change
    create_table :github_repos, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, index: true

      t.bigint :repo_id, null: false
      t.string :name, null: false
      t.string  :html_url
      t.text    :description
      t.string  :language
      t.integer :stargazers_count, null: false, default: 0
      t.integer :forks_count,      null: false, default: 0
    end
  end
end
