module ProjectExportations
  class Perform < ActiveInteraction::Base
    include ProjectExportations::Import[upload_pipeline: "pipelines.upload"]

    isolatable!

    transactional!

    record :project_exportation

    boolean :force_new_export, default: true

    # @return [ProjectExportation]
    def execute
      step_args = { export_and_attach_project: [{ force: force_new_export }] }

      upload_pipeline.with_step_args(step_args).call(project_exportation) do |m|
        m.success do
          transition_to! :success, on: project_exportation
        end

        m.failure do |(code, reason)|
          metadata = { code: code, reason: reason }

          transition_to! :failure, on: project_exportation, metadata: metadata
        end
      end
    rescue StandardError => e
      handle_uncaught_exception! e
    end

    private

    # @param [Exception] e
    # @return [void]
    def handle_uncaught_exception!(e)
      metadata = {
        code: "uncaught_exception",
        reason: "Something went wrong",
        exception_class: e.class.name,
        exception_message: e.message
      }

      transition_to! :failure, on: project_exportation, metadata: metadata
    end
  end
end
