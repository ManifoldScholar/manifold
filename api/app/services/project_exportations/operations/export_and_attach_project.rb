module ProjectExportations
  module Operations
    class ExportAndAttachProject
      include Shared::PipelineOperation

      # @param [ProjectExportation] project_exportation
      # @return [Dry::Monads::Result]
      def call(project_exportation, force: false)
        inputs = { force: force, project: project_exportation.project }

        compose_monadic_interaction(Packaging::Preservation::ExportProjectToBagIt, inputs).bind do |project_export|
          project_exportation.project_export = project_export

          monadic_save project_exportation
        end
      end
    end
  end
end
