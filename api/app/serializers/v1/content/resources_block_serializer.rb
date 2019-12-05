module V1
  module Content
    class ResourcesBlockSerializer < ContentBlockSerializer
      # TODO: Address these dynamic attributes
      attributes(*::Content::ResourcesBlock.available_attributes)
    end
  end
end
