module Updaters
  # Updates an IngestionSource model from JSON-API style params
  class IngestionSource
    include ::Updaters

    def attachment_fields
      [:attachment]
    end

  end
end
