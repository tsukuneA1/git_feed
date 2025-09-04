class EventFetcher
    def initialize(client)
        @client = client
    end

    def call(repos:)
        threads = repos.map do |repo|
            Thread.new do
                fetch_filtered_event_for(repo)
            end
        end

        threads.map(&:value).compact
    end

    private

    attr_reader :client

    def fetch_filtered_event_for(repo)
        events = client.repository_events(repo.full_name, per_page: 30)

        filtered_event = events.find do |event|
            (event.type == "IssuesEvent" && event.payload.action == "opened") ||
            (event.type == "PullRequestEvent" && event.payload.action == "closed" && event.payload.pull_request.merged)
        end

        filtered_event
    rescue Octokit::Error => e
        Rails.logger.error("Failed to fetch events for #{repo.full_name}: #{e.message}")
        nil
    end
end
