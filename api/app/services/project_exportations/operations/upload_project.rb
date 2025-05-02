# frozen_string_literal: true

module ProjectExportations
  module Operations
    class UploadProject
      include Shared::PipelineOperation
      include ExportStrategies::Import[upload_pipeline: "pipelines.upload"]

      # @param [ProjectExportation] exportation
      # @return [Dry::Monads::Result::Success(String)]
      # @return [Dry::Monads::Result::Failure((Symbol, String))]
      def call(exportation)
        result = upload_pipeline.call(exportation.to_selection)

        result.fmap { exportation }
      end
    end
  end
end
