class FeedController < ApplicationController
    before_action :authenticate_user!
    FEED_REPO_COUNT = 10

    def show
        unless current_user.github_token.present?
            render json: { error: "GitHub token not found. Please re-authenticate." }, status: :unauthorized
            return
        end

        client = Octokit::Client.new(access_token: current_user.github_token)

        prefs = current_user.user_tag_prefs.includes(:tag)
        tags = prefs.map { |pref| pref.tag.slug }
        query = SearchQueryBuilder.new(tags: tags).call

        candidate_repos = RepositorySearcher.new(client).call(query: query)
        Rails.logger.info "Found #{candidate_repos.size} candidate repositories"

        selected_repos = candidate_repos.sample(FEED_REPO_COUNT)
        Rails.logger.info "Selected #{selected_repos.size} repositories: #{selected_repos.map(&:full_name)}"

        events = EventFetcher.new(client).call(repos: selected_repos)
        Rails.logger.info "Found #{events.size} events"

        # 最大20件に制限
        limited_events = events.first(20)
        Rails.logger.info "Limited to #{limited_events.size} events"

        feed_items = limited_events.map { |event| transform_event(event) }
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
