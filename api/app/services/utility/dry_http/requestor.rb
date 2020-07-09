module Utility
  module DryHTTP
    # @api private
    class Requestor
      extend Dry::Initializer

      include Dry::Matcher::ResultMatcher.for(:call)
      include Dry::Monads[:result]

      param :http_method, Types::HTTP_METHOD

      # @see Utility::DryHTTP::RequestOptions
      # @param [String] uri
      # @param [{ Symbol => Object }] options
      # @option options [Boolean] :stream_body whether the body should be streamed
      # @option options [#call] :on_fragment required for streaming
      # @return [Dry::Types::Result::Success(HTTParty::Response)]
      # @return [Dry::Types::Result::Failure(Integer, HTTParty::Response)]
      # @return [Dry::Types::Result::Failure(Symbol, String)]
      def call(uri, **options)
        request_options = Utility::DryHTTP::RequestOptions.new http_method, uri, options

        return request_options.to_failure if request_options.invalid?

        response = request_options.make_request!
      rescue SocketError => e
        Failure([:socket_error, e.message])
      rescue StandardError => e
        Failure([:error, e.message])
      else
        return Success(response) if response.ok? || response.code < 400

        Failure([response.code, response])
      end
    end
  end
end
