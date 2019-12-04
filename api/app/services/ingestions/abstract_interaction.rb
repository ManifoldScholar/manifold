module Ingestions
  # @abstract
  class AbstractInteraction < AbstractBaseInteraction
    object :context, class: "Ingestions::Context"

    set_callback :execute, :around, :catch_validation_errors!

    delegate :ingestion, to: :context

    delegate :significant, to: :context
    delegate :info, to: :context
    delegate :debug_string, to: :context
    delegate :debug, to: :context
    delegate :error, to: :context
    delegate :error_string, to: :context
    delegate :warn, to: :context
    delegate :log_structure, to: :context

    # @api private
    # @note An `around` callback for execution that catches `ActiveRecord::RecordInvalid` exceptions
    # @raise [Ingestions::IngestionError] on validation failure
    # @return [void]
    def catch_validation_errors!
      yield if block_given?
    rescue ActiveRecord::RecordInvalid => e
      raise ::Ingestions::IngestionError, "Validation error: #{e.message}"
    end
  end
end
