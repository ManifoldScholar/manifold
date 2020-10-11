module ProjectExportations
  # @see ProjectExportations::Create
  # @see ProjectExportations::Perform
  # @see ProjectExportations::PerformJob
  class CreateAndPerform < ActiveInteraction::Base
    record :export_target

    record :project

    record :user, default: nil

    boolean :force_new_export, default: true

    boolean :perform_synchronously, default: false

    # @return [ProjectExportation]
    def execute
      exportation = compose ProjectExportations::Create, inputs

      perform_inputs = inputs.slice(:force_new_export).merge(project_exportation: exportation)

      if perform_synchronously
        compose ProjectExportations::Perform, perform_inputs
      else
        ProjectExportations::PerformJob.perform_later perform_inputs
      end

      return exportation
    end
  end
end
