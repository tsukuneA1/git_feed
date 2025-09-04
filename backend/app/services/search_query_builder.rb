class SearchQueryBuilder
    STARS_THRESHOLD = 30
    RECENCY_DAYS = 30

    def initialize(tags:)
        @tags = tags
    end

    def call
        selected_tags = select_random_tags
        language_query = build_language_query(selected_tags)

        "#{language_query} stars:>=#{STARS_THRESHOLD} pushed:>=#{RECENCY_DAYS.days.ago.to_date}"
    end

    private

    attr_reader :tags

    def select_random_tags
        return [] if tags.empty?
        sample_size = tags.size >= 3 ? [ 2, 3 ].sample : tags.size
        tags.sample(sample_size)
    end

    def build_language_query(select_random_tags)
        selected_tags.map { |tag| "language:#{tag}" }.join(" ")
    end
end
