module Updaters
  # Updates a Maker model from JSON-API style params
  class Maker
    include ::Updaters

    def attachment_fields
      [:avatar]
    end

  end
end
