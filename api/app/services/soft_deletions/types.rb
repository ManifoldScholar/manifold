# frozen_string_literal: true

module SoftDeletions
  module Types
    include Dry.Types

    SoftDeletable = Types.Instance(::SoftDeletable)
  end
end
