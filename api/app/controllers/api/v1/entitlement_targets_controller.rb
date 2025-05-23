# frozen_string_literal: true

module API
  module V1
    class EntitlementTargetsController < ApplicationController
      resourceful! EntitlementTarget do
        # Intentionally left blank.
      end

      def index
        @entitlement_targets = EntitlementTarget.in_order.all

        render_multiple_resources @entitlement_targets
      end
    end
  end
end
