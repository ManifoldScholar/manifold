module Ingestions
  module Strategies
    # @abstract
    class AbstractStrategy < Ingestions::AbstractInteraction
      define_model_callbacks :ingestibility_check, :perform

      boolean :test_only, default: false

      set_callback :perform, :before, -> { context.set_used_strategy! self.class.name }
      set_callback :perform, :before, :report_strategy

      def execute
        run_callbacks :ingestibility_check do
          @ingestible = determine_ingestibility
        end

        return ingestible? if test_only
        return nil unless ingestible?

        run_callbacks :perform do
          @manifest = perform
        end

        @manifest
      end

      def ingestible?
        @ingestible
      end

      attr_reader :manifest

      # @abstract
      # @return [Boolean]
      def determine_ingestibility
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end

      # @return [Manifest]
      def perform
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end

      # @api private
      # @abstract
      # @return [Class]
      def inspector
        @inspector ||= inspector_klass.new context
      end

      def inspector_klass
        "Ingestions::Strategy::#{strategy_name}::Inspector".constantize
      end

      private

      def report_strategy
        info "services.ingestions.logging.using_strategy",
             strategy: strategy_name
      end

      def strategy_name
        self.class.name.demodulize
      end
    end
  end
end
