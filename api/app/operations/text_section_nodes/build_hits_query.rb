# frozen_string_literal: true

module TextSectionNodes
  # @see TextSectionNodes::HitsQueryBuilder
  class BuildHitsQuery
    # @return [Dry::Monads::Result]
    def call(...)
      TextSectionNodes::HitsQueryBuilder.new(...).call
    end
  end
end
