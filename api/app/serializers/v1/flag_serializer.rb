# frozen_string_literal: true

module V1
  class FlagSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :resolved_at, Types::DateTime.meta(read_only: true)
    typed_attribute :resolved, Types::Bool.meta(read_only: true)
    typed_attribute :resolved_by_creator, Types::Bool.meta(read_only: true)
    typed_attribute :message, Types::String.optional.meta(read_only: true)

    typed_belongs_to :creator,
                     record_type: :user,
                     serializer: ::V1::UserSerializer
  end
end
