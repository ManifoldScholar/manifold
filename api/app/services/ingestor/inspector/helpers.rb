require "uri"
require "open-uri"

module Ingestor
  module Inspector
    # Helper methods related to inspection
    module Helpers
      # rubocop:disable Metrics/MethodLength
      def read_source_uri(relative_path, zip_path = nil)
        uri = URI(relative_path)
        if uri.absolute?
          debug "services.ingestor.inspector.log.download_external",
                relative_path: relative_path
          return nil
        end
        debug "services.ingestor.inspector.log.extract_local_resource",
              relative_path: relative_path

        return IO.read(relative_path) unless zip_path

        Zip::File.open(zip_path) do |zip_file|
          return zip_file.glob(source_zip_path(relative_path)).first.get_input_stream.read
        end
      end
      # rubocop:enable Metrics/MethodLength

      def read_source_file(relative_path, zip_path = nil)
        debug "services.ingestor.inspector.log.extract_local_resource",
              relative_path: relative_path

        return IO.read(relative_path) unless zip_path

        Zip::File.open(zip_path) do |zip_file|
          return zip_file.glob(source_zip_path(relative_path)).first.get_input_stream.read
        end
      end

      def get_source_file(relative_path)
        # This warrants explanation. We stream the file contents from the zip, then
        # we convert it to StringIO, which mostly acts like a file. However, we need
        # to add some additional info for paperclip, and rather than monkey patch
        # String IO, we just add some methods to the instance.
        # See http://stackoverflow.com/questions/5166782/write-stream-to-paperclip
        string_contents = read_source_file(relative_path)
        return nil unless string_contents
        file = StringIO.new(string_contents)
        filename = File.basename(relative_path)
        metaclass = class << file; self; end
        metaclass.class_eval do
          define_method(:original_filename) { filename }
          define_method(:content_type) { "" }
        end
        file
      end
    end
  end
end
