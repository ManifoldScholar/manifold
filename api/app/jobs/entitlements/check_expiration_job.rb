module Entitlements
  class CheckExpirationJob < ApplicationJob
    queue_as :default

    # @return [void]
    def perform
      Entitlements::CheckExpiration.run!
    end
  end
end
