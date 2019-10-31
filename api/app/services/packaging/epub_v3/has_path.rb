module Packaging
  module EpubV3
    # Shared methods for epub dependents that implement `#path`.
    module HasPath
      extend ActiveSupport::Concern

      included do
        memoize :base_path
        memoize :path
      end

      # @api private
      # @see #normalize_path_for_gepub
      EPUB_PREFIX = %r{epub/?}.freeze

      # @api private
      # @see #normalize_path_for_gepub
      INITIAL_SLASH = %r{\A/}.freeze

      # @!attribute [r] base_path
      # @see #build_base_path
      # @note Gets memoized
      # @return [String]
      def base_path
        build_base_path
      end

      # @!attribute [r] path
      # @return [String]
      def path
        normalize_path_for_gepub base_path
      end

      # @param [String] value
      # @return [String]
      def normalize_path_for_gepub(value)
        File.absolute_path(value.gsub(EPUB_PREFIX, ""), "/").gsub(INITIAL_SLASH, "")
      end

      # @!attribute [r] remapped_path
      # @note GEPUB builds things in a way that we need to use relative paths.
      # @return [String]
      def remapped_path
        File.join("..", path)
      end

      private

      # @abstract
      # @return [String]
      def build_base_path
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end
    end
  end
end
