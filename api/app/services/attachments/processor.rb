# frozen_string_literal: true

module Attachments
  class Processor < ActiveInteraction::Base
    object :shrine_uploaded_file, class: Object
    file :file_resource
    object :model, class: Object
    hash :attachment_options do
      symbol :type
      boolean :no_styles, :validate_content_type
    end

    def execute
      versions
      return versions unless can_process?

      process_versions!
      versions
    end

    private

    def versions
      @versions ||= {}
    end

    def process_versions!
      styles.map do |key, value|
        version = process_version value
        versions[key] = version unless version.nil?
      end
    end

    def process_version(config)
      compose VersionProcessor, config: config, file_resource: file_resource, shrine_uploaded_file: shrine_uploaded_file
    end

    def styles
      compose StyleConfigurer, inputs
    end

    def can_process?
      return false if file_resource.size > 200_000_000

      shrine_uploaded_file&.image? || shrine_uploaded_file&.pdf?
    end
  end
end
