require "pandoc-ruby"
require "shellwords"

module Ingestions
  module Converters
    class MsWord < Ingestions::Converters::AbstractConverter
      include Ingestions::Concerns::ConversionHelpers

      def perform
        adjust_media_paths!
        ensure_header_ids!
        document_parsed.to_s
      end

      def self.convertible_extensions
        %w(docx)
      end

      private

      def document_parsed
        @document_parsed ||= Nokogiri::HTML raw_html
      end

      # When Mammoth extracts docx media, it numbers the output files
      # sequentially, relative to the document.  In order to avoid
      # media files from being overwritten by subsequent docx files
      # we need to extract and isolate the files in a directory with
      # the source file's name.
      def output_path
        return @output_path if @output_path.present?

        path = File.join(context.source_root, source_key, "media")
        @output_path ||= context.ensure_dir(path)
        return @output_path
      end

      def input_path
        context.abs(source_path)
      end

      def source_key
        File.basename(source_path, File.extname(source_path))
      end

      def mammoth_html_path
        context.rel("#{output_path}/#{source_key}.html")
      end

      def mammoth_exec_path
        Rails.configuration.manifold.mammoth_path.to_s
      end

      # This method sets the extracted paths to a path relative to the /sources dir.
      def adjust_media_paths!
        media_types = %w(img image video audio)
        xpath = media_types.map { |m| "//#{m}" }.join(" | ")
        document_parsed.search(xpath).each do |tag|
          tag["src"] = "#{source_key}/media/#{tag['src']}"
        end
      end

      def style_map
        <<~HEREDOC
        p[style-name='title'] => h1.textTitle
        #{Settings.instance.ingestion[:mammoth_style_map]}
        HEREDOC
      end

      def with_style_map
        map = Tempfile.new
        map.write(style_map)
        map.close
        yield(map.path)
        map.unlink
      end

      def mammoth_html
        with_style_map do |map_path|
          _stdout, stderr, status = Open3.capture3(
            mammoth_exec_path,
            input_path,
            %[--style-map=#{map_path}],
            %[--output-dir=#{output_path}]
          )
          @mammoth_html ||= context.read(mammoth_html_path)
          context.delete(mammoth_html_path)
          raise IngestionError "Mammoth ingestion failed: #{stderr}" unless status.success?
        end
        @mammoth_html
      end

      def raw_html
        @raw_html ||= wrap_fragment(mammoth_html)
      end

      def wrap_fragment(fragment)
        <<~HEREDOC
          <html xmlns="http://www.w3.org/1999/xhtml" >
          <head>
          </head>
          <body>
            #{fragment}
          </body>
          </html>
        HEREDOC
      end

    end
  end
end
