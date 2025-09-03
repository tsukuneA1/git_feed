class GithubRepo < ApplicationRecord
  belongs_to :user
  validates :repo_id, presence: true
end
