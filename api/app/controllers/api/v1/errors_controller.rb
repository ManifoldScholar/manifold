module API
  module V1
    # Errors controller
    class ErrorsController < ApplicationController

      def error_404
        raise ActionController::RoutingError, "Resource Not Found"
      end

    end
  end
end
