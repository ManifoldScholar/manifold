module Packaging
  module Preservation
    # Export a {Project} to a {ExportKind::BagIt BagIt spec archive}.
    #
    # @see Packaging::BagItSpec::Compilation::Pipeline
    # @see ProjectExport
    class ExportProjectToBagIt < ActiveInteraction::Base
      include MonadicInteraction
      include Packaging::BagItSpec::Import[bagit_pipeline: "compilation.pipeline"]

      TEXT_ASSOCIATIONS = [
        :text_sections,
        :titles,
        { collaborators: %i[maker] }
      ].freeze

      ASSOCIATIONS = [
        :resources,
        {
          collaborators: :maker,
          published_texts: TEXT_ASSOCIATIONS,
          texts: TEXT_ASSOCIATIONS
        }
      ].freeze

      record :project

      boolean :force, default: false

      # @return [Packaging::BagItSpec::ProjectContext]
      attr_reader :project_context

      # @return [ProjectExport]
      attr_reader :project_export

      # @return [ProjectExport]
      def execute
        preload_associations!

        @project_export = ::ProjectExport.find_or_initialize_for_bag_it project

        run_pipeline!

        return @project_export
      end

      private

      # @return [void]
      def preload_associations!
        preloader = ActiveRecord::Associations::Preloader.new

        preloader.preload project, ASSOCIATIONS
      end

      # @return [void]
      def run_pipeline!
        return unless @project_export.new_record? || force

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
    end
  end
end
