module Updaters
  # Updates an ActionCallout model from JSON-API style params
  class ActionCallout
    include ::Updaters

    def attachment_fields
      [:attachment]
    end
  end
end
