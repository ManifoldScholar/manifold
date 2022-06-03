module FormattedAttributes
  class PurgeLegacyCachesJob < ApplicationJob
    queue_as :default

    PATTERNS = %w[
      */plaintext/*
      */formatted/*
    ].freeze

    # @return [void]
    def perform
      redis = Redis.new

      PATTERNS.each do |pattern|
        cursor = 0

        loop do
          cursor, keys = redis.scan cursor, match: pattern

          redis.del *keys if keys.any?

          break if cursor == "0"
        end
      end
    end
  end
end
