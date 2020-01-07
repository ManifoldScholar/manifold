module ProjectExportations
  class Perform < ActiveInteraction::Base
    include ProjectExportations::Import[upload_pipeline: "pipelines.upload"]

    isolatable!

    transactional!

    record :project_exportation

    boolean :force_new_export, default: false

    # @return [ProjectExportation]
    def execute
      step_args = { export_and_attach_project: [force: force_new_export] }

      upload_pipeline.with_step_args(step_args).call(project_exportation) do |m|
        m.success do
          transition_to! :success, on: project_exportation
        end

        m.failure do |(code, reason)|
          metadata = { code: code, reason: reason }

          transition_to! :failure, on: project_exportation, metadata: metadata
        end
      end
    end
  end
end
