module Ingestions
  module Compilers
    class IngestionSource < AbstractInteraction
      object :text
      hash :manifest, strip: false
      hash :attributes do
        string :source_identifier
        string :source_path
        string :kind
        file :attachment
      end

      def execute
        update_or_create
        report
      end

      private

      def ingestion_source
        @ingestion_source ||= initialize_ingestion_source
      end

      def initialize_ingestion_source
        text.ingestion_sources.find_or_initialize_by(
          source_identifier: attributes[:source_identifier]
        )
      end

      def update_or_create
        ingestion_source.update attributes.merge(text: text)
      end

      def report
        key = if ingestion_source.id_previously_changed?
                "services.ingestions.compiler.ingestion_source.log.new"
              else
                "services.ingestions.compiler.ingestion_source.log.updated"
              end

        info key, source_path: ingestion_source.source_path
      end

    end
  end
end
