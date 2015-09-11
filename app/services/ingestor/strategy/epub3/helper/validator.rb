require 'naught'

module Ingestor
  module Strategy
    module EPUB3
      module Helper
        class Validator

          def self.validate_text_sections(text, logger)
            text.text_sections.each do |cd|
              verb = cd.new_record? ? 'create' : 'update'
              if cd.valid?
                logger.info "#{verb.titlecase} text section \"#{cd.name}\" [#{cd.source_identifier}]"
              else
                logger.error "Unable to #{verb} text section \"#{cd.name}\" [#{cd.source_identifier}]"
                cd.errors.full_messages.each do |msg|
                  logger.error"  #{msg}"
                end
                raise IngestionFailed, "Unable to #{verb} text section"
              end

            end
          end

          def self.validate_ingestion_sources(text, logger)
            text.ingestion_sources.each do |source|
              if source.valid?
                verb = source.new_record? ? 'created' : 'updated'
                logger.debug "#{verb.titlecase} ingestion source \"#{source.source_identifier}\" [#{source.source_path}]"
              end
            end
          end

          def self.validate_resources(text, logger)
            text.source_resources.each do |resource|
              if resource.valid?
                verb = resource.new_record? ? 'created' : 'updated'
                size = Filesize.from("#{resource.attachment.size} B").pretty
                logger.debug "#{verb.titlecase} resource \"#{resource.name}\" [#{size}] [#{resource.attachment.content_type}]"
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
