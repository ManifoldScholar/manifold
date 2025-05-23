# frozen_string_literal: true

module Search
  # Rebuild a single {SearchIndexable} multisearchable class.
  #
  # @see Search::RebuildAll
  class Rebuild
    include Dry::Monads[:result]

    # @param [Class<SearchIndexable>] klass
    # @return [Dry::Monads::Success(Integer)]
    def call(klass)
      existing_scope = PgSearch::Document.where(searchable_type: klass.model_name.to_s)

      prev = existing_scope.count

      PgSearch::Multisearch.rebuild(klass)

      curr = existing_scope.count

      diff = curr - prev

      Success diff
    end
  end
end
