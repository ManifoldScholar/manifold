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
        elsif token_params[:email] and token_params[:password]
          authenticated_user = User.find_by(email: token_params[:email])
          .try(:authenticate, token_params[:password])
        elsif token_params[:email]
          # TODO: send email link
          
        end
        render_authenticated_user(authenticated_user)
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
