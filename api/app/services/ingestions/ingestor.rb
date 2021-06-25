# This class takes an Ingestion record and
# returns a new Text record.
module Ingestions
  class Ingestor < AbstractBaseInteraction
    record :ingestion
    object :logger, default: nil

    def execute
      @context = shared_inputs[:context] = build_context

      report_start

      strategy = compose Ingestions::Pickers::Strategy

      compose_into :manifest, strategy.interaction
      compose_into :manifest, Ingestions::PreProcessor

      ActiveRecord::Base.transaction do
        compose_into :text, Ingestions::Compiler

        compose Ingestions::PostProcessor

        set_ingestion_text
      end

      text
    end

    private

    def build_context
      Ingestions::Context.new(ingestion, logger)
    end

    def text
      shared_inputs[:text]
    end

    def report_start
      @context.info "services.ingestions.logging.ingestion_start",
                    name: @context.basename
    end

    def set_ingestion_text
      return unless text.present?

      ingestion.update text: text
    end

    # Removes temporary dir
    def clean_up
      @context.teardown
    end
  end
end
