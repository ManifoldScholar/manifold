module Ingestions
  module Compilers
    class Text < AbstractInteraction
      hash :manifest, strip: false

      def execute
        find_or_create_text
      end

      private

      def find_or_create_text
        text = ingestion.project
                        .texts
                        .joins(:titles)
                        .where(text_titles: { value: main_title&.dig(:value) }).first
        text || ::Text.create(text_attributes)
      end

      def text_attributes
        manifest[:attributes].merge(project: ingestion.project, creator: context.creator)
      end

      def main_title
        manifest[:relationships][:text_titles].detect do |title|
          title[:kind] == ::TextTitle::KIND_MAIN
        end
      end
    end
  end
end
