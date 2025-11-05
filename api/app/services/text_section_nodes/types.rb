# frozen_string_literal: true

module TextSectionNodes
  module Types
    include Dry.Types

    include Dry::Core::Constants

    TextSectionIDs = Array.of(Coercible::String).default(EMPTY_ARRAY).fallback(EMPTY_ARRAY)
  end
end
