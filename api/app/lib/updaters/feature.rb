module Updaters
  # Updates a Feature model from JSON-API style params
  class Feature
    include ::Updaters

    def attachment_fields
      [:foreground, :background]
    end
  end
end
