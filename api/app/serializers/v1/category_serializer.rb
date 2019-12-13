module V1
  class CategorySerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities
    typed_attribute :title, Types::String
    typed_attribute :position, Types::Integer

  end
end
