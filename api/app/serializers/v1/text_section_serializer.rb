module V1
  class TextSectionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :text_slug, NilClass
    typed_attribute :text_title, NilClass
    typed_attribute :name, NilClass
    typed_attribute :social_image, NilClass
    typed_attribute :source_identifier, NilClass
    typed_attribute :kind, NilClass

    typed_belongs_to :text
    typed_has_many :stylesheets

    when_full do
      typed_attribute :body_json, Types::Hash
      typed_attribute :citations, Types::Hash
    end

  end
end
