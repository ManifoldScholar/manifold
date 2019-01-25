module Content
  class ResourcesBlockSerializer < ::ContentBlockSerializer
    attributes Content::ResourcesBlock.available_attributes

    has_many :featured_collections
  end
end
