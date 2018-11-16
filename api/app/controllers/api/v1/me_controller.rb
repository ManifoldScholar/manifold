module Api
  module V1
    # Me controller
    class MeController < ApplicationController

      before_action :authenticate_request!

      INCLUDES = %w(favorites makers).freeze

      def show
        if current_user
          render json: current_user,
                 include: INCLUDES,
                 serializer: CurrentUserSerializer
        else
          render status: :unauthorized
        end
      end

      def update
        ::Updaters::User.new(user_params).update(current_user)
        if current_user.valid?
          render json: current_user,
                 include: INCLUDES,
                 serializer: CurrentUserSerializer
        else
          render json: current_user,
                 serializer: ActiveModel::Serializer::ErrorSerializer,
                 status: :unprocessable_entity
        end
      end
    end
  end
end
