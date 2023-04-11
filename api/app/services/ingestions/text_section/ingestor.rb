# This class takes an Ingestion record and
# returns a new TextSection record.
module Ingestions
  module TextSection
    class Ingestor < Ingestions::AbstractBaseInteraction
      record :ingestion
      record :text
      object :logger, default: nil

      # rubocop:disable Metrics/AbcSize
      def execute
        @context = shared_inputs[:context] = build_context

        report_start

        strategy = compose Ingestions::Pickers::Strategy

        set_ingestion_text

        compose_into :manifest, strategy.interaction
        compose_into :manifest, Ingestions::TextSection::PreProcessor
        shared_inputs[:manifest][:section_ingestion] = true

        ActiveRecord::Base.transaction do
          compose_into :text_section, Ingestions::TextSection::Compiler, text_section_id: ingestion.text_section&.id

          text.reload

          compose Ingestions::TextSection::PostProcessor

          set_ingestion_text_section
        end

        text_section
      end
      # rubocop:enable Metrics/AbcSize

      private

      def build_context
        Ingestions::Context.new(ingestion, logger)
      end

      def text_section
        shared_inputs[:text_section]
      end

      def report_start
        @context.info "services.ingestions.logging.ingestion_start",
                      name: @context.basename
      end

      def set_ingestion_text
        return unless text.present?

        ingestion.update text: text
      end

      def set_ingestion_text_section
        return unless text_section.present?

        ingestion.update text_section: text_section
      end

      # Removes temporary dir
      def clean_up
        @context.teardown
      end
    end
  end
end
