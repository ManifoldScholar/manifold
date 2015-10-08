require 'naught'
require 'pathname'
require 'uri'

module Ingestor
  module Strategy
    module EPUB3
      module Helper
        class URI

          # Path is the URI we're making absolute
          # Source_doc is the path of the document that the relative link appears in
          def self.to_absolute_package_path(path, source_doc_path)
            uri = URI(path)
            if uri.absolute?
              return path[1..-1]
            else
              abs_package_path = File.expand_path('/' + File.dirname(source_doc_path) + '/' + uri.path)[1..-1]
              return abs_package_path
            end
          end

          def self.map_uri(target_uri, map, relative_to = nil)
            uri = URI(target_uri)
            if !uri.scheme
              if uri.relative?
                if relative_to
                  input_path = self.to_absolute_package_path(target_uri, relative_to)
                end
                else input_path = target_uri
              end

              if map.has_key? input_path
                new_path = URI(map[input_path]).path
                uri.path = new_path
                s = uri.to_s
                return s
              end
            end
            uri.to_s
          end

        end
      end
    end
  end
end
