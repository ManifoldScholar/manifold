require "memoist"
require "naught"

module Ingestor
  module Transformer
    # This class is responsible for transforming an EPUB's stylesheet into a format
    # Manifold can work with.
    #
    # @author Zach Davis
    class Stylesheet
      # @param [Text] text A Text model instance with TextSections that
      #   require transformation
      # @param [Logger] logger A logger object that implements the Ruby
      #   Logger interface
      def initialize(text, logger = nil)
        @text = text
        @logger = logger || Naught.build
      end

      def transform_styles(raw_styles)
        ::Validator::Stylesheet.new.validate(raw_styles)
      end
    end
  end
end
