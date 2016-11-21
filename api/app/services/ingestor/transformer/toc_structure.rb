require "memoist"
require "naught"

module Ingestor
  module Transformer
    # This class is responsible for transforming the text structure returned
    # by the TOC Inspector. The TOC Inspector extracts the three supported
    # EPUB navigation types: table of contents, page list, and landmarks.
    # These navigation nodes typically link to internal EPUB URLs. The role
    # of the TOCStructure Transformer is to recursively crawl through these
    # navigation structures and generate navigation structures based on text
    # section IDs, rather then on internal EPUB source paths.
    #
    # @author Zach Davis
    class TOCStructure
      # Transforms text structure hash with internal EPUB links into a text
      # structure with links via text section model IDs
      #
      # @param [Hash] text_structure The text structure hash is a hash that
      #   has three symbol keys: <tt>:toc</tt>, <tt>:page_list</tt>, <tt>
      #   :landmarks</tt>. The easiest way to get this hash is from
      #   Ingestor::Strategy::EPUB::Inspector::TOC#text_structure.
      # @param [Text] text A Manifold Text model with text sections already
      #   added. It's important that the ingestor has already ingested
      #   TextSections and added them to the Text model.
      # @see Ingestor::Strategy::EPUB::Inspector::TOC#text_structure
      def self.transform(structure, text)
        branch_convert(structure.clone, text)
      end

      def self.branch_convert(branch, text)
        branch.each do |leaf|
          if leaf[:source_path]
            ts = text.find_text_section_by_source_path(leaf[:source_path])
            if ts
              leaf[:id] = ts.id
              leaf.delete(:source_path)
            end
          end
          branch_convert(leaf[:children], text) if leaf[:children]
        end
      end
      private_class_method :branch_convert
    end
  end
end
