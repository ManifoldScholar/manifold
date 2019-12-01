module V1
  class StylesheetSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    make_partial_by_default

    attributes :name,
               :source_identifier,
               :styles,
               :ingested,
               :position,
               :created_at

    full_attributes :raw_styles

    full_belongs_to :text
    full_has_many :text_sections

  end
end
