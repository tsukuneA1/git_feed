class FeedController < ApplicationController
    FEED_REPO_COUNT = 10

    def show
        client = Octokit::Client.new(access_token: ENV["GITHUB_ACCESS_TOKEN"])

        tags = current_user.user_tag_prefs.joins(:tag).order(weight: :desc).pluck
    end
end
