require "pandoc-ruby"

module Ingestions
  module Converters
    class Latex < Ingestions::Converters::AbstractConverter

      def perform
        convert_to_html
      end

      def self.convertible_extensions
        return [] if `which pandoc`.blank?
        %w(tex)
      end

      def convert_to_html
        PandocRuby.latex(contents, :s).to_html
      end

    end
  end
end
