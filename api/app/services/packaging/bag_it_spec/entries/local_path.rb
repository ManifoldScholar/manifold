module Packaging
  module BagItSpec
    module Entries
      # A file that is copied from somewhere else on the system
      class LocalPath < Base
        param :source_path, Types::PATH

        option :open_mode, Types::String, default: proc { "rb" }

        def add_to!(bag)
          bag.add_file target_path do |target_file|
            source_path.open(open_mode) do |source_file|
              IO.copy_stream source_file, target_file
            end
          end
        end
      end
    end
  end
end
