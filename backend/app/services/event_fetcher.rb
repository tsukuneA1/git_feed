class EventFetcher
    def initialize(client)
        @client = client
    end

    def call(repos:)
        threads = repos.map do |repo|
            Thread.new do
                fetch_latest_event_for(repo)
            end
        end

        threads.map(&:value).compact
    end

    private

    attr_reader :client

    def fetch_latest_event_for(repo)
        client.repository_events(repo.full_name, per_page: 1).first
    rescue Octokit::Error => e
        Rails.logger.error("Failed to fetch events for #{repo.full_name}: #{e.message}")
        nil
    end
end
