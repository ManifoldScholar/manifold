module Attachments
  class Processor < ActiveInteraction::Base
    object :shrine_uploaded_file, class: Object
    file :file_resource
    object :model, class: Object
    hash :attachment_options do
      symbol :type
      boolean :no_styles, :validate_content_type
    end

    CONFIG = Rails.configuration.manifold.attachments.validations

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
      compose StyleConfigurer, inputs.merge(config: CONFIG)
    end

    def can_process?
      return false if file_resource.size > 200_000_000

      image? || pdf?
    end

    def mime_and_extension?
      shrine_uploaded_file&.mime_type && shrine_uploaded_file&.extension
    end

    # rubocop:disable Lint/Void
    def image?
      return false unless mime_and_extension?

      !shrine_uploaded_file.mime_type.match(Regexp.union(CONFIG[:image][:allowed_mime])).nil?
      !shrine_uploaded_file.extension.match(Regexp.union(CONFIG[:image][:allowed_ext])).nil?
    end

    def pdf?
      return false unless mime_and_extension?

      !shrine_uploaded_file.mime_type.match(Regexp.union(CONFIG[:pdf][:allowed_mime])).nil?
      !shrine_uploaded_file.extension.match(Regexp.union(CONFIG[:pdf][:allowed_ext])).nil?
    end
    # rubocop:enable Lint/Void
  end
end
