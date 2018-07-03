module Ingestions
  module PostProcessors
    class Spine < AbstractInteraction
      object :text

      def execute
        update_text_spine
        report
      end

      private

      def report
        count = text.spine.length
        if count.positive?
          info "services.ingestions.post_processor.log.spine_populated",
               number: count
        else
          info "services.ingestions.post_processor.log.spine_empty"
        end
      end

      def update_text_spine
        text.update spine: build_spine
      end

      def build_spine
        text.text_sections.order(position: :asc).pluck(:id)
      end
    end
  end
end
