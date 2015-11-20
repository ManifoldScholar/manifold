require "naught"

module Ingestor
  module Strategy
    module EPUB3
      module Helper
        # Provides EPUB3 ingestion validation related helper methods
        #
        # @author Zach Davis
        # @todo: This class needs to be refactored to pass Rubocop linting.
        # rubocop:disable Metrics/AbcSize
        class Validator
          def self.validate_text_sections(text, logger)
            text.text_sections.each do |cd|
              verb = cd.new_record? ? "create" : "update"
              if cd.valid?
                logger.info "#{verb.titlecase} text section \"#{cd.name}\""
                logger.info "  [#{cd.source_identifier}]"
              else
                logger.error "Unable to #{verb} text section \"#{cd.name}\""
                logger.info "  [#{cd.source_identifier}]"
                cd.errors.full_messages.each do |msg|
                  logger.error "  #{msg}"
                end
                fail IngestionFailed, "Unable to #{verb} text section"
              end
            end
          end

          def self.validate_ingestion_sources(text, logger)
            text.ingestion_sources.each do |source|
              next unless source.valid?
              verb = source.new_record? ? "created" : "updated"
              msg = "#{verb.titlecase} ingestion source \"#{source.source_identifier}\""
              logger.debug msg
              logger.debug "  [#{source.source_path}]"
            end
          end

          def self.validate_resources(text, logger)
            text.source_resources.each do |resource|
              if resource.valid?
                verb = resource.new_record? ? "created" : "updated"
                size = Filesize.from("#{resource.attachment.size} B").pretty
                logger.debug "#{verb.titlecase} resource \"#{resource.name}\" [#{size}]"
                logger.debug "  [#{resource.attachment.content_type}]"
              else
                logger.debug "Invalid resource \"#{resource.name}\""
                resource.errors.full_messages.each do |message|
                  logger.debug "    #{message}"
                end
              end
            end
          end
        end
      end
    end
  end
end
