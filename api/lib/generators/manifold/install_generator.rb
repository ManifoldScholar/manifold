require "securerandom"

module Manifold
  module Generators
    # <tt>Manifold::Generators::InstallGenerator</tt> is responsible for
    # creating any configuration files that Manifold needs to run
    # correctly.
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("../../templates", __FILE__)

      def install
        generate "manifold:secrets"
        rake "install:create_user"
      end
    end
  end
end
