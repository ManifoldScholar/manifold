require "auth_token"

module API
  module V1
    # Authentication token controller
    class TokensController < ApplicationController
      include Authentication

      def create
        if token_params[:token]
          user_id = AuthToken.decode(token_params[:token])[:user_id]
          authenticated_user = User.find(user_id)
          render_authenticated_user(authenticated_user)
        elsif token_params[:email] and token_params[:password]
          authenticated_user = User.find_by(email: token_params[:email])
          .try(:authenticate, token_params[:password])
          render_authenticated_user(authenticated_user)
        end
        
        if token_params[:email] and params[:password].nil?
          # TODO: send email link
          authenticated_user = User.find_by(email: token_params[:email])
          AccountMailer.login_token(authenticated_user)
          render json: { message: "email sent" }, status: :ok
        end
      rescue StandardError => e
        render_error_response e
      end

      private

      def token_params
        params.permit(:email, :password, :token)
      end
    end
  end
end
