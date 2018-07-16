module ExternalImport
  class Match < ActiveInteraction::Base
    def execute
      ImportSelection.find_each do |import_selection|
        compose ExternalImport::MatchSelection, import_selection: import_selection
      end
    end
  end
end
