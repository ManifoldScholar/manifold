require "image_processing/mini_magick"

module Attachments
  class VersionProcessor < ActiveInteraction::Base
    file :file_resource
    object :shrine_uploaded_file, class: Object
    hash :config, strip: false

    def execute
      return process_animated_gif if animated_gif?

      process_image
    rescue ImageProcessing::Error
      nil
    end

    protected

    def animated_gif_config
      # The order matters here. Coalesce and repage must come before resize, or the
      # resize operation will not work as expected.
      { coalesce: true, repage: "0x0" }.merge(config.except("convert"))
    end

    def animated_gif?
      @animated_gif ||= begin
        return false unless shrine_uploaded_file.extension == "gif"

        image = MiniMagick::Image.new(file_resource.path)
        return false unless image.type == "GIF"
        return false unless image.pages&.length&.positive?

        true
      end
    end

    def process_animated_gif
      image = ImageProcessing::MiniMagick.apply(animated_gif_config)
      image << "+repage"
      image.call(file_resource)
    end

    def process_image
      ImageProcessing::MiniMagick.apply(config).loader(page: 0).call(file_resource)
    end

  end
end
