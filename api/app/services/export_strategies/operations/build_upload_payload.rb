module ExportStrategies
  module Operations
    # @see ExportStrategies::UploadPayload
    class BuildUploadPayload
      include Shared::PipelineOperation

      # @param [{ Symbol => Object }] state
      # @return [ExportStrategies::UploadPayload]
      def call(state)
        ExportStrategies::UploadPayload.new state
      end
    end
  end
end
