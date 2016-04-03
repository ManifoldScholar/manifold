module Api
  module V1
    # Me controller
    class MeController < ApplicationController

      before_action :authenticate_request!

      def show
        if @current_user
          render json: @current_user
        else
          render status: :unauthorized
        end
      end

      def update
        presenter = ::CurrentUserUpdatePresenter.new(me_params)
        updated = presenter.update(@current_user)
        if updated
          render json: @current_user
        else
          render json: @current_user.errors.as_json(full_messages: true),
                 status: :unprocessable_entity
        end
      end

      private

      def me_params
        params.require(:me).permit(
          :first_name,
          :last_name,
          :nickname,
          :name,
          { avatar: [:data, :filename, :content_type] },
          :email,
          :password,
          :password_confirmation,
          :remove_avatar
        )
      end

    end
  end
end
