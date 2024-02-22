# frozen_string_literal: true

module SpamMitigation
  module Akismet
    module Endpoints
      # @abstract
      class Base
        extend Dry::Core::ClassAttributes
        extend Dry::Initializer

        include HTTParty
        include Dry::Monads[:result, :do]
        include SpamMitigation::Integrations

        base_uri "https://rest.akismet.com"

        option :config, SpamMitigation::Akismet::Config, default: proc { SpamMitigation::Akismet::Config.new }
        option :user, Types.Instance(::User).optional, optional: true

        defines :endpoint, type: Types::String
        defines :params_klass, type: Types::Class

        endpoint ?/

        params_klass SpamMitigation::Akismet::Params::Base

        # @return [Dry::Monads::Result]
        def call
          yield check_enabled!

          response = yield run_request

          yield validate_response!(response)

          result = yield handle_response(response)

          Success result
        end

        private

        # @return [Dry::Monads::Result]
        def build_body
          params = self.class.params_klass.new(raw_params)

          Success params.to_body
        end

        # @return [Dry::Monads::Success(Hash)]
        def build_request_options
          body = yield build_body

          options = { body: body, }

          Success options
        end

        # @see SpamMitigation::Integrations#check_integration!
        # @return [Dry::Monads::Result]
        def check_enabled!
          check_integration! config.enabled?
        end

        # @abstract
        # @param [HTTParty::Response] response
        # @return [Dry::Monads::Result]
        def handle_response(response)
          Success response
        end

        # Retrieve the (publicly-accessible) options provided to this object's initializer.
        # @return [{ Symbol => Object }]
        def raw_params
          self.class.dry_initializer.attributes(self)
        end

        # @return [Dry::Monads::Result]
        def run_request
          request_options = yield build_request_options

          response = self.class.post(self.class.endpoint, **request_options)

          Success response
        end

        # @param [HTTParty::Response] response
        # @return [Dry::Monads::Result]
        def validate_response!(response)
          if response.success?
            Success()
          else
            Failure[:invalid_response, response]
          end
        end
      end
    end
  end
end
