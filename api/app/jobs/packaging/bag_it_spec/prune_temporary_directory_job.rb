module Packaging
  module BagItSpec
    # Prune the temporary directory used to build BagIt spec archives.
    #
    # @see Packaging::BagItSpec::PruneTemporaryDirectory
    class PruneTemporaryDirectoryJob < ApplicationJob
      queue_as :default

      # @return [void]
      def perform
        Packaging::BagItSpec::PruneTemporaryDirectory.run!
      end
    end
  end
end
