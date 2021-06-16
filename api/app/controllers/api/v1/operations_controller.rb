module API
  module V1
    # @see https://jsonapi.org/ext/atomic/
    class OperationsController < ApplicationController
      include MonadicControllerActions

      def create
        handler = JSONAPI::Operations::Handler.new current_user: current_user

        result = handler.call params

        handle_monadic_result! result do |m|
          m.success do |value|
            render json: value
          end

          m.failure(:operation_failure) do |_, errors|
            render json: { errors: errors }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
