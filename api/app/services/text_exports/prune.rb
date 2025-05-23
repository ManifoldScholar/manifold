# frozen_string_literal: true

module TextExports
  # @see TextExport.prunable
  class Prune < ActiveInteraction::Base
    # @return [void]
    def execute
      TextExport.prunable.destroy_all
    end
  end
end
