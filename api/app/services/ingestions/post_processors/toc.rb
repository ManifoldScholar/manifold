module Ingestions
  module PostProcessors
    class TOC < AbstractInteraction
      object :text

      def execute
        update_toc
        report
      end

      private

      def report
        count = text.toc.length
        if count.positive?
          log_structure text.toc, "TOC:"
        else
          info "services.ingestions.post_processor.log.toc_empty"
        end
      end

      def update_toc
        text.update toc: transform_toc
      end

      def transform_toc
        branch_convert text.toc.clone
      end

      def branch_convert(branch)
        branch.each do |leaf|
          if leaf[:source_path]
            source_path, _hash, anchor = leaf[:source_path].partition("#")
            ts = text.find_text_section_by_source_path(source_path)
            next unless ts.present?

            leaf[:id] = ts.id
            leaf[:anchor] = anchor if anchor.present?
            leaf.delete(:source_path)
          end
          branch_convert(leaf[:children]) if leaf[:children]
        end
      end

    end
  end
end
