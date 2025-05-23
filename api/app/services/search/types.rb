# frozen_string_literal: true

module Search
  module Types
    include Dry.Types

    KeywordSearchOptions = ::Types::Hash.map(::Types::Symbol, ::Types::Any)

    MultisearchOptions = ::Types::Hash.map(::Types::Symbol, ::Types::Any)
  end
end
