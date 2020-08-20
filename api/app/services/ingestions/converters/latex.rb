require "pandoc-ruby"

module Ingestions
  module Converters
    class Latex < Ingestions::Converters::AbstractConverter
      include Ingestions::Concerns::ConversionHelpers

      def perform
        convert_to_html
      end

      def self.convertible_extensions
        return [] if `which pandoc`.blank?

        %w(tex)
      end

      private

      def convert_to_html
        ensure_header_ids!
        document_parsed.to_s
      end

      def document_parsed
        @document_parsed ||= Nokogiri::HTML raw_html
      end

      def raw_html
        PandocRuby.latex(contents, :s).to_html
      end

    end
  end
end
