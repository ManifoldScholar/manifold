require "pandoc-ruby"

module Ingestions
  module Converters
    class MsWord < Ingestions::Converters::AbstractConverter

      def perform
        convert_to_html
      end

      def self.convertible_extensions
        return [] if `which pandoc`.blank?
        %w(docx)
      end

      def convert_to_html
        relativize_extracted_media_paths!
        doc = parsed_html
        doc.at("head").add_child styles
        doc
      end

      private

      def parsed_html
        @parsed_html ||= Nokogiri::HTML raw_html
      end

      def raw_html
        @raw_html ||= PandocRuby.convert([context.abs(source_path)],
                                         :s,
                                         from: :docx,
                                         to: :html,
                                         extract_media: context.source_root)
      end

      # Pandoc changes sources to absolute paths when it extracts the
      # media items from a document.  When mapping sources in the body
      # transformer, our source path is made up of paths relative to
      # the /source dir.  This method sets the extracted paths to
      # a path relative to the /sources dir.
      def relativize_extracted_media_paths!
        media_types = %w(img image video audio)
        xpath = media_types.map { |m| "//#{m}" }.join(" | ")
        parsed_html.search(xpath).each do |tag|
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
