module Packaging
  module BagItSpec
    module Entries
      # A model attachment
      class Attachment < Base
        param :uploaded_file, Types.Instance(Shrine::UploadedFile)

        option :open_mode, Types::String, default: proc { "rb" }

        def add_to!(bag)
          bag.add_file target_path do |target_file|
            uploaded_file.download do |source_file|
              IO.copy_stream source_file, target_file
            end
          end
        end
      end
    end
  end
end
