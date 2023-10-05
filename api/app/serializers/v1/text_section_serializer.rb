module V1
  class TextSectionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :text_slug, Types::String
    typed_attribute :text_title, Types::String
    typed_attribute :name, Types::String.optional
    typed_attribute :social_image, Types::Serializer::URL.optional
    typed_attribute :source_identifier, Types::String.optional
    typed_attribute :kind, Types::String.meta(example: "section")
    typed_attribute :slug, Types::String
    typed_attribute :hidden_in_reader, Types::Bool

    typed_belongs_to :text
    typed_has_many :stylesheets

    when_full do
      typed_attribute :body_json, Types::Hash.schema(
        tag: Types::String.meta(example: "div"),
        children: Types::Array.of(Types::Hash).meta(
          description: "A JSON representation of the text section's HTML contents"
        )
      )
      typed_attribute :body, Types::String.optional
      typed_attribute :citations, Types::Serializer::Citations
    end

  end
end
