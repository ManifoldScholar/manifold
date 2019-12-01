module V1
  class TagSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    attributes :name,
               :taggings_count
  end
end
