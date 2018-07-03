module Ingestions
  module Compilers
    class Text < AbstractInteraction
      hash :manifest, strip: false

      def execute
        text = find_or_create_text
        report text

        text
      end

      private

      def find_or_create_text
        existing = ingestion.project
                            .texts
                            .joins(:titles)
                            .where(text_titles: { value: main_title&.dig(:value) }).first
        existing || ::Text.create(text_attributes)
      end

      def text_attributes
        manifest[:attributes].merge(project: ingestion.project, creator: context.creator)
      end

      def main_title
        manifest[:relationships][:text_titles].detect do |title|
          title[:kind] == ::TextTitle::KIND_MAIN
        end
      end

      # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
      def report(text)
        if text.id_previously_changed?
          info "services.ingestions.compiler.text.log.new", id: text.id
        else
          info "services.ingestions.compiler.text.log.updated", id: text.id
        end

        info "services.ingestions.compiler.text.log.lang",
             lang: text.metadata.dig("language")
        info "services.ingestions.compiler.text.log.rights",
             rights: text.metadata.dig("rights")
        info "services.ingestions.compiler.text.log.date",
             date: text.publication_date
        info "services.ingestions.compiler.text.log.desc",
             desc: text.description

        return unless text.cover.present?
        info "services.ingestions.compiler.text.log.cover",
             cover: text.cover.source_identifier
      end
      # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
    end
  end
end
