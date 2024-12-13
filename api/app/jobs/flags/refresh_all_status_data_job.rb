# frozen_string_literal: true

module Flags
  # Scheduled job that runs on an interval to make sure that counter caches
  # and other {FlagStatus} data is up to date on every {FlaggableResource}.
  #
  # @see Flags::RefreshAllStatusData
  class RefreshAllStatusDataJob < ApplicationJob
    queue_as :low_priority

    # @return [void]
    def perform
      ManifoldApi::Container["flags.refresh_all_status_data"].()
    end
  end
end
