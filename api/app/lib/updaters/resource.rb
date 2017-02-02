module Updaters
  # Updates a Maker model from JSON-API style params
  class Resource
    include ::Updaters

    def attachment_fields
      [:attachent]
    end

  end
end
