require "naught"

module Ingestor
  module Strategy
    module EPUB
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
                logger.debug "#{verb.titlecase} text section \"#{cd.name}\"".light_cyan
              else
                logger.warn "Unable to #{verb} text section \"#{cd.name}\"".orange
                cd.errors.full_messages.each do |msg|
                  logger.error "  #{msg}".red
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
              logger.debug msg.light_cyan
              logger.debug "  local path: #{source.source_path}".light_cyan
            end
          end
        end
      end
    end
  end
end
