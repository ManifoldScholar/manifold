module Content
  class ResourcesBlockSerializer < ::ContentBlockSerializer
    attributes :show_collections

    has_many :featured_collections
  end
end
