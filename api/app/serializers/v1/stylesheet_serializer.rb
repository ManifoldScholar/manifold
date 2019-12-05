module V1
  class StylesheetSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :name, NilClass
    typed_attribute :source_identifier, NilClass
    typed_attribute :styles, NilClass
    typed_attribute :ingested, NilClass
    typed_attribute :position, NilClass
    typed_attribute :created_at, NilClass

    when_full do
      typed_attribute :raw_styles, NilClass

      typed_belongs_to :text
      typed_has_many :text_sections
    end

  end
end
