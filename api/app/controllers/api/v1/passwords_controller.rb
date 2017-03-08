module Api
  module V1
    # Passwords controller
    class PasswordsController < ApplicationController
      include Password
      include Resourceful

      def create
        @user = User.find_by(email: params[:email])
        @user&.generate_reset_token
        render status: :no_content
      end

      def update
        user = User.by_reset_token(params[:reset_token])
        return invalid_token_error unless user&.valid_token?
        user.update_password(params[:password], params[:password_confirmation])
        if user.save
          render_single_resource(user)
        else
          render json:  user,
                 serializer: ActiveModel::Serializer::ErrorSerializer,
                 status: :unprocessable_entity
        end
      end
    end
  end
end
