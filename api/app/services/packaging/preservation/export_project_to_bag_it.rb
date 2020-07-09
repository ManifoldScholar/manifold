module Packaging
  module Preservation
    # Export a {Project} to a {ExportKind::BagIt BagIt spec archive}.
    #
    # @see Packaging::BagItSpec::Compilation::Pipeline
    # @see ProjectExport
    class ExportProjectToBagIt < ActiveInteraction::Base
      include Concerns::MonadicInteraction
      include Packaging::BagItSpec::Import[bagit_pipeline: "compilation.pipeline"]

      record :project

      boolean :force, default: false

      # @return [Packaging::BagItSpec::ProjectContext]
      attr_reader :project_context

      # @return [ProjectExport]
      attr_reader :project_export

      # @return [ProjectExport]
      def execute
        @project_export = ::ProjectExport.find_or_initialize_for_bag_it project

        if @project_export.new_record? || force
          step_args = {
            finalize!: [{ project_export: @project_export }]
          }

          bagit_pipeline.with_step_args(step_args).call(project) do |m|
            m.success do |result|
              @project_context = result
            end

            m.failure do |_code, reason|
              errors.add :base, "Something went wrong compiling the archive: #{reason}"
            end
          end
        end

        return @project_export
      end
    end
  end
end
