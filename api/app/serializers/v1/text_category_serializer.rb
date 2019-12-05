module V1
  class TextCategorySerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities
    typed_attribute :id, NilClass
    typed_attribute :title, NilClass
    typed_attribute :position, NilClass

  end
end
