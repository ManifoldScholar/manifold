module ExportStrategies
  module Operations
    # @see ExportSelections::Selection#to_upload_state
    class BuildUploadState
      include Shared::PipelineOperation

      SELECTION = Types.Instance(ExportStrategies::Selection)

      # @param [ExportStrategies::Selection] selection
      # @raise [Dry::Types::ConstraintError] should something fail
      # @return [Dry::Monads::Result::Success({ Symbol => Object })]
      # @return [Dry::Monads::Result::Failure((Symbol, String))]
      def call(selection)
        Success SELECTION[selection].to_upload_state
      end
    end
  end
end
