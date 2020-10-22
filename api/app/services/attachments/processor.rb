module Attachments
  class Processor < ActiveInteraction::Base
    file :upload
    interface :model
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

    def local_source
      @local_source ||= upload.respond_to?(:download) ? upload.download.open : upload.open
    end

    def process_versions!
      styles.map do |key, value|
        version = process_version value
        versions[key] = version unless version.nil?
      end
    end

    def process_version(config)
      compose VersionProcessor, config: config, local_source: local_source, attachment: upload
    end

    def styles
      compose StyleConfigurer, inputs.merge(config: CONFIG)
    end

    def can_process?
      return false if upload.size > 200_000_000

      image? || pdf?
    end

    # rubocop:disable Lint/Void
    # rubocop:disable Metrics/AbcSize
    def image?
      return false unless upload&.mime_type && upload&.extension

      !upload.mime_type.match(Regexp.union(CONFIG[:image][:allowed_mime])).nil?
      !upload.extension.match(Regexp.union(CONFIG[:image][:allowed_ext])).nil?
    end

    def pdf?
      return false unless upload&.mime_type && upload&.extension

      !upload.mime_type.match(Regexp.union(CONFIG[:pdf][:allowed_mime])).nil?
      !upload.extension.match(Regexp.union(CONFIG[:pdf][:allowed_ext])).nil?
    end
    # rubocop:enable Lint/Void
    # rubocop:enable Metrics/AbcSize

  end
end
