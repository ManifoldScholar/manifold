module Attachments
  class StyleConfigurer < ActiveInteraction::Base
    file :upload
    interface :model
    hash :attachment_options do
      symbol :type
      boolean :no_styles, :validate_content_type
    end
    hash :config, strip: false

    def execute
      style_configuration
    end

    private

    def style_configuration
      return {} if attachment_options[:no_styles]
      return model.manifold_attachment_alpha_styles if alpha_channel?
      model.manifold_attachment_image_styles
    end

    def alpha_channel?
      pdf? || upload.extension == "png" || upload.extension == "gif"
    end

    # rubocop:disable Metrics/AbcSize, Lint/Void
    def pdf?
      !upload.mime_type.match(Regexp.union(CONFIG[:pdf][:allowed_mime])).nil?
      !upload.extension.match(Regexp.union(CONFIG[:pdf][:allowed_ext])).nil?
    end
    # rubocop:enable Metrics/AbcSize, Lint/Void

  end
end
