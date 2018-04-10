require "securerandom"

module Manifold
  module Generators
    # <tt>Manifold::Generators::SecretsGenerator</tt> is a simple generator
    # that creates a config/secrets.yml file and populates secret_key_base
    # with a generated value.
    class SecretsGenerator < Rails::Generators::Base
      source_root File.expand_path("../templates", __dir__)

      attr_reader :secret_key_base

      def secrets
        template("secrets.yml.erb", "config/secrets.yml")
      end

      def key
        SecureRandom.hex(64)
      end
    end
  end
end
