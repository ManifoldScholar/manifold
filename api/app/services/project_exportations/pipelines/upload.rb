module ProjectExportations
  module Pipelines
    class Upload
      include Dry::Transaction(container: ProjectExportations::Container, step_adapters: ::Shared::StepAdapters)

      pipe :ensure_can_ready_export, with: "operations.ensure_can_ready_export"
      pipe :export_and_attach_project, with: "operations.export_and_attach_project"
      pipe :mark_export_ready, with: "operations.mark_export_ready"

      auto_step :upload_project!, with: "operations.upload_project"
    end
  end
end
