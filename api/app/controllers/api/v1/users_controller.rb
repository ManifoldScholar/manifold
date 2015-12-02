module Api
  module V1
    # User controller
    class UsersController < ApplicationController

      def whoami
        render json: @current_user
      end

    end
  end
end
