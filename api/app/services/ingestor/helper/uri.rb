require "naught"
require "pathname"
require "uri"

module Ingestor
  module Helper
    # The URI helper class is responsible for mapping internal URIs in EPUBs to
    # manifold-friendly URIs
    #
    # @author Zach Davis
    # @todo: This class needs to be refactored to pass Rubocop linting.
    # rubocop:disable Metrics/MethodLength
    class URI
      # Path is the URI we're making absolute
      # Source_doc is the path of the document that the relative link appears in
      def self.to_absolute_package_path(path, source_doc_path)
        uri = URI(path)
        return uri.path[1..-1] if uri.absolute? || uri.path.start_with?("/")
        File.expand_path("/" + File.dirname(source_doc_path) + "/" + uri.path)[1..-1]
      end

      def self.map_uri(target_uri, map, relative_to = nil)
        uri = URI(target_uri)
        unless uri.scheme
          if uri.relative?
            input_path = to_absolute_package_path(target_uri, relative_to) if relative_to
          else input_path = target_uri
          end

          if map.key? input_path
            new_path = URI(map[input_path]).path
            uri.path = new_path
            s = uri.to_s
            return s
          end
        end
        uri.to_s
      end
    end
    # rubocop:enable Metrics/MethodLength
  end
end
