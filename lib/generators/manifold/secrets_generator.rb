require 'securerandom'

module Manifold
  module Generators
    class SecretsGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates', __FILE__)

      attr_reader :secret_key_base

      def secrets
        template('secrets.yml.erb', 'config/secrets.yml')
      end

      def key
        SecureRandom.hex(64)
      end

    end

  end
end

