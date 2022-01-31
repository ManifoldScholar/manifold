module V1
  class ActionCalloutSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :title, Types::String
    typed_attribute :kind, Types::String.enum("link", "read", "toc", "download")
    typed_attribute :location, Types::String.enum("left", "right")
    typed_attribute :visibility, Types::String.enum("always", "unauthorized", "authorized")
    typed_attribute :position, Types::Integer
    typed_attribute :url, Types::Serializer::URL
    typed_attribute :button, Types::Bool
    typed_attribute :attachment_styles, Types::Serializer::Attachment.meta(read_only: true)

    typed_belongs_to :calloutable
    typed_belongs_to :text
  end
end
