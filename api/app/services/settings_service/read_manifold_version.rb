# frozen_string_literal: true

module SettingsService
  # Get the current version of Manifold
  #
  # @see Settings.manifold_version
  class ReadManifoldVersion < ActiveInteraction::Base
    VERSION_FILE = Rails.root.join("version.rb").cleanpath

    require VERSION_FILE

    # @return [Gem::Version]
    def execute
      Gem::Version.new(Manifold::VERSION)
    end
  end
end
