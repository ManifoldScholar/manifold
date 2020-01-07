module ExportStrategies
  module Operations
    # Perform the actual upload.
    #
    # @api private
    # @see ExportStrategies::AbstractUploader#upload!
    # @see ExportStrategies::Pipelines::Upload
    class ConnectAndUpload
      include Shared::PipelineOperation

      # @see ExportStrategies::Configuration#upload_with_chosen_strategy!
      # @see ExportStrategies::UploadPayload#upload_with_chosen_strategy!
      # @param [ExportStrategies::UploadPayload] payload
      # @return [Dry::Monads::Result]
      def call(payload)
        payload.upload_with_chosen_strategy!
      end
    end
  end
end
