module Ingestions
  module PostProcessors
    class TOC < AbstractInteraction
      object :text

      def execute
        update_toc
      end

      private

      def update_toc
        text.update toc: transform_toc
      end

      def transform_toc
        branch_convert text.toc.clone
      end

      def branch_convert(branch)
        branch.each do |leaf|
          if leaf[:source_path]
            ts = text.find_text_section_by_source_path(leaf[:source_path])
            if ts
              leaf[:id] = ts.id
              leaf.delete(:source_path)
            end
          end
          branch_convert(leaf[:children]) if leaf[:children]
        end
      end
    end
  end
end
