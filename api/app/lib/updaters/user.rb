module Updaters
  # Updates a User model from JSON-API style params
  class User
    include ::Updaters

    def attachment_fields
      [:avatar]
    end

  end
end
