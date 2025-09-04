class EventFetcher
    def initialize(client)
        @client = client
    end

    def call(repos:)
        threads = repos.map do |repo|
            Thread.new do
                fetch_filtered_events_for(repo)
            end
        end

        all_events = threads.map(&:value).compact.flatten

        all_events.sort_by { |event| event.created_at }.reverse
    end

    private

    attr_reader :client

    def fetch_filtered_events_for(repo)
        events = client.repository_events(repo.full_name, per_page: 50)

        Rails.logger.info "Checking #{events.size} events for #{repo.full_name}"

        filtered_events = events.select do |event|
            (event.type == "IssuesEvent" && event.payload.action == "opened") ||
            (event.type == "PullRequestEvent" && event.payload.action == "closed" && event.payload.pull_request.merged)
        end

        Rails.logger.info "Found #{filtered_events.size} matching events for #{repo.full_name}"

        filtered_events.first(3)
    rescue Octokit::Error => e
        Rails.logger.error("Failed to fetch events for #{repo.full_name}: #{e.message}")
        []
    end
end
