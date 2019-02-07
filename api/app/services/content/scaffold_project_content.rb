module Content
  class ScaffoldProjectContent < ActiveInteraction::Base
    object :project

    def execute
      scaffold_content
    end

    private

    def scaffold_content
      create_block("Content::RecentActivityBlock", 1)
      create_block("Content::TextsBlock", 2)
      create_block("Content::ResourcesBlock", 3)
      create_block("Content::MetadataBlock", 4)
    end

    def create_block(type, position)
      return if project.content_blocks.where(type: type).present?

      project.content_blocks.create(type: type, position: position)
    end
  end
end
