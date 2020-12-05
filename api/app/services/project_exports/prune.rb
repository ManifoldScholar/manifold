module ProjectExports
  # @see ProjectExport.prunable
  class Prune < ActiveInteraction::Base
    # @return [void]
    def execute
      ProjectExport.prunable.destroy_all
    end
  end
end
