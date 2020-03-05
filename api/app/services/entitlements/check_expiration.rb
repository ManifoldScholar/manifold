module Entitlements
  class CheckExpiration < ActiveInteraction::Base
    isolatable!

    transactional!

    # @return [void]
    def execute
      Entitlement.in_state(:expiring_soon, :active).find_each do |entitlement|
        entitlement.check_state!
      end
    end
  end
end
