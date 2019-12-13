module Packaging
  module BagItSpec
    # Prune the temporary directory used by the {Packaging::BagItSpec::Compilation compilation process}
    # to clean up any files left behind by failed processes.
    class PruneTemporaryDirectory < ActiveInteraction::Base
      extend Memoist

      DEFAULT_AGE = 3.days

      DEFAULT_MAX = 50.megabytes

      STALE_AGE = 30.minutes

      object :path, class: "Pathname", default: proc { Packaging::BagItSpec::Compilation::TMP_ROOT }

      object :age, class: "ActiveSupport::Duration", default: proc { DEFAULT_AGE }

      object :stale_age, class: "ActiveSupport::Duration", default: proc { STALE_AGE }

      integer :maximum_size, default: DEFAULT_MAX

      # @return [void]
      def execute
        return unless path.exist?

        path.each_child do |child|
          next unless child.directory?
          next unless should_remove? child

          child.rmtree
        end
      end

      # @!attribute [r] expired_before
      # @return [ActiveSupport::TimeWithZone]
      memoize def expired_before
        age.ago
      end

      # @!attribute [r] stale_before
      # @return [ActiveSupport::TimeWithZone]
      memoize def stale_before
        stale_age.ago
      end

      private

      # @param [Pathname] directory
      def should_remove?(directory)
        return true if expired?(directory)
        return true if stale?(directory) && size_exceeded?(directory)

        false
      end

      # @param [Pathname] directory
      def expired?(directory)
        expired_before >= directory.ctime
      end

      # @param [Pathname] directory
      def stale?(directory)
        stale_before >= directory.ctime
      end

      # @param [Pathname] directory
      def size_exceeded?(directory)
        maximum_size <= calculate_directory_size(directory)
      end

      # @param [Pathname] directory
      def calculate_directory_size(directory)
        compose Utility::CalculateDirectorySize, path: directory
      end
    end
  end
end
