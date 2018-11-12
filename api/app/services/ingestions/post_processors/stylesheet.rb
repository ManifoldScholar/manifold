require "cssbeautify"

module Ingestions
  module PostProcessors
    class Stylesheet < AbstractInteraction
      object :stylesheet

      def execute
        info "services.ingestions.post_processor.log.transform_ss",
             name: stylesheet.name,
             id: stylesheet.id

        transform_stylesheet!
      end

      private

      def raw_styles
        @raw_styles ||= stylesheet.raw_styles
      end

      def transform_stylesheet!
        beautify_raw_styles! if raw_styles.present?

        stylesheet.update styles: validate_stylesheet,
                          raw_styles: raw_styles,
                          skip_formatting: true
      end

      def beautify_raw_styles!
        @raw_styles = CssBeautify.beautify raw_styles, autosemicolon: true
      end

      def validate_stylesheet
        ::Validator::Stylesheet.new.validate(raw_styles)
      end
    end
  end
end
