# frozen_string_literal: true

module Packaging
  module Exportation
    class ExportTextToEpubV3Job < ApplicationJob
      discard_on ActiveJob::DeserializationError, ActiveRecord::RecordNotFound, Utility::IndexMap::AlreadyStoredObjectError, StandardError

      around_perform :advisory_locked!

      unique_job! by: :job

      queue_as :default

      # @param [Text] text
      # @param [Boolean] force
      # @return [void]
      def perform(text, force: false)
        Packaging::Exportation::ExportTextToEpubV3.run! text: text, force: force
      end

      # We should lock only on the text id.
      # @return [(String)]
      def lock_key_arguments
        [arguments.first.try(:id)]
      end
    end
  end
end
