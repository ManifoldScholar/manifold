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

      def publication_resource?
        attributes["kind"] == ::IngestionSource::KIND_PUBLICATION_RESOURCE
      end

      def update_or_create
        # We can fail and continue in the case of a missing publication resource, which
        # could, for example, be an invalid image referenced from HTMl. Sections, however
        # must be backed by valid ingestion sources.
        message = publication_resource? ? "update" : "update!"
        success = ingestion_source.send(message, attributes.merge(text: text))
        return success if success

        warn "services.ingestions.compiler.ingestion_source.log.invalid", source_path: ingestion_source.source_path
        false
      end

      def report
        key = if ingestion_source.id_previously_changed?
                "services.ingestions.compiler.ingestion_source.log.new"
              elsif ingestion_source.id
                "services.ingestions.compiler.ingestion_source.log.updated"
              end

        info key, source_path: ingestion_source.source_path
      end

    end
  end
end
