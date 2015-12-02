require('auth_token');

module Api
  module V1
    # Authentication token controller
    class TokensController < ApplicationController

      def create
        authenticated_user = User.find_by(email: token_params[:email])
                               .try(:authenticate, token_params[:password])
        if authenticated_user
          render json: authentication_payload(authenticated_user)
        else
          render json: { errors: ['Invalid username or password'] }, status: :unauthorized
        end
      end

      private

      def authentication_payload(user)
        return nil unless user && user.id
        {
          auth_token: AuthToken.encode({ user_id: user.id }),
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
          }
        }
      end

      def token_params()
        params.permit(:email, :password)
      end

    end
  end
end
