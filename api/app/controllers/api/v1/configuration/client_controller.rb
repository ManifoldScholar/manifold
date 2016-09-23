module Api
  module V1
    module Configuration
      # The Client Controller returns configuration data for this installation.
      class ClientController < ApplicationController
        def show
          render json: Rails.application.config.x.client
        end
      end
    end
  end
end
