# frozen_string_literal: true

module ExportStrategies
  module Pipelines
    # Pipeline that takes a {ExportStrategies::Selection} an uploads its {ProjectExport} into the selected {ExportTarget}.
    class Upload
      include Dry::Transaction(container: ExportStrategies::Container, step_adapters: ::Shared::StepAdapters)

      step :build_upload_state!, with: "operations.build_upload_state"

      step :set_target_name!, with: "operations.set_target_name"

      step :build_upload_payload!, with: "operations.build_upload_payload"

      step :connect_and_upload!, with: "operations.connect_and_upload"
    end
  end
end
