module ExportStrategies
  module Operations
    # Set the target name within the state.
    #
    # @api private
    # @note Part of {ExportStrategies::Pipelines::Upload the upload pipeline}.
    class SetTargetName
      include Shared::PipelineOperation

      # @see ExportStrategies::TargetNameFormatter#call
      # @param [ProjectExport] export
      # @param [String] target_name_format
      # @param [{ Symbol => Object }] state
      # @return [Dry::Monads::Result::Success(String)]
      # @return [Dry::Monads::Result::Failure((Symbol, String))]
      def call(export:, target_name_format:, **_state)
        export.to_target_name_formatter.call(target_name_format)
      end
    end
  end
end
