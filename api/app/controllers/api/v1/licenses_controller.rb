# frozen_string_literal: true

module API
  module V1
    class LicensesController < ApplicationController
      def index
        render json: { data: License.select_options }
      end
    end
  end
end
