module Attachments
  class StyleConfigurer < ActiveInteraction::Base
    object :shrine_uploaded_file, class: Object
    object :model, class: Object
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
      return model.manifold_favicon_styles if favicon?
      return model.manifold_attachment_alpha_styles if alpha_channel?

      model.manifold_attachment_image_styles
    end

    def favicon?
      attachment_options[:type] == :favicon
    end

    def alpha_channel?
      pdf? || shrine_uploaded_file.extension == "png" || shrine_uploaded_file.extension == "gif"
    end

    # rubocop:disable Lint/Void
    def pdf?
      !shrine_uploaded_file.mime_type.match(Regexp.union(CONFIG[:pdf][:allowed_mime])).nil?
      !shrine_uploaded_file.extension.match(Regexp.union(CONFIG[:pdf][:allowed_ext])).nil?
    end
    # rubocop:enable Lint/Void

  end
end
