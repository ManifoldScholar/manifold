module Api
  module V1
    # Me controller
    class MeController < ApplicationController
      before_action :authenticate_request!

      def show
        if @current_user
          render json: @current_user, include: %w(favorites)
        else
          render status: :unauthorized
        end
      end

      def update
        presenter = ::CurrentUserUpdatePresenter.new(user_params)
        updated = presenter.update(@current_user)
        if updated
          render json: @current_user
        else
          render json: @current_user.errors.as_json(full_messages: true),
                 status: :unprocessable_entity
        end
      end
    end
  end
end
