module ExportStrategies
  # rubocop:disable Metrics/MethodLength
  class PerformUpload < ActiveInteraction::Base
    include ExportStrategies::Import[attach_export_pipeline: "pipelines.export_and_attach", upload_pipeline: "pipelines.upload"]

    isolatable!

    transactional!

    record :export_target

    record :project

    boolean :force_new_export, default: false

    # @return [ProjectExportation]
    def execute
      exportation = ProjectExportation.new inputs.slice(:export_target, :project)

      persist_model! exportation

      attach_step_args = { export_and_attach_project: [{ force: force_new_export }] }

      attach_export_pipeline.with_step_args(attach_step_args).call(exportation) do |m|
        m.success do
          # continue
        end

        m.failure do |(code, reason)|
          halt! "Could not attach project export: #{code} :: #{reason}"
        end
      end

      upload_pipeline.call(exportation.to_selection) do |m|
        m.success do
          transition_to! :success, on: project_exportation
        end

        m.failure do
          transition_to! :failure, on: project_exportation
        end
      end
    end
  end
  # rubocop:enable Metrics/MethodLength
end
