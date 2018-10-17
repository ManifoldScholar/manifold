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
      @versions ||= { original: upload }
    end

    def process_versions!
      styles.map do |key, value|
        versions[key] = process_version value
      end
    end

    def process_version(config)
      compose VersionProcessor, config: config, source: upload
    end

    def styles
      compose StyleConfigurer, inputs.merge(config: CONFIG)
    end

    def can_process?
      return false if upload.size > 200_000_000
      image? || pdf?
    end

    # rubocop:disable Metrics/AbcSize, Lint/Void
    def image?
      !upload.mime_type.match(Regexp.union(CONFIG[:image][:allowed_mime])).nil?
      !upload.extension.match(Regexp.union(CONFIG[:image][:allowed_ext])).nil?
    end

    def pdf?
      !upload.mime_type.match(Regexp.union(CONFIG[:pdf][:allowed_mime])).nil?
      !upload.extension.match(Regexp.union(CONFIG[:pdf][:allowed_ext])).nil?
    end
    # rubocop:enable Metrics/AbcSize, Lint/Void

  end
end
