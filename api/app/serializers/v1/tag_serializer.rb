module V1
  class TagSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :name, NilClass
    typed_attribute :taggings_count, NilClass

  end
end
