module Api
  module V1
    # Statistics controller
    class StatisticsController < ApplicationController

      resourceful! Statistics do
        Statistics.new
      end

      def show
        render_single_resource(Statistics.new, location: "[:api, :v1, :statistics]")
      end

    end
  end
end
