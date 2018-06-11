module Ingestions
  module Compilers
    class TextTitle < AbstractInteraction
      object :text
      hash :manifest, strip: false
      hash :attributes do
        string :value
        string :kind, default: nil
        integer :position, default: nil
      end

      def execute
        update_or_create
      end

      private

      def text_title
        @text_title ||= initialize_text_title
      end

      def initialize_text_title
        text.titles.find_or_initialize_by(value: attributes[:value])
      end

      def update_or_create
        text_title.update adjusted_attributes
      end

      def adjusted_attributes
        attributes.clone.tap do |hash|
          hash[:value] = hash[:value].presence || "Untitled"
          hash[:kind] = hash[:kind].presence || ::TextTitle::KIND_MAIN
        end
      end

    end
  end
end
