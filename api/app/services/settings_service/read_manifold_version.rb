module SettingsService
  # Get the current version of Manifold
  #
  # @see Settings.manifold_version
  class ReadManifoldVersion < ActiveInteraction::Base
    DEFAULT_FILE = Rails.root.join("..", "MANIFOLD_VERSION").cleanpath

    record :version_file, class: "Pathname", finder: :new, default: DEFAULT_FILE

    # @return [Gem::Version]
    def execute
      Gem::Version.new(read_version_file || "0.0.0")
    end

    private

    def read_version_file
      return nil unless version_file.exist?

      # read and strip the initial v, breaks Gem::Version
      version_file.read.sub(/\Av/, "")
    end
  end
end
