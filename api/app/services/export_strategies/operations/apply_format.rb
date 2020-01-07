module ExportStrategies
  module Operations
    # @see ExportStrategies::TargetNameFormatter#apply_format
    class ApplyFormat
      include Shared::PipelineOperation

      # @param [ExportStrategies::TargetNameFormatter] formatter
      # @param [String] format
      # @return [Dry::Monads::Result::Success(String)]
      # @return [Dry::Monads::Result::Failure((:invalid_format, String))]
      def call(formatter, format: "%s.%e")
        formatter.apply_format format
      end
    end
  end
end
