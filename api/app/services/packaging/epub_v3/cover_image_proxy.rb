module Packaging
  module EpubV3
    # @see Packaging::EpubV3::ConvertCoverImage
    class CoverImageProxy
      extend Dry::Initializer
      extend Memoist

      param :file, Types.Instance(File) | Types.Instance(Tempfile)
      param :content_type, Types::Strict::String

      # @!attribute [r] path
      # @return [String]
      memoize def path
        Utility::EnsureExtension.run! filename: "meta/cover", content_type: content_type
      end
    end
  end
end
