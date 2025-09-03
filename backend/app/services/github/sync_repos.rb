module Github
  class SyncRepos
    PER_PAGE = 100

    def self.call(user)
      token = GithubToken.find_by!(user_id: user.id).github_token
      client = Octokit::Client.new(access_token: token)
      client.auto_paginate = false

      page = 1
      loop do
        repos = client.repos(nil, per_page: PER_PAGE, page: page)
        break if repos.empty?

        upsert_repos!(user, repos)
        break unless client.last_response.rels[:next]
        page += 1
      end
    end

    def self.upsert_repos!(user, repos)
      now = Time.current
      payloads = repos.map do |r|
        {
          id: SecureRandom.uuid,
          user_id: user.id,
          repo_id: r.id,
          name: r.name,
          html_url: r.html_url,
          description: r.description,
          language: r.language,
          stargazers_count: r.stargazers_count || 0,
          forks_count: r.forks_count || 0
        }
      end

      GithubRepo.upsert_all(
        payloads,
        unique_by: %i[user_id repo_id],
        record_timestamps: false
      )
    end
  end
end
