module Packaging
  module Exportation
    class ExportTextToEpubV3Job < ApplicationJob
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
