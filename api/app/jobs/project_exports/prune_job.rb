module ProjectExports
  # @see ProjectExports::Prune
  class PruneJob < ApplicationJob
    queue_as :default

    # @return [void]
    def perform
      ProjectExports::Prune.run!
    end
  end
end
