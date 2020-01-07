module ProjectExportations
  # Create a {ProjectExportation}.
  class Create < ActiveInteraction::Base
    isolatable!

    transactional!

    record :export_target

    record :project

    record :user, default: nil

    # @return [ProjectExportation]
    def execute
      exportation = ProjectExportation.new inputs.slice(:export_target, :project, :user)

      persist_model! exportation
    end
  end
end
