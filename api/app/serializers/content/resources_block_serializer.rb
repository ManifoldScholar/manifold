module Content
  class ResourcesBlockSerializer < ::ContentBlockSerializer
    attributes :resources_count

    has_many :featured_resources
    has_many :featured_collections
  end
end
