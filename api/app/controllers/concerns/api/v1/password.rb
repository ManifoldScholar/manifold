module Api
  module V1
    # Includes password resetting methods
    module Password
      def invalid_token_error
        render json: { errors: ["Invalid or expired token"] },
               status: :unprocessable_entity
      end
    end
  end
end
