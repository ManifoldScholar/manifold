module ProjectExportations
  module Operations
    # Ensure that the {ProjectExportation} is ready to receive a BagItSpec export.
    class EnsureCanReadyExport
      include Shared::PipelineOperation

      # @param [ProjectExportation] project_exportation
      # @return [Dry::Monads::Result]
      def call(project_exportation)
        monadic_can_transition_to! project_exportation, :export_ready
      end
    end
  end
end
