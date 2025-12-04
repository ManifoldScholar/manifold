# frozen_string_literal: true

module Search
  # Types for dealing with searching.
  module Types
    include Dry.Types

    # A list of acceptable facets.
    # @see Search::Faceter
    FACETS = %w[
      Annotation
      Journal
      Project
      Resource
      Text
      TextSection
    ].freeze

    # @see FACETS
    # @see Search::Faceter
    Facet = String.enum(*FACETS)

    # @api private
    SafeFacet = Facet.optional.fallback(nil)

    # @see FACETS
    # @see Search::Faceter
    Facets = Coercible::Array.of(Facet).constructor do |value|
      ::Kernel.Array(value).map { SafeFacet[_1] }.compact.uniq.sort
    end

    KeywordSearchOptions = ::Types::Hash.map(::Types::Symbol, ::Types::Any)

    MultisearchOptions = ::Types::Hash.map(::Types::Symbol, ::Types::Any)
  end
end
