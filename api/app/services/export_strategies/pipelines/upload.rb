module ExportStrategies
  module Pipelines
    # Pipeline that takes a {ExportStrategies::Selection} an uploads its {ProjectExport} into the selected {ExportTarget}.
    class Upload
      include Dry::Transaction(container: ExportStrategies::Container, step_adapters: ::Shared::StepAdapters)

      auto_step :build_upload_state!, with: "operations.build_upload_state"

      pipe_into :set_target_name!, with: "operations.set_target_name", target: :target_name

      auto_step :build_upload_payload!, with: "operations.build_upload_payload"

      auto_step :connect_and_upload!, with: "operations.connect_and_upload"
    end
  end
end
