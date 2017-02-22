module Api
  module V1
    # Includes password resetting methods
    module Password
      def invalid_token_error
        render json: {
          errors: [
            {
              source: { pointer: "/data/attributes/resetToken" },
              detail: "Invalid or expired"
            }
          ]
        }, status: :unprocessable_entity
      end
    end
  end
end
