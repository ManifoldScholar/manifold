module Api
  module V1
    # User controller
    class UsersController < ApplicationController
      def whoami
        render json: @current_user
      end

      # POST /users
      def create
        @user = User.new(user_params)
        if @user.save
          render json: @user, status: :created, location: [:api, :v1, @user]
        else
          render json: @user.errors.as_json(full_messages: true),
                 status: :unprocessable_entity
        end
      end

      private

      # Only allow a trusted parameter "white list" through.
      def user_params
        params.require(:user).permit(
          :first_name,
          :last_name,
          :name,
          :email,
          :password,
          :password_confirmation
        )
      end
    end
  end
end
