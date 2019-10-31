module Utility
  module DryHTTP
    # @api private
    class RequestOptions
      extend Dry::Initializer

      include ActiveModel::Validations
      include Dry::Monads[:result]

      HTTPARTY_OPTIONS = %i[follow_redirects stream_body].freeze

      param :http_method, Types::HTTP_METHOD
      param :uri, Types::HTTP_URI
      option :follow_redirects, Types::Bool, default: proc { true }
      option :on_fragment, Types::CALLABLE, optional: true
      option :stream_body, Types::Bool, default: proc { false }

      validate :require_on_fragment_when_streaming!

      # @see Utility::DryHTTP::Requestor#call
      # @return [HTTParty::Response]
      def make_request!
        HTTParty.public_send http_method, uri, to_options, &on_fragment
      end

      # @return [Dry::Monads::Result::Failure, nil]
      def to_failure
        return if errors.none?

        Failure([:invalid_request_options, errors.full_messages.to_sentence])
      end

      # @return [{ Symbol => Object }]
      def to_options
        HTTPARTY_OPTIONS.each_with_object({}) do |option_name, h|
          h[option_name] = public_send(option_name)
        end
      end

      private

      # @return [void]
      def require_on_fragment_when_streaming!
        return unless stream_body

        return if on_fragment.present?

        errors.add :base, "Must provide :on_fragment when streaming response body"
      end
    end
  end
end
