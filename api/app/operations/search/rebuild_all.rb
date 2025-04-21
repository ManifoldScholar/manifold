# frozen_string_literal: true

module Search
  # Rebuild all {SearchIndexable} multisearchable classes.
  #
  # @see Search::Rebuild
  class RebuildAll
    include Dry::Monads[:result, :do]

    include ManifoldApi::Deps[rebuild: "search.rebuild"]

    MULTISEARCHABLE = [
      ::Project,
      ::Text,
      ::TextSection,
      ::Resource,
      ::Journal,
      ::Annotation
    ].freeze

    # @return [Dry::Monads::Success({ String => Integer })]
    def call
      results = MULTISEARCHABLE.to_h do |klass|
        diff = yield rebuild.(klass)

        [klass.search_result_type, diff]
      end

      Success results
    end
  end
end
