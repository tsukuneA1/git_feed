class RepositorySearcher
    def initialize(client)
        @client = client
    end

    def call(query:)
        result = client.search_repositories(query, per_page: 50)
        result.items
    rescue Octokit::Error => e
        Rails.logger.error("Failed to search repositories: #{e.message}")
        []
    end

    private

    attr_reader :client
end
