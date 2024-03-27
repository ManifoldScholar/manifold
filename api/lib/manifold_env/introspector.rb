# frozen_string_literal: true

require "auth_token"

module ManifoldEnv
  # Rack middleware that inserts a {ManifoldEnv::Introspection}
  # instance into the headers.
  class Introspector
    def initialize(app)
      @app = app
    end

    # @param [Hash] env
    # @return [(Integer, Hash, Array)] Rack response
    def call(env)
      introspection = ManifoldEnv::Introspection.new(env)

      introspection.attach! env

      @app.call(env)
    end
  end
end
