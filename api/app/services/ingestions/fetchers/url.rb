module Ingestions
  module Fetchers
    class URL < Ingestions::AbstractInteraction

      def execute
        tmp_file, tmp_path = fetch
        [tmp_file, tmp_path]
      end

      private

      def extension
        File.extname(URI.parse(context.source_url).path).delete(".")
      end

      def tmp_pointer
        context.tmp_pointer("ingestion", extension, root_dir: context.source_root)
      end

      def fetch
        tmp = tmp_pointer
        IO.copy_stream(URI(context.source_path).open, tmp.path)
      end

    end
  end
end
