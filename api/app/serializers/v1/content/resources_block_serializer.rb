module V1
  module Content
    class ResourcesBlockSerializer < ContentBlockSerializer
      attributes(*::Content::ResourcesBlock.available_attributes)
    end
  end
end
