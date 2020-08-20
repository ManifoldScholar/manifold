module Packaging
  module EpubV3
    # For best support, cover images must be `image/jpeg` or `image/png`. Though many may be
    # `image/svg+xml`, this is not widely supported by all EpubV3 readers (including iBooks, Calibre).
    class ConvertCoverImage < ActiveInteraction::Base
      include MonadicInteraction

      # @api private
      ACCEPTABLE_CONTENT_TYPES = %w[image/jpeg image/png].freeze

      # @api private
      PNG_CONTENT_TYPE = "image/png".freeze

      object :uploaded_file, class: "Shrine::UploadedFile"

      delegate :content_type, to: :uploaded_file

      validate :must_be_image!

      # @return [Packaging::EpubV3::CoverImageProxy]
      def execute
        Packaging::EpubV3::CoverImageProxy.new *maybe_convert
      end

      private

      # @return [(File, String)]
      # @return [(Tempfile, String)]
      def maybe_convert
        file_reference = uploaded_file.to_io

        return [file_reference, content_type] if content_type.in? ACCEPTABLE_CONTENT_TYPES

        [
          ImageProcessing::MiniMagick.convert("png").(file_reference),
          PNG_CONTENT_TYPE
        ]
      end

      # @return [void]
      def must_be_image!
        return if content_type.starts_with? "image/"

        errors.add :uploaded_file, "must have an image/* content_type"
      end
    end
  end
end
