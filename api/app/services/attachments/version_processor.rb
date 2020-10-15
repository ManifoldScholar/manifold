require "image_processing/mini_magick"

module Attachments
  class VersionProcessor < ActiveInteraction::Base
    file :local_source
    file :attachment
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
        return false unless attachment.extension == "gif"

        image = MiniMagick::Image.new(local_source.path)
        return false unless image.type == "GIF"
        return false unless image.pages&.length&.positive?

        true
      end
    end

    def process_animated_gif
      image = ImageProcessing::MiniMagick.apply(animated_gif_config)
      image << "+repage"
      image.call(local_source)
    end

    def process_image
      ImageProcessing::MiniMagick.apply(config).loader(page: 0).call(local_source)
    end

  end
end
