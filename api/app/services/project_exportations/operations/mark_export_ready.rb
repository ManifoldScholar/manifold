# frozen_string_literal: true

module ProjectExportations
  module Operations
    # Ensure that the {ProjectExportation} is ready to receive
    # a BagIt spec export and attach it.
    class MarkExportReady
      include Shared::PipelineOperation

      # @param [ProjectExportation] project_exportation
      # @return [Dry::Monads::Result]
      def call(project_exportation)
        result = monadic_transition_to! project_exportation, :export_ready

        result.fmap { project_exportation }
      end
    end
  end
end
