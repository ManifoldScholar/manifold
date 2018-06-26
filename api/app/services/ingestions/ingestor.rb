# This class takes an Ingestion record and
# returns a new Text record.
module Ingestions
  class Ingestor < AbstractInteraction
    record :ingestion

    def execute
      strategy = compose Ingestions::Pickers::Strategy

      compose_into :manifest, strategy.interaction

      compose_into :text, Ingestions::Compiler

      compose Ingestions::PostProcessor
    end

    def context
      @context ||= Ingestions::Context.new(ingestion)
    end

    private

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
