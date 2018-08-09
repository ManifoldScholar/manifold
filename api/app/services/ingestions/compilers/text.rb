module Ingestions
  module Compilers
    class Text < AbstractInteraction
      hash :manifest, strip: false

      def execute
        text = update_or_create_text
        report text

        text
      end

      private

      def update_or_create_text
        ingestion.text ? update_text : create_text
      end

      def create_text
        ::Text.create(text_attributes)
      end

      def update_text
        ingestion.text.update(text_attributes)

        ingestion.text
      end

      def text_attributes
        manifest[:attributes].merge(project: ingestion.project, creator: context.creator)
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
