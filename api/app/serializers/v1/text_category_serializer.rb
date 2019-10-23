module V1
  class TextCategorySerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :title, Types::String
    typed_attribute :position, Types::Integer

  end
end
