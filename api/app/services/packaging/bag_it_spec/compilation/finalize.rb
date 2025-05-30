# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Compilation
      class Finalize
        include Packaging::PipelineOperation

        # @param [ProjectExport, nil] project_export
        # @return [Dry::Monads::Result::Success(Packaging::BagItSpec::Context)]
        def call(*, project_export: nil)
          context = state[:context]
          archive = state[:archive]

          project_export ||= ::ProjectExport.find_or_initialize_for_bag_it state[:context].project

          maybe_fail do
            project_export.asset = File.open(archive, "rb")

            try_to_save! project_export, code: :failed_export, prefix: "Could not export project"

            self.pipeline_result = context

            Success(context)
          end
        ensure
          FileUtils.remove_entry_secure(context.build_path)
        end
      end
    end
  end
end
