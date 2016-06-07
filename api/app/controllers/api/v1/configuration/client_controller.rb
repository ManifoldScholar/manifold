module Api
  module V1
    module Configuration
      class ClientController < ApplicationController

        def show
          render json: Rails.application.config.x.client
        end

      end
    end
  end
end
