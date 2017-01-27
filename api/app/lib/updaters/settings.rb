module Updaters
  # Updates a User model from JSON-API style params
  class Settings
    include ::Updaters

    def attachment_fields
      [:press_logo]
    end

    def adjusted_attributes
      return {} unless attributes
      attributes
    end
  end
end
