module Api
  module V1
    # Development controller
    class DevelopmentController < ApplicationController

      def whoami
        render json: @current_user
      end

    end
  end
end
