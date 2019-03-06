module Content
  class ScaffoldProjectContent < ActiveInteraction::Base
    string :kind, default: nil
    hash :configuration, default: nil do
      boolean :multiple_texts, default: false
      boolean :resources, default: false
      boolean :markdown, default: false
      boolean :recent_activity, default: false
    end
    object :project
    object :logger, default: nil

    def execute
      return unless project.persisted?
      return if project_content_exists?

      return unless blueprint.present?

      scaffold_content(blueprint.content_blocks)
    end

    private

    def project_content_exists?
      project.content_blocks.any?
    end

    def blueprint
      @blueprint ||= begin
        return Content::ScaffoldTemplate.new(kind) if kind.present?
        return Content::ScaffoldConfigured.new(configuration) if configuration.present?

        nil
      end
    end

    def scaffold_content(types)
      report("Creating content blocks for #{project.title} [#{project.id}]")

      types.each { |type, attrs| create_block type, attrs }
    end

    def create_block(type, attrs = {})
      project.content_blocks.create(type: type, **attrs.symbolize_keys)
      report("    Created #{type}")
    end

    def report(msg)
      return unless logger.present?

      logger.info msg
    end
  end
end
