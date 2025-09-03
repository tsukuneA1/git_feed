class GithubToken < ApplicationRecord
    belongs_to :user

    validates :github_token, presence: true
end