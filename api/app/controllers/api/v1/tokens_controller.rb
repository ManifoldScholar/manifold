require "auth_token"

module API
  module V1
    # Authentication token controller
    class TokensController < ApplicationController
      include Authentication

      def create
        authenticated_user = User.find_by(email: token_params[:email])
          .try(:authenticate, token_params[:password])
        render_authenticated_user(authenticated_user)
      rescue StandardError => e
        render_error_response e
      end

      private

      def token_params
        params.permit(:email, :password)
      end
    end
  end
end
