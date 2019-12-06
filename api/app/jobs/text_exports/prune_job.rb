module TextExports
  # @see TextExports::Prune
  class PruneJob < ApplicationJob
    queue_as :default

    # @return [void]
    def perform
      TextExports::Prune.run!
    end
  end
end
