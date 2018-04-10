require "naught"

module Ingestor
  module Helper
    # Provides EPUB ingestion validation related helper methods
    #
    # @author Zach Davis
    # @todo: This class needs to be refactored to pass Rubocop linting.
    # rubocop:disable Metrics/AbcSize
    class Validator
      def self.validate_text_sections(text, logger)
        text.text_sections.each do |cd|
          verb = cd.new_record? ? "create" : "update"
          if cd.valid?
            logger.debug "#{verb.titlecase} text section \"#{cd.name}\""
          else
            logger.warn "Unable to #{verb} text section \"#{cd.name}\""
            cd.errors.full_messages.each do |msg|
              logger.error "  #{msg}"
            end
            raise IngestionFailed, "Unable to #{verb} text section"
          end
        end
      end

      def self.validate_ingestion_sources(text, logger)
        text.ingestion_sources.each do |source|
          next unless source.valid?
          verb = source.new_record? ? "created" : "updated"
          msg = "#{verb.titlecase} ingestion source \"#{source.source_identifier}\""
          logger.debug msg
          logger.debug "  local path: #{source.source_path}"
        end
      end
    end
    # rubocop:enable Metrics/AbcSize
  end
end
