class FeedController < ApplicationController
    FEED_REPO_COUNT = 10

    def show
        client = Octokit::Client.new(access_token: ENV["GITHUB_ACCESS_TOKEN"])

        prefs = current_user.user_tag_prefs.includes(:tag)
        query = SearchQueryBuilder.new(prefs: prefs).call

        candidate_repos = RepositorySearcher.new(client).call(query: query)
        selected_repos = candidate_repos.sample(FEED_REPO_COUNT)

        events = EventFetcher.new(client).call(repos: selected_repos)

        feed_items = events.map { |event| transform_event(event) }
        render json: { feed_items: feed_items }
    end

    private

    def transform_event(event)
        {
            id: event.id,
            type: event.type,
            repo: {
                id: event.repo.id,
                name: event.repo.name,
                url: event.repo.url
            },
            actor: {
                id: event.actor.id,
                login: event.actor.login,
                avatar_url: event.actor.avatar_url
            },
            created_at: event.created_at,
            payload: event.payload
        }
    end
end
