# This class takes an Ingestion record and
# returns a new Text record.
module Ingestions
  class Ingestor < AbstractInteraction
    record :ingestion
    object :logger, default: nil

    set_callback :execute, :before, :report_start
    set_callback :execute, :after, :set_ingestion_text, :report_end

    def execute
      strategy = compose Ingestions::Pickers::Strategy

      compose_into :manifest, strategy.interaction

      compose_into :text, Ingestions::Compiler

      compose Ingestions::PostProcessor
    end

    def context
      @context ||= Ingestions::Context.new ingestion,
                                           logger
    end

    private

    def text
      shared_inputs[:text]
    end

    def report_start
      info "services.ingestions.logging.ingestion_start",
           name: context.basename
    end

    def report_end
      info "services.ingestions.logging.ingestion_end"
    end

    def set_ingestion_text
      return unless text.present?
      ingestion.update text: text
    end

    # Removes temporary dir
    def clean_up
      context.teardown
    end

    def shared_inputs
      @shared_inputs ||= {}.merge(inputs)
                           .merge(context: context)
    end
  end
end
