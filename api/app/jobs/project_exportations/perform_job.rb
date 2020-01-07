module ProjectExportations
  class PerformJob < ApplicationJob
    queue_as :default

    # @param [Hash] inputs
    # @option inputs [ProjectExportation] project_exportation
    # @option inputs [Boolean] force_new_export
    # @return [void]
    def perform(inputs)
      ProjectExportations::Perform.run! inputs
    end
  end
end
