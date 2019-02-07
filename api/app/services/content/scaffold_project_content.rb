module Content
  class ScaffoldProjectContent < ActiveInteraction::Base
    string :kind, default: nil
    object :project

    def execute
      return unless project.persisted?
      return if project_content_exists?

      scaffold_content(configuration.content_blocks)
    end

    private

    def project_content_exists?
      project.content_blocks.any?
    end

    def configuration
      @configuration ||= Content::ScaffoldTemplate.new(kind)
    end

    def scaffold_content(types)
      types.each { |type, attrs| create_block type, attrs }
    end

    def create_block(type, attrs = {})
      project.content_blocks.create(type: type, **attrs.symbolize_keys)
    end
  end
end
