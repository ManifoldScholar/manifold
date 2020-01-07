module Updaters
  # Updates an {ExportTarget} model from JSON-API style params
  class ExportTarget
    include ::Updaters

    def attachment_fields
      []
    end
  end
end
