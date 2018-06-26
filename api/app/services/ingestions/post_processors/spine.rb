module Ingestions
  module PostProcessors
    class Spine < AbstractInteraction
      object :text

      def execute
        update_text_spine
      end

      private

      def update_text_spine
        text.update spine: build_spine
      end

      def build_spine
        text.text_sections.order(position: :asc).pluck(:id)
      end
    end
  end
end
