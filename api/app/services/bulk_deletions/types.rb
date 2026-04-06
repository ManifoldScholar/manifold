# frozen_string_literal: true

module BulkDeletions
  module Types
    include Dry.Types

    include Dry::Core::Constants

    Filters = Filtering::Types::Params

    IDList = Coercible::Array.of(Coercible::String)

    User = Instance(::User)
  end
end
