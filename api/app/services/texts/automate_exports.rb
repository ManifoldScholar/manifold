module Texts
  class AutomateExports < ActiveInteraction::Base
    # @return [void]
    def execute
      Text.pending_epub_v3_export.find_each do |text|
        Packaging::Exportation::ExportTextToEpubV3Job.perform_later text
      end
    end
  end
end
