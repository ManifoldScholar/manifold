# frozen_string_literal: true

module System
  # URL Helper for generating routes on the API.
  class Routes
    include Dry::Core::Memoizable
    include Rails.application.routes.url_helpers

    INCLUDED_PORT = Dry::Types["integer"].constrained(excluded_from: [80, 443])

    # @param [User] user
    # @return [String]
    def email_confirmation_url_for(user)
      api_v1_email_confirmation_url(user, token: user.email_confirmation_token)
    end

    # @!attribute [r] default_url_options
    # @return [Hash]
    memoize def default_url_options
      url = URI(Rails.configuration.manifold.api_url)

      {
        protocol: url.scheme,
        host: url.host,
        port: sanitize_port(url.port),
      }.compact
    end

    private

    # @param [Integer] value
    # @return [Integer, nil]
    def sanitize_port(value)
      INCLUDED_PORT.try(value).to_monad.value_or(nil)
    end
  end
end
