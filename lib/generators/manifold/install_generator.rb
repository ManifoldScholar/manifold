require 'securerandom'

module Manifold
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates', __FILE__)

      def install
        generate "manifold:secrets"
      end

    end
  end
end

