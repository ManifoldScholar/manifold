module Search
  # Enhancements related to using `elasticsearch-dsl`.
  module AdvancedDSL
    extend ActiveSupport::Concern

    # The analyzers used by searchkick.
    #
    # @see #each_analyzer
    ANALYZERS = %w[searchkick_search searchkick_search2].freeze

    # A tuple of the values in {ANALYZERS} along with `true` or `false`.
    #
    # @see #each_analyzer_and_fuzzy_value
    ANALYZER_FUZZIES = ANALYZERS.product([true, false]).freeze

    included do
      include Elasticsearch::DSL
    end

    # @param [<#to_hash>] queries
    # @return [Hash]
    def extracted_bool_should(*queries)
      queries.flatten!

      extracted_query do |q|
        q.bool do |b|
          queries.each do |query|
            b.should query
          end
        end
      end
    end

    # @return [{ Symbol => Object }]
    def extracted_query
      result = search do
        query(&Proc.new)
      end

      result.to_hash.fetch(:query)
    end

    # @param [Array] args
    # @return [{ Symbol => Object }]
    def extracted_match(*args)
      extracted_query do |q|
        q.match(*args, &Proc.new)
      end
    end

    # @param [Array] args
    # @return [{ Symbol => Object }]
    def extracted_match_phrase(*args)
      extracted_query do |q|
        q.match_phrase(*args, &Proc.new)
      end
    end

    # @yield [analyzer]
    # @yieldparam [String] analyzer
    # @yieldreturn [Object]
    # @return [<Object>]
    def each_analyzer
      ANALYZERS.map do |analyzer|
        yield analyzer
      end
    end

    # @yield [analyzer, is_fuzzy]
    # @yieldparam [String] analyzer
    # @yieldparam [Boolean] is_fuzzy
    # @yieldreturn [Object]
    # @return [<Object>]
    def each_analyzer_and_fuzzy_value
      ANALYZER_FUZZIES.map do |(analyzer, is_fuzzy)|
        yield analyzer, is_fuzzy
      end
    end
  end
end
