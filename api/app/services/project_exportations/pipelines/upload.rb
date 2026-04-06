# frozen_string_literal: true

module ProjectExportations
  module Pipelines
    class Upload
      include Dry::Transaction(container: ProjectExportations::Container, step_adapters: ::Shared::StepAdapters)

      step :ensure_can_ready_export, with: "operations.ensure_can_ready_export"
      step :export_and_attach_project, with: "operations.export_and_attach_project"
      step :mark_export_ready, with: "operations.mark_export_ready"

      step :upload_project!, with: "operations.upload_project"
    end
  end
end
