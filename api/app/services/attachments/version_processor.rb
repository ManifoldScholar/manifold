require "image_processing/mini_magick"

module Attachments
  class VersionProcessor < ActiveInteraction::Base
    file :source
    hash :config, strip: false

    def execute
      ImageProcessing::MiniMagick.apply(config).call(source.open)
    end
  end
end
