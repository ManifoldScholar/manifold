module Packaging
  module Exportation
    class ExportTextToEpubV3Job < ApplicationJob
      discard_on ActiveJob::DeserializationError, ActiveRecord::RecordNotFound

      around_perform :advisory_locked!

      unique :until_executed, lock_ttl: 15.minutes, on_conflict: :log

      queue_as :default

      # @param [Text] text
      # @param [Boolean] force
      # @return [void]
      def perform(text, force: false)
        Packaging::Exportation::ExportTextToEpubV3.run! text: text, force: force
      end
    end
  end
end
