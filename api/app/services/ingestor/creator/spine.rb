module Ingestor
  module Creator
    # Determines the order of text sections in a text
    #
    # @author Max Ono
    # rubocop:disable LineLength
    class Spine < AbstractCreator

      def create(inspector)
        spine_source_ids = inspector.spine_source_ids
        spine_source_ids = spine_source_ids
                           .map { |id| @text.text_sections.find_by(source_identifier: id) }
                           .pluck(:id)
        report(spine_source_ids)
        spine_source_ids
      end

      private

      def report(spine_source_ids)
        if spine_source_ids.count.positive?
          info "services.ingestor.creator.log.spine_populated", number: spine_source_ids.count
        else
          info "services.ingestor.creator.log.spine_empty"
        end
      end
    end
    # rubocop:enable LineLength
  end
end
