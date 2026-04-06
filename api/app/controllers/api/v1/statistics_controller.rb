# frozen_string_literal: true

module API
  module V1
    # Statistics controller
    class StatisticsController < ApplicationController
      resourceful! Statistics do
        Statistics.new
      end

      def show
        expires_in 10.minutes, public: true
        render_single_resource Statistics.new,
                               serializer: ::V1::StatisticsSerializer,
                               location: "[:api, :v1, :statistics]"
      end
    end
  end
end
