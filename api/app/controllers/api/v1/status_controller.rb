# frozen_string_literal: true

# Endpoints for reporting on the status and health of the API.
module API
  module V1
    class StatusController < ApplicationController
      # A ping endpoint.
      #
      # @return [void]
      def ping
        render json: { pong: true }
      end
    end
  end
end
