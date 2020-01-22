module V1
  class TagSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :name, Types::String
    typed_attribute :taggings_count, Types::Integer

  end
end
