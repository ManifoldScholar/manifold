require "pandoc-ruby"
require "shellwords"

module Ingestions
  module Converters
    class MsWord < Ingestions::Converters::AbstractConverter
      include Concerns::ConversionHelpers

      def perform
        convert_to_html
      end

      def self.convertible_extensions
        return [] if `which pandoc`.blank?
        %w(docx)
      end

      def convert_to_html
        relativize_extracted_media_paths!
        insert_head_styles!
        ensure_header_ids!
        document_parsed.to_s
      end

      private

      def document_parsed
        @document_parsed ||= Nokogiri::HTML raw_html
      end

      def insert_head_styles!
        document_parsed.at("head").add_child styles
      end

      def escaped_path
        @escaped_path ||= Shellwords.escape context.abs(source_path)
      end

      # When Pandoc extracts docx media, it numbers the output files
      # sequentially, relative to the document.  In order to avoid
      # media files from being overwritten by subsequent docx files
      # we need to extract and isolate the files in a directory with
      # the source file's name.
      def media_dir
        Pathname.new(File.join(context.source_root,
                               File.basename(escaped_path, ".*")))
      end

      def raw_html
        @raw_html ||= PandocRuby.convert([escaped_path],
                                         :s,
                                         from: :docx,
                                         to: :html,
                                         extract_media: media_dir)
      end

      # Pandoc changes sources to absolute paths when it extracts the
      # media items from a document.  When mapping sources in the body
      # transformer, our source path is made up of paths relative to
      # the /source dir.  This method sets the extracted paths to
      # a path relative to the /sources dir.
      def relativize_extracted_media_paths!
        media_types = %w(img image video audio)
        xpath = media_types.map { |m| "//#{m}" }.join(" | ")
        document_parsed.search(xpath).each do |tag|
          tag["src"] = context.rel(tag["src"], context.source_root)
        end
      end

      def styles
        <<~HEREDOC
          <style type="text/css">
              .smallcaps { font-variant: small-caps; }
              .underline { text-decoration: underline; }
              .column{ display: inline-block; vertical-align: top; width: 50%; }
              .title { text-align: center; font-size: 2em; }
              .subtitle { text-align: center; font-size: 1.2em; }
              .author { display: none; }
              .date { display: none; }
              tr.header { border-bottom: 1px solid black; }
              tr.even { background-color: #f7f7f7; }
              tr.odd { background-color: #FFF; }
              .footnotes ol li { font-size: 0.8em; }
              .footnote-ref {}
              .footnote-back {}
          </style>
        HEREDOC
      end

    end
  end
end
