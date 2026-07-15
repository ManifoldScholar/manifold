# frozen_string_literal: true

module Ingestions
  # Base for ingestors that build an {Ingestions::Context}, run their ingestion,
  # and guarantee that context (and every tempfile it owns) is torn down
  # afterward, on both the success and failure paths.
  #
  # Subclasses implement {#run_ingestion} with the ingestion body and return the
  # resulting record.
  #
  # @abstract
  class AbstractContextualIngestor < AbstractBaseInteraction
    record :ingestion
    object :logger, default: nil

    def execute
      @context = shared_inputs[:context] = build_context

      report_start

      run_ingestion
    ensure
      @context&.teardown
    end

    private

    # @abstract
    # @return [ApplicationRecord, nil]
    def run_ingestion
      raise NotImplementedError, "Must implement #{self.class}##{__method__}"
    end

    def build_context
      Ingestions::Context.new(ingestion, logger)
    end

    def report_start
      @context.info "services.ingestions.logging.ingestion_start",
                    name: @context.basename
    end
  end
end
