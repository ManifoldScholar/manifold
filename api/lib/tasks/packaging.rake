namespace :packaging do
  namespace :epub_v3 do
    desc "Export a text by its ID to an epub"
    task :export_text, %i[text_id] => %i[environment] do |t, args|
      text_id = args[:text_id]

      logger = ActiveSupport::TaggedLogging.new(Logger.new($stdout))

      logger.tagged("packaging", "epub_v3") do
        unless text_id.present?
          logger.fatal "Must provide a text_id via #{$PROGRAM_NAME} #{t.name}[text_id]"

          exit 1
        end

        logger.debug "Exporting text by id: #{text_id}"

        text =
          begin
            Text.find text_id
          rescue ActiveRecord::RecordNotFound
            logger.fatal "Could not find text with id: #{text_id}"

            exit 1
          end

        outcome = Packaging::Exportation::ExportTextToEpubV3.run text: text

        if outcome.valid?
          text_export = outcome.result

          logger.debug "Export successful"

          logger.tagged("text_export") do
            logger.info text_export.asset_path
          end
        else
          logger.error "Something went wrong"

          logger.tagged("error") do
            outcome.errors.full_messages.each do |message|
              logger.error message
            end
          end

          exit 1
        end
      end
    end
  end
end
