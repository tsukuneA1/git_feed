class GithubToken < ApplicationRecord
    belongs_to :user

    validates :github_tokens, presence: true
end