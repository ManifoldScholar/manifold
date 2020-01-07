module ProjectExportations
  module Operations
    class UploadProject
      include Shared::PipelineOperation
      include ExportStrategies::Import[upload_pipeline: "pipelines.upload"]

      # @param [ProjectExportation] exportation
      # @return [Dry::Monads::Result::Success(String)]
      # @return [Dry::Monads::Result::Failure((Symbol, String))]
      def call(exportation)
        upload_pipeline.call(exportation.to_selection)
      end
    end
  end
end
