module Updaters
  # Updates a Resource model from JSON-API style params
  class Resource
    include ::Updaters

    def attachment_fields
      [:attachment]
    end

  end
end
