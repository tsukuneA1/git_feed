class Api::V1::Github::ReposController < ApplicationController
  def sync
    Github::SyncRepos.call(current_user)
    head :accepted
  rescue ActiveRecord::RecordNotFound
    render json: { error: "GitHub token not found for current user" }, status: :unprocessable_entity
  rescue Octokit::Unauthorized
    render json: { error: "GitHub token invalid or expired" }, status: :unauthorized
  end

  def index
    repos = GithubRepo.where(user_id: current_user.id)
                      .order(stargazers_count: :desc)
                      .limit(params.fetch(:limit, 50).to_i.clamp(1, 200))
    render json: repos.as_json(only: %i[repo_id name full_name private html_url description language stargazers_count forks_count pushed_at])
  end
end
