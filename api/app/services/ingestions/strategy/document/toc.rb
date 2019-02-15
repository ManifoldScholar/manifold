module Ingestions
  module Strategy
    module Document
      class TOC

        def initialize(inspector)
          @context = inspector.context
          @inspector = inspector
        end

        def toc
          build_toc_from_headers
        end

        protected

        # Store this as its own instance because we remove nodes
        # from the copy as we go through it.
        def body_parsed
          @body_parsed ||= @inspector.index_parsed_uncached
        end

        def header_tag_depth(tag)
          header_tags.find_index(tag)
        end

        # rubocop:disable Metrics/AbcSize, Metrics/MethodLength,
        # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
        def build_toc_from_headers
          xpath = header_tags.map { |h| "//#{h}" }.join(" | ")
          headers = body_parsed.search(xpath)
          memo = []
          entries = []
          current_depth = 0
          last_entry_depth = nil
          last_unadjusted_entry_depth = nil
          headers.each do |header|
            next if header.text.strip.blank? # exclude blank headers.

            entry_depth = header_tag_depth(header.name)
            unadjusted_entry_depth = entry_depth
            entry = entry_for_header(header)
            entry_depth = (current_depth + 1) if entry_depth > current_depth
            entry_depth = current_depth if
              unadjusted_entry_depth == last_unadjusted_entry_depth
            entry_depth = 0 if last_entry_depth.nil?
            parent_depth = entry_depth - 1
            collection = if parent_depth != -1 && memo[parent_depth]
                           memo[parent_depth][:children]
                         else
                           entries
                         end
            collection << entry
            memo[entry_depth] = entry
            current_depth = entry_depth
            last_entry_depth = entry_depth
            last_unadjusted_entry_depth = unadjusted_entry_depth
          end
          entries
        end
        # rubocop:enable Metrics/AbcSize, Metrics/MethodLength,
        # rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

        def header_tags
          %w(h1 h2 h3 h4 h5 h6)
        end

        def entry_for_header(node)
          label = node.text.strip
          anchor = node["id"]
          {
            label: label,
            anchor: anchor,
            source_path: @inspector.index_source_path,
            children: []
          }
        end

      end
    end
  end
end
