module API
  module V1
    class EntitlementTargetsController < ApplicationController
      resourceful! EntitlementTarget do
      end

      def index
        @entitlement_targets = EntitlementTarget.in_order.all

        render_multiple_resources @entitlement_targets
      end
    end
  end
end
