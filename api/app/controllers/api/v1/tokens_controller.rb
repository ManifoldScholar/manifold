require "auth_token"

module Api
  module V1
    # Authentication token controller
    class TokensController < ApplicationController
      include Authentication

      def create
        authenticated_user = User.find_by(email: token_params[:email])
                                 .try(:authenticate, token_params[:password])
        render_authenticated_user(authenticated_user)
      end

      private

      def token_params
        params.permit(:email, :password)
      end
    end
  end
end
