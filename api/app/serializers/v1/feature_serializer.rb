module V1
  class FeatureSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :header, Types::String
    typed_attribute :header_formatted, Types::String.meta(read_only: true)
    typed_attribute :subheader, Types::String.optional
    typed_attribute :subheader_formatted, Types::String.optional.meta(read_only: true)
    typed_attribute :body, Types::String
    typed_attribute :body_formatted, Types::String.meta(read_only: true)
    typed_attribute :link_text, Types::String
    typed_attribute :link_url, Types::Serializer::URL
    typed_attribute :link_target, Types::String.optional.meta(
      description: "Where to display the linked URL. Additional information can be found "\
                   "<a href='https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target'>here</a>"
    )
    typed_attribute :style, Types::String.enum("dark", "light")
    typed_attribute :hidden, Types::Bool
    typed_attribute :background_color, Types::String.optional.meta(description: "Any valid CSS color (eg. 'blue' or '#e3e3e3'")
    typed_attribute :foreground_color, Types::String.optional.meta(description: "Any valid CSS color (eg. 'blue' or '#e3e3e3'")
    typed_attribute :header_color, Types::String.optional.meta(description: "Any valid CSS color (eg. 'blue' or '#e3e3e3'")
    typed_attribute :layout, Types::String.optional # TODO: Check type for this. It might not be used anymore.
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :foreground_top, Types::String.optional.meta(
      example: "1.9em",
      description: "Any valid CSS distance (eg. px, em, rem)"
    )
    typed_attribute :foreground_left, Types::String.optional.meta(
      example: "1.9em",
      description: "Any valid CSS distance (eg. px, em, rem)"
    )
    typed_attribute :foreground_position, Types::String.optional.meta(
      example: "absolute",
      description: "Position can be absolute or relative"
    )
    typed_attribute :position, Types::Integer
    typed_attribute :live, Types::Bool
    typed_attribute :include_sign_up, Types::Bool
    typed_attribute :foreground_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :background_styles, Types::Serializer::Attachment.meta(read_only: true)

  end
end
