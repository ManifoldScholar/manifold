module API
  module V1
    module NotificationPreferences
      module Relationships
        class UnsubscribeController < ApplicationController
          include Resourceful

          def create
            outcome = Notifications::Unsubscribe.run token: params.dig("token")
            outcome.valid?
            render_single_resource outcome.result
          end

        end
      end
    end
  end
end
