module V1
  module Content
    class ResourcesBlockSerializer < ContentBlockSerializer
      # TODO: Address these dynamic attributes
      attributes(*::Content::ResourcesBlock.available_attributes)

      typed_has_many :featured_collections, record_type: "resourceCollection"

    end
  end
end
