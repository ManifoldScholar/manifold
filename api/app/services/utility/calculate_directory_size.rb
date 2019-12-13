module Utility
  # Recursively calculate the size of a given directory
  class CalculateDirectorySize < ActiveInteraction::Base
    COUNTER = Utility::Counter.new

    isolatable!

    haltable!

    record :path, class: "Pathname", finder: :new

    validate :must_be_directory!

    # @return [Integer, nil]
    def execute
      return nil unless path.exist?

      COUNTER.call do |counter|
        path.find do |child|
          counter += child.size if child.file?
        end
      end
    end

    private

    # @return [void]
    def must_be_directory!
      return unless path.exist?

      errors.add :path, "must be a directory" unless path.directory?
    end
  end
end
