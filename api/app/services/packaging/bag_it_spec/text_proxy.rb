module Packaging
  module BagItSpec
    # A wrapper around a {Text} and its current {TextExport} that represents
    # their usages within the context of BagIt archiving.
    class TextProxy
      extend Dry::Initializer
      extend Memoist

      include Packaging::BagItSpec::BuildsEntries

      param :text, Types.Instance(Text)
      param :text_export, Types.Instance(TextExport)

      delegate :cover_original, to: :text
      delegate :asset, to: :text_export
      delegate :content_type, to: :cover_original, prefix: :cover, allow_nil: true

      # The path to the cover asset on the filesystem, {#has_cover? if present}.
      #
      # @return [String]
      def cover_asset
        cover_original if has_cover?
      end

      # @!attribute [r] cover_name
      #
      # The filename to use with the cover file, {#has_cover? if present}.
      #
      # @return [String]
      memoize def cover_name
        Utility::EnsureExtension.run! filename: "cover", content_type: cover_content_type if has_cover?
      end

      # @!attribute [r] cover_path
      #
      # The relative path for the epub cover.
      #
      # @return [String]
      memoize def cover_path
        path_to cover_name
      end

      # @!attribute [r] epub_name
      #
      # The filename to use for epubs
      #
      # @return [String]
      def epub_name
        "#{text.slug}.epub"
      end

      # @!attribute [r] epub_path
      #
      # The relative path for the epub within the bagit archive.
      #
      # @return [String]
      memoize def epub_path
        path_to epub_name
      end

      # @!attribute [r] metadata_path
      #
      # The relative path for the text metdata within the bagit archive.
      #
      # @return [String]
      memoize def metadata_path
        path_to "metadata.json"
      end

      # @!attribute [r] metadata
      # @return [ActiveSupport::HashWithIndifferentAccess]
      memoize def metadata
        text.packaging_metadata
      end

      # {Text#cover} is an optional attachment and may not always be present.
      # Make sure we have one before attempting to add it or do any processing.
      def has_cover?
        cover_original.present?
      end

      private

      # @param [<String>] parts
      # @return [String] a relative path to the provided path `parts`.
      def path_to(*parts)
        text_root.join(*parts).to_s
      end

      # @!attribute [r] text_root
      # @api private
      # @return [Pathname] the relative root for a given text
      memoize def text_root
        Pathname.new("texts/#{text.slug}")
      end

      def build_entries(builder)
        builder.attachment! :cover, cover_path, cover_asset if has_cover?
        builder.attachment! :epub, epub_path, asset
        builder.json! :metadata, metadata_path, metadata

        builder.extract_maker_avatar_entries_from! text, base: text_root
      end
    end
  end
end
