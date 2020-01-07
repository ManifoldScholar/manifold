module V1
  class MakerSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :first_name, Types::String.meta(description: "Requires at least one of these fields")
    typed_attribute :last_name, Types::String.meta(description: "Requires at least one of these fields")
    typed_attribute :middle_name, Types::String.optional
    typed_attribute :display_name, Types::String.optional
    typed_attribute :full_name, Types::String
    typed_attribute :suffix, Types::String.optional
    typed_attribute :prefix, Types::String.optional
    typed_attribute :avatar_styles, Types::Serializer::Attachment.meta(read_only: true)

  end
end
