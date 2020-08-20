module Ingestions
  module Fetchers
    class URL < Ingestions::Fetchers::AbstractFetcher

      def perform
        fetch
        { file: temp_file }
      end

      def determine_fetchability
        url.start_with?("http")
      end

      protected

      def extension
        File.extname(URI.parse(url).path).delete(".")
      end

      def temp_file
        @temp_file ||=
          tmp_pointer("source", extension)
      end

      def fetch
        IO.copy_stream(URI(url).open, temp_file.path)
      end

    end
  end
end
