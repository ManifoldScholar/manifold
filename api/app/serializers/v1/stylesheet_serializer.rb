module V1
  class StylesheetSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :name, Types::String
    typed_attribute :source_identifier, Types::String.optional.meta(read_only: true)
    typed_attribute :styles, Types::String.optional.meta(
      read_only: true,
      description: "Validated, scoped, and transformed styles that will be "\
      "applied in the reader."
    )
    typed_attribute :ingested, Types::Bool.meta(read_only: true)
    typed_attribute :position, Types::Integer
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :applies_to_all_text_sections, Types::Bool

    when_full do
      typed_attribute :raw_styles, Types::String.optional.meta(
        example: ".class-selector { background: black }",
        description: "CSS styles and selectors for your custom stylesheet"
      )

      typed_belongs_to :text
      typed_has_many :text_sections
    end

  end
end
