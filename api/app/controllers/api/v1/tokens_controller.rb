require "auth_token"

module Api
  module V1
    # Authentication token controller

    class TokensController < ApplicationController
      def create
        authenticated_user = User.find_by(email: token_params[:email])
                                 .try(:authenticate, token_params[:password])
        if authenticated_user
          render json: authenticated_user,
                 meta: { authToken: AuthToken.encode(user_id: authenticated_user.id) },
                 include: %w(favorites)
        else
          render json: { errors: ["Invalid username or password"] }, status: :unauthorized
        end
      end

      private

      def token_params
        params.permit(:email, :password)
      end
    end
  end
end
