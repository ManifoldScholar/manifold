# This class takes an Ingestion record and
# returns a new Text record.
module Ingestions
  class Ingestor < AbstractBaseInteraction
    record :ingestion
    object :logger, default: nil

    define_model_callbacks :initialize_context, :post_process

    def execute
      @context = shared_inputs[:context] = build_context

      report_start

      strategy = compose Ingestions::Pickers::Strategy

      compose_into :manifest, strategy.interaction

      compose_into :text, Ingestions::Compiler

      compose Ingestions::PostProcessor

      text
    end

    private

    def build_context
      Ingestions::Context.new(ingestion, logger) do |context|
        fetched = compose Ingestions::Fetcher, context.to_fetcher_inputs if context.url?

        context.source = fetched
      end
    end

    def text
      shared_inputs[:text]
    end

    def report_start
      @context.info "services.ingestions.logging.ingestion_start",
                    name: @context.basename
    end

    def report_end
      @context.info "services.ingestions.logging.ingestion_end"
    end

    def set_ingestion_text
      return unless text.present?
      ingestion.update text: text
    end

    # Removes temporary dir
    def clean_up
      @context.teardown
    end

    def shared_inputs
      @shared_inputs ||= {}.merge(inputs)
    end
  end
end
