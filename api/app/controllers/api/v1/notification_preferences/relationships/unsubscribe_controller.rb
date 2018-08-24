module Api
  module V1
    module NotificationPreferences
      module Relationships
        class UnsubscribeController < ApplicationController
          include Resourceful

          def create
            outcome = Notifications::Unsubscribe.run token: params.dig("token")
            if outcome.valid?
              render_single_resource outcome.result
            else
              render json:  outcome,
                     serializer: ActiveModel::Serializer::ErrorSerializer,
                     status: :unprocessable_entity
            end
          end

        end
      end
    end
  end
end
