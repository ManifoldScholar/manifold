module ExternalImport
  class Perform < ActiveInteraction::Base
    import_filters ExternalImport::Process

    def execute
      compose ExternalImport::Process, inputs
      compose ExternalImport::Match
      ImportSelection.find_each do |is|
        compose ExternalImport::CreateAnnotations, import_selection: is
      end
    end
  end
end
