module V1
  module Content
    class ResourcesBlockSerializer < ContentBlockSerializer
      typed_attribute :title, Types::String
      typed_attribute :description, Types::String
      typed_attribute :show_all_collections, Types::Bool
      typed_attribute :show_descriptions, Types::Bool

      typed_has_many :featured_collections, record_type: "resourceCollection"
    end
  end
end
