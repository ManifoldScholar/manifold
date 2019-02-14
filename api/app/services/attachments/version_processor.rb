require "image_processing/mini_magick"

module Attachments
  class VersionProcessor < ActiveInteraction::Base
    file :source
    hash :config, strip: false

    def execute
      ImageProcessing::MiniMagick.apply(config).loader(page: 0).call(source.open)
    rescue ImageProcessing::Error
      nil
    end
  end
end
