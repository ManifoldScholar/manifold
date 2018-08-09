module Ingestions
  module PostProcessors
    class Spine < AbstractInteraction
      hash :manifest, strip: false
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
        identifiers = manifest[:relationships][:text_sections].map do |ts|
          ts[:source_identifier]
        end

        text.text_sections
            .where(source_identifier: identifiers)
            .order(position: :asc)
            .pluck(:id)
      end
    end
  end
end
