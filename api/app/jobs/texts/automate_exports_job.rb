module Texts
  # @see Texts::AutomateExports
  class AutomateExportsJob < ApplicationJob
    queue_as :default

    # @return [void]
    def perform
      Texts::AutomateExports.run!
    end
  end
end
